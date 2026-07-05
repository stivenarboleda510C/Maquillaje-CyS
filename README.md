# Maquillaje CyS

Catalogo de productos de maquillaje.

## Estructura

- `backend/` — API en FastAPI (Python), conectada a Supabase (Postgres).
- `frontend/` — Sitio en Next.js (React) que consume la API.

## Desarrollo local

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env   # completar SUPABASE_URL y SUPABASE_KEY
uvicorn app.main:app --reload
```

La API queda disponible en `http://localhost:8000`.

### Base de datos

En el SQL Editor de Supabase, ejecutar `backend/supabase_schema.sql` para crear la tabla `products` con datos de ejemplo.

### Frontend

```bash
cd frontend
npm install
copy .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

El sitio queda disponible en `http://localhost:3000`.

## Despliegue (gratis)

- **Backend:** Render (free tier), usando `backend/render.yaml`.
- **Frontend:** Vercel (free tier), apuntando a la carpeta `frontend/`.
- **Base de datos/Auth:** Supabase (free tier).
