# Ecotone CMS image roles (design-system note)

**Principle:** Editors upload a **high-quality master**. The delivery pipeline
(`lib/ecotoneImage`) chooses the appropriate Sanity CDN derivative via `srcset`.
Do **not** pre-compress images into small pixel dimensions just to reduce upload size.

## Roles

| Role | Typical use | Recommended master | Studio warning | Studio error |
|------|-------------|--------------------|----------------|--------------|
| **hero** | Full-bleed heroes | **3200–3840px** wide | width &lt; 3200 | width &lt; 1600 |
| **editorial** | Section / pair visuals | **2400–2800px** wide | width &lt; 2000 | width &lt; 1200 |
| **portrait** | People / headshots | Short side **≥1200px** (range ~1200–2000 on relevant dim) | short side &lt; 1000 | short side &lt; 700 |
| **card** | Listing / promo cards | **1200–1600px** wide | width &lt; 1200 | width &lt; 800 |

Warnings are publishable. Errors block publish for that field.

Validation implementation (Studio): `sanity/lib/ecotoneImageRoleValidation.js`  
Delivery roles (site): `lib/ecotoneImage/roles.ts`
