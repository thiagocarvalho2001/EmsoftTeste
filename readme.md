# Cadastro de Endereços

Projeto desenvolvido para Emsoft.

* **Tecnologias Utilizadas**

* **Frontend: HTML5, CSS3, Bootstrap 5, JavaScript (Vanilla).**

* **Backend: PHP Puro (sem frameworks).**

* **Dados: Armazenamento em arquivo JSON.**

* **API Externa: ViaCEP.**

## Como Executar o Projeto

Pré-requisitos

Você precisa de um servidor local com PHP instalado. Exemplos:

XAMPP

WAMP

Laragon

Ou PHP instalado via linha de comando.

Passo a Passo

Baixe os arquivos: Coloque a pasta do projeto dentro do diretório do seu servidor (ex: htdocs no XAMPP).

Permissões: Certifique-se de que o PHP tem permissão de escrita na pasta do projeto (para criar a pasta data e o arquivo ceps.json).

Executando com PHP Built-in Server (Modo mais fácil)

Se você tem o PHP instalado e configurado no PATH do sistema:

Abra o terminal na pasta raiz do projeto.

1. **Execute o comando:**

```bash
php -S localhost:8000
```

2. **Abra o navegador e acesse: http://localhost:8000**

* **Funcionalidades Implementadas**

* **Consulta de CEP: Busca dados na API ViaCEP.**

* **Interface : Campos de endereço aparecem apenas após a busca.**

* **Loading: Feedback visual durante as requisições.**

* **Backend PHP: Recebe os dados via POST.**

* **Validação de Duplicidade: O sistema impede o cadastro do mesmo CEP duas vezes, retornando erro 409.**

* **Persistência: Salva os dados incrementais em data/ceps.json.**
