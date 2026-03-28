from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from app.database import engine
from app import models
from app.routes import user, interview

app = FastAPI()

# ✅ Add your deployed frontend URL here
origins = [
    "http://localhost:3000",
    "https://interview-ufu7.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # ✅ use specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Ensure DB tables are created
try:
    models.Base.metadata.create_all(bind=engine)
    print("✅ Database connected & tables created")
except Exception as e:
    print("❌ Database error:", e)

app.include_router(user.router)
app.include_router(interview.router)

@app.get("/")
def root():
    return {"message": "AI Mock Interview API"}
