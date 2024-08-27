import os
import torch
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain_community.embeddings import HuggingFaceInstructEmbeddings
from langchain_community.document_loaders import PyMuPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.schema import Document
from langchain_community.llms import HuggingFaceEndpoint
import fitz  # PyMuPDF for advanced PDF text and table extraction

# Load environment variables
load_dotenv()

# Check for GPU availability and set the appropriate device for computation.
DEVICE = "cuda:0" if torch.cuda.is_available() else "cpu"

# Global variables
conversation_retrieval_chain = None
chat_history = []
llm_hub = None
embeddings = None

def init_llm():
    global llm_hub, embeddings

    # Set up the environment variable for HuggingFace and initialize the desired model
    os.environ["HUGGINGFACEHUB_API_TOKEN"] = os.getenv('HUGGING_FACE_TOKEN')
    model_id = "mistralai/Mixtral-8x7B-Instruct-v0.1"
    
    # Initialize the model with the correct task
    llm_hub = HuggingFaceEndpoint(
        repo_id=model_id, 
        model_kwargs={"max_length": 1200},  # Adjusted for longer responses
        task="text-generation"
    )

    # Initialize embeddings using a pre-trained model to represent the text data
    embeddings = HuggingFaceInstructEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Function to process a PDF document and extract text and tables
def process_document():
    global conversation_retrieval_chain

    # # Load the document with PyMuPDF
    # doc = fitz.open(document_path)
    # combined_text = ""

    # # Iterate over each page to extract text and handle tables
    # for page in doc:
    #     text = page.get_text("text")  # Extract text
    #     combined_text += text + "\n\n"  # Add extracted text to the combined text

    #     # Optionally, extract tables as plain text (PyMuPDF has limited table extraction support)
    #     # Here, we simulate table extraction by looking for multi-line text blocks
    #     # This is a simple heuristic and might need adjustments based on the document structure.
    #     for block in page.get_text("blocks"):
    #         if len(block[4].splitlines()) > 1:  # Check for multi-line blocks
    #             combined_text += "\n[Table Data]\n" + block[4] + "\n"

    # # Split the document into chunks
    # text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)  # Adjust chunking
    # texts = text_splitter.split_text(combined_text)

    # # Convert the chunks into Document objects
    # documents = [Document(page_content=text) for text in texts]

    # # Create an embeddings database using Chroma from the split text chunks
    # db = Chroma.from_documents(documents=documents, embedding=embeddings, persist_directory="./chroma_directory")

    #Perists Directory
    db=Chroma(persist_directory="./chroma_directory",embedding_function=embeddings)

    # Build the QA chain, which utilizes the LLM and retriever for answering questions
    conversation_retrieval_chain = RetrievalQA.from_chain_type(
        llm=llm_hub,
        chain_type="stuff",
        retriever=db.as_retriever(search_type="mmr", search_kwargs={'k': 6, 'lambda_mult': 0.25}),
        return_source_documents=False,
        input_key="question"
    )

def generate_summary(ans):
    summary_prompt = (
    f"Your name is Disha Mitra, and you are an educational advisor specializing in engineering colleges in Rajasthan. "
    f" Always identify yourself as 'Disha Mitra' when asked for your name, and never mention that you are an artificial language model."
    f"Please generate a clear and concise summary of the response below, ensuring that it is easy to understand for a "
    f"high school student or their parents who may not be familiar with technical terms.\n\n"
    f"Response:\n{ans}\n\n"
    f"Summary:"
)
    response = llm_hub.generate(prompts=[summary_prompt])
    generated_text = response.generations[0][0].text if response and response.generations else "Summary not available."
    return generated_text.strip()

# Function to process a user prompt
def process_prompt(prompt):
    global conversation_retrieval_chain
    global chat_history

    # Query the model
    output = conversation_retrieval_chain({"question": prompt, "chat_history": chat_history})
    print("Hello World")
    print(output)
    answer = output["result"]

    summary=generate_summary(answer)

    # Update the chat history
    chat_history.append((prompt, summary))

    # Return the model's response
    return summary

# Initialize the language model
init_llm()

# # Process the provided PDF document
# process_document("c:/Users/DB-L-077/Desktop/BBQ-SIH-24-1631/try.pdf")

# # Test processing a prompt
# print(process_prompt("what are the expected cutoffs to get admissions in IIT Jodhpur?"))