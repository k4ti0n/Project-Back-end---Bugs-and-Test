from datetime import date
from typing import Optional
from pydantic import BaseModel


# --- Schemas para Engine ---
class EngineCreate(BaseModel):
    Name_Engine: str


class EngineResponse(BaseModel):
    Engine_ID: int
    Name_Engine: str

    class Config:
        from_attributes = True


# --- Schemas para Professional ---
class ProfessionalCreate(BaseModel):
    Nome: str
    Active: Optional[bool] = True


class ProfessionalResponse(BaseModel):
    Professional_ID: int
    Nome: str
    Active: bool

    class Config:
        from_attributes = True


# --- Schemas para Documentation Bug ---
class BugCreate(BaseModel):
    Date_Reported: date
    Place_game: str
    cause: Optional[str] = None
    Step_Reproduction: str
    Game_ID: int
    Reported_ID: int
    Responsible_ID: int


class BugResponse(BaseModel):
    Documentation_Bug_ID: int
    Date_Reported: date
    Place_game: str
    cause: Optional[str] = None
    Step_Reproduction: str
    Game_ID: int
    Reported_ID: int
    Responsible_ID: int

    class Config:
        from_attributes = True