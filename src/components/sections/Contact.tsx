"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "motion/react";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import ContactFormModal from "@/components/contact/ContactFormModal";
import { photoCredits } from "@/data/photoCredits";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
};

const lineMaskVariants: Variants = { hidden: {}, visible: {} };

const lineInnerVariants: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

function Line({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.span
      variants={lineMaskVariants}
      className="relative block overflow-hidden pb-[0.08em] leading-[0.98]"
    >
      <motion.span
        variants={lineInnerVariants}
        className={`inline-block will-change-transform ${className ?? ""}`}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

/**
 * CTA final (Fase 1.5) — última batida da home antes do footer.
 * Big headline com reveal por linha + 3 vias de contato (CTA principal,
 * telefone, e-mail).
 */
export default function Contact() {
  const t = useTranslations("contact");
  const tFooter = useTranslations("footer");
  const [open, setOpen] = useState(false);

  return (
    <section
      id="contato"
      aria-label="Contato"
      className="relative isolate overflow-hidden bg-isq-off pt-[clamp(4.5rem,9vw,7.5rem)] pb-[clamp(4.5rem,9vw,7.5rem)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto block h-px w-full max-w-[110rem] bg-isq-navy/10"
      />

      <Container className="relative">
        <div className="grid grid-cols-12 gap-x-8 gap-y-12">
          <div className="col-span-12 lg:col-span-2">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="block text-[10px] font-medium uppercase tracking-[0.32em] text-isq-red"
            >
              {t("section")}
            </motion.span>
          </div>

          <div className="col-span-12 lg:col-span-6 lg:pl-4">
            <div className="mb-3 hidden items-baseline gap-2 lg:flex">
              <span aria-hidden className="h-px w-10 bg-isq-navy/20" />
              <span className="text-[10px] uppercase tracking-[0.28em] text-isq-navy/45">
                {t("meta")}
              </span>
            </div>

            {/* Headline em 2 linhas */}
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
              className="font-serif tracking-[-0.02em] text-[clamp(2.25rem,6.2vw,6.25rem)] leading-[1.01] text-isq-navy"
            >
              <Line className="font-sans font-extralight text-isq-navy/45">
                {t("lead")}{" "}
                <em className="font-serif italic font-normal text-isq-navy">
                  {t("leadEmph")}
                </em>
              </Line>
              <Line className="font-sans font-extralight text-isq-navy/55">
                {t("leadEnd")}
              </Line>
            </motion.h2>

            {/* CTAs */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeVariants}
              className="mt-10 flex flex-col items-start gap-6 lg:mt-14"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group inline-flex items-center gap-4 rounded-full bg-isq-navy px-8 py-5 text-sm font-semibold uppercase tracking-[0.18em] text-isq-off transition-[transform,background] duration-500 hover:-translate-y-0.5 hover:bg-isq-red"
              >
                {t("cta")}
                <span
                  aria-hidden
                  className="inline-block text-base transition-transform duration-500 group-hover:translate-x-1"
                >
                  →
                </span>
              </button>

              <span className="text-[11px] uppercase tracking-[0.28em] text-isq-navy/45">
                {t("or")}
              </span>

              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-12">
                <li className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-isq-navy/45">
                    {t("phoneLabel")}
                  </span>
                  <a
                    href={`tel:${tFooter("phone").replace(/\D/g, "")}`}
                    className="font-serif text-lg text-isq-navy transition-colors hover:text-isq-red sm:text-xl"
                  >
                    {tFooter("phone")}
                  </a>
                </li>
                <li className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-isq-navy/45">
                    {t("emailLabel")}
                  </span>
                  <a
                    href={`mailto:${tFooter("email")}`}
                    className="break-all font-serif text-lg text-isq-navy transition-colors hover:text-isq-red sm:text-xl"
                  >
                    {tFooter("email")}
                  </a>
                </li>
                <li className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-isq-navy/45">
                    {t("workWithUsLabel")}
                  </span>
                  <a
                    href="#trabalhe-conosco"
                    className="font-serif text-lg text-isq-navy transition-colors hover:text-isq-red sm:text-xl"
                  >
                    →
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Coluna lateral — atmosfera */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 hidden lg:col-span-4 lg:block"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-isq-navy/5">
              <Image
                src={photoCredits.contactSide.src}
                alt={photoCredits.contactSide.alt}
                fill
                sizes="(max-width: 1024px) 0px, 30vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </Container>

      <ContactFormModal open={open} onOpenChange={setOpen} />
    </section>
  );
}
