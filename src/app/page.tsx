'use client';

import styles from './page.module.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AISearchInput } from '@/components/ui/AISearchInput';
import { CardCarousel } from '@/components/ui/CardCarousel';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PROPERTIES } from '@/lib/properties';

const sections = [
  { title: 'Belle luminosité', cards: [PROPERTIES[0], PROPERTIES[1], PROPERTIES[2]] },
  { title: 'Maison proche RER dans les Yvelines', cards: [PROPERTIES[1], PROPERTIES[0], PROPERTIES[2]] },
  { title: 'Vue mer', cards: [PROPERTIES[2], PROPERTIES[0], PROPERTIES[1]] },
  { title: 'Belle luminosité', cards: [PROPERTIES[0], PROPERTIES[2], PROPERTIES[1]] },
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
            {section.cards.map((property, j) => (
              <Card
                key={j}
                images={property.images}
                imageAlt={property.cardTitle}
                badge={<Badge variant="ia">Label</Badge>}
                title={property.cardTitle}
                location={property.cardLocation}
                price={property.cardPrice}
                features={property.cardFeatures}
                href={`/annonce/${property.id}`}
              />
            ))}
          </CardCarousel>
        ))}
      </div>

      <Footer />
    </div>
  );
}
