<p align="center"> <a href="#-tech-stack"> <img src="https://img.shields.io/badge/Node.js-18.x-blue?style=for-the-badge&logo=node.js" alt="Versão Node.js"> <img src="https://img.shields.io/badge/Next.js-13.x-black?style=for-the-badge&logo=next.js" alt="Versão Next.js"> <img src="https://img.shields.io/badge/MongoDB-6.x-green?style=for-the-badge&logo=mongodb" alt="Versão MongoDB"> <img src="https://img.shields.io/badge/Docker-20.x-blue?style=for-the-badge&logo=docker" alt="Versão Docker"> </a> <a href="./LICENSE"> <img src="https://img.shields.io/badge/Licença-MIT-yellow?style=for-the-badge" alt="Licença"> </a> </p>
🌟 Visão Geral
Este é um aplicativo Full Stack de Dashboard de Vendas pronto para produção e rico em funcionalidades. Ele oferece uma solução completa para empresas gerenciarem vendas, produtos e usuários, com visualização de dados e sistema de autenticação seguro. Construído com uma stack moderna, o projeto é ideal para desempenho, escalabilidade e manutenção.

Serve como um excelente ponto de partida para qualquer aplicação SaaS ou ferramenta interna de negócios, economizando centenas de horas de desenvolvimento.

✨ Funcionalidades Principais
Autenticação JWT Segura: Sistema robusto de login/cadastro com controle de acesso baseado em papéis (Admin/Usuário).

Dashboard Interativo: Gráficos dinâmicos e KPIs para acompanhamento de desempenho de vendas.

Operações CRUD: Gerenciamento completo de Produtos, Vendas e Usuários (somente Admin).

Ambiente Dockerizado: Configuração simples com Docker Compose para desenvolvimento e implantação.

Documentação de API Profissional: Documentação interativa via Swagger.

Qualidade de Código: Consistência garantida com ESLint e Prettier em toda a stack.

Testes Automatizados no Backend: Backend confiável com suíte de testes utilizando Jest & Supertest.

Seed de Usuário Admin: Script para criar facilmente o primeiro administrador.

🛠️ Stack Tecnológica
Área	Tecnologias
Backend	Node.js, Express, MongoDB, Mongoose, JWT
Frontend	Next.js, React, Tailwind CSS, Recharts
DevOps	Docker, Docker Compose
Testes	Jest, Supertest, mongodb-memory-server
Ferramentas	ESLint, Prettier, Swagger

🚀 Primeiros Passos
Pré-requisitos
Docker e Docker Compose instalados.

Instalação
Clone o repositório:

bash
Copiar
Editar
git clone https://github.com/seu-usuario/sales-dashboard.git
cd sales-dashboard
Crie os arquivos de ambiente:

Você deve criar os arquivos .env para o backend e o frontend. Arquivos .env.example são fornecidos em cada diretório.

Backend (/backend/.env):

bash
Copiar
Editar
cp backend/.env.example backend/.env
Depois, edite backend/.env e preencha as variáveis necessárias, especialmente JWT_SECRET e as credenciais do administrador.

Frontend (/frontend/.env):

bash
Copiar
Editar
cp frontend/.env.example frontend/.env
🏃 Executando a Aplicação
Construa e inicie os containers:

No diretório raiz, execute:

bash
Copiar
Editar
docker-compose up -d --build
Acesse a aplicação:

Frontend: http://localhost:3000

API Backend: http://localhost:5000

🌱 Popular Banco de Dados
Para criar o usuário admin inicial, execute o script de seed. As credenciais são lidas das variáveis ADMIN_EMAIL e ADMIN_PASSWORD em backend/.env.

bash
Copiar
Editar
# Executar o script de seed dentro do container backend
docker-compose exec backend npm run seed
🧪 Executando Testes
Para rodar a suíte de testes automatizados do backend:

bash
Copiar
Editar
# Executar os testes dentro do container backend
docker-compose exec backend npm run test
📚 Documentação da API
O backend inclui documentação interativa da API gerada com Swagger. Com os containers rodando, acesse:

http://localhost:5000/api-docs

Aqui você pode explorar e testar todos os endpoints disponíveis.

📜 Licença
Distribuído sob a Licença MIT. Veja o arquivo LICENSE para mais informações.

📬 Contato
Seu Nome - @seu_twitter - email@exemplo.com

Link do Projeto: https://github.com/seu-usuario/sales-dashboard