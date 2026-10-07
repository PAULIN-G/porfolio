from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .. import content as c
from ..config import ADMIN_TOKEN
from ..database import get_db
from ..models import Education, Experience, Message, Project, Skill
from ..schemas import (ContactIn, ContactOut, MessageOut, ProjectOut, SkillOut,
                       StatsOut, TimelineOut)

router = APIRouter()


@router.get("/health")
def health():
    return {"ok": True}


@router.get("/profile")
def profile(db: Session = Depends(get_db)):
    edu = db.scalars(select(Education).order_by(Education.position)).all()
    exp = db.scalars(select(Experience).order_by(Experience.position)).all()
    # expériences d'abord (plus récentes), puis formations
    timeline = [TimelineOut.model_validate(x) for x in (*exp, *edu)]
    return {**c.PROFILE, "pillars": c.PILLARS, "timeline": timeline}


@router.get("/projects", response_model=list[ProjectOut])
def projects(db: Session = Depends(get_db)):
    return db.scalars(select(Project).order_by(Project.position)).all()


@router.get("/skills", response_model=list[SkillOut])
def skills(db: Session = Depends(get_db)):
    return db.scalars(select(Skill).order_by(Skill.position)).all()


@router.get("/stats", response_model=StatsOut)
def stats(db: Session = Depends(get_db)):
    count = lambda col: db.scalar(select(func.count(col))) or 0  # noqa: E731
    return StatsOut(
        projects=count(Project.id),
        technologies=count(Skill.id),
        domains=db.scalar(select(func.count(func.distinct(Skill.category)))) or 0,
        messages=count(Message.id),
    )


@router.post("/contact", response_model=ContactOut, status_code=201)
def contact(data: ContactIn, db: Session = Depends(get_db)):
    if data.website:  # robot : on répond OK sans rien enregistrer
        return ContactOut(ok=True, detail="Message envoyé.")
    db.add(Message(name=data.name, email=data.email, subject=data.subject, body=data.message))
    db.commit()
    return ContactOut(ok=True, detail="Message envoyé. Je vous réponds rapidement.")


@router.get("/messages", response_model=list[MessageOut])
def messages(x_admin_token: str = Header(default=""), db: Session = Depends(get_db)):
    if not ADMIN_TOKEN or x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="Accès refusé.")
    return db.scalars(select(Message).order_by(Message.created_at.desc())).all()
