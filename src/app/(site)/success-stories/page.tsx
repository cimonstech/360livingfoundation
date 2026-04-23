import type { Metadata } from 'next'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { canonicalPath, rootOpenGraphDefaults, rootTwitterDefaults } from '@/lib/seo'
import { successStoriesPage } from '@/data/content'

export const metadata: Metadata = {
  title: 'Success Stories | 360 Living Foundation',
  description: 'Stories from programme participants — shared with consent.',
  alternates: canonicalPath('/success-stories'),
  openGraph: {
    ...rootOpenGraphDefaults,
    title: 'Success Stories | 360 Living Foundation',
    description: 'Participant stories — more coming soon.',
    url: '/success-stories',
  },
  twitter: {
    ...rootTwitterDefaults,
    title: 'Success Stories | 360 Living Foundation',
    description: 'Participant stories — more coming soon.',
  },
}

export default function SuccessStoriesPage() {
  const p = successStoriesPage.placeholder
  return (
    <main className="bg-white">
      <Navbar />
      <section className="relative overflow-hidden bg-charcoal py-24 lg:py-28">
        <div className="absolute inset-0">
          <Image
            src={successStoriesPage.heroImageSrc}
            alt={successStoriesPage.heroImageAlt}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/45" aria-hidden />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-10">
          <h1 className="font-lora text-4xl font-normal leading-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.5)] lg:text-5xl">
            {successStoriesPage.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-dm text-base font-normal leading-relaxed text-white/95 [text-shadow:0_1px_16px_rgba(0,0,0,0.55)]">
            {successStoriesPage.intro}
          </p>
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-6 lg:px-10">
          <blockquote className="rounded-2xl border border-gray-100 bg-warm-white p-8">
            <p className="font-lora text-lg italic leading-relaxed text-charcoal">&ldquo;{p.quote}&rdquo;</p>
            <footer className="mt-4 font-dm text-sm text-charcoal-muted">— {p.attribution}</footer>
          </blockquote>
        </div>
      </section>
      <Footer />
    </main>
  )
}
