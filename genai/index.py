import logging
import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.document import process_document
from app.prompt_handler import process_prompt
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI()

class Message(BaseModel):
    userMessage: str

# Set up CORS
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging configuration
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Ensure uploads folder exists
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/api/chat")
async def process_message_route(message: Message):
    user_message = message.userMessage
    logger.debug(f"Received user message: {user_message}")

    if not user_message:
        raise HTTPException(status_code=400, detail="Please provide a message to process.")

    try:
        bot_response = process_prompt(user_message)
        return JSONResponse(content={"botResponse": bot_response}, status_code=200)
    except Exception as e:
        logger.error(f"Error processing message: {e}")
        raise HTTPException(status_code=500, detail="Error processing your message.")

@app.post("/process-document")
async def process_document_route(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected. Please upload a document.")

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    try:
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        logger.debug(f"File saved to {file_path}. Processing...")
        process_document(file_path)

        return JSONResponse(content={
            "botResponse": "Document uploaded and processed successfully. You can now ask questions about it."
        }, status_code=200)
    except Exception as e:
        logger.error(f"Error processing document: {e}")
        raise HTTPException(status_code=500, detail="Error processing your document.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
