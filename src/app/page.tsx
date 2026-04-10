'use client';

import styles from './page.module.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AISearchInput } from '@/components/ui/AISearchInput';
import { CardCarousel } from '@/components/ui/CardCarousel';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

/* ── Fake data for demo cards ──────────────────────────────── */
const demoCard = {
  images: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=640&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=640&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=640&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=640&q=80',
  ],
  title: 'Appartement lumineux avec terrasse',
  location: 'Paris 11e, Île-de-France',
  price: '120.000 €',
  features: [{ label: '3 pièces' }, { label: '65 m²' }],
};

const demoCard2 = {
  images: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=640&q=80',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=640&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=640&q=80',
  ],
  title: 'Maison familiale avec jardin',
  location: 'Versailles, Yvelines',
  price: '350.000 €',
  features: [{ label: '5 pièces' }, { label: '120 m²' }],
};

const demoCard3 = {
  images: [
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=640&q=80',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=640&q=80',
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=640&q=80',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=640&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=640&q=80',
  ],
  title: 'Villa vue mer panoramique',
  location: 'Nice, Alpes-Maritimes',
  price: '890.000 €',
  features: [{ label: '7 pièces' }, { label: '280 m²' }],
};

const sections = [
  { title: 'Belle luminosité', cards: [demoCard, demoCard2, demoCard3] },
  { title: 'Maison proche RER dans les Yvelines', cards: [demoCard2, demoCard, demoCard3] },
  { title: 'Vue mer', cards: [demoCard3, demoCard, demoCard2] },
  { title: 'Belle luminosité', cards: [demoCard, demoCard3, demoCard2] },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Trouvez votre futur <span className={styles.heroBrand}>chez-vous.</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Découvrez nos biens exclusifs et ceux de nos partenaires, partout en France.
        </p>
        <AISearchInput />
      </section>

      <div className={styles.sections}>
        {sections.map((section, i) => (
          <CardCarousel key={i} title={section.title} onSeeAll={() => {}}>
            {section.cards.map((card, j) => (
              <Card
                key={j}
                images={card.images}
                imageAlt={card.title}
                badge={<Badge variant="ia">Label</Badge>}
                title={card.title}
                location={card.location}
                price={card.price}
                features={card.features}
              />
            ))}
          </CardCarousel>
        ))}
      </div>

      <Footer />
    </div>
  );
}
