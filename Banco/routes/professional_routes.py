from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from Banco.dependencies import get_db
from Banco.models import Professional
from Banco.schemas import ProfessionalCreate, ProfessionalResponse

professional_router = APIRouter(prefix="/professionals", tags=["Profissionais"])


@professional_router.post("/", response_model=ProfessionalResponse, status_code=status.HTTP_201_CREATED)
def create_professional(prof_data: ProfessionalCreate, db: Session = Depends(get_db)):
    new_prof = Professional(Nome=prof_data.Nome, Active=prof_data.Active)
    db.add(new_prof)
    db.commit()
    db.refresh(new_prof)
    return new_prof


@professional_router.get("/", response_model=list[ProfessionalResponse])
def list_professionals(db: Session = Depends(get_db)):
    return db.query(Professional).all()