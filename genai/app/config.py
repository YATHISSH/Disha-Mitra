import os
from dotenv import load_dotenv
import torch

# Load environment variables from .env
load_dotenv()

DEVICE = "cuda:0" if torch.cuda.is_available() else "cpu"

HUGGINGFACEHUB_API_TOKEN = os.getenv('HUGGING_FACE_TOKEN')
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.3"
EMBEDDINGS_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
FAISS_INDEX_PATH = "./faiss_index"
