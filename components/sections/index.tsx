/* eslint-disable @next/next/no-img-element -- gambar bisa berasal dari URL apa pun milik klien */
import type { PropValue, Section } from "@/lib/types";
import { CanvasView, safeHref } from "./canvas";
import { Ceremony, Couple, Dresscode, EventSection, Story } from "./invitation";
import { Countdown, Cover, Gift, Music, RsvpSection } from "./invitation-client";
import { Budget, Points, Pricing, Team, Timeline } from "./proposal";
import { Approval } from "./proposal-client";

// Komponen section siap pakai. Semuanya murni (tanpa state) sehingga bisa
// dirender di server (halaman publik) maupun di browser (editor).
// Tata letak memakai container query (@3xl, @5xl) agar pratinjau desktop,
// tablet, dan HP di editor berubah sesuai lebar bingkainya.

type P = Record<string, PropValue>;

const s = (v: PropValue | undefined): string => (typeof v === "string" ? v : v == null ? "" : String(v));
const list = (v: PropValue | undefined): Record<string, string>[] => (Array.isArray(v) ? (v as Record<string, string>[]) : []);

function Heading({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  if (!children) return null;
  return <h2 className={`pf-h text-3xl @3xl:text-4xl font-bold leading-tight ${className}`}>{children}</h2>;
}

function Wrap({ children, id, className = "" }: { children: React.ReactNode; id?: string; className?: string }) {
  return (
    <section id={id} className={`px-6 py-16 @3xl:px-12 @3xl:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

function Hero({ p }: { p: P }) {
  const align = s(p.align) || "left";
  const button = s(p.buttonText) ? (
    <a href={safeHref(s(p.buttonLink))} className="pf-btn mt-8 inline-block px-6 py-3 font-semibold">
      {s(p.buttonText)}
    </a>
  ) : null;

  if (align === "cover") {
    return (
      <section className="relative isolate flex min-h-[560px] items-end overflow-hidden px-6 py-16 @3xl:px-12">
        {s(p.image) && <img src={s(p.image)} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <div className="mx-auto w-full max-w-6xl text-white">
          {s(p.eyebrow) && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] opacity-80">{s(p.eyebrow)}</p>}
          <h1 className="pf-h text-4xl font-bold leading-[1.05] @3xl:text-6xl @5xl:text-7xl">{s(p.title)}</h1>
          {s(p.subtitle) && <p className="mt-4 text-xl @3xl:text-2xl opacity-90">{s(p.subtitle)}</p>}
          {s(p.description) && <p className="mt-4 max-w-xl opacity-80">{s(p.description)}</p>}
          {button}
        </div>
      </section>
    );
  }

  if (align === "center") {
    return (
      <Wrap className="text-center">
        {s(p.image) && <img src={s(p.image)} alt="" className="pf-img mx-auto mb-10 h-40 w-40 object-cover !rounded-full" />}
        {s(p.eyebrow) && <p className="pf-accent mb-3 text-sm font-semibold uppercase tracking-[0.2em]">{s(p.eyebrow)}</p>}
        <h1 className="pf-h mx-auto max-w-4xl text-4xl font-bold leading-[1.05] @3xl:text-6xl @5xl:text-7xl">{s(p.title)}</h1>
        {s(p.subtitle) && <p className="pf-muted mt-5 text-xl @3xl:text-2xl">{s(p.subtitle)}</p>}
        {s(p.description) && <p className="pf-muted mx-auto mt-4 max-w-2xl">{s(p.description)}</p>}
        {button}
      </Wrap>
    );
  }

  return (
    <Wrap>
      <div className="grid items-center gap-10 @3xl:grid-cols-2 @3xl:gap-16">
        <div>
          {s(p.eyebrow) && <p className="pf-accent mb-3 text-sm font-semibold uppercase tracking-[0.2em]">{s(p.eyebrow)}</p>}
          <h1 className="pf-h text-4xl font-bold leading-[1.05] @3xl:text-5xl @5xl:text-6xl">{s(p.title)}</h1>
          {s(p.subtitle) && <p className="pf-muted mt-5 text-xl @3xl:text-2xl">{s(p.subtitle)}</p>}
          {s(p.description) && <p className="pf-muted mt-4 max-w-lg">{s(p.description)}</p>}
          {button}
        </div>
        {s(p.image) && <img src={s(p.image)} alt="" className="pf-img aspect-[4/5] w-full object-cover" />}
      </div>
    </Wrap>
  );
}

function About({ p }: { p: P }) {
  return (
    <Wrap id="tentang">
      <div className={`grid items-center gap-10 ${s(p.image) ? "@3xl:grid-cols-[2fr_3fr] @3xl:gap-16" : ""}`}>
        {s(p.image) && <img src={s(p.image)} alt="" className="pf-img aspect-square w-full object-cover" />}
        <div>
          <Heading>{s(p.heading)}</Heading>
          <p className="pf-muted mt-6 whitespace-pre-line text-lg leading-relaxed">{s(p.body)}</p>
        </div>
      </div>
    </Wrap>
  );
}

function Gallery({ p }: { p: P }) {
  const cols = Math.min(4, Math.max(2, Number(p.columns) || 3));
  const colClass = { 2: "@3xl:grid-cols-2", 3: "@3xl:grid-cols-3", 4: "@3xl:grid-cols-4" }[cols];
  return (
    <Wrap id="galeri">
      <Heading className="mb-10">{s(p.heading)}</Heading>
      <div className={`grid grid-cols-2 gap-4 ${colClass}`}>
        {list(p.items).map((it, i) => (
          <figure key={i}>
            {it.image && <img src={it.image} alt={it.caption ?? ""} className="pf-img aspect-square w-full object-cover" />}
            {it.caption && <figcaption className="pf-muted mt-2 text-sm">{it.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </Wrap>
  );
}

function Projects({ p }: { p: P }) {
  return (
    <Wrap id="karya">
      <Heading className="mb-10">{s(p.heading)}</Heading>
      <div className="grid gap-6 @3xl:grid-cols-2 @5xl:grid-cols-3">
        {list(p.items).map((it, i) => (
          <article key={i} className="pf-card overflow-hidden">
            {it.image && <img src={it.image} alt="" className="aspect-[4/3] w-full object-cover" />}
            <div className="p-5">
              <h3 className="pf-h text-xl font-bold">{it.title}</h3>
              {it.description && <p className="pf-muted mt-2 text-sm leading-relaxed">{it.description}</p>}
              {it.link && (
                <a href={safeHref(it.link)} target="_blank" rel="noopener noreferrer" className="pf-accent mt-3 inline-block text-sm font-semibold">
                  Lihat proyek →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </Wrap>
  );
}

function Experience({ p }: { p: P }) {
  return (
    <Wrap id="pengalaman">
      <Heading className="mb-10">{s(p.heading)}</Heading>
      <ol className="space-y-8">
        {list(p.items).map((it, i) => (
          <li key={i} className="grid gap-1 border-t border-[color-mix(in_srgb,var(--c-text)_15%,transparent)] pt-6 @3xl:grid-cols-[200px_1fr] @3xl:gap-8">
            <p className="pf-accent text-sm font-semibold">{it.period}</p>
            <div>
              <h3 className="pf-h text-xl font-bold">{it.role}</h3>
              {it.place && <p className="pf-muted">{it.place}</p>}
              {it.description && <p className="pf-muted mt-2 leading-relaxed">{it.description}</p>}
            </div>
          </li>
        ))}
      </ol>
    </Wrap>
  );
}

function Skills({ p }: { p: P }) {
  return (
    <Wrap id="keahlian">
      <Heading className="mb-10">{s(p.heading)}</Heading>
      <div className="grid gap-4 @md:grid-cols-2 @5xl:grid-cols-4">
        {list(p.items).map((it, i) => (
          <div key={i} className="pf-card p-5">
            <p className="pf-h text-lg font-bold">{it.name}</p>
            {it.detail && <p className="pf-muted mt-1 text-sm">{it.detail}</p>}
          </div>
        ))}
      </div>
    </Wrap>
  );
}

function Testimonial({ p }: { p: P }) {
  return (
    <Wrap>
      <figure className="mx-auto max-w-3xl text-center">
        <span className="pf-accent pf-h block text-7xl leading-none" aria-hidden>
          “
        </span>
        <blockquote className="pf-h text-2xl font-medium leading-snug @3xl:text-3xl">{s(p.quote)}</blockquote>
        <figcaption className="mt-6">
          <span className="font-semibold">{s(p.author)}</span>
          {s(p.role) && <span className="pf-muted"> · {s(p.role)}</span>}
        </figcaption>
      </figure>
    </Wrap>
  );
}

function Contact({ p }: { p: P }) {
  const email = s(p.email);
  const phone = s(p.phone);
  const wa = phone.replace(/[^\d]/g, "").replace(/^0/, "62");
  return (
    <Wrap id="kontak" className="pf-surface">
      <div className="max-w-2xl">
        <Heading>{s(p.heading)}</Heading>
        {s(p.text) && <p className="pf-muted mt-4 text-lg">{s(p.text)}</p>}
        <div className="mt-8 flex flex-wrap gap-3">
          {email && (
            <a href={`mailto:${email}`} className="pf-btn px-6 py-3 font-semibold">
              {email}
            </a>
          )}
          {phone && (
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="pf-btn-outline px-6 py-3 font-semibold">
              {phone}
            </a>
          )}
        </div>
        {list(p.links).length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {list(p.links).map((l, i) => (
              <li key={i}>
                <a href={safeHref(l.url)} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">
                  {l.label || l.url}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Wrap>
  );
}

const COMPONENTS = {
  hero: Hero,
  about: About,
  gallery: Gallery,
  projects: Projects,
  experience: Experience,
  skills: Skills,
  testimonial: Testimonial,
  contact: Contact,
  canvas: CanvasView,
  cover: Cover,
  couple: Couple,
  event: EventSection,
  countdown: Countdown,
  story: Story,
  rsvp: RsvpSection,
  gift: Gift,
  music: Music,
  ceremony: Ceremony,
  dresscode: Dresscode,
  points: Points,
  timeline: Timeline,
  budget: Budget,
  pricing: Pricing,
  team: Team,
  approval: Approval,
} as const;

export function SectionView({ section }: { section: Section }) {
  const C = COMPONENTS[section.type];
  if (!C) return null;
  return <C p={section.props} />;
}
