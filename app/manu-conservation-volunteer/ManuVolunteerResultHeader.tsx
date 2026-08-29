import { ManuVolunteerBrandLogo } from './ManuVolunteerBrandLogo'

/** Minimal logo-only chrome for `/manu-conservation-volunteer/result`. */
export function ManuVolunteerResultHeader() {
  return (
    <header className="mcv-result-topbar">
      <div className="mcv-container mcv-result-topbar-inner">
        <ManuVolunteerBrandLogo />
      </div>
    </header>
  )
}
