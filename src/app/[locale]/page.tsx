import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Pillars from "@/components/sections/Pillars";
import Fronts from "@/components/sections/Fronts";
import Stats from "@/components/sections/Stats";
import Clients from "@/components/sections/Clients";
import Contact from "@/components/sections/Contact";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Manifesto />
      <Pillars />
      <Fronts />
      <Stats />
      <Clients />
      <Contact />
    </>
  );
}
