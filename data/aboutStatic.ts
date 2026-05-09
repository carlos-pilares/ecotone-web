import { DEFAULT_WHATSAPP_URL } from '@/data/cmsApproved/siteSettingsApprovedContent'

export const aboutPartnersCopy = {
  eyebrow: '' as string,
  title: 'Certified by & affiliated with',
  body: null as string | null,
  emptyMessage: null as string | null,
}

/** Default SEO when `aboutPage.seo` is empty or fetch fails. */
export const aboutSeoFallback = {
  title: 'About — Ecotone · Cusco, Perú',
  description:
    'Regenerative travel in the Manu Biosphere Reserve and Camanti — who we are, why we exist, and how we design immersive nature journeys from Cusco.',
  noIndex: false as boolean,
  ogImageUrl: null as string | null,
}

export const aboutStatic = {
  hero: {
    eyebrow: 'Manu & Camanti · Cusco, Perú',
    titleLines: ['Travel deeper into nature,', 'and closer to what protects it.'],
    tagline:
      "Ecotone creates immersive journeys across Peru's Andes–Amazon landscapes, connecting travellers with remarkable places, field knowledge, and conservation stories that are alive on the ground.",
    primaryLabel: 'Explore experiences',
    primaryHref: '/experiences',
    secondaryLabel: 'Our story ↓',
    secondaryHref: '#who',
    imageUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1600&q=85',
    imageAlt: 'Ecotone — Andes to Amazon, Perú',
  },
  who: {
    sectionId: 'who',
    eyebrow: 'Who we are',
    headline: "A regenerative travel company in Peru's most biodiverse landscapes.",
    paragraphs: [
      "Ecotone is a regenerative travel company creating nature-based journeys in some of Peru's most biodiverse landscapes. We work with lodges, biological stations, guides, scientists, and local teams to design experiences that go beyond sightseeing.",
      'Our journeys are built for travellers who want to understand the places they visit — not just pass through them.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&q=85',
    imageAlt: 'Soqtapata Reserve — cloud forest',
    pills: ['Camanti Route', 'Manu Road', 'Manu Core', '3 routes · 4 lodges'],
  },
  why: {
    sectionId: 'why',
    eyebrow: 'Why we exist',
    headlineLines: ['Because nature needs more than visitors.', 'It needs allies.'],
    body:
      'We believe travel can help protect the places it depends on — but only when it is designed with care. Ecotone was created to connect meaningful travel with conservation, science, learning, and long-term value for the landscapes and people behind each journey.',
  },
  difference: {
    sectionId: 'different',
    eyebrow: 'What makes us different',
    headline: 'Four things that shape every journey we create.',
    cards: [
      {
        key: 'immersive',
        title: 'Immersive by design',
        description:
          'Our journeys follow real ecological transitions — from cloud forest to rainforest, from high Andes to Amazon lowlands. Every detail of the route is intentional.',
      },
      {
        key: 'guides',
        title: 'Guided by field knowledge',
        description:
          'Travellers are accompanied by people who know the landscape deeply: naturalist guides, field teams, hosts, and conservation practitioners who live here year-round.',
      },
      {
        key: 'conservation',
        title: 'Connected to conservation',
        description:
          'Each experience is designed to support a wider conservation ecosystem — not only a travel itinerary. Every booking directly funds the work of HERPIRO in the field.',
      },
      {
        key: 'meaningful',
        title: 'Built for meaningful travellers',
        description:
          'We work with families, universities, companies, specialist groups, and independent travellers looking for more than a standard tour. No two programs are identical.',
      },
    ],
  },
  way: {
    sectionId: 'way',
    eyebrow: 'Our way of travelling',
    headline: 'We believe the best journeys are slower, deeper, and more connected.',
    paragraphs: [
      'We design journeys that give travellers time to observe, listen, ask questions, and understand the living systems around them. Sometimes that means walking quietly through the forest. Sometimes it means hearing from a biologist, sharing a meal with the field team, or noticing how the landscape changes hour by hour.',
      'Ecotone is not about rushing through destinations. It is about learning how to belong, even briefly, to a place.',
    ],
    pullquote: 'Learning how to belong, even briefly, to a place.',
    imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=85',
    imageAlt: 'Cloud forest — Soqtapata Reserve',
  },
  people: {
    sectionId: 'people',
    eyebrow: 'The people behind the journey',
    headline: 'Real people, real field experience.',
    intro:
      "The people you'll meet aren't tour operators. They are field researchers, naturalist guides, and conservationists who live and work in these landscapes year-round.",
    members: [
      {
        key: 'carlos',
        name: 'Carlos Pilares',
        role: 'Founder & Director',
        bio: 'Designs the vision and the journeys that connect travellers to the landscapes he has spent two decades working to protect.',
        imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
        imageAlt: 'Carlos — Founder',
      },
      {
        key: 'lucia',
        name: 'Lucía Ríos',
        role: 'Lead Naturalist',
        bio: "Guides travellers through the cloud forest. Twelve years studying Soqtapata's bird communities and herpetofauna alongside CIDS researchers.",
        imageUrl: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&q=80',
        imageAlt: 'Lead Naturalist',
      },
      {
        key: 'marco',
        name: 'Marco Huanca',
        role: 'Field Researcher · CIDS',
        bio: "Runs the CIDS biological station and welcomes researchers and travellers who want to understand the science behind the landscape they're walking through.",
        imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&q=80',
        imageAlt: 'Field Researcher CIDS',
      },
      {
        key: 'rosa',
        name: 'Rosa Quispe',
        role: 'Lodge Host · Soqtapata',
        bio: 'Makes every stay feel like home. Manages the day-to-day of Soqtapata Lodge and makes sure travellers feel welcomed, fed, and looked after.',
        imageUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&q=80',
        imageAlt: 'Lodge Host Operations',
      },
    ],
  },
  proof: {
    sectionId: 'proof',
    eyebrow: 'A growing platform for regenerative travel',
    headline: 'The work behind every journey.',
    intro:
      'These are not marketing numbers. They are the result of years of field work, conservation partnerships, and a commitment to doing this properly.',
    stats: [
      {
        number: '10,000',
        label: 'Hectares',
        description:
          'Of primary cloud forest in the Soqtapata Reserve — managed by HERPIRO for conservation.',
      },
      {
        number: '1,200+',
        label: 'Species observed',
        description:
          'Across the three routes — birds, mammals, reptiles, amphibians, and insects documented by CIDS.',
      },
      {
        number: '5.0',
        label: 'Guest rating',
        description:
          'Every verified review on Trustpilot. Not a single journey has ended without a five-star experience.',
      },
      {
        number: '100%',
        label: 'Conservation-led',
        description: 'Every booking supports active conservation — no intermediaries, no greenwashing.',
      },
    ],
    certLabel: 'Recognised by',
    certs: [
      'B Corp · HERPIRO',
      'ATTA Member',
      'GSTC',
      'Manu UNESCO Biosphere',
      'SERNANP · National Parks',
    ],
  },
  finalCta: {
    sectionId: 'contact',
    eyebrow: 'Come experience the forest from the inside',
    headline: 'Whether you travel as a family, university, company, or nature lover.',
    body: 'Ecotone helps you go deeper into the landscapes that make Peru extraordinary. Every journey is all-inclusive from Cusco.',
    ctas: [
      { label: 'Explore experiences', href: '/experiences', variant: 'primary' as const, external: false },
      { label: 'Plan your journey', href: '/experiences', variant: 'secondary' as const, external: false },
      {
        label: 'Talk to us on WhatsApp',
        href: DEFAULT_WHATSAPP_URL,
        variant: 'ghost' as const,
        external: true,
      },
    ],
    trust: [
      { key: 't1', text: 'All inclusive from Cusco', icon: 'check' as const },
      { key: 't2', text: 'Free cancellation · 15 days', icon: 'shield' as const },
      { key: 't3', text: 'B Corp certified', icon: 'heart' as const },
    ],
  },
} as const
