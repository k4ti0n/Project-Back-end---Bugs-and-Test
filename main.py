from fastapi import FastAPI
from Banco.routes.engine_routes import engine_router
from Banco.routes.professional_routes import professional_router
from Banco.routes.bug_routes import bug_router

app = FastAPI(title="Gerenciamento de Bugs e Testes em Jogos", version="1.0.0")

# Incluindo as rotas modularizadas
app.include_router(engine_router)
app.include_router(professional_router)
app.include_router(bug_router)

@app.get("/")
def root():
    return {"message": "API de Gerenciamento de Bugs em Jogos rodando com sucesso!"}