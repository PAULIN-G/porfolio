from sqlalchemy import delete
from sqlalchemy.orm import Session

from . import content as c
from .models import Education, Experience, Project, Skill


def sync_content(db: Session) -> None:
    """Réécrit les tables de contenu depuis content.py (les messages ne sont pas touchés)."""
    for model in (Project, Skill, Experience, Education):
        db.execute(delete(model))
    db.add_all(Project(position=i, **p) for i, p in enumerate(c.PROJECTS))
    db.add_all(Skill(name=n, category=cat, note=note, position=i) for i, (n, cat, note) in enumerate(c.SKILLS))
    db.add_all(Education(position=i, **e) for i, e in enumerate(c.EDUCATION))
    db.add_all(Experience(position=i, **e) for i, e in enumerate(c.EXPERIENCE))
    db.commit()
