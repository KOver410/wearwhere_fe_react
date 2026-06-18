import { useLanguage } from '@/shared/i18n/LanguageContext';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import { motion } from 'motion/react';

import img1 from "@/assets/c9607fafaf1406169066dfdc3dfdfd2bd9a8ad14.png";
import img2 from "@/assets/6e8d000c3265da9fb34c0c91152059cdbd7a1f7c.png";
import img3 from "@/assets/728d974360f6dfed5eca745e80ce2487151565b0.png";
import img4 from "@/assets/9a0e0ec65de7f3a5680c500bf5f6e4f1ccd0ff7b.png";
import img5 from "@/assets/019ab61474ad11823fb4a080d203213b1680e06d.png";
import img6 from "@/assets/b9e51712a8dbc8a4570bc94eb1bdb0b04a543aa4.png";
import img7 from "@/assets/62d90974aa3e2fe10a164b436f4720c8dac4ec22.png";
import img8 from "@/assets/5832e122f9abf5513e949fd3242891fdd0a30730.png";
import img9 from "@/assets/3555487a298df1c3d9cbf49c477139a78ef76dd4.png";
import img10 from "@/assets/e55dfed031eea38d7f78a2cf46f8c700da015a11.png";
import img11 from "@/assets/6ab36a8225b4b91df7d26648b8880ad916e8a1ee.png";
import img12 from "@/assets/f6bebe2b005fd08e0bc335d3780bbe9688170fd9.png";
import img13 from "@/assets/429b14e4ca77c61b1aa504ec0bbf39eb35277894.png";
import img14 from "@/assets/81fd3f3e214838d45181f80b5e654a3ebfc05218.png";
import img15 from "@/assets/91ff9318712a9ece951191ae99b63ea4a556d031.png";
import img16 from "@/assets/015bfc75a258fc516b9bd22013b6f65aaf578889.png";
import img17 from "@/assets/1473b5bf03a7993a447bfc20945a3687c4296709.png";
import img18 from "@/assets/1ce96cffa421c5e846deded6cf5d77a731324802.png";
import img19 from "@/assets/c4bf8d563aee5d24fe1a3ab8c82298334e3380ee.png";
import img20 from "@/assets/ca559d7928570b35ab2ec2cf528985c971735087.png";
import img21 from "@/assets/a219c1091086926525fd974422f2ed6278c4a1c2.png";
import img22 from "@/assets/099891dd819cb46940d7013d34d9fddf12b9565a.png";
import img23 from "@/assets/59c8e9ff15f0804f666c3f0ad58d3b00e99205bd.png";
import img24 from "@/assets/5db665be1f12cd80694de64ebf1f078c56c1459d.png";

/* ═══════════════════════════════════════════════════════════
   DATA — clean product images on white backgrounds
   ═══════════════════════════════════════════════════════════ */

interface Item {
  id: string;
  image: string;
  alt: string;
}

const row1: Item[] = [
  { id: 'r1-1', image: img1, alt: 'Red Leather Coat' },
  { id: 'r1-2', image: img2, alt: 'Black Leather Coat' },
  { id: 'r1-3', image: img3, alt: 'Black Hoodie Jacket' },
  { id: 'r1-4', image: img6, alt: 'Washed Oversized Tee' },
  { id: 'r1-5', image: img7, alt: 'Phon Chay Sweatshirt' },
  { id: 'r1-6', image: img8, alt: 'Leopard Camisole' },
  { id: 'r1-7', image: img9, alt: 'Polka Dot Tank Top' },
  { id: 'r1-8', image: img10, alt: 'Gray Collar Sweater' },
];

const row2: Item[] = [
  { id: 'r2-1', image: img4, alt: 'Distressed Biker Jeans' },
  { id: 'r2-2', image: img5, alt: 'Washed Flare Jeans' },
  { id: 'r2-3', image: img11, alt: 'Black Rhinestone Shorts' },
  { id: 'r2-4', image: img12, alt: 'Yellow Stripe Joggers' },
  { id: 'r2-5', image: img13, alt: 'Dark Wide Leg Pants' },
  { id: 'r2-6', image: img14, alt: 'Distressed Denim Shorts' },
  { id: 'r2-7', image: img15, alt: 'Pleated Mini Skirt' },
  { id: 'r2-8', image: img16, alt: 'Denim Pleated Skirt' },
];

const row3: Item[] = [
  { id: 'r3-1', image: img17, alt: 'Black Leather Boots' },
  { id: 'r3-2', image: img18, alt: 'Black Combat Boots' },
  { id: 'r3-3', image: img19, alt: 'Black Graphic Sneakers' },
  { id: 'r3-4', image: img20, alt: 'White Running Shoes' },
  { id: 'r3-5', image: img21, alt: 'Beige Retro Sneakers' },
  { id: 'r3-6', image: img22, alt: 'White Chunky Sneakers' },
  { id: 'r3-7', image: img23, alt: 'Black Sock Boots' },
  { id: 'r3-8', image: img24, alt: 'Cream Velcro Sneakers' },
];

/* ═══════════════════════════════════════════════════════════
   Product Tile — clean, borderless, KREAM style
   ═══════════════════════════════════════════════════════════ */

function Tile({ item }: { item: Item }) {
  return (
    <motion.div
      className="flex-shrink-0 cursor-pointer group"
      style={{ width: 140 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'tween', duration: 0.2 }}
    >
      <div
        className="w-full flex items-center justify-center rounded-[4px] overflow-hidden"
        style={{
          height: 140,
          backgroundColor: '#F3F4F6',
        }}
      >
        <ImageWithFallback
          src={item.image}
          alt={item.alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ mixBlendMode: 'multiply' }}
        />
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   Grid Row — horizontal scrolling row of tiles
   ══════════════════════════════════════════════════════════ */

function GridRow({ items }: { items: Item[] }) {
  return (
    <div
      className="flex gap-3 overflow-x-auto justify-center"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {items.map((item) => (
        <Tile key={item.id} item={item} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main Section
   ═══════════════════════════════════════════════════════════ */

export function OutfitSuggestions() {
  const { lang } = useLanguage();

  return (
    <section
      className="relative py-12 md:py-20 overflow-hidden"
      style={{ backgroundColor: '#fff9f2' }}
    >
      <div className="mx-auto px-4 lg:px-6" style={{ maxWidth: 'calc(75% + 320px)' }}>
        {/* ── Section Header — giữ nguyên title heading editorial ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '14px', letterSpacing: '0.3em', color: '#d41c1c' }}>
            MIX & MATCH
          </span>

          <h2
            className="mt-2"
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: 'clamp(40px, 6vw, 64px)',
              fontWeight: 700,
              color: '#0d0d0d',
              lineHeight: 1.5,
              textTransform: 'uppercase',
            }}
          >
            {lang === 'vi' ? (
              <>
                GỢI Ý TRANG PHỤC
                <br />
                <span style={{ WebkitTextStroke: '2px #0d0d0d', color: 'transparent' }}>
                  MÙA HÈ NÀY
                </span>
              </>
            ) : (
              <>
                OUTFIT PICKS
                <br />
                <span style={{ WebkitTextStroke: '2px #0d0d0d', color: 'transparent' }}>
                  FOR THIS SUMMER
                </span>
              </>
            )}
          </h2>

          {/* Handwritten annotation */}
          
        </motion.div>

        {/* ── Product Grid — 3 rows, KREAM style ── */}
        <div className="flex flex-col gap-4">
          {/* Row 1: Tops */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <GridRow items={row1} />
          </motion.div>

          {/* Row 2: Bottoms */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            <GridRow items={row2} />
          </motion.div>

          {/* Row 3: Shoes */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.16 }}
          >
            <GridRow items={row3} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}