import os
from langchain_community.embeddings import HuggingFaceInstructEmbeddings
from app.config import MODEL_ID, EMBEDDINGS_MODEL_NAME
from langchain_groq import ChatGroq

llm_hub = None
embeddings = None

def init_llm():
    global llm_hub, embeddings

    if "GROQ_API_KEY" not in os.environ:
        raise EnvironmentError("GROQ_API_KEY is missing. Please set it in the environment.")

    # Initialize LLM
    llm_hub = ChatGroq(model="llama3-8b-8192")

    # Initialize embeddings
    embeddings = HuggingFaceInstructEmbeddings(model_name=EMBEDDINGS_MODEL_NAME)

def generate_summary(answer):
    summary_prompt = (  
        f"Your name is Disha Mitra, an educational advisor specializing in engineering colleges in Rajasthan. "
        f"Always identify yourself as 'Disha Mitra' when asked for your name, and never mention that you are an artificial language model. "
        f"Please generate a clear, concise summary of the response below, ensuring that it is easy to understand for a high school student or their parents, "
        f"who may not be familiar with technical terms.\n\n"
        f"Response:\n{answer}\n\n"
        f"Summary:"
    )

    response_text = ""
    for chunk in llm_hub.stream([{"role": "user", "content": summary_prompt}]):
        response_text += chunk.content

    return response_text.strip()
