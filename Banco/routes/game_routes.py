from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from Banco.dependencies import get_db
from Banco.models import AssociationProjectAndEngine, Engine, ProjectingDocumentation
from Banco.schemas import GameCreate, GameResponse

game_router = APIRouter(prefix="/games", tags=["Jogos"])


@game_router.post("/", response_model=GameResponse, status_code=status.HTTP_201_CREATED)
def create_game(game_data: GameCreate, db: Session = Depends(get_db)):
    engine_ids = list(dict.fromkeys(game_data.Engine_IDs))
    for engine_id in engine_ids:
        if db.get(Engine, engine_id) is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Engine não encontrada.")

    new_game = ProjectingDocumentation(
        Game_Name=game_data.Game_Name,
        Game_Status=game_data.Game_Status,
    )
    db.add(new_game)
    db.flush()

    db.add_all(
        AssociationProjectAndEngine(Engine_ID=engine_id, Game_ID=new_game.Game_ID)
        for engine_id in engine_ids
    )

    db.commit()
    db.refresh(new_game)
    return GameResponse(
        Game_ID=new_game.Game_ID,
        Game_Name=new_game.Game_Name,
        Game_Status=new_game.Game_Status,
        Engine_IDs=engine_ids,
    )


@game_router.get("/", response_model=list[GameResponse])
def list_games(db: Session = Depends(get_db)):
    games = db.query(ProjectingDocumentation).order_by(ProjectingDocumentation.Game_ID.desc()).all()
    associations = db.query(AssociationProjectAndEngine).all()
    engines_by_game = {}
    for association in associations:
        engines_by_game.setdefault(association.Game_ID, []).append(association.Engine_ID)

    return [
        GameResponse(
            Game_ID=game.Game_ID,
            Game_Name=game.Game_Name,
            Game_Status=game.Game_Status,
            Engine_IDs=engines_by_game.get(game.Game_ID, []),
        )
        for game in games
    ]
