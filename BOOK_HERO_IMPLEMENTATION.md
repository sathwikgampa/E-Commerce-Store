# Sri Thirumala: 3D Hero Implementation Specification

This document serves as the absolute source of truth for the 3D Hero architecture, layout, lighting, materials, and scroll storytelling. **Do not deviate from these specifications.**

---

## 1. Component Hierarchy & Architecture

The architecture relies on a **Global Canvas** to allow the 3D book to persist across DOM sections.

```tsx
// App/Layout Level
<GlobalCanvas /> // fixed inset-0, pointer-events-none, z-0
<div className="scroll-container"> // lenis smooth scrolling wrapper
  <HeroSection /> // min-h-[200vh], z-10
  <EngineeringSection />
  <MedicalSection />
  <NovelsSection />
</div>

// Inside HeroSection
<HeroOverlay>
  <HeaderNav />
  <HeroContent /> // Title, Subtitle
  <FixedHeroButtons />
  <ScrollIndicator />
</HeroOverlay>
```

---

## 2. Layout Measurements & Spacing

### Typography (Tailwind config required)
- **Primary Serif:** `Cormorant Garamond`, `Canela`, or `Editorial New`.
- **Secondary Sans:** `Inter` or `Satoshi`.
- **Brand Colors:**
  - Background: `#FAFAF7` (Warm Off-White)
  - Primary Text: `#18243D` (Deep Navy)
  - Accent Text: `#C89B3C` (Luxury Gold)
  - Paper Edge: `#F8F2E8`

### Spacing (Hero Content)
- **Top Padding:** `pt-32` (approx 128px) for Header clearance.
- **Badge:** `mb-6`, `px-4 py-1.5`, `rounded-full`, 1px gold border.
- **Heading:** `text-6xl md:text-8xl`, `tracking-tighter`, `mb-4`, Serif font.
- **Description:** `text-lg`, `max-w-xl`, `mb-8`, Sans font, muted color.
- **CTA Buttons:** `gap-4`. Button 1 (Deep Navy bg, White text, hover glow). Button 2 (White bg, Navy text, slight shadow).

---

## 3. The 3D Book Asset (`/public/assets/book.glb`)

**DO NOT build a procedural book.** The implementation strictly requires a pre-built, museum-quality `.glb` asset with the following properties:
- **Geometry:** 50k–100k polygons, clean topology.
- **Nodes Required:** `Front_Cover`, `Back_Cover`, `Spine`, `Page_Stack`, and individual animate-able pages (`Page_01` to `Page_10`).
- **Textures (2048x2048):** Base Color, Normal, Roughness, Metallic, AO.

### Material Specifications
- **Cover:** Leather (`roughness: 0.7`, `metalness: 0.1`, deep navy base, detailed normal map).
- **Gold Foil:** Embossed (`metalness: 1.0`, `roughness: 0.15`, `#C89B3C`).
- **Pages:** Ivory (`color: '#F8F2E8'`, `roughness: 0.95`), visible AO in the crevices.

---

## 4. Lighting & Environment Setup

The quality of the scene relies entirely on soft, premium lighting.

1. **Environment:** `<Environment files="/assets/hdr/studio.hdr" />` (Soft box / Museum style).
2. **Volumetric Sun:** Upper left diagonal directional light (`position={[-10, 20, -10]}`). Color: warm sunlight (`#fff8f0`). Intensity: high but soft-shadowed.
3. **Fill Light:** Very soft, neutral white from the right (`position={[10, 5, 10]}`) to lift harsh shadows.
4. **Shadows:** 
   - `ContactShadows` directly beneath the book (`opacity={0.8}`, `blur={3}`, `scale={25}`).
   - Ensure the GLB casts and receives internal shadows (Ambient Occlusion).
5. **Ground Plane:** A warm concrete/marble plane catching shadows (`roughness={0.9}`, `metalness={0.05}`).

---

## 5. Post-Processing Configuration

Use `@react-three/postprocessing`. Do not overdo these effects.

- **Bloom:** `luminanceThreshold={1.2}`, `intensity={0.2}`, `mipmapBlur`. (Keep it subtle).
- **Noise:** `opacity={0.025}`, `premultiply`. (For photographic film grain).
- **Depth of Field:** `focusDistance={0.05}`, `focalLength={0.02}`, `bokehScale={2}`. (Sharp on the front of the book, softly blurred at the back).
- **Vignette:** `darkness={0.3}`, `offset={0.1}`. (Soft edges).

---

## 6. The Animation Storyboard (GSAP ScrollTrigger)

The book must feel **heavy** and the pages must bend organically. **The book itself does not spin or fly.**

### 0%: Idle State
- Book rests on the table, open to the middle.
- **Idle Motion:** Minuscule breathing (Y-axis translation `0.005`), tiny page flutter (Z-axis rotation `0.002`). Dust particles float slowly (500 count, 5% opacity).

### 10% - 30%: The Lift & Bend
- The first page (or right-side pages) begins to lift.
- **Math:** Rotate Z towards the center. Apply a sine-wave distortion to X/Y rotation to simulate the paper **bending** before it turns.

### 30% - 70%: The Cascading Turn
- Pages turn sequentially with a slight delay (staggered).
- Gravity affects the speed: slow at the peak, fast as it falls.

### 70% - 90%: The Closure & Camera Push
- The final pages settle. The front cover begins to fall closed.
- **Camera:** Begins at `[0, 5, 20]`. Pushes forward to `[0, 6, 15]`.
- The book cover lands softly but heavily (ease: `power4.inOut`). No bouncy snapping.

### 90% - 100%: Product Reveal
- The camera rises slightly. The book tilts up exactly `10°` (0.17 rads) to beautifully catch the HDR reflection on the gold foil logo.
- The hero animation completes.

---

## 7. Responsive Behavior

- **Desktop (1024px+):** Book is anchored at Y: `-3.5`. Takes up the bottom 40% of the viewport.
- **Tablet (768px - 1024px):** Camera pushed back slightly (`Z: 25`). Text scales down.
- **Mobile (<768px):** Camera pushed significantly back (`Z: 35`) or book scaled to `0.6`. Post-processing effects (Depth of Field, Volumetrics) **MUST** be disabled for performance.

---

## 8. Performance Budgets & Strict Rules

1. **Polygon Count:** Maximum 100k active triangles.
2. **Draw Calls:** Merge static page blocks inside Blender to reduce draw calls. 
3. **Texture Compression:** All textures must be compressed (WebP or KTX2). GLB must be Draco compressed.
4. **Frame Rate:** Must maintain 60 FPS on mid-tier devices. If frame rate drops, disable shadows and post-processing dynamically (using `@react-three/drei` `PerformanceMonitor`).
5. **No Placeholders:** Development on the animation logic must not proceed until the final `.glb` and `.hdr` are in place to ensure bone-rigging or shape-key mapping is 100% accurate.

---
*End of Specification.*
