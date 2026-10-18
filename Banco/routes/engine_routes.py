from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from Banco.dependencies import get_db
from Banco.models import Engine
from Banco.schemas import EngineCreate, EngineResponse

engine_router = APIRouter(prefix="/engines", tags=["Engines"])


@engine_router.post("/", response_model=EngineResponse, status_code=status.HTTP_201_CREATED)
def create_engine(engine_data: EngineCreate, db: Session = Depends(get_db)):
    new_engine = Engine(Name_Engine=engine_data.Name_Engine)
    db.add(new_engine)
    db.commit()
    db.refresh(new_engine)
    return new_engine


@engine_router.get("/", response_model=list[EngineResponse])
def list_engines(db: Session = Depends(get_db)):
    return db.query(Engine).all()