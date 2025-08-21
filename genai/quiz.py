import fitz  # PyMuPDF for PDF extraction
from educhain import Educhain, LLMConfig
from langchain_groq import ChatGroq
import os
import getpass
import extra

# Function to integrate with NVIDIA LangChain API within Educhain
def enhance_and_generate_mcqs_from_pdf(num_questions=15):
    # Step 1: Extract text from the PDF
    # extracted_text = extract_text_from_pdf(pdf_file_path)

    extracted_text=extra.extraa
    print(extracted_text)

    os.environ["GROQ_API_KEY"] = "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"

    if "GROQ_API_KEY" not in os.environ:
        os.environ["GROQ_API_KEY"] = "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"

    client = ChatGroq(model="llama-3.1-8b-instant")

    # Step 4: Initialize Educhain client
    llm_config = LLMConfig(custom_model=client)
    educhain_client = Educhain(llm_config)

    # Step 5: Generate MCQs from the enriched content using Educhain
    questions = educhain_client.qna_engine.generate_questions_from_data(
        source=extracted_text,  
        source_type="text",  # Ingesting enriched text
        num=num_questions, 
        question_type="Multiple Choice",
    )

    formatted_questions = []

    for question in questions.dict()["questions"]:
        formatted_question = {
            "question": question["question"],
            "options": question["options"],
            "answer": question["answer"]
        }
        formatted_questions.append(formatted_question)
    # print("Hello World\n",formatted_questions)
    # print(len(formatted_questions))
    return formatted_questions

# # Example usage
# pdf_file = "c:/Users/rishi/Desktop/MCQS/test.pdf"  # Path to your PDF file
# topic = "DevOps"  # Example topic for question generation
# print(enhance_and_generate_mcqs_from_pdf(num_questions=15))