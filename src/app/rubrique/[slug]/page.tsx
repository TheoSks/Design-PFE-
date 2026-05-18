'use client';

import { useParams, notFound } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PropertyMap } from '@/components/ui/Map';
import { getSectionBySlug } from '@/lib/sections';
import { IconChevronLeft } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import styles from './page.module.css';

export default function RubriquePage() {
  const params = useParams();
  const router = useRouter();
  const section = getSectionBySlug(params.slug as string);

  if (!section) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <Button
              variant="tertiary"
              iconLeft={<IconChevronLeft size={16} />}
              onClick={() => router.back()}
              className={styles.backButton}
            >
              Retour
            </Button>
            <h1 className={styles.title}>{section.title}</h1>
            <p className={styles.count}>{section.cards.length} annonce{section.cards.length > 1 ? 's' : ''}</p>
          </div>

          <div className={styles.miniMap}>
            <PropertyMap properties={section.cards} />
          </div>

          <div className={styles.grid}>
            {section.cards.map((property, i) => (
              <Card
                key={i}
                images={property.images}
                imageAlt={property.cardTitle}
                badge={<Badge variant="ia" color={property.badgeColor}>{property.badgeLabel ?? 'Label'}</Badge>}
                title={property.cardTitle}
                location={property.cardLocation}
                price={property.cardPrice}
                features={property.cardFeatures}
                lifestyle={property.lifestyle}
                href={`/annonce/${property.id}`}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
