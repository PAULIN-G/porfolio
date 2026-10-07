"""
CONTENU DU PORTFOLIO : seul fichier à modifier pour personnaliser le site.
Il est resynchronisé en base à chaque démarrage du serveur.
"""

PROFILE = {
    "name": "DTSAMO PAULIN FRANCKY",
    "short_name": "DTSAMO",
    "title": "Ingénieur des Travaux | Full-Stack Developer",
    "role_line": "Ingénieur des Travaux · Full-Stack Developer",
    "tagline": "Je conçois et développe des solutions numériques modernes, performantes et orientées vers des besoins réels.",
    "bio": [
        "Je suis DTSAMO PAULIN FRANCKY, Ingénieur des Travaux diplômé de l'IUT Fotso Victor de Bandjoun en 2024-2025. Je m'intéresse particulièrement au développement logiciel, aux applications web, aux architectures backend, aux bases de données et aux solutions orientées données.",
        "Je travaille sur toute la chaîne d'une application : modéliser les données, exposer une API claire avec Python ou Java et Spring Boot, puis construire l'interface avec JavaScript, Angular ou React. Je pars du besoin réel, je garde le code lisible et je livre quelque chose qui se déploie et se maintient.",
        "Mon goût pour les chiffres me ramène souvent vers la donnée : Excel, SQL et Python pour importer, nettoyer et analyser des jeux de données.",
    ],
    "email": "votre.email@exemple.com",  # À MODIFIER
    "socials": {  # À MODIFIER : laissez "" pour masquer un lien
        "github": "https://github.com/",
        "linkedin": "https://www.linkedin.com/",
    },
}

# Domaines affichés dans « Ce que je construis »
PILLARS = [
    {"title": "Web Applications", "text": "Applications web modernes et responsives, pensées pour l'écran du téléphone comme pour celui du bureau."},
    {"title": "Backend & APIs", "text": "APIs REST et architectures backend robustes : validation des données, authentification, structure claire."},
    {"title": "Data & Databases", "text": "Traitement, analyse et structuration des données, du fichier Excel à la base SQL."},
    {"title": "Software Engineering", "text": "Conception et développement de solutions logicielles maintenables, du besoin jusqu'à la livraison."},
]

# category : backend | frontend | database | data
SKILLS = [
    ("Python", "backend", "Scripts, APIs FastAPI, traitement de données"),
    ("Java", "backend", "Programmation orientée objet"),
    ("Spring Boot", "backend", "Services d'entreprise et APIs REST"),
    ("APIs REST", "backend", "Conception de ressources, codes HTTP, validation"),
    ("JavaScript", "frontend", "Interfaces dynamiques, appels d'API"),
    ("Angular", "frontend", "Applications structurées en composants"),
    ("React.js", "frontend", "Interfaces réactives"),
    ("Next.js", "frontend", "Rendu serveur et routage"),
    ("HTML5", "frontend", "Structure sémantique, accessibilité"),
    ("CSS3", "frontend", "Mise en page, responsive, animations"),
    ("SQL", "database", "Requêtes, jointures, modélisation"),
    ("PostgreSQL", "database", "Base relationnelle de production"),
    ("MySQL", "database", "Base relationnelle"),
    ("SQLite", "database", "Développement et petits projets"),
    ("Excel", "data", "Tableaux, formules, tableaux croisés"),
    ("Analyse de données", "data", "Lecture, indicateurs, restitution"),
    ("Traitement de données", "data", "Import, nettoyage, transformation"),
]

# Projets de DÉMONSTRATION : concepts qui illustrent des compétences (aucun client réel).
# Renseignez github / demo quand le projet existe ; vide = bouton désactivé.
PROJECTS = [
    {
        "slug": "business-management-platform", "mockup": "dashboard",
        "title": "Business Management Platform",
        "summary": "Application complète de gestion d'entreprise : clients, stocks, factures et tableau de bord.",
        "problem": "Une petite structure suit ses ventes et son stock dans des fichiers dispersés, avec des doublons et des erreurs de saisie.",
        "features": ["Gestion des clients et produits", "Facturation avec totaux calculés", "Tableau de bord des ventes", "Export des données"],
        "stack": ["Python", "SQL", "JavaScript"], "github": "", "demo": "",
    },
    {
        "slug": "enterprise-rest-api", "mockup": "api",
        "title": "Enterprise REST API",
        "summary": "Backend professionnel pour gérer des utilisateurs, des ressources et des données.",
        "problem": "Plusieurs applications ont besoin d'un point d'accès unique, sécurisé et documenté aux mêmes données.",
        "features": ["Authentification et rôles", "CRUD validé", "Pagination et filtres", "Documentation OpenAPI"],
        "stack": ["Java", "Spring Boot", "PostgreSQL"], "github": "", "demo": "",
    },
    {
        "slug": "modern-web-application", "mockup": "web",
        "title": "Modern Web Application",
        "summary": "Application web moderne avec une interface dynamique et rapide.",
        "problem": "Les utilisateurs abandonnent des interfaces lentes qui rechargent la page à chaque action.",
        "features": ["Navigation sans rechargement", "Rendu côté serveur", "Interface responsive", "Gestion d'état propre"],
        "stack": ["React.js", "Next.js", "JavaScript"], "github": "", "demo": "",
    },
    {
        "slug": "data-analysis-platform", "mockup": "data",
        "title": "Data Analysis Platform",
        "summary": "Solution pour importer, traiter et analyser des données issues de fichiers Excel.",
        "problem": "Les analyses se font à la main, tableau par tableau, avec un risque d'erreur à chaque étape.",
        "features": ["Import CSV et Excel", "Nettoyage automatique", "Indicateurs et graphiques", "Rapport exportable"],
        "stack": ["Python", "SQL", "Excel"], "github": "", "demo": "",
    },
]

EDUCATION = [
    {"period": "2024 — 2025", "title": "Ingénieur des Travaux", "organization": "IUT Fotso Victor de Bandjoun",
     "detail": "Diplôme obtenu, année académique 2024-2025."},
]

# Ajoutez ici stages, emplois, certifications : ils apparaissent dans la frise « Parcours ».
EXPERIENCE = [
    # {"period": "2025", "title": "Intitulé du poste", "organization": "Entreprise", "detail": "Missions réalisées."},
]
