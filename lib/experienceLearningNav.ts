import type { SoqtapataPhase1NavLink, SoqtapataPhase1PageNav } from '@/data/soqtapataExperienceLocal'

/** In-page nav for Experiential Learning experience pages only. */
export const EXPERIENCE_LEARNING_NAV_LINKS: SoqtapataPhase1NavLink[] = [
  { href: '#overview', label: 'Overview', className: 'pnav-top pnav-item active' },
  { href: '#programme', label: 'Programme', className: 'pnav-top pnav-item', dataActiveWhen: 'programme' },
  { href: '#projects', label: 'Projects', className: 'pnav-top pnav-item', dataActiveWhen: 'projects' },
  { href: '#outcomes', label: 'Outcomes', className: 'pnav-top pnav-item', dataActiveWhen: 'outcomes' },
  {
    href: '#field-base',
    label: 'Field Base',
    className: 'pnav-top pnav-item',
    dataActiveWhen: 'field-base',
  },
  { href: '#wildlife', label: 'Wildlife', className: 'pnav-top pnav-item', dataActiveWhen: 'wildlife' },
  { href: '#includes', label: 'Included', className: 'pnav-top pnav-item', dataActiveWhen: 'includes' },
  { href: '#media', label: 'Gallery', className: 'pnav-top pnav-item', dataActiveWhen: 'media' },
  {
    href: '#good-to-know',
    label: 'Good To Know',
    className: 'pnav-top pnav-item',
    dataActiveWhen: 'good-to-know',
  },
  { href: '#terms', label: 'Terms', className: 'pnav-top pnav-item', dataActiveWhen: 'terms' },
  { href: '#faq', label: 'FAQs', className: 'pnav-top pnav-item', dataActiveWhen: 'faq' },
  { href: '#book', label: 'Reserve', className: 'pnav-top pnav-item', dataActiveWhen: 'book' },
]

export function buildExperienceLearningPageNav(base: SoqtapataPhase1PageNav): SoqtapataPhase1PageNav {
  return {
    ...base,
    links: EXPERIENCE_LEARNING_NAV_LINKS.map((link, i) => ({
      ...link,
      className: i === 0 ? 'pnav-top pnav-item active' : 'pnav-top pnav-item',
    })),
  }
}
