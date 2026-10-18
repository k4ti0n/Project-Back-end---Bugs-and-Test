from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from Banco.dependencies import get_db
from Banco.models import DocumentationBug
from Banco.schemas import BugCreate, BugResponse

bug_router = APIRouter(prefix="/bugs", tags=["Bugs"])


@bug_router.post("/", response_model=BugResponse, status_code=status.HTTP_201_CREATED)
def create_bug(bug_data: BugCreate, db: Session = Depends(get_db)):
    new_bug = DocumentationBug(
        Date_Reported=bug_data.Date_Reported,
        Place_game=bug_data.Place_game,
        cause=bug_data.cause,
        Step_Reproduction=bug_data.Step_Reproduction,
        Game_ID=bug_data.Game_ID,
        Reported_ID=bug_data.Reported_ID,
        Responsible_ID=bug_data.Responsible_ID
    )
    db.add(new_bug)
    db.commit()
    db.refresh(new_bug)
    return new_bug


@bug_router.get("/", response_model=list[BugResponse])
def list_bugs(db: Session = Depends(get_db)):
    return db.query(DocumentationBug).all()