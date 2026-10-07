from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ORM(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class ProjectOut(ORM):
    id: int
    slug: str
    title: str
    summary: str
    problem: str
    features: list[str]
    stack: list[str]
    mockup: str
    github: str
    demo: str
    is_demo: bool


class SkillOut(ORM):
    id: int
    name: str
    category: str
    note: str


class TimelineOut(ORM):
    period: str
    title: str
    organization: str
    detail: str


class ContactIn(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    name: str = Field(min_length=2, max_length=80)
    email: str = Field(max_length=120, pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    subject: str = Field(min_length=3, max_length=140)
    message: str = Field(min_length=10, max_length=3000)
    website: str = ""  # champ piège anti-spam : doit rester vide


class ContactOut(BaseModel):
    ok: bool
    detail: str


class MessageOut(ORM):
    id: int
    name: str
    email: str
    subject: str
    body: str
    created_at: datetime


class StatsOut(BaseModel):
    projects: int
    technologies: int
    domains: int
    messages: int
