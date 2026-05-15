"use client";

import { useState, useId, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { clsx } from "clsx";

type Status = "idle" | "submitting" | "success" | "error";

type ContactFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Modal de contato B2B — Radix Dialog (focus trap, ESC, scroll lock e ARIA
 * tratados pela primitiva). Submit é mockado por ora; quando houver backend,
 * troque a função `submit` por um POST real (SendGrid, Resend, etc).
 */
export default function ContactFormModal({ open, onOpenChange }: ContactFormModalProps) {
  const t = useTranslations("contactForm");
  const [status, setStatus] = useState<Status>("idle");
  const formId = useId();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      // Mock: simula latência de rede. Trocar por fetch real quando o
      // endpoint estiver disponível.
      await new Promise((r) => setTimeout(r, 900));
      // eslint-disable-next-line no-console
      console.info("[contact] payload", data);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) {
      // Reset depois do close para o próximo open vir limpo
      window.setTimeout(() => setStatus("idle"), 300);
    }
  }

  const subjects = [
    "solutions",
    "services",
    "training",
    "partnership",
    "press",
    "other",
  ] as const;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 z-[80] bg-isq-navy/55 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content
              asChild
              aria-describedby={`${formId}-intro`}
              onOpenAutoFocus={(e) => {
                // Não rouba foco para o primeiro botão; quem seleciona é o user
                e.preventDefault();
                const first = document.getElementById(`${formId}-name`);
                first?.focus();
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={clsx(
                  "fixed left-1/2 top-1/2 z-[90] w-[min(640px,92vw)] -translate-x-1/2 -translate-y-1/2",
                  "max-h-[92vh] overflow-y-auto rounded-[2px] bg-isq-paper shadow-2xl",
                )}
              >
                {/* Header */}
                <div className="relative flex items-start justify-between gap-6 border-b border-isq-navy/10 px-7 pb-6 pt-7 sm:px-10 sm:pt-9">
                  <div>
                    <Dialog.Title className="font-serif text-[clamp(1.5rem,3vw,2rem)] leading-tight tracking-[-0.015em] text-isq-navy">
                      {t("title")}
                    </Dialog.Title>
                    <Dialog.Description
                      id={`${formId}-intro`}
                      className="mt-3 max-w-md text-sm leading-relaxed text-isq-navy/65"
                    >
                      {t("intro")}
                    </Dialog.Description>
                  </div>
                  <Dialog.Close
                    aria-label={t("close")}
                    className="-mr-2 -mt-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-isq-navy/55 transition-colors hover:bg-isq-navy/5 hover:text-isq-navy"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M1 1L13 13M13 1L1 13"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </Dialog.Close>
                </div>

                {/* Body */}
                {status === "success" ? (
                  <div className="flex flex-col items-start gap-5 px-7 py-12 sm:px-10">
                    <span
                      aria-hidden
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-isq-red/10 text-isq-red"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M4 10.5L8.5 15L16 6"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <h3 className="font-serif text-2xl tracking-tight text-isq-navy">
                      {t("successTitle")}
                    </h3>
                    <p className="max-w-md text-sm leading-relaxed text-isq-navy/65">
                      {t("successDescription")}
                    </p>
                    <Dialog.Close className="mt-4 inline-flex items-center gap-3 rounded-full bg-isq-navy px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-isq-off transition-colors hover:bg-isq-red">
                      {t("successCta")}
                    </Dialog.Close>
                  </div>
                ) : (
                  <form onSubmit={submit} className="grid grid-cols-2 gap-5 px-7 pb-9 pt-8 sm:px-10 sm:gap-6">
                    <Field
                      id={`${formId}-name`}
                      name="name"
                      label={t("fields.name")}
                      required
                      requiredLabel={t("required")}
                      autoComplete="name"
                      className="col-span-2 sm:col-span-1"
                    />
                    <Field
                      id={`${formId}-email`}
                      name="email"
                      type="email"
                      label={t("fields.email")}
                      required
                      requiredLabel={t("required")}
                      autoComplete="email"
                      className="col-span-2 sm:col-span-1"
                    />
                    <Field
                      id={`${formId}-company`}
                      name="company"
                      label={t("fields.company")}
                      required
                      requiredLabel={t("required")}
                      autoComplete="organization"
                      className="col-span-2 sm:col-span-1"
                    />
                    <Field
                      id={`${formId}-phone`}
                      name="phone"
                      type="tel"
                      label={t("fields.phone")}
                      autoComplete="tel"
                      className="col-span-2 sm:col-span-1"
                    />

                    <SelectField
                      id={`${formId}-subject`}
                      name="subject"
                      label={t("fields.subject")}
                      required
                      requiredLabel={t("required")}
                      placeholder={t("subjects.placeholder")}
                      options={subjects.map((key) => ({
                        value: key,
                        label: t(`subjects.${key}`),
                      }))}
                      className="col-span-2"
                    />

                    <div className="col-span-2 flex flex-col gap-2">
                      <label
                        htmlFor={`${formId}-message`}
                        className="text-[10px] font-medium uppercase tracking-[0.22em] text-isq-navy/55"
                      >
                        {t("fields.message")}{" "}
                        <span className="text-isq-red">*</span>
                      </label>
                      <textarea
                        id={`${formId}-message`}
                        name="message"
                        required
                        rows={4}
                        className="w-full resize-none rounded-[2px] border border-isq-navy/15 bg-white/40 px-4 py-3 text-sm text-isq-navy placeholder:text-isq-navy/30 focus:border-isq-navy focus:bg-white focus:outline-none"
                      />
                    </div>

                    <label className="col-span-2 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-isq-navy/65">
                      <input
                        type="checkbox"
                        name="consent"
                        required
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-isq-red"
                      />
                      <span>{t("fields.consent")}</span>
                    </label>

                    {status === "error" && (
                      <p
                        role="alert"
                        className="col-span-2 rounded-[2px] border border-isq-red/30 bg-isq-red/5 px-4 py-3 text-sm text-isq-red"
                      >
                        <strong className="font-medium">{t("errorTitle")}</strong>{" "}
                        {t("errorDescription")}
                      </p>
                    )}

                    <div className="col-span-2 mt-2 flex items-center justify-end">
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className={clsx(
                          "group inline-flex items-center gap-3 rounded-full bg-isq-navy px-7 py-3.5",
                          "text-xs font-semibold uppercase tracking-[0.18em] text-isq-off",
                          "transition-[background,transform] duration-500",
                          "hover:-translate-y-0.5 hover:bg-isq-red",
                          "disabled:cursor-progress disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-isq-navy",
                        )}
                      >
                        {status === "submitting" ? t("submitting") : t("submit")}
                        <span
                          aria-hidden
                          className="inline-block transition-transform duration-500 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

type FieldProps = {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  requiredLabel?: string;
  autoComplete?: string;
  className?: string;
};

function Field({
  id,
  name,
  label,
  type = "text",
  required,
  autoComplete,
  className,
}: FieldProps) {
  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <label
        htmlFor={id}
        className="text-[10px] font-medium uppercase tracking-[0.22em] text-isq-navy/55"
      >
        {label} {required && <span className="text-isq-red">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-[2px] border border-isq-navy/15 bg-white/40 px-4 py-3 text-sm text-isq-navy placeholder:text-isq-navy/30 focus:border-isq-navy focus:bg-white focus:outline-none"
      />
    </div>
  );
}

type SelectFieldProps = {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  requiredLabel?: string;
  placeholder: string;
  options: { value: string; label: string }[];
  className?: string;
};

function SelectField({
  id,
  name,
  label,
  required,
  placeholder,
  options,
  className,
}: SelectFieldProps) {
  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <label
        htmlFor={id}
        className="text-[10px] font-medium uppercase tracking-[0.22em] text-isq-navy/55"
      >
        {label} {required && <span className="text-isq-red">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          name={name}
          required={required}
          defaultValue=""
          className="w-full appearance-none rounded-[2px] border border-isq-navy/15 bg-white/40 px-4 py-3 pr-10 text-sm text-isq-navy focus:border-isq-navy focus:bg-white focus:outline-none"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-isq-navy/45"
        >
          ▾
        </span>
      </div>
    </div>
  );
}
