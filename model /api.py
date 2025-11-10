import joblib
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
import sys

# --- 1. Load Model and Encoder ---

MODEL_PATH = "profession_model.joblib"
ENCODER_PATH = "profession_encoder.joblib"

try:
    model = joblib.load(MODEL_PATH)
    encoder = joblib.load(ENCODER_PATH)
    print("--- Model and Encoder loaded successfully ---")
except FileNotFoundError:
    print(f"Error: Model ('{MODEL_PATH}') or Encoder ('{ENCODER_PATH}') not found.")
    print("Please run 'model.py' first to train and save the model files.")
    sys.exit(1)
except Exception as e:
    print(f"An error occurred while loading model/encoder: {e}")
    sys.exit(1)


# --- 2. Define Input Schema ---

class IntelligenceScores(BaseModel):
    linguistic: float = Field(..., example=8.0)
    musical: float = Field(..., example=7.0)
    bodily: float = Field(..., example=6.0)
    logical_mathematical: float = Field(..., example=9.0)
    spatial_visualization: float = Field(..., example=5.0)
    interpersonal: float = Field(..., example=7.0)
    intrapersonal: float = Field(..., example=8.0)
    naturalist: float = Field(..., example=6.0)


# --- 3. Initialize FastAPI App ---

app = FastAPI(
    title="Profession Predictor API",
    description="Predict job professions based on multiple intelligence scores.",
    version="1.0.0",
)

# --- 3.1 Enable CORS for React Frontend ---
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # Allowed frontend URLs
    allow_credentials=True,     # Allow cookies/auth headers
    allow_methods=["*"],        # All HTTP methods
    allow_headers=["*"],        # All headers
)


# --- 4. API Endpoints ---

@app.get("/", tags=["Health Check"])
async def root():
    """Health check endpoint."""
    return {"message": "Profession Predictor API is live 🚀"}


@app.post("/predict", tags=["Prediction"])
async def predict_profession(scores: IntelligenceScores):
    """
    Receives 8 intelligence scores and predicts a job profession.
    """
    try:
        # 1️⃣ Prepare input
        features = [
            scores.linguistic,
            scores.musical,
            scores.bodily,
            scores.logical_mathematical,
            scores.spatial_visualization,
            scores.interpersonal,
            scores.intrapersonal,
            scores.naturalist,
        ]
        input_data = [features]  # sklearn expects 2D array

        # 2️⃣ Predict encoded label
        encoded_prediction = model.predict(input_data)

        # 3️⃣ Decode label
        predicted_profession = encoder.inverse_transform(encoded_prediction)[0]

        # 4️⃣ Return response
        return {
            "predicted_profession": predicted_profession,
            "input_scores": scores.dict(),
        }

    except Exception as e:
        return {"error": str(e)}


# --- 5. Run Server (for standalone use) ---

if __name__ == "__main__":
    print("--- Starting FastAPI server on http://127.0.0.1:8000 ---")
    uvicorn.run(app, host="127.0.0.1", port=8000)
