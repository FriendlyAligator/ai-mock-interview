import os
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key
API_KEY = os.getenv("GROQ_API_KEY")

# Create Groq client
client = Groq(api_key=API_KEY)


def generate_question(role: str, difficulty: str = "medium"):

    prompt = f"""
    You are a technical interviewer.

    Generate ONE {difficulty}-level interview question for a {role} developer.

    Rules:
    - Question should be clear and practical
    - No explanation
    - Only return the question text
    """

    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": "You generate interview questions."},
            {"role": "user", "content": prompt}
        ],
        model="llama-3.1-8b-instant"
    )

    return response.choices[0].message.content.strip()

def evaluate_answer(question: str, answer: str):

    prompt = f"""
    You are a technical interviewer.

    Question: {question}

    Candidate Answer: {answer}

    Evaluate the answer.

    Return strictly in this format:

    Score: <number from 0 to 10>
    Feedback: <short feedback>
    """

    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": "You evaluate interview answers."},
            {"role": "user", "content": prompt}
        ],
        model="llama-3.1-8b-instant"
    )

    result = response.choices[0].message.content

    lines = result.split("\n")

    score = 0
    feedback = result

    for line in lines:
        if "Score" in line:
            score = int(line.split(":")[1].strip())
        if "Feedback" in line:
            feedback = line.split(":")[1].strip()

    return score, feedback