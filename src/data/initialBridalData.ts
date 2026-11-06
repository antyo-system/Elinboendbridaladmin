import type { BridalProduct } from '../types/product'
import type { Article } from '../types/article'

export const INITIAL_BRIDAL_PRODUCTS: BridalProduct[] = [
  {
    id: 'eb-001',
    code: 'EB-001',
    title: 'The Aurelia French Lace Ballgown',
    slug: 'the-aurelia-french-lace-ballgown',
    product_type: 'wedding_gown',
    silhouette: 'Ballgown',
    occasion: 'Holy Matrimony',
    color_name: 'Ivory & Warm Champagne',
    color_hex: '#F5EDE6',
    fabric: 'French Chantilly Lace & Silk Organza',
    rental_price: 6500000,
    original_rental_price: 8500000,
    purchase_price: 24000000,
    original_purchase_price: 28000000,
    security_deposit: 1500000,
    is_rental_available: true,
    is_purchase_available: true,
    badge_label: 'Best Seller',
    images: [
      'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    ],
    description:
      'Handcrafted with delicate French Chantilly lace over sparkling organza, The Aurelia features an internal sweetheart corset and a cathedral train that floats down the aisle.',
    rating: 5.0,
    reviews_count: 18,
    rented_count: 14,
    sizes_available: ['XS', 'S', 'M', 'Custom'],
    is_live: true,
    store_code: 'EB_ATELIER',
    pickup_sla: '3_day',
    in_stock: true,
    created_at: '2026-10-15T08:00:00Z',
  },
  {
    id: 'eb-002',
    code: 'EB-002',
    title: 'Seraphina Crystalline Mermaid Gown',
    slug: 'seraphina-crystalline-mermaid-gown',
    product_type: 'wedding_gown',
    silhouette: 'Mermaid',
    occasion: 'Wedding Reception',
    color_name: 'Pure White',
    color_hex: '#FFFFFF',
    fabric: 'Crepe Silk & Swarovski Beads',
    rental_price: 5200000,
    original_rental_price: 6500000,
    purchase_price: 19500000,
    original_purchase_price: 22000000,
    security_deposit: 1200000,
    is_rental_available: true,
    is_purchase_available: true,
    badge_label: 'Haute Couture',
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    ],
    description:
      'A sculptural masterpiece hugging every curve before cascading into a flared godet train encrusted with hand-sewn micro crystals.',
    rating: 4.9,
    reviews_count: 14,
    rented_count: 11,
    sizes_available: ['S', 'M', 'L'],
    is_live: true,
    store_code: 'EB_ATELIER',
    pickup_sla: '3_day',
    in_stock: true,
    created_at: '2026-10-18T09:00:00Z',
  },
  {
    id: 'eb-003',
    code: 'EB-003',
    title: 'Elysian Minimalist Mikado Sheath',
    slug: 'elysian-minimalist-mikado-sheath',
    product_type: 'wedding_gown',
    silhouette: 'Sheath / Column',
    occasion: 'Holy Matrimony',
    color_name: 'Lustrous Pearl',
    color_hex: '#FAF8F5',
    fabric: 'Heavy Japanese Mikado Silk',
    rental_price: 4200000,
    original_rental_price: 5000000,
    purchase_price: 15500000,
    original_purchase_price: 18000000,
    security_deposit: 1000000,
    is_rental_available: true,
    is_purchase_available: true,
    badge_label: 'Modern Bride',
    images: [
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    ],
    description:
      'For the contemporary bride who values clean lines and architectural drapery. Includes a detachable dramatic back bow with floor-sweeping ties.',
    rating: 4.8,
    reviews_count: 9,
    rented_count: 8,
    sizes_available: ['XS', 'S', 'M', 'L', 'Custom'],
    is_live: true,
    store_code: 'EB_ATELIER',
    pickup_sla: '2_day',
    in_stock: true,
    created_at: '2026-10-20T10:30:00Z',
  },
  {
    id: 'eb-004',
    code: 'EB-004',
    title: 'Nocturne Emerald Velvet Evening Gown',
    slug: 'nocturne-emerald-velvet-evening-gown',
    product_type: 'party_dress',
    silhouette: 'Mermaid',
    occasion: 'Evening Gala',
    color_name: 'Deep Emerald',
    color_hex: '#0A3B2A',
    fabric: 'Silk Stretch Velvet & Gold Thread',
    rental_price: 2800000,
    original_rental_price: 3500000,
    purchase_price: 9800000,
    original_purchase_price: 12000000,
    security_deposit: 800000,
    is_rental_available: true,
    is_purchase_available: true,
    badge_label: 'Party Exclusive',
    images: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80',
    ],
    description:
      'Luxurious deep emerald stretch velvet featuring an asymmetric off-shoulder neckline and a sensual high leg slit. Perfect for galas and black-tie affairs.',
    rating: 4.9,
    reviews_count: 22,
    rented_count: 19,
    sizes_available: ['S', 'M', 'L'],
    is_live: true,
    store_code: 'EB_ATELIER',
    pickup_sla: 'same_day',
    in_stock: true,
    created_at: '2026-10-22T11:15:00Z',
  },
  {
    id: 'eb-005',
    code: 'EB-005',
    title: 'Celeste Starlight A-Line Gown',
    slug: 'celeste-starlight-a-line-gown',
    product_type: 'wedding_gown',
    silhouette: 'A-Line',
    occasion: 'Wedding Reception',
    color_name: 'Blush & Silver Shimmer',
    color_hex: '#FCEEE9',
    fabric: 'Glitter Tulle & 3D Floral Appliques',
    rental_price: 5800000,
    original_rental_price: 7200000,
    purchase_price: 21000000,
    original_purchase_price: 25000000,
    security_deposit: 1500000,
    is_rental_available: true,
    is_purchase_available: true,
    badge_label: 'Trending',
    images: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    ],
    description:
      'Soft blush undertones overlaid with celestial star-dusted tulle and botanical 3D blossoms trickling down from bodice to hem.',
    rating: 5.0,
    reviews_count: 31,
    rented_count: 24,
    sizes_available: ['XS', 'S', 'M', 'XL', 'Custom'],
    is_live: true,
    store_code: 'EB_ATELIER',
    pickup_sla: '3_day',
    in_stock: true,
    created_at: '2026-10-25T14:00:00Z',
  },
  {
    id: 'eb-006',
    code: 'EB-006',
    title: 'Genevieve Champagne Draped Satin Dress',
    slug: 'genevieve-champagne-draped-satin-dress',
    product_type: 'party_dress',
    silhouette: 'Sheath / Column',
    occasion: 'Evening Gala',
    color_name: 'Warm Champagne',
    color_hex: '#DFCCAF',
    fabric: 'Heavy Duchess Satin',
    rental_price: 2400000,
    original_rental_price: 3000000,
    purchase_price: 8500000,
    original_purchase_price: 10500000,
    security_deposit: 700000,
    is_rental_available: true,
    is_purchase_available: true,
    badge_label: 'Popular Rental',
    images: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    ],
    description:
      'Impeccably draped cowl neckline with open back detailing, tailored to move like liquid gold under evening lights.',
    rating: 4.7,
    reviews_count: 11,
    rented_count: 15,
    sizes_available: ['S', 'M'],
    is_live: true,
    store_code: 'EB_ATELIER',
    pickup_sla: 'same_day',
    in_stock: true,
    created_at: '2026-10-27T15:30:00Z',
  },
  {
    id: 'eb-007',
    code: 'EB-007',
    title: 'Adelaide Modern Heritage Kebaya Pengantin',
    slug: 'adelaide-modern-heritage-kebaya-pengantin',
    product_type: 'wedding_gown',
    silhouette: 'Modern Kebaya',
    occasion: 'Holy Matrimony',
    color_name: 'Broken White & Gold Lace',
    color_hex: '#F9F6F0',
    fabric: 'French Corded Lace & Songket Accent',
    rental_price: 4900000,
    original_rental_price: 6000000,
    purchase_price: 18000000,
    original_purchase_price: null,
    security_deposit: 1200000,
    is_rental_available: true,
    is_purchase_available: true,
    badge_label: 'Heritage Couture',
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    ],
    description:
      'A refined fusion of traditional Indonesian kebaya silhouette with contemporary haute couture corsetry and floor-length trailing lace train.',
    rating: 5.0,
    reviews_count: 27,
    rented_count: 21,
    sizes_available: ['S', 'M', 'Custom'],
    is_live: true,
    store_code: 'EB_ATELIER',
    pickup_sla: '3_day',
    in_stock: true,
    created_at: '2026-10-29T16:00:00Z',
  },
  {
    id: 'eb-008',
    code: 'EB-008',
    title: 'Rosalind Pastel Rose Bridesmaid Gown',
    slug: 'rosalind-pastel-rose-bridesmaid-gown',
    product_type: 'party_dress',
    silhouette: 'A-Line',
    occasion: 'Bridesmaid',
    color_name: 'Dusty Rose',
    color_hex: '#E2B2B8',
    fabric: 'Italian Chiffon & Pleated Bodice',
    rental_price: 1800000,
    original_rental_price: 2200000,
    purchase_price: 5500000,
    original_purchase_price: null,
    security_deposit: 500000,
    is_rental_available: true,
    is_purchase_available: true,
    badge_label: 'Bridesmaid Favorite',
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    ],
    description:
      'Airy and romantic, Rosalind is designed for bridesmaids who desire elegance with effortless comfort throughout a full wedding celebration.',
    rating: 4.8,
    reviews_count: 19,
    rented_count: 17,
    sizes_available: ['XS', 'S', 'M', 'L', 'XL'],
    is_live: true,
    store_code: 'EB_ATELIER',
    pickup_sla: 'next_day',
    in_stock: true,
    created_at: '2026-11-01T10:00:00Z',
  },
]

export const INITIAL_BRIDAL_ARTICLES: Article[] = [
  {
    id: 'art-001',
    title: 'The Ultimate Guide to Choosing Your Dream Wedding Gown Silhouette',
    slug: 'ultimate-guide-choosing-wedding-gown-silhouette',
    meta_title: 'Ultimate Guide to Choosing Your Wedding Gown Silhouette | Elinboend',
    meta_description:
      'Discover how wedding gown silhouettes—from French lace ballgowns to sculptural mermaid dresses—complement your natural proportions for your big day.',
    focus_keyword: 'wedding gown silhouette',
    canonical_url: 'https://elinboendbridal.com/articles/ultimate-guide-choosing-wedding-gown-silhouette',
    excerpt:
      'From grand ballgowns to architectural column sheaths, learn how neckline, train, and corset geometry complement your unique body proportions.',
    cover_image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    cover_image_alt: 'Luxury wedding gown silhouette fitting at Elinboend Bridal Atelier',
    category: 'Silhouette Guide',
    tags: ['wedding gown silhouette', 'ballgown', 'mermaid gown', 'a-line dress', 'bridal fitting'],
    author_name: 'Elin Boend, Lead Designer',
    reading_time_minutes: 5,
    related_product_ids: ['eb-001', 'eb-002', 'eb-003'],
    status: 'published',
    views_count: 428,
    published_at: '2026-10-28T08:00:00Z',
    created_at: '2026-10-28T08:00:00Z',
    updated_at: '2026-10-28T08:00:00Z',
    content: `# The Ultimate Guide to Choosing Your Dream Wedding Gown Silhouette

Every bride arrives at our atelier with a vision. Yet, discovering the **wedding gown silhouette** that truly takes your breath away is often a journey of exploring how fabric architecture interacts with your body geometry.

---

## 1. The Timeless Ballgown
If you have envisioned a fairytale grand entrance under chandelier lighting, the ballgown remains unrivaled. Featuring a structured bodice that cinches at the natural waist before dramatically cascading into layers of French Chantilly lace and silk organza, this silhouette creates the classic hourglass proportion.

> **Stylist Note:** Pair a cathedral-length ballgown with an internal corset for effortless posture throughout your ceremony and reception.

---

## 2. The Universally Flattering A-Line
The A-line is celebrated as bridal couture's most versatile silhouette. Gently widening from the bust downwards without dramatic volume at the hips, it offers supreme comfort for long ceremony rituals and garden receptions.

---

## 3. The Sculptural Mermaid & Trumpet
Designed for confident brides who wish to accentuate their natural curves. A well-constructed mermaid wedding gown hugs the torso, waist, and hips before flaring outward at the mid-thigh or knee. Our atelier integrates flexible French boning to ensure full ease of movement during your first dance.

---

## 4. The Modern Minimalist Sheath
For intimate celebrations or holy matrimony ceremonies, heavy layers can feel overwhelming. Fluid Japanese Mikado silk or bias-cut satin sheaths offer clean, sculptural elegance that moves like water.

---

### Book Your Private 1-on-1 Atelier Fitting
Ready to try on these silhouettes in person? Schedule your private fitting session with our bridal concierge today.

[Book Private Fitting via WhatsApp](https://wa.me/6287880111169?text=Hello%20Elinboend%20Bridal%2C%20I%20would%20like%20to%20schedule%20a%20private%20gown%20fitting%20session)`,
  },
  {
    id: 'art-002',
    title: 'Wedding Gown Rental vs. Custom Made: Which One Fits Your Wedding Budget?',
    slug: 'wedding-gown-rental-vs-custom-made-budget-guide',
    meta_title: 'Wedding Gown Rental vs Custom Made Budget Guide | Elinboend Bridal',
    meta_description:
      'Compare 3-day luxury wedding gown rental vs bespoke custom made-to-measure tailoring at Elinboend Bridal to maximize your wedding budget.',
    focus_keyword: 'wedding gown rental',
    canonical_url: 'https://elinboendbridal.com/articles/wedding-gown-rental-vs-custom-made-budget-guide',
    excerpt:
      'Compare the benefits of couture rental with bespoke purchase to maximize your wedding budget without sacrificing luxury craftsmanship.',
    cover_image:
      'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=80',
    cover_image_alt: 'Couture wedding gown rental and custom tailoring comparison',
    category: 'Bridal Budget',
    tags: ['wedding gown rental', 'custom wedding dress', 'bridal budget', 'sewa gaun pengantin'],
    author_name: 'Clarissa Ward, Bridal Concierge',
    reading_time_minutes: 4,
    related_product_ids: ['eb-001', 'eb-005', 'eb-007'],
    status: 'published',
    views_count: 315,
    published_at: '2026-10-15T09:00:00Z',
    created_at: '2026-10-15T09:00:00Z',
    updated_at: '2026-10-15T09:00:00Z',
    content: `# Wedding Gown Rental vs. Custom Made: Which One Fits Your Wedding Budget?

One of the first questions brides ask during our private consultations is whether they should opt for a **wedding gown rental** or commission a bespoke made-to-measure piece.

---

## The Advantages of 3-Day Couture Rental
- **Significant Cost Savings**: Luxury designer gowns with retail values exceeding Rp 24.000.000 can be rented for Rp 4.200.000 – Rp 6.500.000 for a full 3-day window.
- **Zero Preservation Hassle**: You avoid the burden of specialist couture dry cleaning, acid-free storage boxes, and long-term humidity protection.
- **Complimentary Custom Fitting**: At Elinboend Bridal, every rental gown includes temporary waist and hem adjustments plus a fully refundable security deposit.

---

## When to Choose Custom Made-to-Measure
- **Bespoke Proportions**: Ideal when your vision calls for a custom corset cut, specific neckline depth, or detachable train.
- **Heirloom Sentiment**: If you intend to treasure your gown for future generations.
- **Signature Embroidery**: Custom Swarovski beadwork, monogrammed veil lace, or heritage Songket accents.

[Consult With Our Bridal Stylist](https://wa.me/6287880111169?text=Hello%20Elinboend%20Bridal%2C%20I%20want%20to%20ask%20about%20Rental%20vs%20Custom%20Made%20Gowns)`,
  },
  {
    id: 'art-003',
    title: 'Bridal Fitting Etiquette: 5 Essentials to Prepare Before Your Fitting Session',
    slug: 'bridal-fitting-etiquette-5-essentials-to-prepare',
    meta_title: 'Bridal Fitting Etiquette: 5 Essentials Before Your Gown Fitting',
    meta_description:
      'Maximize your 1-on-1 bridal fitting session at Elinboend Bridal with these 5 essential tips: shoe heel height, seamless undergarments, and styling prep.',
    focus_keyword: 'bridal fitting etiquette',
    canonical_url: 'https://elinboendbridal.com/articles/bridal-fitting-etiquette-5-essentials-to-prepare',
    excerpt:
      'Maximize your 1-on-1 atelier fitting session with these essential preparations: undergarment selection, heel height, and guest etiquette.',
    cover_image:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    cover_image_alt: 'Private bridal fitting session at Elinboend Bridal boutique',
    category: 'Fitting & Care',
    tags: ['bridal fitting etiquette', 'gown fitting tips', 'wedding shoes', 'atelier appointment'],
    author_name: 'Elin Boend, Lead Designer',
    reading_time_minutes: 4,
    related_product_ids: ['eb-002', 'eb-004'],
    status: 'published',
    views_count: 264,
    published_at: '2026-09-30T10:00:00Z',
    created_at: '2026-09-30T10:00:00Z',
    updated_at: '2026-09-30T10:00:00Z',
    content: `# Bridal Fitting Etiquette: 5 Essentials to Prepare Before Your Fitting Session

Your private fitting is an intimate milestone where sketches and silhouettes transform into reality. Mastering **bridal fitting etiquette** ensures your 90-minute appointment is calm, productive, and joyful.

---

## 1. Bring Your Wedding Shoes or Exact Heel Height
The hemline alteration depends entirely on your heel height. Even a 2 cm variance can cause a cathedral train or mermaid flare to bunch on the floor.

## 2. Wear Seamless Nude Undergarments
Bright or textured undergarments distract from sheer illusion lace and delicate French Chantilly bodices.

## 3. Curate an Intimate Entourage (2 Trusted Guests)
Too many conflicting opinions create unnecessary stress. Bring one or two loved ones whose aesthetic judgment and emotional support anchor you.

## 4. Test Movement: Walk, Sit, and Dance
A couture gown should not only photograph beautifully—it should allow you to breathe, embrace guests, and dance comfortably.`,
  },
]

