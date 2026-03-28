from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from app.auth import get_current_user
from app import models, schemas
from app import ai_services

router = APIRouter(prefix="/interview", tags=["Interview"])

@router.post("/start")
def start_interview(data: schemas.InterviewStart,
                    db: Session = Depends(get_db),
                    current_user: models.User = Depends(get_current_user)):

    question = ai_services.generate_question(
    role=data.role,
    difficulty="medium"
)

    interview = models.Interview(
        user_id=current_user.id,
        role=data.role,
        question=question,
        question_number=1
    )

    db.add(interview)
    db.commit()
    db.refresh(interview)

    return {
        "question": question,
        "interview_id": interview.id,
        "question_number": 1
    }

@router.post("/answer")

def submit_answer(
    data: schemas.AnswerSubmit,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    interview = db.query(models.Interview).filter(
        models.Interview.id == data.interview_id,
        models.Interview.question_number == data.question_number,
        models.Interview.user_id == current_user.id
    ).first()

    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    # evaluate answer
    score, feedback = ai_services.evaluate_answer(
        interview.question, data.answer
    )

    interview.answer = data.answer
    interview.score = score
    interview.feedback = feedback

    db.commit()

    # if less than 5 questions → ask next
    if interview.question_number < 5:

        next_question = ai_services.generate_question(
        role=interview.role,
        difficulty = "easy" if interview.question_number <= 2 else "hard"
        )

        new_interview = models.Interview(
            user_id=current_user.id,
            role=interview.role,
            question=next_question,
            question_number=interview.question_number + 1
        )

        db.add(new_interview)
        db.commit()
        db.refresh(new_interview)

        return {
            "score": score,
            "feedback": feedback,
            "next_question": next_question,
            "interview_id": new_interview.id,
            "question_number": new_interview.question_number
            
        }

    # FINAL RESULT
    else:
        all_interviews = db.query(models.Interview).filter(
        models.Interview.user_id == current_user.id
        ).all()

        scores = [i.score for i in all_interviews if i.score is not None]
        total_score = sum(scores)
        count = len(scores)

        avg_score = total_score / count if count else 0

        return {
            "message": "Interview completed",
            "final_score": total_score,
            "average_score": round(avg_score,2), 
        }

@router.get("/result")
def get_result(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    interviews = db.query(models.Interview).filter(
        models.Interview.user_id == current_user.id
    ).all()

    if not interviews:
        return {
            "final_score": 0,
            "average_score": 0,
            "final_feedback": "No interviews yet"
        }

    scores = [i.score for i in interviews if i.score is not None]
    total_score = sum(scores)
    avg_score = total_score / len(scores) if scores else 0

    # take last feedback
    last_feedback = interviews[-1].feedback if interviews[-1].feedback else ""

    return {
        "final_score": round(avg_score,2),
        "average_score": round(avg_score, 2),
        "final_feedback": last_feedback
    }

@router.get("/dashboard")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    interviews = db.query(models.Interview)\
        .filter(models.Interview.user_id == current_user.id)\
        .order_by(models.Interview.id.desc())\
        .limit(10)\
        .all()

    interviews = interviews[::-1]

    return [
    {
        "name": f"Interview {index + 1}",
        "score": i.score if i.score else 0
    }
    for index, i in enumerate(interviews)
]

@router.delete("/reset")
def reset_interviews(db: Session = Depends(get_db)):
    try:
        db.execute(text("TRUNCATE TABLE interviews RESTART IDENTITY CASCADE"))
        db.commit()

        return {"message": "History cleared successfully"}

    except Exception as e:
        return {"error": str(e)}    