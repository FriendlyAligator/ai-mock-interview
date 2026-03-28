from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()
from app.database import engine
from app import models
from app.routes import user, interview

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://ai-mock-interview-one-fawn.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if engine:
    models.Base.metadata.create_all(bind=engine)

app.include_router(user.router)
app.include_router(interview.router)

@app.get("/")
def root():
    return {"message": "AI Mock Interview API"}

