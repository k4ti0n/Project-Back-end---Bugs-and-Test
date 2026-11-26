(function () {
  const $ = id => document.getElementById(id);
  const status = $("pageStatus");

  const setStatus = (message, state) => {
    status.textContent = message;
    status.dataset.state = state || "";
  };

  const errorMessage = body => {
    if (Array.isArray(body.detail)) return body.detail.map(item => item.msg).join("; ");
    return body.detail || "A API recusou a solicitação.";
  };

  const request = async (path, options) => {
    const response = await fetch(path, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options && options.headers) }
    });
    const body = await response.json();
    if (!response.ok) throw new Error(errorMessage(body));
    return body;
  };

  const addOptions = (select, items, label, id, emptyLabel) => {
    const placeholder = select.multiple ? [] : [new Option(emptyLabel, "")];
    select.replaceChildren(...placeholder);
    items.forEach(item => select.add(new Option(label(item), id(item))));
  };

  const loadOptions = async () => {
    const [engines, games, professionals] = await Promise.all([
      request("/engines/"),
      request("/games/"),
      request("/professionals/")
    ]);

    addOptions($("gameEngine"), engines, item => item.Name_Engine, item => item.Engine_ID, "");
    addOptions($("bugGame"), games, item => item.Game_Name, item => item.Game_ID, "Selecione um jogo");
    const activeProfessionals = professionals.filter(item => item.Active);
    addOptions($("bugReporter"), activeProfessionals, item => item.Nome, item => item.Professional_ID, "Selecione quem reportou");
    addOptions($("bugResponsible"), activeProfessionals, item => item.Nome, item => item.Professional_ID, "Selecione o responsável");

    setStatus(
      "Conectado. " + engines.length + " engine(s), " + games.length +
      " jogo(s) e " + activeProfessionals.length + " profissional(is) disponíveis.",
      "success"
    );
  };

  const formPayload = form => Object.fromEntries(new FormData(form).entries());
  const setToday = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    $("bugDate").value = today.toISOString().slice(0, 10);
  };

  const bindForm = (formId, endpoint, payload, successMessage) => {
    $(formId).addEventListener("submit", async event => {
      event.preventDefault();
      const form = event.currentTarget;
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      try {
        await request(endpoint, { method: "POST", body: JSON.stringify(payload(form)) });
        form.reset();
        if (formId === "bugForm") setToday();
        try {
          await loadOptions();
          setStatus(successMessage, "success");
        } catch (error) {
          setStatus(successMessage + " Atualize a página para recarregar as opções.", "warning");
        }
      } catch (error) {
        setStatus("Não foi possível salvar: " + error.message, "error");
      } finally {
        button.disabled = false;
      }
    });
  };

  bindForm("engineForm", "/engines/", formPayload, "Engine salva no banco.");
  bindForm("professionalForm", "/professionals/", formPayload, "Profissional salvo no banco.");
  bindForm("gameForm", "/games/", form => {
    const data = formPayload(form);
    const engineSelect = form.querySelector('[name="Engine_IDs"]');
    return {
      ...data,
      Engine_IDs: Array.from(engineSelect.selectedOptions, option => Number(option.value)).filter(id => id > 0)
    };
  }, "Jogo salvo no banco.");
  bindForm("bugForm", "/bugs/", form => {
    const data = formPayload(form);
    return {
      ...data,
      Game_ID: Number(data.Game_ID),
      Reported_ID: Number(data.Reported_ID),
      Responsible_ID: Number(data.Responsible_ID),
      cause: data.cause || null
    };
  }, "Bug registrado no banco.");

  setToday();
  loadOptions().catch(error => {
    setStatus("Não foi possível carregar as opções: " + error.message + ". Verifique se a API está disponível.", "error");
  });
})();
