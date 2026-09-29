# RepoAnalyzer 🚀

RepoAnalyzer is an AI-powered GitHub repository analyzer and RAG (Retrieval-Augmented Generation) chat assistant. It connects to your GitHub account, indexes codebases into vector embeddings, and enables real-time AI conversations grounded directly in your source code with file-level citations.

---

## ✨ Features

- **GitHub OAuth2 Authentication**: Secure login and repository access via GitHub OAuth.
- **Automatic & On-Demand Sync**: Instantly fetch public and private GitHub repositories.
- **Smart Code Indexing**: Token-based chunking and language filtering for source code files.
- **Vector Search (PGVector)**: High-performance vector storage and similarity retrieval using PostgreSQL and PGVector.
- **Real-Time RAG Chat**: SSE (Server-Sent Events) streaming AI responses grounded in repository context with file citations.
- **Modern UI**: Next.js dashboard with dark mode, live search, and reactive status indicators.

---

## 🛠️ Tech Stack

### Backend
- **Language**: Java 21
- **Framework**: Spring Boot 3.3.4
- **AI & RAG**: Spring AI, OpenAI Embeddings (`text-embedding-3-small`), `gpt-4o-mini`
- **Database**: PostgreSQL 16 + `pgvector`
- **Security**: Spring Security OAuth2 Client, Custom Token Encryption

### Frontend
- **Framework**: Next.js 16 (React 19, TypeScript)
- **Styling**: Tailwind CSS
- **State & Data**: TanStack React Query
- **Icons**: Lucide React

---

## ⚡ Quick Start

### 1. Prerequisites
- Docker & Docker Compose
- Java 21 (JDK 21) & Maven
- Node.js (v18+) & `npm`
- OpenAI API Key

### 2. Start PostgreSQL with PGVector
```bash
docker-compose up -d
```

### 3. Configure Backend Environment
Create `backend/src/main/resources/application-secrets.properties`:
```properties
OPENAI_API_KEY=your_openai_api_key
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
```

### 4. Run Backend Server
```bash
cd backend
mvn spring-boot:run
```
*Backend runs on `http://localhost:8081`.*

### 5. Run Next.js Frontend
```bash
cd Client
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

---

## 📄 License

Distributed under the MIT License.
