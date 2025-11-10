SkillSync: AI Career Prediction Platform

SkillSync is a full-stack web application designed to help users discover their ideal career path. It combines a modern, responsive frontend, a secure user authentication system, and an AI-powered prediction engine to provide personalized career recommendations based on a user's multiple intelligence scores.

This project uses a microservice-style architecture, splitting the user management and the AI prediction into two separate, dedicated backend services.

🛠️ Tech Stack

Component

Technology

Frontend

React, React Router, Tailwind CSS, Axios [cite: api.js], React Context (useAuth, useTheme)

Auth Backend

Node.js, Express, MongoDB (Mongoose) [cite: db.js], JSON Web Token (JWT), bcrypt.js

ML Backend

Python, FastAPI, Uvicorn, Scikit-learn, Pandas, Joblib [cite: model.py, api.py]

🏁 Getting Started & Local Setup

To run this project, you must start all three services in separate terminals.

Prerequisites

Node.js & npm (for Frontend & Auth Backend)

Python & pip (for ML Backend)

MongoDB (A local instance or a free cloud-based Atlas URI)

An Excel file named data.xlsx (for training the ML model) [cite: model.py]

1.⁠ ⁠Auth Backend (Node.js)

This server handles all user data, careers, and feedback.

# 1. Navigate to the backend server directory (the one with server.js)

cd ./backend-auth

# 2. Install all Node.js dependencies

npm install

# 3. Create a .env file in this directory

# It MUST contain your MongoDB URI and JWT Secret

touch .env

Your .env file must contain these two lines:

MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_key_for_tokens

# 4. Start the auth server

node server.js

✅ Auth Backend is now running on http://localhost:5000 [cite: server.js]

2.⁠ ⁠ML Backend (Python)

This server handles the AI predictions.

# 1. Navigate to the ML API directory (the one with api.py)

cd ./backend-ml

# 2. Install all Python dependencies

# (You may want to use a virtual environment)

pip install fastapi uvicorn scikit-learn pandas joblib openpyxl

# 3. !! CRITICAL STEP !!

# You must train the model first. Make sure 'data.xlsx' is in this folder.

python model.py

# This will create 'profession_model.joblib' and 'profession_encoder.joblib' [cite: ⁠ model.py ⁠]

# 4. Start the FastAPI server

uvicorn api:app --reload

✅ ML Backend is now running on http://localhost:8000 [cite: api.py]

3.⁠ ⁠Frontend (React)

This is the main application you will see in your browser.

# 1. Navigate to the frontend directory

cd ./frontend

# 2. Install all Node.js dependencies

npm install

# 3. !! CRITICAL STEP !!

# Before you start, check your API URLs.

# - Make sure src/services/api.js has baseURL: 'http://localhost:5000/api' [cite: ⁠ api.js ⁠]

# - Make sure your CareerAssessmentPage.js (or wherever you call the ML model)

# is fetching from 'http://localhost:8000/predict'

# 4. Start the React development server

npm start

✅ Frontend is now running on http://localhost:3000

You can now open http://localhost:3000 in your browser to use the full application.
