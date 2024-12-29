from app.llm import init_llm, generate_summary
from app.faiss_index import load_faiss_index, create_faiss_index
from app.document import process_document
from app.prompt_handler import setup_chain, process_prompt

def main():
    # Initialize LLM
    init_llm()

    # Load FAISS index
    try:
        db = load_faiss_index()
    except FileNotFoundError:
        print("Processing document to create FAISS index...")
        documents = process_document("path_to_your_pdf.pdf")
        db = create_faiss_index(documents)
        print("FAISS index created successfully.")

    # Setup retrieval chain
    from app.llm import llm_hub
    setup_chain(llm_hub, db.as_retriever(search_type="mmr", search_kwargs={'k': 6, 'lambda_mult': 0.25}))

    # Test a prompt
    prompt = "List out the tech tools."
    response = process_prompt(prompt)
    summary = generate_summary(response)
    print(summary)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(main, host="0.0.0.0", port=8000, log_level="debug") 