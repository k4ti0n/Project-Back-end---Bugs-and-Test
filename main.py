from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from Banco.routes.engine_routes import engine_router
from Banco.routes.game_routes import game_router
from Banco.routes.professional_routes import professional_router
from Banco.routes.bug_routes import bug_router

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(title="Gerenciamento de Bugs e Testes em Jogos", version="1.0.0")
app.mount("/Interface", StaticFiles(directory=BASE_DIR / "Interface"), name="interface")

# Incluindo as rotas modularizadas
app.include_router(engine_router)
app.include_router(game_router)
app.include_router(professional_router)
app.include_router(bug_router)

@app.get("/")
def root():
    return FileResponse(BASE_DIR / "index.html")


@app.get("/cadastro", include_in_schema=False)
def cadastro_page():
    return FileResponse(BASE_DIR / "cadastro.html")


@app.get("/visualizador", include_in_schema=False)
def visualizador_page():
    return FileResponse(BASE_DIR / "visualizador.html")


    # uvicorn main:app --reload
    # pip install alembic 
    # alembic init alembic
    # alembic revision --autogenerate -m "Initial migration"
    # alembic revision --autogenerate -m "Initial migration"
    # alembic upgrade head
    # alembic current
