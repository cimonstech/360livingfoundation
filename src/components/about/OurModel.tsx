import Image from 'next/image'
import { about } from '@/data/content'

export default function OurModel() {
  const { eyebrow, title, paragraphs } = about.model
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-charcoal-light ring-1 ring-charcoal/10">
              <Image
                src="/images/rise.jpg"
                alt="RNCC model — Resilient Narrative-Centered Counselling"
                fill
                className="object-contain object-center"
                sizes="(max-width: 1024px) 100vw, 32rem"
              />
            </div>
            <div className="absolute bottom-4 right-4 z-10 max-w-[200px] rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="font-dm text-xs text-charcoal-muted">Our Approach</p>
              <p className="mt-1 font-lora text-lg font-medium text-charcoal">RNCC Model</p>
              <p className="mt-1 font-dm text-xs leading-relaxed text-charcoal-muted">
                Resilient Narrative-Centered Counselling
              </p>
            </div>
          </div>

          <div>
            <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-green">{eyebrow}</p>
            <h2 className="mt-3 font-lora text-3xl font-normal leading-snug text-charcoal lg:text-4xl">{title}</h2>
            {paragraphs.map((p) => (
              <p key={p} className="mt-4 font-dm text-sm font-light leading-relaxed text-charcoal-muted">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
