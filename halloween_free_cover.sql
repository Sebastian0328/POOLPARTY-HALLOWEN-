-- HALLOWEEN POOL PARTY | Preparado para un proyecto NUEVO de Supabase.
-- Ejecutar completo en SQL Editor. No elimina ni sobrescribe tablas existentes.
-- 100 cupos; ingreso ANTES de las 22:00 del 31/10/2026, America/Bogota.
-- Pendientes: lugar, hora inicial, responsable/contacto de datos y política publicada.
-- La lista se crea CERRADA. Abrir solo después de conectar y probar el backend.
-- Este archivo no ha sido ejecutado en el proyecto del organizador.

begin;

create table public.party_events (
  slug text primary key,
  name text not null,
  event_date date not null,
  timezone text not null default 'America/Bogota',
  capacity integer not null check (capacity > 0),
  registration_open boolean not null default false,
  free_cover_deadline timestamptz not null,
  privacy_policy_version text,
  venue text,
  created_at timestamptz not null default now(),
  check (not registration_open or privacy_policy_version is not null)
);

create table public.party_registrations (
  id uuid primary key default gen_random_uuid(),
  event_slug text not null references public.party_events(slug),
  -- Código visible de consulta manual, NO credencial de acceso ni QR seguro.
  confirmation_code text not null unique default
    ('HP-' || upper(replace(gen_random_uuid()::text, '-', ''))),
  full_name text not null check (char_length(btrim(full_name)) between 3 and 120),
  whatsapp text not null check (whatsapp ~ '^\+[1-9][0-9]{7,14}$'),
  email text check (email is null or char_length(email) <= 254),
  favorite_environment text check (
    favorite_environment in ('techno', 'regueton_old_school', 'dancehall_rancha')
  ),
  adult_declaration boolean not null check (adult_declaration),
  privacy_consent boolean not null check (privacy_consent),
  marketing_consent boolean not null default false,
  privacy_policy_version text not null,
  consent_recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (event_slug, whatsapp)
);

alter table public.party_events enable row level security;
alter table public.party_registrations enable row level security;
-- Ninguna política pública: visitantes no pueden leer datos ni insertar directamente.
revoke all on public.party_events, public.party_registrations from anon, authenticated;

insert into public.party_events
  (slug, name, event_date, capacity, free_cover_deadline)
values
  ('halloween-pool-party-2026', 'HALLOWEEN POOL PARTY', '2026-10-31',
   100, '2026-10-31 22:00:00-05');

-- Todas las altas deben pasar por esta RPC desde el servidor Next.js.
-- El bloqueo del evento serializa solicitudes concurrentes y protege el cupo.
create function public.register_party_free_cover(
  p_full_name text,
  p_whatsapp text,
  p_adult_declaration boolean,
  p_privacy_consent boolean,
  p_privacy_policy_version text,
  p_email text default null,
  p_favorite_environment text default null,
  p_marketing_consent boolean default false
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event public.party_events%rowtype;
  v_registration public.party_registrations%rowtype;
  v_phone text := regexp_replace(btrim(p_whatsapp), '[[:space:]()-]', '', 'g');
  v_count bigint;
begin
  if p_full_name is null or char_length(btrim(p_full_name)) not between 3 and 120
    or v_phone is null or v_phone !~ '^\+[1-9][0-9]{7,14}$'
    or p_adult_declaration is distinct from true
    or p_privacy_consent is distinct from true
    or (p_email is not null and char_length(p_email) > 254)
    or (p_favorite_environment is not null and p_favorite_environment not in
      ('techno', 'regueton_old_school', 'dancehall_rancha')) then
    return jsonb_build_object('status', 'invalid');
  end if;

  select * into v_event from public.party_events
    where slug = 'halloween-pool-party-2026' for update;

  if not found then
    return jsonb_build_object('status', 'unavailable');
  end if;
  if not v_event.registration_open or clock_timestamp() >= v_event.free_cover_deadline then
    return jsonb_build_object('status', 'closed');
  end if;
  if p_privacy_policy_version is distinct from v_event.privacy_policy_version then
    return jsonb_build_object('status', 'policy_changed');
  end if;

  if exists (select 1 from public.party_registrations
    where event_slug = v_event.slug and whatsapp = v_phone) then
    -- No devolver código, nombre ni otros datos personales de un registro anterior.
    return jsonb_build_object('status', 'duplicate');
  end if;

  select count(*) into v_count from public.party_registrations
    where event_slug = v_event.slug;
  if v_count >= v_event.capacity then
    return jsonb_build_object('status', 'sold_out');
  end if;

  insert into public.party_registrations
    (event_slug, full_name, whatsapp, email, favorite_environment,
     adult_declaration, privacy_consent, marketing_consent, privacy_policy_version)
  values
    (v_event.slug, btrim(p_full_name), v_phone, nullif(btrim(p_email), ''),
     p_favorite_environment, true, true, coalesce(p_marketing_consent, false),
     v_event.privacy_policy_version)
  returning * into v_registration;

  return jsonb_build_object(
    'status', 'confirmed',
    'registrationId', v_registration.id,
    'confirmationCode', v_registration.confirmation_code,
    'name', v_registration.full_name,
    'freeCoverDeadline', v_event.free_cover_deadline
  );
end;
$$;

revoke all on function public.register_party_free_cover(
  text, text, boolean, boolean, text, text, text, boolean
) from public, anon, authenticated;
grant execute on function public.register_party_free_cover(
  text, text, boolean, boolean, text, text, text, boolean
) to service_role;
grant select, update on public.party_events to service_role;
grant select on public.party_registrations to service_role;
-- No permitir INSERT directo con el rol del backend: usar exclusivamente la RPC.
revoke insert, update, delete, truncate on public.party_registrations from service_role;

commit;

-- INTEGRACIÓN PARA CLAUDE (contrato del backend):
-- POST /api/registrations con JSON:
-- { fullName, whatsapp, email?, favoriteEnvironment?, isAdult,
--   privacyConsent, privacyPolicyVersion, marketingConsent? }
-- Validar en servidor, normalizar teléfono con país y validar correo si existe.
-- Usar supabase.rpc('register_party_free_cover', { p_full_name: ..., ... }).
-- p_privacy_policy_version debe ser la versión que vio y aceptó el visitante.
-- Nunca usar una clave secreta en el navegador o en variables NEXT_PUBLIC_*.
-- Variables servidor: SUPABASE_URL y SUPABASE_SECRET_KEY.
-- Validar origen permitido, tamaño del cuerpo y protección antiabuso antes de la RPC.
-- No guardar datos personales en logs, URLs ni localStorage.
-- HTTP: confirmed=201; duplicate/sold_out/closed/policy_changed=409;
-- invalid=400; unavailable/error de Supabase=503. No exponer errores internos.
-- Duplicado: no mostrar el código anterior sin verificar identidad.
-- Desactivar caché de respuestas del registro (Cache-Control: no-store).
-- Formulario solo confirmado tras obtener status=confirmed del backend real.
-- Copy confirmado: 'Estás en la lista. Guarda esta confirmación y preséntala
-- antes de las 10:00 p. m. del 31 de octubre de 2026.'
-- No prometer QR, recuperación automática ni ingreso después del límite.

-- PRUEBAS ANTES DE ABRIR:
-- En proyecto de prueba: aceptar 100 WhatsApps distintos; rechazar el 101;
-- dos envíos simultáneos para el cupo 100 confirman solo uno;
-- mismo WhatsApp con distintos formatos sigue siendo un único registro;
-- anon/authenticated no pueden leer tablas ni ejecutar la RPC;
-- checkbox obligatorio falso rechaza el registro;
-- versión de política desactualizada pide aceptar la vigente.
-- No llenar la lista real con registros de prueba.

-- ACTIVACIÓN MANUAL (ejecutar aparte, cuando estén web y política listas):
-- update public.party_events set
--   privacy_policy_version = '2026-10-09-v1',
--   registration_open = true
-- where slug = 'halloween-pool-party-2026';

-- CIERRE MANUAL:
-- update public.party_events set registration_open = false
-- where slug = 'halloween-pool-party-2026';

-- EXPORTACIÓN PARA PUERTA: desde SQL Editor, resultados -> exportar CSV.
-- select full_name, whatsapp, confirmation_code, created_at
-- from public.party_registrations
-- where event_slug = 'halloween-pool-party-2026' order by created_at;
-- Mantener el CSV privado. El código requiere comprobación manual por el equipo.
