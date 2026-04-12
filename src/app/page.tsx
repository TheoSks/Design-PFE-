'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AISearchInput } from '@/components/ui/AISearchInput';
import { CardCarousel } from '@/components/ui/CardCarousel';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SECTIONS } from '@/lib/sections';

export default function Home() {
  const router = useRouter();

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
        {SECTIONS.map((section, i) => (
          <CardCarousel key={i} title={section.title} onSeeAll={() => router.push(`/rubrique/${section.slug}`)}>
            {section.cards.map((property, j) => (
              <Card
                key={j}
                images={property.images}
                imageAlt={property.cardTitle}
                badge={<Badge variant="ia" color={property.badgeColor}>{property.badgeLabel ?? 'Label'}</Badge>}
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
