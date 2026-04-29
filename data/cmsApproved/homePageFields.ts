/**
 * Approved home copy — matches the current live homepage text block
 * (same strings as the previous `seedHomePage.ts` inline object).
 * Images are added at seed time (`buildHomePageDocument`).
 */
const key = (id: string) => ({ _key: id })

export const homePageTextFields = {
  seo: {
    _type: 'seo' as const,
    title: 'Ecotone — The forest is waiting for you',
    description:
      'Immersive all-inclusive nature experiences from Cusco. Manu, Camanti, and the cloud forest — small groups, expert guides, direct conservation impact.',
  },
  heroEyebrow: 'Manu Biosphere Reserve & Camanti · Cusco, Perú',
  heroHeadline: 'The forest',
  heroHeadlineLight: 'is waiting for you.',
  heroSubheadline:
    'Immersive all-inclusive experiences in the most biodiverse ecosystems on Earth. All-inclusive from Cusco.',
  heroPills: ['3 Routes', '~10 Experiences', 'Max 8 per group', 'All inclusive'],
  heroCta1Text: 'Explore experiences',
  heroCta1Link: '#experiences',
  heroCta2Text: 'Our routes ↓',
  heroCta2Link: '#routes',
  heroCardPrice: 'from $380',
  heroCardPriceSuffix: '/person',
  heroCardSubprice: 'All inclusive · departure from Cusco',
  heroCardRows: [
    { ...key('h0'), _type: 'heroCardRow' as const, label: 'Routes', value: '3 territories' },
    { ...key('h1'), _type: 'heroCardRow' as const, label: 'Experiences', value: '~10 programs' },
    { ...key('h2'), _type: 'heroCardRow' as const, label: 'Group', value: 'Up to 8 people' },
    { ...key('h3'), _type: 'heroCardRow' as const, label: 'Duration', value: '3 days – 6 weeks' },
  ],
  heroCardCtaText: 'Check availability →',
  heroCardCtaLink: '#book',

  stats: [
    { ...key('s0'), _type: 'homeStat' as const, number: '3', label: 'Routes' },
    { ...key('s1'), _type: 'homeStat' as const, number: '~10', label: 'Experiences' },
    { ...key('s2'), _type: 'homeStat' as const, number: '1,200+', label: 'Species observed' },
    { ...key('s3'), _type: 'homeStat' as const, number: '5.0 ★', label: 'Guest rating' },
  ],

  manifestoEyebrow: 'Our purpose',
  manifestoHeadline: 'Not a tour. An immersion.',
  manifestoBody1:
    'We design all-inclusive journeys where technology deepens your connection with nature — not replaces it. Every trail, every sound, every species encountered becomes part of a story you carry home.',
  manifestoBody2:
    'Three routes through the Manu Biosphere Reserve and Camanti cloud forest. Four ways to travel with purpose. One commitment: protect what matters.',
  manifestoImageCaption: 'Soqtapata · 3,200 m.a.s.l. · Camanti Route',
  manifestoCta1Text: 'Our story',
  manifestoCta1Link: '#about',
  manifestoCta2Text: 'Explore programs',
  manifestoCta2Link: '#experiences',

  explorerEyebrow: 'Find your journey',
  explorerHeadline: 'Choose how you want to go deep',
  explorerSubheadline: '4 ways to travel with purpose. All-inclusive from Cusco. Filter by experience type.',

  reviewsEyebrow: 'What guests say',
  reviewsHeadline: 'Real experiences',
  reviewsScore: '5.0',

  techEyebrow: 'Exclusive technology',
  techHeadline: 'A commitment to preserving pristine nature',
  techBody:
    'Designed for eco-travellers seeking adventure with purpose. We combine immersive technology, sustainable lodging, and direct impact on local communities.',

  missionEyebrow: 'Why travel with us',
  missionHeadline: 'Travel deeper. Protect what matters.',
  missionBody: 'Every booking directly funds conservation in the Manu Biosphere Reserve and Camanti cloud forest.',
  missionItems: [
    {
      ...key('m0'),
      _type: 'missionItem' as const,
      iconType: 'transport' as const,
      title: 'All-inclusive from Cusco',
      subtitle: 'Certified naturalist guides · pickup at your hotel',
    },
    {
      ...key('m1'),
      _type: 'missionItem' as const,
      iconType: 'lodge' as const,
      title: 'Exclusive eco-lodges',
      subtitle: 'Located in high-biodiversity conservation zones',
    },
    {
      ...key('m2'),
      _type: 'missionItem' as const,
      iconType: 'tech' as const,
      title: 'Technology-enhanced immersion',
      subtitle: 'EcoDroneView® · ForestWhisper® · EcoSpeciesExplorer®',
    },
    {
      ...key('m3'),
      _type: 'missionItem' as const,
      iconType: 'group' as const,
      title: 'Max 8 people per group',
      subtitle: 'Always intimate · never a mass tour',
    },
    {
      ...key('m4'),
      _type: 'missionItem' as const,
      iconType: 'conservation' as const,
      title: 'Direct conservation impact',
      subtitle: 'Every booking funds active research and local communities',
    },
  ],
  missionCtaText: 'Read our impact →',
  missionCtaLink: '#',

  partnersLabel: 'Certified by & affiliated with',

  blogEyebrow: 'From the field',
  blogHeadline: 'Latest from Ecotone',

  bookingEyebrow: 'Reserve your spot',
  bookingHeadline: 'Ready to disconnect?',
  bookingBody:
    'Small groups. Fixed departures. Limited spots. Choose from ~10 immersive experiences across 3 routes — or let us design something entirely yours.',
  bookingTrustItems: [
    { ...key('b0'), _type: 'bookingTrustItem' as const, iconType: 'shield' as const, text: 'Secure payment — multiple methods accepted' },
    { ...key('b1'), _type: 'bookingTrustItem' as const, iconType: 'chart' as const, text: 'Free cancellation up to 15 days before departure' },
    { ...key('b2'), _type: 'bookingTrustItem' as const, iconType: 'heart' as const, text: 'Committed to responsible and regenerative tourism' },
    { ...key('b3'), _type: 'bookingTrustItem' as const, iconType: 'clock' as const, text: 'All-inclusive from Cusco — pickup from your hotel' },
  ],
  bookingPrice: 'from $380',
  bookingPriceSubtext: 'All inclusive · departure from Cusco',
  bookingCardRows: [
    { ...key('bc0'), _type: 'labelValue' as const, label: 'Routes', value: 'Camanti · Manu Route · Core' },
    { ...key('bc1'), _type: 'labelValue' as const, label: 'Group size', value: '2 – 8 people' },
    { ...key('bc2'), _type: 'labelValue' as const, label: 'Duration', value: '3 days – 6 weeks' },
    { ...key('bc3'), _type: 'labelValue' as const, label: 'Pickup', value: '4:30–5:00 AM · Cusco' },
  ],
  bookingCta1Text: 'Explore all experiences →',
  bookingCta1Link: '#experiences',
  bookingCta2Text: 'Ask via WhatsApp',
  bookingCta2Link:
    'https://wa.me/51974781094?text=I%20want%20information%20about%20Ecotone%20experiences',
}
