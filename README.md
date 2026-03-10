# PharmaManager
Application de gestion de pharmacie — Développé dans le cadre du test technique SMARTHOLOL

## Stack Technique
- Backend : Django 5.x + Django REST Framework + PostgreSQL
- Frontend : React.js (Vite)
- Documentation API : Swagger (drf-spectacular)
- Déploiement : Docker Compose

## Installation Backend
```bash
cd pharma_backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate --settings=config.settings.local
python manage.py runserver --settings=config.settings.local
```

## Variables d'Environnement (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
DB_NAME=pharma_db
DB_USER=postgres
DB_PASSWORD=postgres123
DB_HOST=localhost
DB_PORT=5432
```

## Installation Frontend
```bash
cd pharma_frontend
npm install
npm run dev
```

## Lancer avec Docker
```bash
docker-compose up -d
```

## Documentation API
Swagger UI : http://localhost:8000/api/schema/swagger-ui/

## Endpoints principaux
- GET /api/v1/medicaments/ — Liste des médicaments
- GET /api/v1/medicaments/alertes/ — Alertes stock
- POST /api/v1/ventes/ — Créer une vente
- POST /api/v1/ventes/{id}/annuler/ — Annuler une vente