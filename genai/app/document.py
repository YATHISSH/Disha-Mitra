import fitz  # PyMuPDF
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document

def process_document(document_path):
    combined_text = ""

    # Load the document with PyMuPDF
    doc = fitz.open(document_path)

    for page in doc:
        combined_text += page.get_text("text") + "\n\n"

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=3000, chunk_overlap=200)
    texts = text_splitter.split_text(combined_text)

    return [Document(page_content=text) for text in texts]