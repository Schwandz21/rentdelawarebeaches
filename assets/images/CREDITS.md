# Image credits — rentdelawarebeaches.com

## Rent Delaware Beaches owned photography

| File | Subject | Source |
|---|---|---|
| `custom-home-sign-2092.jpg` | Custom RDB house number sign ("2092") with integrated cedar planter box, mounted on board-and-batten siding | **Rent Delaware Beaches, LLC — own product photograph.** Optimised from the original `images/2092 Address Sign Hero.png`, which remains in the repository unmodified. |

This is a photograph of an actual product RDB built and installed. It is not stock imagery and
must not be replaced with stock imagery.

## Licensed stock photography

All images below are royalty-free under the Unsplash License or the Pexels License, both of which
permit commercial use without attribution. Attribution is recorded here as good practice.

| File | Subject | Source | ID |
|---|---|---|---|
| `hero-coastal-home.jpg` | Mid-Atlantic style clapboard coastal home with porches and dune grass | Unsplash | `qPmKTfyVOBs` |
| `service-curbside-container-care.jpg` | Two clean residential wheeled containers (refuse + recycling) at a curb | Unsplash | `3FPtmyflfKQ` |
| `service-small-home-maintenance.jpg` | Person assembling flat-pack furniture in a bedroom | Unsplash | `bd7HCEl1PVQ` |
| `service-exterior-property-care.jpg` | Person pressure washing residential clapboard siding | Pexels | `5652626` |

## Notes

- Images are served as optimised progressive JPEG. WebP was not generated because no WebP
  encoder (`cwebp`, ImageMagick) is available on this machine and `sips` on this macOS build does
  not support WebP output. Re-encoding to WebP/AVIF is a safe future optimisation.
- Crops are handled in CSS with `object-fit: cover` plus per-image `object-position`, so the
  subject stays correctly framed across breakpoints rather than being baked into the file.
- `images/Surf-Fishing-Vintage-Pickup-Beach-Sunset-Wall-Art.png` is retained in the repository but
  is not used on the new homepage: it is decorative wall art from the Blue Hen Basement catalogue
  rather than an RDB property-care or house-sign product.
