// ===== Edite aqui os integrantes e o link do repositório =====
var equipe = [
  {nome:"Integrante 1", papel:"Modelagem do banco de dados e SQLAlchemy"},
  {nome:"Integrante 2", papel:"Rotas da API com FastAPI"},
  {nome:"Integrante 3", papel:"Validação com Pydantic e regras de negócio"},
  {nome:"Integrante 4", papel:"Testes e documentação"}
];
document.getElementById("repoLink").href = "https://github.com/seu-usuario/seu-repositorio";

// ===== Monta os cards da equipe =====
var grid = document.getElementById("teamGrid");
equipe.forEach(function(m){
  var d = document.createElement("div");
  d.className = "card";
  var h = document.createElement("h3"); h.textContent = m.nome;
  var s = document.createElement("small"); s.textContent = m.papel;
  d.appendChild(h); d.appendChild(s); grid.appendChild(d);
});

// ===== Demonstração da regra de negócio =====
var estado = {status:"aberto", testeOk:false};
var elS = document.getElementById("status"), elM = document.getElementById("msg");

function render(){
  elS.textContent = estado.status === "andamento" ? "em andamento" : estado.status;
  elS.className = "pill " + estado.status;
}

document.getElementById("bAnd").onclick = function(){
  if(estado.status === "resolvido"){ elM.textContent = "Bug já resolvido."; return; }
  estado.status = "andamento"; render(); elM.textContent = "Status atualizado para em andamento.";
};
document.getElementById("bTeste").onclick = function(){
  estado.testeOk = true; elM.textContent = "Teste aprovado registrado para o bug #12.";
};
document.getElementById("bRes").onclick = function(){
  if(!estado.testeOk){ elM.textContent = "❌ Bloqueado: o bug só pode ser resolvido após um teste aprovado."; return; }
  estado.status = "resolvido"; render(); elM.textContent = "✅ Bug marcado como resolvido.";
};
document.getElementById("bReset").onclick = function(){
  estado = {status:"aberto", testeOk:false}; render(); elM.textContent = "Simulação reiniciada.";
};