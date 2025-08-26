import os
import torch
import fitz  
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain_community.embeddings import HuggingFaceEmbeddings 
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain_community.llms import HuggingFaceEndpoint
from langchain.docstore.document import Document
import getpass

load_dotenv()

DEVICE = "cuda:0" if torch.cuda.is_available() else "cpu"

conversation_retrieval_chain = None
chat_history = []
llm_hub = None
embeddings = None


def init_llm():
    global llm_hub, embeddings

    
    os.environ["HUGGINGFACEHUB_API_TOKEN"] = os.getenv('HUGGING_FACE_TOKEN')
    
    if "GROQ_API_KEY" not in os.environ:
        os.environ["GROQ_API_KEY"] = getpass.getpass("Enter your Groq API key: ")

    from langchain_groq import ChatGroq
    llm_hub = ChatGroq(model="llama3-8b-8192")

    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

def load_faiss_index():
    global conversation_retrieval_chain
    
    if embeddings is None:
        raise ValueError("Embeddings model is not initialized.")

    if not os.path.exists("./faiss_index"):
        print("FAISS index not found, processing the document to create the index...")
        print("Index created successfully!")
    else:
        db = FAISS.load_local("./faiss_index", embeddings, allow_dangerous_deserialization=True)
        conversation_retrieval_chain = RetrievalQA.from_chain_type(
            llm=llm_hub,
            chain_type="stuff",
            retriever=db.as_retriever(search_type="mmr", search_kwargs={'k': 6, 'lambda_mult': 0.25}),
            return_source_documents=False,
            input_key="question"
        )
        print("FAISS index loaded successfully.")

def process_document(document_path):
    global conversation_retrieval_chain
    
    doc = fitz.open(document_path)
    combined_text = ""

    for page in doc:
        text = page.get_text("text")
        print(text)
        combined_text += text + "\n\n"

        for block in page.get_text("blocks"):
            lines = block[4].splitlines()
            if len(lines) > 1:
                heading = lines[0].strip()
                details = " | ".join(line.strip() for line in lines[1:])
                combined_text += f"{heading}: {details}\n"
            else:
                combined_text += block[4] + "\n"

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=3000, chunk_overlap=200)
    texts = text_splitter.split_text(combined_text)
    documents = [Document(page_content=text) for text in texts]
    db = FAISS.from_documents(documents=documents, embedding=embeddings)
    db.save_local("./faiss_index")
    load_faiss_index()

def generate_summary(ans):
    summary_prompt = (
        f"You are Vantum AI, a helpful educational and informational assistant. "
f"Always introduce yourself as 'Vantum AI' in your very first response of the conversation. "
f"Do not mention that you are an AI model. "
f"Your role is to summarize and explain information retrieved from documents clearly and politely. "
f"Always use simple language so that high school students, parents, or non-technical people can easily understand. "
f"If this is not the first response, do not reintroduce yourself—just continue the conversation naturally."
f"Result: {ans}. "
    )
    response_text = ""
    for chunk in llm_hub.stream([{"role": "user", "content": summary_prompt}]):
        response_text += chunk.content
    return response_text.strip()

def process_prompt(prompt):
    global conversation_retrieval_chain, chat_history
    VANTUM_SYSTEM_PROMPT = """
You are Vantum AI, a helpful educational and informational assistant. 
Always introduce yourself as 'Vantum AI' in your very first response of the conversation. 
Do not mention that you are an AI model. 
Your role is to summarize and explain information retrieved from documents clearly and politely. 
Always use simple language so that high school students, parents, or non-technical people can easily understand. 
If this is not the first response, do not reintroduce yourself—just continue the conversation naturally.
"""

    
    if not chat_history:  # First response
        query_with_identity = f"{VANTUM_SYSTEM_PROMPT}\n\nUser: {prompt}"
    else:  # Continue without repeating introduction
        query_with_identity = prompt

    output = conversation_retrieval_chain({"question": query_with_identity, "chat_history": chat_history})
    answer = output["result"]

    summary = generate_summary(answer)
    chat_history.append((prompt, summary))
    return answer


init_llm()
load_faiss_index()
