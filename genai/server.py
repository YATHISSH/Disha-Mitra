import logging
import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import Worker_completed as worker  # Import the worker module
import quiz

# Initialize FastAPI app
app = FastAPI()

# Pydantic models
class Message(BaseModel):
    userMessage: str

class QuizRequest(BaseModel):
    distribution: Dict[str, int]  # Format: {"Mathematics": 10, "Physics": 8, ...}

# Configure CORS middleware
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("FastAPI-App")

# Directory to store uploaded files
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Route for processing chat messages
@app.post("/api/chat")
async def process_message_route(message: Message):
    user_message = message.userMessage
    logger.debug(f"Received user message: {user_message}")

    if not user_message:
        raise HTTPException(status_code=400, detail="Please provide a message to process.")

    try:
        # Process the user's message using the worker module
        bot_response = worker.process_prompt(user_message)
        logger.debug(f"Bot response: {bot_response}")
        return JSONResponse(content={"botResponse": bot_response}, status_code=200)
    except Exception as e:
        logger.error(f"Error processing message: {e}")
        raise HTTPException(status_code=500, detail="There was an error processing your message.")

# Route for processing document uploads
@app.post("/process-document")
async def process_document_route(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected. Please try again.")

    # Save the uploaded file to the uploads directory
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    try:
        logger.debug(f"Saving uploaded file to {file_path}")
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        logger.debug(f"File successfully saved to {file_path}")

        # Process the uploaded document using the worker module
        worker.process_document(file_path)

        return JSONResponse(content={
            "botResponse": "Thank you for providing your PDF document. I have analyzed it, so now you can ask me any questions regarding it!"
        }, status_code=200)
    except Exception as e:
        logger.error(f"Error saving or processing document: {e}")
        raise HTTPException(status_code=500, detail="There was an error processing your document.")

# Route for generating a quiz
@app.post("/generate-quiz")
async def generate_quiz_route():
    try:
        total_questions = 30  # Target number of questions
        batch_size = 15  # Number of questions per batch
        collected_questions = []

        while len(collected_questions) < total_questions:
            try:
                # Generate a batch of questions
                questions_batch = quiz.enhance_and_generate_mcqs_from_pdf(batch_size)
                collected_questions.extend(questions_batch)

                # Log progress
                logger.debug(f"Generated {len(questions_batch)} questions, total: {len(collected_questions)}")
            except Exception as e:
                # Log error and continue
                logger.error(f"Error generating questions: {e}")
                continue

        # Truncate to exactly 30 questions if overshooting
        collected_questions = collected_questions[:total_questions]

        return JSONResponse(content={"botResponse": collected_questions}, status_code=200)
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="There was an error processing your message.")

# Run the FastAPI app using Uvicorn if executed as the main module
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
