import type { EnquiryPayload } from '@/lib/enquiryPayload'

/** Fire-and-forget POST to `/api/enquiry`; errors are swallowed so UX never blocks. */
export function submitEnquiryInBackground(payload: EnquiryPayload): void {
  if (typeof window === 'undefined') return
  void fetch('/api/enquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {})
}
