# Despliegue en Vercel y activación de la lista

## 1. Supabase
1. Ejecuta `halloween_free_cover.sql` completo en SQL Editor (la lista se crea CERRADA, 100 cupos).
2. Settings > API Keys: copia `Project URL` y la **secret key** (la que empieza por `sb_secret_`, o `service_role` en proyectos antiguos).

## 2. Vercel
1. Sube la carpeta a un repositorio de GitHub e impórtalo en vercel.com/new (Next.js, sin cambiar nada). Alternativa: `npx vercel` y luego `npx vercel --prod` dentro de la carpeta.
2. Settings > Environment Variables (Production y Preview):
   - `SUPABASE_URL`
   - `SUPABASE_SECRET_KEY` (sin prefijo `NEXT_PUBLIC_`; Vercel la guarda como secreta)
   - `NEXT_PUBLIC_SITE_URL` = URL final con https
3. Deploy. La página queda pública con el formulario cerrado (`registration_open = false`).
4. Recomendado: Vercel > Firewall > Rate Limiting sobre `POST /api/registrations` (p. ej. 10 solicitudes/minuto por IP). El límite interno (20 por 10 min por IP) es por instancia y solo una barrera básica.

## 3. Prueba real antes de abrir (con la lista cerrada para el público)
No hay modo "prueba" separado: para probar de verdad hay que abrir la lista un momento.
1. Define la política (la versión debe coincidir con el documento publicado):
   `update public.party_events set privacy_policy_version = '2026-10-09-v1' where slug = 'halloween-pool-party-2026';`
2. Abre: `update public.party_events set registration_open = true where slug = 'halloween-pool-party-2026';`
   (la web lo refleja en la siguiente carga; no hace falta redeploy)
3. Haz UNA inscripción real de prueba en la web. Verifica en Supabase > Table Editor > `party_registrations` (nombre, WhatsApp en +E.164, consentimientos, versión de política).
4. Repite el mismo número (debe decir duplicado; en otro formato también).
5. Cierra de inmediato si aún no es el momento: `update public.party_events set registration_open = false where slug = 'halloween-pool-party-2026';`
6. Borra la fila de prueba: `delete from public.party_registrations where whatsapp = '+57...';` (con el rol del SQL Editor).
   Pruebas adicionales del archivo SQL (100/101 cupos, concurrencia) hazlas en un proyecto Supabase de prueba, no en el real.

## 4. Abrir / cerrar
- Abrir: pasos 1–2 de arriba. Cerrar: `registration_open = false`. Efecto inmediato.
- La lista se cierra sola a las 10:00 p. m. del 31/10/2026 (`free_cover_deadline`).
- Cambiar la política: actualiza `privacy_policy_version`; quien tenga el formulario abierto con la versión anterior verá "Actualizamos la política de datos" y deberá recargar.

## Exportar para la puerta
SQL Editor: `select full_name, whatsapp, confirmation_code, created_at from public.party_registrations order by created_at;` → exportar CSV. Mantenerlo privado.
