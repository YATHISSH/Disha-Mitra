import os
from langchain.vectorstores import FAISS
from app.config import FAISS_INDEX_PATH
from app.llm import embeddings

def load_faiss_index():
    if embeddings is None:
        raise ValueError("Embeddings model is not initialized.")

    if not os.path.exists(FAISS_INDEX_PATH):
        raise FileNotFoundError(f"FAISS index not found at {FAISS_INDEX_PATH}. Please create it first.")
    
    db = FAISS.load_local(FAISS_INDEX_PATH, embeddings, allow_dangerous_deserialization=True)
    return db

def create_faiss_index(documents):
    db = FAISS.from_documents(documents, embeddings)
    db.save_local(FAISS_INDEX_PATH)
    return db
    