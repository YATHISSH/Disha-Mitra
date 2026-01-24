import os
import time
import numpy as np
import pdfplumber
import requests
from io import BytesIO
from dotenv import load_dotenv
from google import genai
from pinecone import Pinecone, ServerlessSpec

load_dotenv()

# Configuration from environment (set these in .env or environment)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
EMBED_MODEL = "text-embedding-004"  # New Gemini embedding model
CHAT_MODEL = "gemini-2.5-flash-lite"  # New Gemini chat model

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENV = os.getenv("PINECONE_ENV")
PINECONE_INDEX = os.getenv("PINECONE_INDEX", "genai-index")

# Gemini API client
genai_client = None
if GEMINI_API_KEY:
    genai_client = genai.Client(api_key=GEMINI_API_KEY)

# Pinecone client
pc = None
if PINECONE_API_KEY:
    pc = Pinecone(api_key=PINECONE_API_KEY)

chat_history = []


def init_llm():
    global genai_client, pc
    
    if not GEMINI_API_KEY:
        raise EnvironmentError("GEMINI_API_KEY not set in environment")
    if not PINECONE_API_KEY:
        raise EnvironmentError("PINECONE_API_KEY not set in environment")
    
    if genai_client is None:
        genai_client = genai.Client(api_key=GEMINI_API_KEY)
    if pc is None:
        pc = Pinecone(api_key=PINECONE_API_KEY)


def _extract_text(pdf_source: str) -> str:
    """
    Extract text from PDF either from file path or URL.
    """
    try:
        if pdf_source.startswith(('http://', 'https://')):
            # Add headers to avoid 401 errors from some servers like Cloudinary
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/pdf, */*',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
            }
            response = requests.get(pdf_source, headers=headers, timeout=30)
            response.raise_for_status()
            pdf_file = BytesIO(response.content)
            with pdfplumber.open(pdf_file) as pdf:
                parts = [page.extract_text() for page in pdf.pages if page.extract_text()]
        else:
            with pdfplumber.open(pdf_source) as pdf:
                parts = [page.extract_text() for page in pdf.pages if page.extract_text()]
        return "\n\n".join(parts)
    except Exception as e:
        raise ValueError(f"Error extracting text from PDF: {str(e)}")


def _chunk_text(text: str, max_chars: int = 1000):
    """Split text into chunks."""
    chunks = []
    start = 0
    length = len(text)
    while start < length:
        end = min(start + max_chars, length)
        cut = text.rfind("\n", start, end)
        if cut <= start:
            cut = text.rfind(" ", start, end)
        if cut <= start:
            cut = end
        chunk = text[start:cut].strip()
        if chunk:
            chunks.append(chunk)
        start = cut
    return chunks


def _embed_texts(texts):
    """Generate embeddings for text chunks using Gemini."""
    if not GEMINI_API_KEY:
        raise EnvironmentError("GEMINI_API_KEY not set")
    if genai_client is None:
        raise EnvironmentError("genai_client not initialized")

    embeddings = []
    for text in texts:
        resp = genai_client.models.embed_content(
            model=EMBED_MODEL,
            contents=text
        )
        vec = np.array(resp.embeddings[0].values, dtype=np.float32)
        embeddings.append(vec)
    return embeddings


def _ensure_pinecone_index(dim: int):
    """Ensure Pinecone index exists."""
    if not PINECONE_API_KEY:
        raise EnvironmentError("PINECONE_API_KEY not set in environment")
    if pc is None:
        raise EnvironmentError("Pinecone client not initialized")
    
    existing = pc.list_indexes().names()
    if PINECONE_INDEX not in existing:
        pc.create_index(
            name=PINECONE_INDEX,
            dimension=dim,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-west-2")
        )
    return pc.Index(PINECONE_INDEX)


def load_faiss_index():
    """Load or initialize Pinecone index."""
    if not os.path.exists("./faiss_index"):
        print("Document index not found. Please process a document first using process_document().")
    else:
        print("Index ready. Use process_prompt() to query the documents.")

def process_document(document_path, namespace: str = None, company_id: int = None,
                    user_id: int = None, pdf_id: str = None, source: str = None, category: str = None):
    """Extract text from PDF, chunk it, compute embeddings, and upsert to Pinecone."""
    text = _extract_text(document_path)
    chunks = _chunk_text(text, max_chars=1200)
    if not chunks:
        raise ValueError("No text found in the provided PDF.")
    
    embeddings = _embed_texts(chunks)
    
    idx = _ensure_pinecone_index(dim=len(embeddings[0]))
    vectors = []
    ts = int(time.time())
    for i, (chunk, emb) in enumerate(zip(chunks, embeddings)):
        vid = f"doc-{ts}-{i}"
        metadata = {"text": chunk}
        if company_id is not None:
            try:
                metadata["company_id"] = int(company_id)
            except (TypeError, ValueError):
                metadata["company_id"] = company_id
        if user_id is not None:
            try:
                metadata["user_id"] = int(user_id)
            except (TypeError, ValueError):
                metadata["user_id"] = user_id
        if pdf_id is not None:
            metadata["pdf_id"] = str(pdf_id)
        if source is not None:
            metadata["source"] = str(source)
        if category is not None:
            metadata["category"] = str(category)

        vectors.append({
            "id": vid,
            "values": emb.tolist(),
            "metadata": metadata
        })
    
    upsert_kwargs = {"vectors": vectors}
    if namespace:
        upsert_kwargs["namespace"] = namespace
    idx.upsert(**upsert_kwargs)
    
    print(f"Document processed and upserted {len(vectors)} chunks to Pinecone.")

def generate_summary(ans):
    """Generate a summary using Gemini."""
    summary_prompt = (
        "You are Vantum AI, a helpful educational and informational assistant. "
        "Summarize and explain the following information clearly and politely. "
        "Always use simple language so that high school students, parents, or non-technical people can easily understand. "
        f"Information to summarize: {ans}"
    )
    
    resp = genai_client.models.generate_content(
        model=CHAT_MODEL,
        contents=summary_prompt
    )
    return resp.text.strip()


def process_prompt(prompt: str, top_k: int = 4, namespace: str = None,
                   company_id: int = None) -> str:
    """Answer a user prompt by querying Pinecone and calling Gemini."""
    if not PINECONE_API_KEY:
        raise EnvironmentError("PINECONE_API_KEY not set in environment")
    if genai_client is None:
        raise EnvironmentError("genai_client not initialized")

    # Embed the query
    qresp = genai_client.models.embed_content(
        model=EMBED_MODEL,
        contents=prompt
    )
    q_vec = qresp.embeddings[0].values

    idx = pc.Index(PINECONE_INDEX)
    query_args = {"top_k": top_k, "include_metadata": True}
    if namespace:
        query_args["namespace"] = namespace
    if company_id is not None:
        try:
            query_args["filter"] = {"company_id": int(company_id)}
        except (TypeError, ValueError):
            query_args["filter"] = {"company_id": company_id}

    # Query Pinecone
    try:
        res = idx.query(vector=q_vec, **query_args)
    except TypeError:
        res = idx.query(queries=[q_vec], **query_args)

    matches = []
    if isinstance(res, dict):
        matches = res.get("matches", [])
    elif hasattr(res, "matches"):
        matches = res.matches

    context_chunks = []
    for m in matches[:top_k]:
        md = m.get("metadata") if isinstance(m, dict) else getattr(m, "metadata", None)
        if md and "text" in md:
            context_chunks.append(md["text"])

    context = "\n\n---\n\n".join(context_chunks) if context_chunks else ""

    # Generate response
    combined_prompt = (
        "You are Vantum AI, a helpful educational and informational assistant. "
        "Answer concisely and supportively; when relevant, indicate which part of the provided context supports your answer. "
        "Always use simple language so that high school students, parents, or non-technical people can easily understand.\n\n"
        f"CONTEXT:\n{context}\n\n"
        f"QUESTION: {prompt}\n\n"
        f"Answer:"
    )

    resp = genai_client.models.generate_content(
        model=CHAT_MODEL,
        contents=combined_prompt
    )

    answer = resp.text

    chat_history.append((prompt, answer))
    return answer


# Initialize on module load
init_llm()
load_faiss_index()
