(function () {
  const $ = id => document.getElementById(id);
  const status = $("pageStatus");
  const tableHead = $("tableHead");
  const tableBody = $("tableBody");
  const tabs = [...document.querySelectorAll("[data-table]")];
  let datasets = {};
  let activeTable = "engines";

  const setStatus = (message, state) => {
    status.textContent = message;
    status.dataset.state = state || "";
  };

  const request = async path => {
    const response = await fetch(path);
    const body = await response.json();
    if (!response.ok) {
      const detail = Array.isArray(body.detail) ? body.detail.map(item => item.msg).join("; ") : body.detail;
      throw new Error(detail || "Falha ao consultar a API.");
    }
    return body;
  };

  const columns = {
    engines: [
      ["Engine_ID", "ID"],
      ["Name_Engine", "Engine"],
      ["Function_Engine", "Função / observação"]
    ],
    games: [
      ["Game_ID", "ID"],
      ["Game_Name", "Jogo"],
      ["Game_Status", "Status"],
      ["Engines", "Engines vinculadas"]
    ],
    professionals: [
      ["Professional_ID", "ID"],
      ["Nome", "Profissional"],
      ["Active", "Ativo"]
    ],
    bugs: [
      ["Documentation_Bug_ID", "ID"],
      ["Date_Reported", "Data"],
      ["Game", "Jogo"],
      ["Place_game", "Local"],
      ["cause", "Causa"],
      ["Step_Reproduction", "Passos para reproduzir"],
      ["Reported", "Reportado por"],
      ["Responsible", "Responsável"]
    ]
  };

  const normalizeData = ({ engines, games, professionals, bugs }) => {
    const enginesById = new Map(engines.map(item => [item.Engine_ID, item.Name_Engine]));
    const gamesById = new Map(games.map(item => [item.Game_ID, item.Game_Name]));
    const professionalsById = new Map(professionals.map(item => [item.Professional_ID, item.Nome]));
    return {
      engines,
      games: games.map(item => ({
        ...item,
        Engines: item.Engine_IDs.map(id => enginesById.get(id) || "Engine não encontrada (#" + id + ")").join(", ") || "—"
      })),
      professionals,
      bugs: bugs.map(item => ({
        ...item,
        Date_Reported: item.Date_Reported.split("-").reverse().join("/"),
        Game: gamesById.get(item.Game_ID) || "Jogo não encontrado (#" + item.Game_ID + ")",
        Reported: professionalsById.get(item.Reported_ID) || "Profissional não encontrado (#" + item.Reported_ID + ")",
        Responsible: professionalsById.get(item.Responsible_ID) || "Profissional não encontrado (#" + item.Responsible_ID + ")"
      }))
    };
  };

  const renderTable = tableName => {
    const rows = datasets[tableName] || [];
    tableHead.replaceChildren();
    tableBody.replaceChildren();
    $("tablePanel").setAttribute("aria-labelledby", "tab-" + tableName);
    $("tableSummary").textContent = rows.length + " registro(s) em " + tabs.find(tab => tab.dataset.table === tableName).textContent + ".";

    const headerRow = document.createElement("tr");
    columns[tableName].forEach(([, label]) => {
      const cell = document.createElement("th");
      cell.scope = "col";
      cell.textContent = label;
      headerRow.append(cell);
    });
    tableHead.append(headerRow);

    if (!rows.length) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.className = "empty-cell";
      cell.colSpan = columns[tableName].length;
      cell.textContent = "Nenhum registro nesta tabela.";
      row.append(cell);
      tableBody.append(row);
      return;
    }

    rows.forEach(item => {
      const row = document.createElement("tr");
      columns[tableName].forEach(([key]) => {
        const cell = document.createElement("td");
        const value = item[key];
        cell.textContent = key === "Active" ? (value ? "Sim" : "Não") : (value || "—");
        if (key === "Step_Reproduction") cell.className = "multiline";
        row.append(cell);
      });
      tableBody.append(row);
    });
  };

  const selectTable = tableName => {
    activeTable = tableName;
    document.body.dataset.view = tableName;
    tabs.forEach(tab => tab.setAttribute("aria-selected", String(tab.dataset.table === tableName)));
    if (datasets[tableName]) renderTable(tableName);
  };

  const loadData = async () => {
    $("refreshButton").disabled = true;
    setStatus("Consultando o banco...", "");
    try {
      const response = await Promise.all([
        request("/engines/"),
        request("/games/"),
        request("/professionals/"),
        request("/bugs/")
      ]);
      datasets = normalizeData({
        engines: response[0],
        games: response[1],
        professionals: response[2],
        bugs: response[3]
      });
      $("engineCount").textContent = datasets.engines.length;
      $("gameCount").textContent = datasets.games.length;
      $("professionalCount").textContent = datasets.professionals.length;
      $("bugCount").textContent = datasets.bugs.length;
      $("lastUpdated").textContent = "Última consulta: " + new Date().toLocaleString("pt-BR");
      setStatus("Consulta concluída. Estes dados foram carregados da API.", "success");
      renderTable(activeTable);
    } catch (error) {
      setStatus("Não foi possível consultar os dados: " + error.message, "error");
      tableHead.replaceChildren();
      tableBody.replaceChildren();
    } finally {
      $("refreshButton").disabled = false;
    }
  };

  tabs.forEach(tab => tab.addEventListener("click", () => selectTable(tab.dataset.table)));
  $("refreshButton").addEventListener("click", loadData);
  loadData();
})();
