# Installation

## 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

## 2. Install Dependencies

### Frontend

Navigate to the frontend directory:

```bash
cd Frontend-GenAI
npm install
```

### Backend

Navigate to the backend directory:

```bash
cd ../backend
npm install
```

### GenAI

Navigate to the python-server directory:

```bash
cd ../genai
pip install -r requirements.txt
```

## To Run:

### Frontend

Start the development server:

```bash
npm run dev
```

Open the application in your browser at `http://localhost:5173`.

### Backend

Start the Node.js server:

```bash
npm start
```

The backend will run at `http://localhost:5000`.

### GenAI

Run the Python server:

```bash
python server.py
