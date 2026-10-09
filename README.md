# Halloween Pool Party — 31 de octubre de 2026

Next.js (App Router), TypeScript, Tailwind v4, React Hook Form + Zod, Motion, Supabase (vía REST, solo servidor).

```bash
npm install
cp .env.example .env.local   # completar valores
npm run dev                  # http://localhost:3000
```

## Despliegue y activación
Ver `docs/DEPLOY.md`. Contrato de la API: `docs/API_CONTRACT.md`. Esquema propuesto: `supabase/schema.sql`.

## Qué editar
- `src/config/event.ts`: organizadores, redes, links legales, ambientes.
- `public/images/`: flyers (hoy placeholders SVG).
- `src/app/opengraph-image.tsx`: imagen para compartir (provisional).
- `src/components/sections/{Experience,FAQ,FinalCTA}.tsx`: secciones listas pero fuera de la versión de lanzamiento (añadir a `src/app/page.tsx`).
