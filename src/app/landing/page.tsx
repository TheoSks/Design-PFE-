'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { Logo } from '@/components/ui/Logo';
import {
  IconSparkle,
  IconSearch,
  IconLocation,
  IconBell,
  IconChat,
  IconHome,
  IconBuilding,
  IconLock,
  IconCheck,
  IconPlus,
  IconArrowRight,
  IconStar,
} from '@/components/icons';

/* ── Données ─────────────────────────────────────────────── */

const PARTNERS = ['SeLoger', 'LeBonCoin', 'PAP', 'Bien’ici', 'Logic-Immo', 'Century 21'];

const STEPS = [
  {
    badge: 'Étape 1',
    title: 'Téléchargez l’app',
    text: 'Accédez à des milliers d’annonces vérifiées, partout en France, en temps réel.',
  },
  {
    badge: 'Étape 2',
    title: 'Décrivez votre projet',
    text: 'Dites à notre IA ce que vous cherchez, en langage naturel. Elle fait le reste.',
  },
  {
    badge: 'Étape 3',
    title: 'Trouvez votre chez-vous',
    text: 'Recevez une alerte dès qu’un bien correspond vraiment à vos critères.',
  },
];

const FEATURES = [
  {
    icon: IconSearch,
    title: 'Recherche par IA',
    text: 'Décrivez vos critères en langage naturel, notre IA parcourt les annonces.',
  },
  {
    icon: IconLocation,
    title: 'Carte interactive',
    text: 'Explorez les biens sur la carte et découvrez chaque quartier en détail.',
  },
  {
    icon: IconBell,
    title: 'Alertes intelligentes',
    text: 'Soyez prévenu en premier dès qu’un bien correspond à votre projet.',
  },
  {
    icon: IconLock,
    title: 'Données vérifiées',
    text: 'Des annonces fiables, mises à jour en continu, sans mauvaises surprises.',
  },
];

const TABS = [
  {
    label: 'Recherche conversationnelle',
    title: 'Recherche conversationnelle',
    text: 'Posez votre question comme à un agent : « un 3 pièces lumineux près du centre de Rouen avec un balcon ». L’IA comprend et trouve.',
  },
  {
    label: 'Filtres intelligents',
    title: 'Filtres intelligents',
    text: 'L’IA traduit vos envies en filtres précis : surface, budget, étage, exposition, proximité des transports.',
  },
  {
    label: 'Estimation de prix',
    title: 'Estimation de prix',
    text: 'Découvrez si une annonce est au bon prix grâce à notre estimation basée sur les ventes du quartier.',
  },
  {
    label: 'Quartiers & points d’intérêt',
    title: 'Quartiers & points d’intérêt',
    text: 'Écoles, commerces, transports : visualisez tout ce qui compte autour du bien avant même de visiter.',
  },
];

const PLAN_FEATURES = [
  'Annonces illimitées',
  'Recherche par IA',
  'Alertes en temps réel',
  'Carte interactive',
  'Favoris & projets',
  'Estimations détaillées',
];

const FAQ = [
  {
    q: 'Qu’est-ce que Homely et à qui s’adresse l’app ?',
    a: 'Homely est une application de recherche immobilière augmentée par l’IA. Elle s’adresse à toute personne qui cherche à louer ou acheter un logement sans perdre de temps.',
  },
  {
    q: 'Comment démarrer ?',
    a: 'Téléchargez l’application, décrivez votre projet à notre assistant IA et laissez-le vous proposer les biens les plus pertinents.',
  },
  {
    q: 'Existe-t-il une offre gratuite ?',
    a: 'Oui. Vous pouvez explorer les annonces et utiliser la recherche IA gratuitement. L’abonnement débloque les alertes en temps réel et les estimations détaillées.',
  },
  {
    q: 'Puis-je l’utiliser sur plusieurs appareils ?',
    a: 'Bien sûr. Votre compte est synchronisé entre votre téléphone, votre tablette et le web.',
  },
  {
    q: 'L’application fonctionne-t-elle partout en France ?',
    a: 'Oui, Homely couvre l’ensemble du territoire français et agrège les annonces de nos partenaires.',
  },
  {
    q: 'Mes données sont-elles en sécurité ?',
    a: 'Vos données personnelles sont chiffrées et protégées conformément au RGPD. Nous ne les revendons jamais.',
  },
  {
    q: 'Puis-je annuler mon abonnement à tout moment ?',
    a: 'Oui, l’abonnement est sans engagement et résiliable en un clic depuis votre compte.',
  },
  {
    q: 'Comment contacter le support ?',
    a: 'Notre équipe est joignable directement depuis l’application, par chat ou par e-mail, 7j/7.',
  },
];

const ARTICLES = [
  {
    title: 'Comment l’IA trouve votre logement sans que vous leviez le petit doigt',
    date: '1 mai 2026',
  },
  {
    title: 'Bien estimer un logement : la méthode des professionnels',
    date: '20 mars 2026',
  },
  {
    title: 'Acheter ou louer en 2026 : ce qu’il faut vraiment regarder',
    date: '31 janv. 2026',
  },
];

/* ── Sous-composants ─────────────────────────────────────── */

function Pill({ icon: Icon, children }: { icon: React.ComponentType<{ size?: number }>; children: React.ReactNode }) {
  return (
    <span className={styles.pill}>
      <Icon size={14} />
      {children}
    </span>
  );
}

/* Maquette de téléphone reproduisant l'app Homely */
function PhoneMockup({ className }: { className?: string }) {
  return (
    <div className={`${styles.phone} ${className ?? ''}`}>
      <div className={styles.phoneNotch} />
      <div className={styles.phoneScreen}>
        <div className={styles.phoneTabs}>
          <span className={`${styles.phoneTab} ${styles.phoneTabActive}`}>
            <IconSparkle size={12} /> Filtrer avec IA
          </span>
          <span className={styles.phoneTab}>Résultats</span>
        </div>
        <div className={styles.phoneCardTitle}>Belle luminosité</div>
        <div className={styles.phoneImage}>
          <span className={styles.phoneBadge}>
            <IconSparkle size={10} /> Coup de cœur
          </span>
        </div>
        <div className={styles.phoneMeta}>
          <span>3 pièces · 68 m²</span>
          <strong>249 000 €</strong>
        </div>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────── */

export default function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={styles.page}>
      {/* ── Nav ─────────────────────────────────────────── */}
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.navLogo} aria-label="Accueil">
            <Logo size="sm" />
          </Link>
          <nav className={styles.navLinks}>
            <a href="#fonctionnalites">Fonctionnalités</a>
            <a href="#tarifs">Tarifs</a>
            <a href="#avis">Avis</a>
            <a href="#blog">Blog</a>
          </nav>
          <Link href="/" className={styles.navCta}>Commencer gratuitement</Link>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className={styles.hero}>
        <Pill icon={IconSparkle}>Cherchez · Trouvez · Emménagez</Pill>
        <h1 className={styles.heroTitle}>
          Cherchez. <IconSparkle size={44} className={styles.heroTitleIcon} /> Trouvez.
          <br />Emménagez.
        </h1>
        <p className={styles.heroSubtitle}>
          Décrivez le logement de vos rêves : notre IA parcourt des milliers d&apos;annonces
          et vous présente uniquement celles qui comptent.
        </p>

        <div className={styles.heroShowcase}>
          {/* Carte gauche */}
          <div className={`${styles.showcaseCard} ${styles.showcaseCardLeft}`}>
            <div className={styles.showcaseBg} />
            <div className={styles.showcaseCardBody}>
              <h3>On sait ce que<br />vous cherchez</h3>
              <p>Des recommandations sur-mesure dès votre première recherche, partout en France.</p>
              <Link href="/" className={styles.darkBtn}>Commencer gratuitement</Link>
            </div>
          </div>

          {/* Téléphone centre */}
          <PhoneMockup className={styles.showcasePhone} />

          {/* Carte droite */}
          <div className={`${styles.showcaseCard} ${styles.showcaseCardRight}`}>
            <div className={`${styles.showcaseBg} ${styles.showcaseBgWarm}`} />
            <div className={styles.showcaseCardBody}>
              <h3>Partout en France</h3>
              <p>Des annonces vérifiées de nos partenaires, mises à jour en temps réel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Logos ───────────────────────────────────────── */}
      <section className={styles.logos}>
        <div className={styles.logosRow}>
          {PARTNERS.map((p) => (
            <span key={p} className={styles.logoItem}>{p}</span>
          ))}
        </div>
        <p className={styles.logosCaption}>Adopté par 50 000+ chercheurs de logement partout en France</p>
      </section>

      {/* ── About / Bento ───────────────────────────────── */}
      <section className={styles.about}>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutIntro}>
            <h2 className={styles.aboutTitle}>L&apos;immobilier, version intelligente</h2>
            <p>
              Une seule application pour chercher, comparer et trouver votre futur logement,
              propulsée par l&apos;intelligence artificielle.
            </p>
            <Link href="/" className={styles.darkBtn}>Commencer gratuitement</Link>
          </div>

          <div className={`${styles.bentoCard} ${styles.bentoLarge}`}>
            <div className={`${styles.bentoBg} ${styles.bentoBgGreen}`} />
            <div className={styles.bentoOverlay}>
              <h3>Recherche intelligente</h3>
              <p>Décrivez vos critères en langage naturel, notre IA trouve les biens qui correspondent.</p>
            </div>
          </div>

          <div className={`${styles.bentoCard} ${styles.bentoSmall}`}>
            <div className={`${styles.bentoBg} ${styles.bentoBgWarm}`} />
            <div className={styles.bentoOverlay}>
              <span className={styles.bentoTag}><IconSparkle size={12} /> Résumés IA</span>
              <p>Comprenez chaque annonce d&apos;un coup d&apos;œil grâce aux résumés générés par l&apos;IA.</p>
            </div>
          </div>

          <div className={`${styles.bentoCard} ${styles.bentoSmall}`}>
            <div className={`${styles.bentoBg} ${styles.bentoBgDark}`} />
            <div className={styles.bentoOverlay}>
              <span className={styles.bentoStat}>+12K biens</span>
              <p>Référencés et mis à jour en temps réel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────── */}
      <section className={styles.how}>
        <div className={styles.sectionHead}>
          <Pill icon={IconSparkle}>Fonctionnement</Pill>
          <h2 className={styles.sectionTitle}>Démarrer est très simple&nbsp;!</h2>
          <p className={styles.sectionSub}>
            Trois étapes suffisent pour trouver votre futur logement avec Homely.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          {STEPS.map((s) => (
            <div key={s.title} className={styles.stepCard}>
              <div className={styles.stepVisual}>
                <span className={styles.stepBadge}>{s.badge}</span>
                <div className={styles.stepPhoneHint}>
                  <Logo size="sm" />
                </div>
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section id="fonctionnalites" className={styles.features}>
        <div className={styles.featuresLayout}>
          <div className={styles.featuresLeft}>
            <Pill icon={IconSparkle}>Fonctionnalités</Pill>
            <h2 className={styles.sectionTitle}>Tout ce qu&apos;il faut pour trouver votre logement</h2>
            <p className={styles.sectionSub}>
              Quatre outils puissants, réunis dans une seule application pensée pour vous.
            </p>
            <div className={styles.featuresGrid}>
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <div key={title} className={styles.featureItem}>
                  <span className={styles.featureIcon}><Icon size={18} /></span>
                  <h4>{title}</h4>
                  <p>{text}</p>
                </div>
              ))}
              <div className={styles.featureStat}>
                <span className={styles.featureStatBg} />
                <div>
                  <strong>+25K</strong>
                  <span>Utilisateurs conquis</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.featuresImage}>
            <div className={`${styles.bentoBg} ${styles.bentoBgGreen}`} />
            <div className={styles.featuresImageOverlay}>
              <h3>Visitez sans vous déplacer</h3>
              <p>Photos, plans et visites immersives : explorez chaque bien depuis votre canapé.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tabs ────────────────────────────────────────── */}
      <section className={styles.tabs}>
        <div className={styles.tabsCard}>
          <div className={styles.tabsList}>
            {TABS.map((t, i) => (
              <button
                key={t.label}
                type="button"
                className={`${styles.tabRow} ${i === activeTab ? styles.tabRowActive : ''}`}
                onClick={() => setActiveTab(i)}
              >
                <span className={styles.tabIcon}><IconSparkle size={16} /></span>
                <span className={styles.tabText}>
                  <strong>{t.title}</strong>
                  {i === activeTab && <span className={styles.tabDesc}>{t.text}</span>}
                </span>
              </button>
            ))}
          </div>
          <PhoneMockup className={styles.tabsPhone} />
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────── */}
      <section id="avis" className={styles.testimonials}>
        <div className={styles.sectionHead}>
          <Pill icon={IconStar}>Avis</Pill>
          <h2 className={styles.sectionTitle}>Ce que disent nos utilisateurs</h2>
          <p className={styles.sectionSub}>
            Des locataires aux primo-accédants : ils ont trouvé leur logement avec Homely.
          </p>
        </div>

        <div className={styles.testiGrid}>
          <div className={styles.testiFeatured}>
            <div className={styles.testiAvatar} />
            <h4>Sarah C.</h4>
            <p>« Homely a complètement changé ma recherche. J&apos;ai trouvé mon appartement en une semaine, sans visiter dix biens pour rien. »</p>
            <div className={styles.stars}><Stars /></div>
          </div>

          <div className={styles.testiMid}>
            <div className={styles.testiRating}>
              <span className={styles.testiStoreIcon}><IconHome size={20} /></span>
              <div>
                <strong>4,9 / 5</strong>
                <span>12K+ avis sur les stores</span>
                <div className={styles.starsSmall}><Stars /></div>
              </div>
            </div>
            <div className={styles.testiStats}>
              <div className={styles.testiStat}>
                <strong>98%</strong>
                <span>Satisfaction</span>
              </div>
              <div className={styles.testiStat}>
                <strong>+50K</strong>
                <span>Utilisateurs</span>
              </div>
            </div>
            <div className={styles.testiMini}>
              <div className={styles.testiMiniAvatar} />
              <div>
                <strong>Lilly M.</strong>
                <span>M&apos;a fait gagner des heures.</span>
              </div>
            </div>
          </div>

          <div className={styles.testiCol}>
            <div className={styles.testiMini}>
              <div className={styles.testiMiniAvatar} />
              <div>
                <strong>Léna O.</strong>
                <span>Je ne pourrais plus m&apos;en passer.</span>
              </div>
            </div>
            <div className={styles.testiSide}>
              <div className={styles.testiMiniAvatar} />
              <strong>Marie-Jeanne W.</strong>
              <p>« J&apos;ai déniché un bien rare dans mon quartier avant même qu&apos;il ne sorte sur les autres sites. »</p>
              <div className={styles.starsSmall}><Stars /></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing / FAQ ───────────────────────────────── */}
      <section id="tarifs" className={styles.pricing}>
        <div className={styles.sectionHead}>
          <Pill icon={IconBuilding}>Tarifs</Pill>
          <h2 className={styles.sectionTitle}>Une tarification simple et transparente</h2>
          <p className={styles.sectionSub}>
            Aucun frais caché. Cherchez, comparez et trouvez avec une seule offre.
          </p>
        </div>

        <div className={styles.pricingLayout}>
          <div className={styles.pricingCol}>
            <div className={styles.planCard}>
              <div className={styles.planHead}>
                <span className={styles.planIcon}><IconHome size={20} /></span>
                <h3>Abonnement</h3>
              </div>
              <p className={styles.planDesc}>Pour celles et ceux qui veulent trouver vite et bien.</p>
              <div className={styles.planPrice}>9 €<span>/mois</span></div>
              <Link href="/" className={styles.darkBtn}>Essai gratuit</Link>
              <ul className={styles.planList}>
                {PLAN_FEATURES.map((f) => (
                  <li key={f}><IconCheck size={16} /> {f}</li>
                ))}
              </ul>
            </div>

            <div className={styles.clubCard}>
              <div>
                <h4>Rejoignez le Club Homely</h4>
                <p>Pour les chercheurs les plus exigeants.</p>
              </div>
              <div className={styles.clubAvatars}>
                <span /><span /><span /><span />
                <em>+25K</em>
              </div>
            </div>
          </div>

          <div className={styles.faqCol}>
            {FAQ.map((item, i) => (
              <div key={item.q} className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ''}`}>
                <button
                  type="button"
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {item.q}
                  <IconPlus size={18} />
                </button>
                {openFaq === i && <p className={styles.faqAnswer}>{item.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog ────────────────────────────────────────── */}
      <section id="blog" className={styles.blog}>
        <div className={styles.sectionHead}>
          <Pill icon={IconChat}>Blog</Pill>
          <h2 className={styles.sectionTitle}>Conseils immo de notre équipe</h2>
          <p className={styles.sectionSub}>
            Guides pratiques, tendances du marché et astuces pour réussir votre projet.
          </p>
        </div>

        <div className={styles.blogGrid}>
          {ARTICLES.map((a, i) => (
            <article key={a.title} className={styles.blogCard}>
              <div className={`${styles.blogImage} ${styles[`blogImage${i}` as keyof typeof styles]}`} />
              <h3>{a.title}</h3>
              <span className={styles.blogDate}>{a.date}</span>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className={styles.cta}>
        <div className={styles.ctaBg} />
        <div className={styles.ctaContent}>
          <Pill icon={IconSparkle}>Prêt à emménager&nbsp;?</Pill>
          <h2 className={styles.ctaTitle}>Votre futur chez-vous<br />commence ici.</h2>
          <p className={styles.ctaSub}>
            Rejoignez 50 000+ utilisateurs qui font confiance à Homely pour trouver leur logement,
            plus vite et plus sereinement.
          </p>
          <Link href="/" className={styles.lightBtn}>Commencer gratuitement</Link>
          <PhoneMockup className={styles.ctaPhone} />
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Logo size="md" />
          <p className={styles.footerCopy}>© 2026 Homely · Recherche immobilière augmentée par l&apos;IA</p>
        </div>
      </footer>
    </div>
  );
}

function Stars() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <IconStar key={i} size={14} />
      ))}
    </>
  );
}
