"use client";

import { useState, useSyncExternalStore } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { DEFAULT_DIAL_CODE, DIAL_CODES } from "@/config/countries";
import { event } from "@/config/event";
import { buildRegistrationInput, submitRegistration } from "@/lib/registration";
import { registrationFormSchema, type RegistrationFormValues } from "@/lib/validations";
import type { ListStatus, RegistrationResponse } from "@/types/registration";
import { RegistrationStatus, type StatusKind } from "./RegistrationStatus";
import { RegistrationSuccess } from "./RegistrationSuccess";

const inputBase =
  "w-full min-h-12 border bg-ink px-4 text-base text-white placeholder:text-white/35 transition-colors focus:border-blood focus:outline-none disabled:opacity-50";

function Field({
  id,
  label,
  optional,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-2 flex justify-between text-white/80">
        <span>{label}</span>
        {optional && <span className="text-mute normal-case tracking-normal">Opcional</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-mute">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-blood">
          {error}
        </p>
      )}
    </div>
  );
}

function Checkbox({
  id,
  error,
  children,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-white/80">
        <input
          id={id}
          type="checkbox"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-5 shrink-0 cursor-pointer appearance-none border border-white/40 bg-ink checked:border-blood checked:bg-blood checked:[background-image:url('data:image/svg+xml;utf8,<svg_xmlns=%22http://www.w3.org/2000/svg%22_viewBox=%220_0_20_20%22><path_d=%22M4_10l4_4_8-8%22_fill=%22none%22_stroke=%22white%22_stroke-width=%222.5%22/></svg>')] disabled:opacity-50"
          {...rest}
        />
        <span>{children}</span>
      </label>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 pl-8 text-sm text-blood">
          {error}
        </p>
      )}
    </div>
  );
}

const closedKinds: Partial<Record<ListStatus, StatusKind>> = {
  upcoming: "upcoming",
  closed: "closed",
};

const responseKinds: Record<Exclude<RegistrationResponse["status"], "confirmed">, StatusKind> = {
  duplicate: "duplicate",
  sold_out: "soldout",
  closed: "closed",
  policy_changed: "policy_changed",
  invalid: "error",
  unavailable: "unavailable",
};

export function RegistrationForm({
  listStatus,
  privacyPolicyVersion,
}: {
  listStatus: ListStatus;
  privacyPolicyVersion?: string;
}) {
  const [response, setResponse] = useState<RegistrationResponse | null>(null);
  // false en el servidor y antes de hidratar: evita envíos nativos del navegador
  // que pondrían datos personales en la URL.
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting, isValidating },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      whatsappPrefix: DEFAULT_DIAL_CODE,
      whatsappNumber: "",
      email: "",
      favoriteEnvironment: "",
      isAdult: false,
      privacyConsent: false,
      marketingConsent: false,
      website: "",
    },
  });

  const favorite = useWatch({ control, name: "favoriteEnvironment" });
  const isOpen = listStatus === "open" && !!privacyPolicyVersion;
  const lockedKind = closedKinds[listStatus];
  // Si el backend dice agotado/cerrado, el formulario se bloquea aunque la config diga "open".
  const serverLocked = response?.status === "sold_out" || response?.status === "closed";
  const disabled = !hydrated || !isOpen || serverLocked || isSubmitting;

  const onSubmit = async (values: RegistrationFormValues) => {
    setResponse(null);
    if (!privacyPolicyVersion) return;
    const result = await submitRegistration(buildRegistrationInput(values, privacyPolicyVersion));
    setResponse(result);
  };

  if (response?.status === "confirmed") {
    return (
      <RegistrationSuccess
        name={response.name}
        confirmationCode={response.confirmationCode}
      />
    );
  }

  const statusKind: StatusKind | null =
    response ? responseKinds[response.status] : (lockedKind ?? null);
  const statusMessage =
    response && "message" in response ? response.message : undefined;

  const buttonLabel = isSubmitting
    ? "Enviando…"
    : isValidating
      ? "Validando datos…"
      : isOpen
        ? "Quiero estar en la lista"
        : listStatus === "upcoming"
          ? "Registro aún no disponible"
          : "Lista no disponible";

  return (
    <form
      method="post"
      action="#registro"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-busy={isSubmitting}
      className="space-y-6 border border-line bg-surface p-5 sm:p-9"
    >
      {statusKind && <RegistrationStatus kind={statusKind} message={statusMessage} />}

      <fieldset disabled={!isOpen || serverLocked} className="space-y-6">
        <legend className="sr-only">Registro Free Cover</legend>

        <Field id="fullName" label="Nombre completo" error={errors.fullName?.message}>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Nombre y apellido"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className={`${inputBase} ${errors.fullName ? "border-blood" : "border-white/15"}`}
            {...register("fullName")}
          />
        </Field>

        <Field
          id="whatsappNumber"
          label="WhatsApp"
          error={errors.whatsappNumber?.message ?? errors.whatsappPrefix?.message}
          hint="Incluye el prefijo internacional de tu país."
        >
          <div className="flex gap-2">
            <select
              aria-label="Prefijo internacional"
              autoComplete="tel-country-code"
              className={`${inputBase} !w-[10.5rem] shrink-0 border-white/15 pr-2 sm:!w-44`}
              {...register("whatsappPrefix")}
            >
              {DIAL_CODES.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.label}
                </option>
              ))}
            </select>
            <input
              id="whatsappNumber"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="300 123 4567"
              aria-invalid={!!errors.whatsappNumber}
              aria-describedby={errors.whatsappNumber ? "whatsappNumber-error" : undefined}
              className={`${inputBase} min-w-0 flex-1 ${errors.whatsappNumber ? "border-blood" : "border-white/15"}`}
              {...register("whatsappNumber")}
            />
          </div>
        </Field>

        <Field id="email" label="Correo electrónico" optional error={errors.email?.message}>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="tucorreo@ejemplo.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`${inputBase} ${errors.email ? "border-blood" : "border-white/15"}`}
            {...register("email")}
          />
        </Field>

        <div role="radiogroup" aria-labelledby="env-label">
          <p id="env-label" className="eyebrow mb-2 flex justify-between text-white/80">
            <span>Ambiente favorito</span>
            <span className="text-mute normal-case tracking-normal">Opcional</span>
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {event.environments.map((env) => (
              <label
                key={env.id}
                className={`flex min-h-12 cursor-pointer items-center border px-4 text-sm font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blood ${
                  favorite === env.id
                    ? "border-blood bg-blood/15 text-white"
                    : "border-white/15 text-white/75 hover:border-white/40"
                }`}
              >
                <input
                  type="radio"
                  value={env.id}
                  className="sr-only"
                  {...register("favoriteEnvironment")}
                  // Volver a pulsar la opción activa la deselecciona.
                  onClick={() => favorite === env.id && setValue("favoriteEnvironment", "")}
                />
                {env.name}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4 border-t border-line pt-6">
          <Checkbox id="isAdult" error={errors.isAdult?.message} {...register("isAdult")}>
            Confirmo que soy mayor de 18 años.
          </Checkbox>
          <Checkbox
            id="privacyConsent"
            error={errors.privacyConsent?.message}
            {...register("privacyConsent")}
          >
            Autorizo el tratamiento de mis datos personales para gestionar mi inscripción en la lista.
            {privacyPolicyVersion && (
              <span className="text-mute"> Política versión {privacyPolicyVersion}.</span>
            )}
          </Checkbox>
          <Checkbox id="marketingConsent" {...register("marketingConsent")}>
            Autorizo recibir publicidad y comunicaciones comerciales sobre futuros eventos.{" "}
            <span className="text-mute">(Opcional)</span>
          </Checkbox>
        </div>

        {/* Honeypot: invisible para personas, tentador para bots */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website">No completar este campo</label>
          <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={disabled}
        className="group flex min-h-16 w-full items-center justify-center gap-3 bg-blood px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-white hover:text-ink active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40 sm:text-base"
      >
        {(isSubmitting || isValidating) && <Loader2 aria-hidden className="size-5 animate-spin" />}
        {buttonLabel}
        {isOpen && !isSubmitting && !isValidating && (
          <span aria-hidden className="transition-transform group-hover:translate-x-1.5">
            →
          </span>
        )}
      </button>

      <p className="text-xs leading-relaxed text-mute">
        Registro sujeto a disponibilidad y a las condiciones de ingreso que se publicarán. Tus
        datos no se guardan en este dispositivo.
      </p>
    </form>
  );
}
