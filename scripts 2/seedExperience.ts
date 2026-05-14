/**
 * Seed Soqtapata experience + lodge (idempotent createOrReplace).
 * Requires SANITY_API_TOKEN in .env.local. Run: npm run seed:experience
 */
import type { SanityClient } from '@sanity/client'
import { createClient } from 'next-sanity'
import { config } from 'dotenv'
import { resolve } from 'node:path'

config({ path: resolve(process.cwd(), '.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-20'
const token = process.env.SANITY_API_TOKEN

function writeClient(): SanityClient {
  if (!projectId || !dataset) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in .env.local')
  }
  if (!token) {
    throw new Error('Missing SANITY_API_TOKEN. Add it to .env.local and run again.')
  }
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false })
}

const lodgeSoqtapata = {
  _type: 'lodge' as const,
  _id: 'lodge-soqtapata',
  name: 'Soqtapata Lodge',
  slug: { _type: 'slug' as const, current: 'soqtapata-lodge' },
  route: 'camanti' as const,
  altitudeLegacy: '1,200 m.a.s.l.',
  distanceFromCusco: '~2.5 hrs',
  capacity: 8,
  ecosystem: 'Cloud forest',
  shortDescription:
    'Private bungalows adjacent to CIDS — your base in the 10,000 ha Soqtapata Reserve.',
}

const experienceSoqtapata = {
  _type: 'experience' as const,
  _id: 'experience-soqtapata-3d2n',
  name: 'Soqtapata Pristine Immersion',
  slug: { _type: 'slug' as const, current: 'soqtapata-pristine-immersion' },
  programType: 'nature-core' as const,
  route: 'camanti' as const,
  status: 'active' as const,
  duration: '3D / 2N',
  price: 986,
  priceLabel: 'USD 986',
  tagline:
    'The untouched cloud forest. 10,000 ha reserve. EcoDroneView® · ForestWhisper® · Expert naturalist guide.',
  shortDescription: 'Cloud forest. 300+ birds. EcoDroneView®. Private bungalow.',
  fullDescription: `Three days inside the Soqtapata Reserve — 10,000 hectares of primary cloud forest from 900 to 4,700 m.a.s.l. You'll track wildlife, fly the canopy with EcoDroneView®, and stay at Soqtapata Lodge next to CIDS, our research centre. Run by scientists who live in the forest. Every booking funds conservation via HERPIRO (B Corp).`,

  highlights: [
    'Fly the canopy with EcoDroneView® (included)',
    'ForestWhisper® 360° sound immersion at night',
    'Private bungalow at Soqtapata Lodge (max 2 guests)',
    'Visit CIDS research station with resident biologists',
    '300+ bird species — spectacled bear, puma, jaguar territory',
  ],

  videoTitle: 'Soqtapata Pristine Immersion',
  videoDuration: '3:24',

  // Añade en Studio: cada foto { _key, image, caption?, category? }
  gallery: [],

  lodge: { _type: 'reference' as const, _ref: 'lodge-soqtapata' },
  lodgeNightLabel: 'Nights 1 & 2',
  groupSizeMin: 2,
  groupSizeMax: 8,
  altitude: '1,200 m',
  distanceFromCusco: '~2.5h',
  ecosystem: 'Cloud forest',

  includedTechProducts: [
    { _key: 'inc-tech-01', _type: 'reference' as const, _ref: 'seed-tech-01' },
    { _key: 'inc-tech-02', _type: 'reference' as const, _ref: 'seed-tech-02' },
    { _key: 'inc-tech-03', _type: 'reference' as const, _ref: 'seed-tech-03' },
  ],

  itinerary: [
    {
      _key: 'day1',
      dayNumber: 1,
      title: 'Into the Cloud Forest',
      subtitle: 'Departure · Trek in · First wildlife walk · EcoDroneView®',
      photoCaption: 'Entering the Soqtapata Reserve via the 45-min trail from the road',
      timeline: [
        { _key: 'day1-t1', time: '4:30 AM', title: 'Pickup from Cusco', description: 'Hotel pickup or main plaza. Private 4x4 vehicle.' },
        { _key: 'day1-t2', time: '~7:30 AM', title: 'Arrival at trailhead', description: 'Rubber boots on. 45-min trek. First bird and mammal sightings.' },
        { _key: 'day1-t3', time: '12:00 PM', title: 'Lunch at Soqtapata Lodge', description: 'Fresh local food. Meet the research team.' },
        { _key: 'day1-t4', time: '3:00 PM', title: 'EcoDroneView® canopy flight', description: 'Aerial survey with your naturalist — wildlife from the treetops.' },
        { _key: 'day1-t5', time: '6:00 PM', title: 'ForestWhisper® at night', description: '360° sound as the forest wakes — owls, insects, amphibians.' },
      ],
      lodgeOvernight: 'Soqtapata Lodge',
      lodgeSub: 'Private bungalow or double room · full board',
    },
    {
      _key: 'day2',
      dayNumber: 2,
      title: 'Deep in the Reserve',
      subtitle: 'Full-day trail · CIDS visit · EcoSpeciesExplorer® · Night walk',
      photoCaption: 'Primary forest trails — CIDS in the afternoon',
      timeline: [
        { _key: 'day2-t1', time: '5:30 AM', title: 'Dawn birdwatch', description: 'Peak activity. ID by call with EcoSpeciesExplorer®.' },
        { _key: 'day2-t2', time: '8:00 AM', title: 'Breakfast & full-day trail', description: 'Deep into primary forest. EcoSpeciesExplorer® in the field.' },
        { _key: 'day2-t3', time: '2:00 PM', title: 'CIDS research station', description: 'Meet biologists and active conservation work.' },
        { _key: 'day2-t4', time: '7:00 PM', title: 'Night wildlife walk', description: 'Torch-led walk. Amphibians, insects, possible mammals.' },
      ],
      lodgeOvernight: 'Soqtapata Lodge',
      lodgeSub: 'Private bungalow or double room · full board',
    },
    {
      _key: 'day3',
      dayNumber: 3,
      title: 'Last Morning · Return to Cusco',
      subtitle: 'Dawn birdwatch · Breakfast · Trek out',
      photoCaption: 'Final dawn before trek out to Cusco',
      timeline: [
        { _key: 'day3-t1', time: '5:30 AM', title: 'Final dawn birdwatch', description: 'Cock-of-the-rock lek at sunrise.' },
        { _key: 'day3-t2', time: '8:00 AM', title: 'Breakfast · Pack & trek out', description: '45 min to trailhead. Private transfer to Cusco.' },
        { _key: 'day3-t3', time: '~1:00 PM', title: 'Arrival in Cusco', description: 'Drop-off at hotel or main plaza.' },
      ],
    },
  ],

  includes: [
    'Private transport from/to Cusco',
    '2 nights at Soqtapata Lodge',
    'All meals — full board',
    'Expert certified naturalist guide',
    'EcoDroneView® session',
    'ForestWhisper® night session',
    'CIDS research station visit',
    'Rubber boots and rain gear (on loan)',
    'Filtered water at all times',
  ],
  notIncludes: [
    'Flights to Cusco',
    'Travel insurance (recommended)',
    'Alcohol',
    'Tips (discretionary)',
    'Personal meds / first aid',
    'Laundry',
  ],

  wildlife: [
    { _key: 'w1', name: 'Cock-of-the-rock', description: 'National bird of Perú', iconType: 'bird' },
    { _key: 'w2', name: 'Spectacled bear', description: 'Only bear in S. America', iconType: 'bear' },
    { _key: 'w3', name: 'Puma', description: 'Mountain lion', iconType: 'cat' },
    { _key: 'w4', name: 'Jaguar', description: 'Apex predator', iconType: 'jaguar' },
    { _key: 'w5', name: '300+ birds', description: 'Including endemics', iconType: 'bird' },
    { _key: 'w6', name: 'Woolly monkey', description: 'Active research', iconType: 'monkey' },
    { _key: 'w7', name: 'Andean tapir', description: 'Rare sighting', iconType: 'generic' },
  ],

  bestTimeByMonth: [
    { _key: 'm1', month: 'january', highlight: 'Reptiles & amphibians at peak. Lush green season.', level: 'always-good' },
    { _key: 'm2', month: 'february', highlight: 'Orchids bloom. Forest in full colour.', level: 'always-good' },
    { _key: 'm3', month: 'march', highlight: 'Migratory birds. Nest-building starts.', level: 'always-good' },
    { _key: 'm4', month: 'april', highlight: 'Cock-of-the-rock leks. Fewer visitors.', level: 'good' },
    { _key: 'm5', month: 'may', highlight: 'Dry season begins. Clearer trails. Great photos.', level: 'good' },
    { _key: 'm6', month: 'june', highlight: 'Peak season. Clear skies. Bears most visible.', level: 'peak' },
    { _key: 'm7', month: 'july', highlight: 'Best birding window. 300+ species very active.', level: 'peak' },
    { _key: 'm8', month: 'august', highlight: 'Dry peak. Puma tracks on trails.', level: 'peak' },
    { _key: 'm9', month: 'september', highlight: 'Transition. Juveniles explore.', level: 'good' },
    { _key: 'm10', month: 'october', highlight: 'Rains return. Waterfalls & frog chorus.', level: 'always-good' },
    { _key: 'm11', month: 'november', highlight: 'Butterflies. More solitude.', level: 'always-good' },
    { _key: 'm12', month: 'december', highlight: 'Orchids & bromeliads. Green season peak.', level: 'always-good' },
  ],

  packingList: [
    'Quick-dry trousers',
    'Warm mid-layer',
    'Waterproof jacket',
    'Long-sleeve shirts',
    'Insect repellent (DEET)',
    'Sunscreen SPF 50+',
    'Binoculars (8x42+)',
    'Headlamp + spare batteries',
    'Small daypack',
    'Camera + extra cards',
  ],

  entryRequirements: [
    { _key: 'e1', title: 'Passport', description: 'Valid 6+ months beyond travel. Keep physical + digital copy.' },
    { _key: 'e2', title: 'Visa', description: 'Many nationalities: 90-day tourist entry. Confirm with your embassy.' },
    { _key: 'e3', title: 'Vaccinations', description: 'Yellow fever often recommended. Hep A/B, typhoid, rabies for jungle. See a travel clinic 4+ weeks before.' },
    { _key: 'e4', title: 'Travel insurance', description: 'Covers jungle activities, altitude, and evacuation from remote areas.' },
  ],

  gettingHereInfo: [
    { _key: 'g1', title: 'Flights to Cusco', description: 'CUZ: direct from Lima ~1.5h (LATAM, Avianca). Lima connects to global hubs.' },
    { _key: 'g2', title: 'Acclimatise in Cusco', description: '3,400 m.a.s.l. Arrive 1–2 days early. Rest, coca tea, easy on alcohol day one.' },
    { _key: 'g3', title: 'Our pickup', description: '4:30–5:00 AM from hotel or main plaza. Send hotel name after booking.' },
  ],

  cancellationPolicy:
    'Free cancellation up to 15 days before departure. Cancellations between 7–15 days receive a 50% refund. Cancellations under 7 days are non-refundable. All bookings through WeTravel. We recommend travel insurance.',
  termsAndConditions:
    "By booking this experience you agree to Ecotone's terms of service. All prices in USD, per person, based on double occupancy. Single supplement available on request. Ecotone reserves the right to modify itineraries due to weather, safety, or conservation requirements. HERPIRO is a certified B Corp.",
  importantNotes: [
    'Minimum age: 8 years',
    'Moderate fitness required — 45 min walk each way',
    'Not recommended for visitors with severe altitude sensitivity',
    'Early 4:30 AM departure — rest in Cusco the day before',
  ],

  mapPdfLabel: 'Route map · Soqtapata · Trail overview · PDF',
  brochurePdfLabel: 'Experience brochure · Full itinerary · Photos · PDF',

  faqs: [
    { _key: 'f1', question: 'Is this experience suitable for first-time visitors to the Amazon?', answer: "Yes. Soqtapata is the most accessible route — 2.5h from Cusco, cloud forest terrain, easy 45-min walk to the lodge. Your guide is with you at all times." },
    { _key: 'f2', question: "What's the minimum and maximum group size?", answer: "Minimum 2, maximum 8. Solo travellers can join scheduled departures — WhatsApp us for dates." },
    { _key: 'f3', question: "What if the weather is bad?", answer: 'Light rain is normal. Gear provided. EcoDroneView® may be rescheduled same trip if wind is unsafe.' },
    { _key: 'f4', question: 'Is altitude an issue?', answer: 'The lodge is ~1,200 m — often easier than Cusco (3,400 m). We still recommend 1–2 acclimation days in Cusco first.' },
    { _key: 'f5', question: 'WiFi or phone at the lodge?', answer: 'Limited satellite WiFi in common areas. No signal in the reserve — most guests enjoy the disconnect.' },
    { _key: 'f6', question: 'Private departures?', answer: 'Yes, groups 2–8, subject to lodge availability. Contact us on WhatsApp.' },
    { _key: 'f7', question: 'Cancellation policy?', answer: 'Free up to 15 days before. 7–15 days: 50% refund. Under 7 days: non-refundable. Insurance recommended.' },
  ],

  seoTitle: 'Soqtapata Pristine Immersion — Ecotone · Cusco, Perú',
  seoDescription:
    'The untouched cloud forest. Soqtapata Reserve, EcoDroneView®, ForestWhisper®, expert naturalist guide.',
} as const

type SeedDoc = Record<string, unknown> & { _id: string; _type: string }

async function main() {
  const client = writeClient()
  const tx = client.transaction()
  tx.createOrReplace(lodgeSoqtapata as unknown as SeedDoc)
  tx.createOrReplace({ ...experienceSoqtapata } as unknown as SeedDoc)
  await tx.commit()
  console.log('Seed OK: lodge-soqtapata + experience-soqtapata-3d2n')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
