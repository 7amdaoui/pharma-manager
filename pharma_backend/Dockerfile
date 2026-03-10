FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
```

---

## 📁 `.env.example` (dans `pharma_backend/`)
```
DEBUG=True
SECRET_KEY=your-secret-key-here
DB_NAME=pharma_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1