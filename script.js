document.addEventListener("DOMContentLoaded", () => {
  // Referências aos elementos do DOM
  const form = document.getElementById("addressForm");
  const cepInput = document.getElementById("cep");
  const btnBuscar = document.getElementById("btnBuscar");
  const btnEnviar = document.getElementById("btnEnviar");
  const enderecoContainer = document.getElementById("enderecoContainer");
  const feedbackMsg = document.getElementById("feedbackMsg");

  // Elementos de Loading
  const loadingBuscar = document.getElementById("loadingBuscar");
  const iconBuscar = document.getElementById("iconBuscar");
  const loadingEnviar = document.getElementById("loadingEnviar");
  const textEnviar = document.getElementById("textEnviar");

  // Inputs de Endereço
  const fields = {
    logradouro: document.getElementById("logradouro"),
    bairro: document.getElementById("bairro"),
    cidade: document.getElementById("cidade"),
    estado: document.getElementById("estado"),
    pais: document.getElementById("pais"),
  };

  cepInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  });

  cepInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      btnBuscar.click();
    }
  });

  if (!fields.cidade.value || !fields.estado.value) {
    enderecoContainer.classList.add("d-none");
  }
  // Mensagens de feedback
  const showMessage = (message, type = "success") => {
    feedbackMsg.className = `alert alert-${type} d-block fade-in`;
    feedbackMsg.textContent = message;

    if (type === "success") {
      setTimeout(() => {
        feedbackMsg.classList.add("d-none");
      }, 5000);
    }
  };

  const clearMessage = () => {
    feedbackMsg.classList.add("d-none");
  };

  // Ação 1: Buscar CEP
  btnBuscar.addEventListener("click", async () => {
    const cep = cepInput.value.trim();

    clearMessage();

    // Validação no frontend
    if (cep.length !== 8) {
      showMessage("Por favor, digite um CEP válido com 8 números.", "warning");
      return;
    }

    // UI: Estado de Carregamento
    btnBuscar.disabled = true;
    iconBuscar.classList.add("d-none");
    loadingBuscar.classList.remove("d-none");
    enderecoContainer.classList.add("d-none");

    // Trata a consulta à API ViaCEP
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        showMessage("CEP não encontrado. Verifique o número.", "danger");
        enderecoContainer.classList.add("d-none");
      } else {
        fields.logradouro.value = data.logradouro || "Não informado";
        fields.bairro.value = data.bairro || "Não informado";
        fields.cidade.value = data.localidade;
        fields.estado.value = data.uf;

        enderecoContainer.classList.remove("d-none");
        cepInput.classList.add("is-valid"); // Visual Bootstrap
      }
    } catch (error) {
      console.error(error);
      showMessage("Erro ao consultar API. Verifique sua conexão.", "danger");
    } finally {
      btnBuscar.disabled = false;
      iconBuscar.classList.remove("d-none");
      loadingBuscar.classList.add("d-none");
    }
  });

  // ---- Ação 2: Envia os dados --- Backend ----
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      cep: cepInput.value,
      endereco: fields.logradouro.value,
      bairro: fields.bairro.value,
      cidade: fields.cidade.value,
      estado: fields.estado.value,
      pais: fields.pais.value,
    };

    btnEnviar.disabled = true;
    textEnviar.classList.add("d-none");
    loadingEnviar.classList.remove("d-none");

    try {
      const response = await fetch("backend/api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        // Trata erros retornados pelo PHP
        throw new Error(result.message || "Erro ao salvar dados.");
      }

      showMessage(result.message, "success");

      form.reset();
      enderecoContainer.classList.add("d-none");
      cepInput.classList.remove("is-valid");
    } catch (error) {
      showMessage(error.message, "danger");
    } finally {
      btnEnviar.disabled = false;
      textEnviar.classList.remove("d-none");
      loadingEnviar.classList.add("d-none");
    }
  });
});
