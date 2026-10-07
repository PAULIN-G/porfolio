# Portfolio — DTSAMO PAULIN FRANCKY

Frontend HTML/CSS/JS sans framework, backend Python FastAPI, base SQL (SQLite, prête pour PostgreSQL).
FastAPI sert à la fois l'API et le site : un seul serveur, une seule adresse.

## Lancer en local (automatique)

- **Windows** : double-clic sur `start.bat`
- **Linux / macOS** : `./start.sh`

Le script crée l'environnement virtuel `.venv`, installe les dépendances, copie `.env.example` en `.env`,
démarre le serveur et ouvre `http://localhost:8000`. Prérequis : Python 3.10+.
Documentation interactive de l'API : `http://localhost:8000/docs`.

## Personnaliser

Tout le contenu est dans **`backend/app/content.py`** : nom, titre, bio, email, réseaux sociaux, compétences,
projets, formation, expériences. Enregistrez puis relancez le serveur : la base est resynchronisée au démarrage.

À faire avant publication :
- remplacer `email` et `socials` (GitHub, LinkedIn) dans `content.py` ;
- renseigner `github` et `demo` de chaque projet quand ils existent (vide = bouton « bientôt ») ;
- ajouter vos stages et emplois dans `EXPERIENCE` : ils apparaissent dans la frise Parcours ;
- adapter le `<title>`, les balises Open Graph et le JSON-LD dans `public/index.html`.

Après toute modification de `content.py`, relancez `python tools/export_content.py` (fait automatiquement par `start.bat`/`start.sh`) et envoyez aussi `public/data/site.json` sur GitHub : c'est le repli qui garde le site visible si l'API est indisponible.

Les quatre projets fournis sont des **concepts de démonstration** et sont affichés comme tels.

## API

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/api/profile` | profil, domaines, frise (formation + expériences) |
| GET | `/api/projects` | projets |
| GET | `/api/skills` | compétences |
| GET | `/api/stats` | compteurs |
| POST | `/api/contact` | enregistre un message (validé, champ anti-spam) |
| GET | `/api/messages` | lit les messages, en-tête `X-Admin-Token` = `ADMIN_TOKEN` du `.env` |

## Passer à PostgreSQL

`pip install "psycopg[binary]"`, puis dans `.env` :
`DATABASE_URL=postgresql+psycopg://user:motdepasse@localhost:5432/portfolio`

## Structure

```
backend/app/   main.py, config.py, content.py, database.py, models.py, schemas.py, seed.py, routes/
public/      index.html, css/style.css, js/app.js, js/config.js
database/      portfolio.db (créé au premier lancement)
start.bat · start.sh · requirements.txt · .env.example
```

## Déployer sur Vercel

1. Créez un dépôt GitHub et envoyez-y le contenu de ce dossier (`.gitignore` exclut déjà `.venv` et `.env`).
2. Sur vercel.com : **Add New, Project**, importez le dépôt. Vercel lit le point d'entrée dans `pyproject.toml` (`backend.app.main:app`).
3. Avant de déployer, onglet **Storage** (ou Marketplace) : créez une base **Neon Postgres** et reliez-la au projet.
   Vercel ajoute `DATABASE_URL` (ou `POSTGRES_URL`) ; `config.py` convertit l'adresse au bon format.
4. Dans **Environment Variables**, ajoutez `ADMIN_TOKEN` (mot de passe long) et `CORS_ORIGINS` (l'adresse de votre site).
5. **Deploy**. Lire les messages : `curl -H "X-Admin-Token: VOTRE_TOKEN" https://VOTRE-SITE.vercel.app/api/messages`

Sans base PostgreSQL, le site fonctionne mais les messages du formulaire ne sont pas conservés (disque éphémère).
Le site (`public/`) est servi par le CDN de Vercel, l'API (`/api/...`) par la fonction Python.
