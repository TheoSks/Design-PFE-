'use client';

import React, { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PropertyGallery } from '@/components/ui/PropertyGallery';
import { PropertySpecs } from '@/components/ui/PropertySpecs';
import { PriceBlock } from '@/components/ui/PriceBlock';
import { PromoCard } from '@/components/ui/PromoCard';
import { DetailTable } from '@/components/ui/DetailTable';
import { FeatureList } from '@/components/ui/FeatureList';
import { SpecList } from '@/components/ui/SpecList';
import { EnergyRating } from '@/components/ui/EnergyRating';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MapView } from '@/components/ui/MapView';
import {
  IconCheck,
  IconSearch,
  IconHeart,
} from '@/components/icons';
import { getPropertyById, PROPERTIES } from '@/lib/properties';
import { RENTALS } from '@/lib/rentals';
import { LIFESTYLE, categorizeEnvironnement, computeLifestyleScores } from '@/lib/lifestyle';
import styles from './page.module.css';

export default function AnnoncePage() {
  const params = useParams();
  const allProperties = [...PROPERTIES, ...RENTALS];
  const property = allProperties.find((p) => p.id === (params.id as string));

  const [isFavorite, setIsFavorite] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  if (!property) {
    notFound();
  }

  // Similar properties: same dataset (buy or rent), excluding current
  const similarProperties = allProperties.filter((p) => p.id !== property.id).slice(0, 6);

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Image Gallery */}
          <PropertyGallery
            images={property.images}
            isFavorite={isFavorite}
            onFavoriteToggle={() => setIsFavorite(!isFavorite)}
          />

          {/* Title & Location */}
          <div className={styles.propertyHeader}>
            <h1 className={styles.propertyTitle}>{property.title}</h1>
            <p className={styles.propertyLocation}>{property.location}</p>
          </div>

          {/* Specs Grid */}
          <PropertySpecs specs={property.specs} />

          {/* Price Block + CTA */}
          <PriceBlock
            price={property.price}
            pricePerM2={property.pricePerM2}
          />

          {/* Promo Card */}
          <PromoCard
            title="Vous vendez votre bien ?"
            description="Obtenez une offre 2x plus vite grâce à la Vente Collective."
            linkText="En savoir plus"
            imageSrc="/selling-your-home.webp.svg"
          />

          {/* Description */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Description</h2>
            <div className={styles.description}>
              {(descExpanded ? property.description : property.description.slice(0, 2)).map(
                (p, i) => (
                  <p key={i} className={styles.descriptionParagraph}>{p}</p>
                )
              )}
              {property.description.length > 2 && (
                <button
                  className={styles.readMore}
                  onClick={() => setDescExpanded(!descExpanded)}
                >
                  {descExpanded ? 'Voir moins' : 'Lire plus'}
                </button>
              )}
            </div>
          </section>

          {/* Caractéristiques générales */}
          <DetailTable
            title="Caractéristiques générales"
            rows={property.characteristics}
          />

          {/* Promo Feature List */}
          <FeatureList
            title="Pourquoi acheter avec Label ?"
            items={[
              { icon: <IconCheck size={24} />, label: 'Des biens contrôlés et certifiés' },
              { icon: <IconSearch size={24} />, label: 'Un accompagnement personnalisé' },
              { icon: <IconHeart size={24} />, label: 'Un achat simplifié' },
            ]}
          />

          {/* Spécificités */}
          <SpecList
            title="Spécificités"
            items={property.specificites}
          />

          {/* Performance énergétique */}
          <EnergyRating
            title="Performance énergétique"
            dpeGrade={property.dpe.grade}
            dpeValue={property.dpe.value}
            gesGrade={property.ges.grade}
            gesValue={property.ges.value}
          />

          {/* Copropriété */}
          <DetailTable
            title="Informations sur la copropriété"
            rows={property.copropriete.map((r) => ({ label: r.label, value: r.value }))}
          />

          {/* Localisation */}
          <section className={styles.section}>
            <div className={styles.mapHeader}>
              <h2 className={styles.sectionTitle}>Localisation</h2>
              <div className={styles.mapSubHeader}>
                <span className={styles.mapLocation}>{property.location}</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapLink}
                >
                  Voir sur Google Maps
                </a>
              </div>
            </div>
            <MapView
              lat={property.coordinates.lat}
              lng={property.coordinates.lng}
              className={styles.mapContainer}
            />
          </section>

          {/* Vivre ici — quality of life */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Vivre ici</h2>

            {/* Lifestyle tags */}
            {property.lifestyle && property.lifestyle.length > 0 && (
              <div className={styles.lifestyleTags}>
                {property.lifestyle.map((tag) => (
                  <span key={tag} className={styles.lifestyleTag}>
                    <span className={styles.lifestyleTagEmoji} aria-hidden="true">{LIFESTYLE[tag].emoji}</span>
                    {LIFESTYLE[tag].label}
                  </span>
                ))}
              </div>
            )}

            {/* Scores */}
            {(() => {
              const scores = computeLifestyleScores(property.lifestyle, property.environnement);
              const items: { key: keyof typeof scores; label: string; emoji: string }[] = [
                { key: 'family',    label: 'Familles',    emoji: '👨‍👩‍👧' },
                { key: 'calm',      label: 'Calme',       emoji: '🌿' },
                { key: 'connected', label: 'Transports',  emoji: '🚇' },
                { key: 'green',     label: 'Espaces verts', emoji: '🌳' },
                { key: 'social',    label: 'Vie sociale', emoji: '🍽️' },
              ];
              return (
                <div className={styles.scoresGrid}>
                  {items.map((it) => {
                    const val = scores[it.key];
                    return (
                      <div key={it.key} className={styles.scoreCell}>
                        <span className={styles.scoreEmoji} aria-hidden="true">{it.emoji}</span>
                        <span className={styles.scoreLabel}>{it.label}</span>
                        <div className={styles.scoreBar} aria-hidden="true">
                          <div className={styles.scoreBarFill} style={{ width: `${val * 10}%` }} />
                        </div>
                        <span className={styles.scoreValue}>{val.toFixed(1)}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* Categorized environnement */}
            <div className={styles.envCategories}>
              {categorizeEnvironnement(property.environnement).map((cat) => (
                <div key={cat.key} className={styles.envCategory}>
                  <h3 className={styles.envCategoryTitle}>
                    <span className={styles.envCategoryEmoji} aria-hidden="true">{cat.emoji}</span>
                    {cat.label}
                  </h3>
                  <ul className={styles.envCategoryItems}>
                    {cat.items.map((it) => (
                      <li key={it} className={styles.envCategoryItem}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Une journée ici — narrative timeline */}
            <div className={styles.dayTimeline}>
              <h3 className={styles.dayTimelineTitle}>Une journée ici</h3>
              <ul className={styles.dayTimelineList}>
                <li className={styles.dayTimelineItem}>
                  <span className={styles.dayTime}>8h</span>
                  <span className={styles.dayDescription}>Café du coin à 3 min à pied</span>
                </li>
                <li className={styles.dayTimelineItem}>
                  <span className={styles.dayTime}>12h</span>
                  <span className={styles.dayDescription}>Déjeuner sur le pouce au marché ou en terrasse</span>
                </li>
                <li className={styles.dayTimelineItem}>
                  <span className={styles.dayTime}>18h</span>
                  <span className={styles.dayDescription}>
                    {property.environnement.find((e) => /parc|jardin|plage/i.test(e))
                      ? `Pause détente au ${property.environnement.find((e) => /parc|jardin|plage/i.test(e))}`
                      : 'Balade dans le quartier après le travail'}
                  </span>
                </li>
                <li className={styles.dayTimelineItem}>
                  <span className={styles.dayTime}>20h</span>
                  <span className={styles.dayDescription}>Restaurants et bars à proximité pour finir la soirée</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Détails du prix */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Détails du prix</h2>
            <div className={styles.priceTable}>
              {property.pricingDetails.map((row, i) => (
                <div key={i} className={styles.priceRow}>
                  <span className={styles.priceRowLabel}>{row.label}</span>
                  <span className={styles.priceRowValue}>{row.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Annonceur */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Annonceur</h2>
            <div className={styles.advertiser}>
              <span className={styles.advertiserName}>{property.advertiser.name}</span>
              <span className={styles.advertiserDetail}>{property.advertiser.address}</span>
              <span className={styles.advertiserDetail}>
                Siret : <strong>{property.advertiser.siret}</strong> - N° de carte professionnelle : <strong>{property.advertiser.carte}</strong>
              </span>
            </div>
          </section>

          {/* Référence */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>A propos de cette annonce</h2>
            <div className={styles.priceRow}>
              <span className={styles.priceRowLabel}>Référence</span>
              <span className={styles.priceRowValue}>{property.reference}</span>
            </div>
          </section>

          {/* Risques */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Risques naturels et technologiques</h2>
            <p className={styles.riskText}>
              Les informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr
            </p>
          </section>
        </div>

        {/* Similar Properties */}
        <section className={styles.similarSection}>
          <h2 className={styles.similarTitle}>Ces biens pourraient vous intéresser</h2>
          <div className={styles.similarGrid}>
            {similarProperties.map((prop) => (
              <Card
                key={prop.id}
                images={prop.images}
                imageAlt={prop.cardTitle}
                title={prop.cardTitle}
                location={prop.cardLocation}
                price={prop.cardPrice}
                features={prop.cardFeatures}
                badge={<Badge variant="ia" color={prop.badgeColor}>{prop.badgeLabel ?? 'Label'}</Badge>}
                href={`/annonce/${prop.id}`}
              />
            ))}
          </div>
        </section>

        {/* Promo Banner */}
        <section className={styles.promoBanner}>
          <h2 className={styles.promoTitle}>Vous vendez votre bien ?</h2>
          <p className={styles.promoSubtitle}>
            {`Label s'occupe de tout, à vous d'imaginer la suite !`}
          </p>
          <p className={styles.promoText}>
            Démarrez votre projet en quelques clics et projetez vous sereinement dans votre nouvelle vie.
          </p>
          <button className={styles.promoButton}>
            Faire estimer mon bien
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
