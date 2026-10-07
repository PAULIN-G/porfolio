"""Génère public/data/site.json depuis backend/app/content.py (bibliothèque standard uniquement).
Ce fichier permet au site de s'afficher même si l'API est indisponible.
À relancer après chaque modification de content.py :  python tools/export_content.py"""
import importlib.util
import json
import pathlib

root = pathlib.Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("content", root / "backend" / "app" / "content.py")
c = importlib.util.module_from_spec(spec)
spec.loader.exec_module(c)

data = {
    "profile": {**c.PROFILE, "pillars": c.PILLARS, "timeline": [*c.EXPERIENCE, *c.EDUCATION]},
    "skills": [{"name": n, "category": k, "note": note} for n, k, note in c.SKILLS],
    "projects": [{**p, "is_demo": True} for p in c.PROJECTS],
    "stats": {"projects": len(c.PROJECTS), "technologies": len(c.SKILLS),
              "domains": len({k for _, k, _ in c.SKILLS}), "messages": 0},
}
out = root / "public" / "data"
out.mkdir(parents=True, exist_ok=True)
(out / "site.json").write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
print("public/data/site.json généré")
