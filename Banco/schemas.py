from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


# --- Schemas para Engine ---
class EngineCreate(BaseModel):
    Name_Engine: str = Field(min_length=1)
    Function_Engine: str = Field(min_length=1)


class EngineResponse(BaseModel):
    Engine_ID: int
    Name_Engine: str
    Function_Engine: str
    model_config = ConfigDict(from_attributes=True)


# --- Schemas para jogos ---
class GameCreate(BaseModel):
    Game_Name: str = Field(min_length=1)
    Game_Status: str = Field(min_length=1)
    Engine_IDs: list[int] = Field(default_factory=list)


class GameResponse(BaseModel):
    Game_ID: int
    Game_Name: str
    Game_Status: str
    Engine_IDs: list[int]


# --- Schemas para Professional ---
class ProfessionalCreate(BaseModel):
    Nome: str = Field(min_length=1)
    Active: Optional[bool] = True


class ProfessionalResponse(BaseModel):
    Professional_ID: int
    Nome: str
    Active: bool

    model_config = ConfigDict(from_attributes=True)


# --- Schemas para Documentation Bug ---
class BugCreate(BaseModel):
    Date_Reported: date
    Place_game: str = Field(min_length=1)
    cause: Optional[str] = None
    Step_Reproduction: str = Field(min_length=1)
    Game_ID: int = Field(gt=0)
    Reported_ID: int = Field(gt=0)
    Responsible_ID: int = Field(gt=0)


class BugResponse(BaseModel):
    Documentation_Bug_ID: int
    Date_Reported: date
    Place_game: str
    cause: Optional[str] = None
    Step_Reproduction: str
    Game_ID: int
    Reported_ID: int
    Responsible_ID: int

    model_config = ConfigDict(from_attributes=True)