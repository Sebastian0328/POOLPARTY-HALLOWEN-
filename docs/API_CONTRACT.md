# Contrato — `POST /api/registrations`

Fuente: `halloween_free_cover.sql`. Código: `src/app/api/registrations/route.ts` → `src/server/registrations.ts` → RPC `register_party_free_cover`.

## Request (JSON, ≤ 10 KB, `Origin` debe ser el propio sitio)

```json
{
  "fullName": "Nombre Apellido",
  "whatsapp": "+573001234567",
  "email": "opcional@correo.com",
  "favoriteEnvironment": "techno | regueton_old_school | dancehall_rancha",
  "isAdult": true,
  "privacyConsent": true,
  "privacyPolicyVersion": "versión mostrada al visitante",
  "marketingConsent": false,
  "website": ""
}
```

El servidor revalida todo, normaliza el WhatsApp (quita espacios, guiones y paréntesis; exige `+` y 8–15 dígitos), y rechaza campos desconocidos. `website` es un honeypot: si trae contenido → `invalid`.

## Response (siempre `Cache-Control: no-store`)

| HTTP | `status`         | Cuerpo adicional |
|------|------------------|------------------|
| 201  | `confirmed`      | `name`, `confirmationCode`, `freeCoverDeadline` |
| 409  | `duplicate`      | — (no se devuelve ningún dato del registro previo) |
| 409  | `sold_out`       | — |
| 409  | `closed`         | — |
| 409  | `policy_changed` | — (la versión enviada ya no es la vigente) |
| 400/403/413 | `invalid` | — (datos inválidos, origen no permitido, honeypot, cuerpo grande) |
| 429  | `unavailable`    | `message` (límite de intentos por IP) |
| 503  | `unavailable`    | — (Supabase no configurado, caído o respuesta inesperada) |

La UI solo muestra la confirmación con HTTP 201 + `status: "confirmed"` + `name` + `confirmationCode`.

## Estado público de la lista

No hay endpoint: el servidor (`src/server/eventStatus.ts`) lee `party_events` en cada solicitud y entrega al formulario solo: abierta/cerrada y `privacy_policy_version`. Nunca cupos, conteos ni asistentes.
