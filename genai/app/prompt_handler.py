from langchain.chains import RetrievalQA

conversation_retrieval_chain = None
chat_history = []

def setup_chain(llm, retriever):
    global conversation_retrieval_chain
    conversation_retrieval_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=False,
        input_key="question"
    )

def process_prompt(prompt):
    global conversation_retrieval_chain, chat_history

    if conversation_retrieval_chain is None:
        raise ValueError("Conversation retrieval chain is not initialized.")

    output = conversation_retrieval_chain({"question": prompt, "chat_history": chat_history})
    answer = output["result"]

    chat_history.append((prompt, answer))
    return answer