import Image from 'next/image'

export default function TeamHero() {
  return (
    <section className="bg-warm-cream py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Our Board</p>
          <h1 className="mt-4 font-lora text-4xl font-normal leading-tight text-charcoal lg:text-5xl">
            The people dedicated
            <br />
            to walking with <em className="font-lora italic text-brand-pink">you</em>
          </h1>
          <p className="mt-6 max-w-lg font-dm text-sm font-light leading-relaxed text-charcoal-muted">
            Our licensed practitioners bring expertise, empathy, and deep cultural sensitivity to every interaction. We
            believe in whole-person care — walking alongside you every step of the way.
          </p>
          <div className="mt-8 flex flex-wrap gap-8">
            <div>
              <p className="font-lora text-3xl text-brand-pink">3+</p>
              <p className="mt-1 font-dm text-xs text-charcoal-muted">Licensed Practitioners</p>
            </div>
            <div>
              <p className="font-lora text-3xl text-brand-pink">500+</p>
              <p className="mt-1 font-dm text-xs text-charcoal-muted">Lives Impacted</p>
            </div>
            <div>
              <p className="font-lora text-3xl text-brand-pink">10+</p>
              <p className="mt-1 font-dm text-xs text-charcoal-muted">Years of Practice</p>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-lg items-center justify-center gap-6 sm:gap-8 lg:max-w-none lg:justify-end lg:pr-4">
          <Image
            src="/images/Rev.Angela.jpeg"
            alt="Rev. Angela Carmen Appiah"
            width={192}
            height={256}
            className="h-64 w-48 shrink-0 -translate-y-2 rounded-2xl border-4 border-white object-cover object-top shadow-sm sm:-translate-y-3"
          />
          <Image
            src="/images/selasi.jpeg"
            alt="Selasi Doku"
            width={192}
            height={256}
            className="h-64 w-48 shrink-0 translate-y-5 rounded-2xl border-4 border-white object-cover object-top shadow-sm sm:translate-y-7"
          />
        </div>
      </div>
    </section>
  )
}
