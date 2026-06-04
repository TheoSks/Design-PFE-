'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import styles from './page.module.css';
import { Logo } from '@/components/ui/Logo';
import { Preloader, PRELOADER_MS } from './_components/Preloader';
import { Reveal } from './_components/Reveal';
import { CountUp } from './_components/CountUp';
import { Magnetic } from './_components/Magnetic';
import { PhoneMockup } from './_components/PhoneMockup';
import { ScrollProgress } from './_components/ScrollProgress';
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
  IconChevronLeft,
  IconStar,
} from '@/components/icons';

/* ── Données ─────────────────────────────────────────────── */

const PARTNERS = ['SeLoger', 'LeBonCoin', 'PAP', 'Bien’ici', 'Logic-Immo', 'Century 21'];

const STEPS = [
  {
    badge: 'Étape 1',
    title: 'Téléchargez l’app',
    text: 'Accédez à des milliers d’annonces vérifiées, partout en France, en temps réel.',
    img: '/landing/step-1.jpg',
  },
  {
    badge: 'Étape 2',
    title: 'Décrivez votre projet',
    text: 'Dites à notre IA ce que vous cherchez, en langage naturel. Elle fait le reste.',
    img: '/landing/step-2.jpg',
  },
  {
    badge: 'Étape 3',
    title: 'Trouvez votre chez-vous',
    text: 'Recevez une alerte dès qu’un bien correspond vraiment à vos critères.',
    img: '/landing/step-3.jpg',
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

/* Vrais écrans de l'app Homely, alignés sur l'ordre des onglets ci-dessus. */
const APP_SHOTS = [
  '/landing/app-chat.jpg',    // Recherche conversationnelle
  '/landing/app-achat.jpg',   // Filtres intelligents
  '/landing/app-annonce.jpg', // Estimation de prix
  '/landing/app-carte.jpg',   // Quartiers & points d'intérêt
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
    img: '/landing/blog-0.jpg',
  },
  {
    title: 'Bien estimer un logement : la méthode des professionnels',
    date: '20 mars 2026',
    img: '/landing/blog-1.jpg',
  },
  {
    title: 'Acheter ou louer en 2026 : ce qu’il faut vraiment regarder',
    date: '31 janv. 2026',
    img: '/landing/blog-2.jpg',
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

/* ── Page ────────────────────────────────────────────────── */

export default function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState(0);
  const reduce = useReducedMotion();

  /* Délai de base : l'entrée du hero s'enchaîne avec la levée du preloader. */
  const heroBase = reduce ? 0 : PRELOADER_MS / 1000;

  /* Propriétés de révélation au scroll (non-hook, réutilisable dans les .map). */
  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  const heroIntro: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: heroBase } },
  };
  const heroItem: Variants = {
    hidden: { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div className={styles.page}>
      <Preloader />
      <ScrollProgress />

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
          <Magnetic strength={0.25}>
            <Link href="/" className={styles.navCta}>Commencer gratuitement</Link>
          </Magnetic>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroAura} aria-hidden />

        <motion.div
          className={styles.heroIntro}
          variants={heroIntro}
          initial={reduce ? false : 'hidden'}
          animate="show"
        >
          <motion.div variants={heroItem}>
            <Pill icon={IconSparkle}>Cherchez · Trouvez · Emménagez</Pill>
          </motion.div>
          <motion.h1 className={styles.heroTitle} variants={heroItem}>
            <span className={styles.heroTitleLine}>
              Cherchez.<img src="/logo.svg" alt="" className={styles.heroTitleIcon} />Trouvez.
            </span>
            <span className={styles.heroTitleLine}>Emménagez.</span>
          </motion.h1>
          <motion.p className={styles.heroSubtitle} variants={heroItem}>
            Décrivez le logement de vos rêves : notre IA parcourt des milliers d&apos;annonces
            et vous présente uniquement celles qui comptent.
          </motion.p>
        </motion.div>

        <Reveal className={styles.heroShowcase} entrance delay={heroBase + 0.45}>
          {/* Bloc gauche — carte blanche */}
          <div className={styles.heroLeftCard}>
            <h3 className={styles.heroLeftTitle}>On sait ce que vous cherchez</h3>
            <div className={styles.heroAvatars}>
              <img src="/landing/av1.png" alt="" />
              <img src="/landing/av2.png" alt="" />
              <img src="/landing/av3.png" alt="" />
              <img src="/landing/av4.png" alt="" />
              <em>+25K</em>
            </div>
            <p className={styles.heroLeftText}>
              Notre IA apprend de vos critères et affine chaque recherche pour vous proposer
              les biens qui vous correspondent, partout en France.
            </p>
            <Magnetic>
              <Link href="/" className={styles.darkBtn}>Commencer gratuitement</Link>
            </Magnetic>
          </div>

          {/* Téléphone centre — vrai écran de l'app Homely dans un mockup iPhone réaliste */}
          <PhoneMockup className={styles.heroPhone} screen="/landing/app-home.jpg" />

          {/* Bloc droit — image + texte + flèches */}
          <div className={styles.heroRightCard}>
            <div className={styles.heroRightImage}>
              <img src="/landing/hero-right.png" alt="Recherche immobilière depuis mobile" />
            </div>
            <h3 className={styles.heroRightTitle}>Partout en France</h3>
            <p className={styles.heroRightText}>
              Des annonces vérifiées, mises à jour en temps réel.
            </p>
            <div className={styles.heroArrows}>
              <button type="button" aria-label="Précédent"><IconChevronLeft size={18} /></button>
              <button type="button" aria-label="Suivant"><IconArrowRight size={18} /></button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Logos ───────────────────────────────────────── */}
      <section className={styles.logos}>
        <div className={styles.logosViewport}>
          <div className={styles.logosTrack}>
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <span key={`${p}-${i}`} className={styles.logoItem} aria-hidden={i >= PARTNERS.length}>{p}</span>
            ))}
          </div>
        </div>
        <p className={styles.logosCaption}>Adopté par 50 000+ chercheurs de logement partout en France</p>
      </section>

      {/* ── About / Bento ───────────────────────────────── */}
      <section className={styles.about}>
        <div className={styles.aboutGrid}>
          <motion.div className={styles.aboutIntro} {...reveal()}>
            <h2 className={styles.aboutTitle}>L&apos;immobilier, version intelligente</h2>
            <p>
              Une seule application pour chercher, comparer et trouver votre futur logement,
              propulsée par l&apos;intelligence artificielle.
            </p>
            <Magnetic>
              <Link href="/" className={styles.darkBtn}>Commencer gratuitement</Link>
            </Magnetic>
          </motion.div>

          <motion.div className={`${styles.bentoCard} ${styles.bentoLarge}`} {...reveal(0.05)}>
            <img src="/landing/bento-search.jpg" alt="Intérieur lumineux d’un appartement" className={styles.bentoImg} />
            <div className={`${styles.bentoScrim} ${styles.scrimBrand}`} />
            <div className={styles.bentoOverlay}>
              <h3>Recherche intelligente</h3>
              <p>Décrivez vos critères en langage naturel, notre IA trouve les biens qui correspondent.</p>
            </div>
          </motion.div>

          <motion.div className={`${styles.bentoCard} ${styles.bentoSmall}`} {...reveal(0.12)}>
            <img src="/landing/bento-summary.jpg" alt="Salon chaleureux" className={styles.bentoImg} />
            <div className={styles.bentoScrim} />
            <div className={styles.bentoOverlay}>
              <span className={styles.bentoTag}><IconSparkle size={12} /> Résumés IA</span>
              <p>Comprenez chaque annonce d&apos;un coup d&apos;œil grâce aux résumés générés par l&apos;IA.</p>
            </div>
          </motion.div>

          <motion.div className={`${styles.bentoCard} ${styles.bentoSmall}`} {...reveal(0.18)}>
            <img src="/landing/bento-city.jpg" alt="Immeubles en ville au crépuscule" className={styles.bentoImg} />
            <div className={styles.bentoScrim} />
            <div className={styles.bentoOverlay}>
              <span className={styles.bentoStat}>
                <CountUp to={12} prefix="+" suffix="K biens" />
              </span>
              <p>Référencés et mis à jour en temps réel.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────── */}
      <section className={styles.how}>
        <Reveal className={styles.sectionHead}>
          <Pill icon={IconSparkle}>Fonctionnement</Pill>
          <h2 className={styles.sectionTitle}>Démarrer est très simple&nbsp;!</h2>
          <p className={styles.sectionSub}>
            Trois étapes suffisent pour trouver votre futur logement avec Homely.
          </p>
        </Reveal>

        <div className={styles.stepsGrid}>
          {STEPS.map((s, i) => (
            <motion.div key={s.title} className={styles.stepCard} {...reveal(i * 0.1)}>
              <div className={styles.stepVisual}>
                <img src={s.img} alt="" className={styles.stepImg} />
                <span className={styles.stepBadge}>{s.badge}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section id="fonctionnalites" className={styles.features}>
        <div className={styles.featuresLayout}>
          <motion.div className={styles.featuresLeft} {...reveal()}>
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
                <img src="/landing/bento-city.jpg" alt="" className={styles.featureStatImg} />
                <span className={styles.featureStatScrim} />
                <div>
                  <strong><CountUp to={25} prefix="+" suffix="K" /></strong>
                  <span>Utilisateurs conquis</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className={styles.featuresImage} {...reveal(0.1)}>
            <img src="/landing/feat-visit.jpg" alt="Intérieur d’un logement à visiter" className={styles.featuresImageImg} />
            <div className={styles.featuresImageScrim} />
            <div className={styles.featuresImageOverlay}>
              <h3>Visitez sans vous déplacer</h3>
              <p>Photos, plans et visites immersives : explorez chaque bien depuis votre canapé.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Tabs ────────────────────────────────────────── */}
      <section className={styles.tabs}>
        <Reveal className={styles.tabsCard}>
          <div className={styles.tabsList}>
            {TABS.map((t, i) => (
              <button
                key={t.label}
                type="button"
                className={`${styles.tabRow} ${i === activeTab ? styles.tabRowActive : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {i === activeTab && (
                  <motion.span
                    layoutId="tabHighlight"
                    className={styles.tabHL}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className={styles.tabIcon}><IconSparkle size={16} /></span>
                <span className={styles.tabText}>
                  <strong>{t.title}</strong>
                  {i === activeTab && (
                    <motion.span
                      className={styles.tabDesc}
                      initial={reduce ? false : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {t.text}
                    </motion.span>
                  )}
                </span>
              </button>
            ))}
          </div>
          <PhoneMockup className={styles.tabsPhone} screens={APP_SHOTS} activeTab={activeTab} />
        </Reveal>
      </section>

      {/* ── Testimonials ────────────────────────────────── */}
      <section id="avis" className={styles.testimonials}>
        <Reveal className={styles.sectionHead}>
          <Pill icon={IconStar}>Avis</Pill>
          <h2 className={styles.sectionTitle}>Ce que disent nos utilisateurs</h2>
          <p className={styles.sectionSub}>
            Des locataires aux primo-accédants : ils ont trouvé leur logement avec Homely.
          </p>
        </Reveal>

        <div className={styles.testiGrid}>
          {/* Avis vedette */}
          <motion.figure className={styles.testiFeatured} {...reveal()}>
            <span className={styles.quoteMark} aria-hidden>&ldquo;</span>
            <blockquote className={styles.testiFeaturedQuote}>
              Homely a complètement changé ma recherche. J&apos;ai trouvé mon
              appartement en une semaine, sans visiter dix biens pour rien.
            </blockquote>
            <figcaption className={styles.testiPerson}>
              <img src="/landing/face-1.jpg" alt="Sarah Caron" className={styles.testiAvatar} />
              <span className={styles.testiName}>
                <strong>Sarah Caron <span className={styles.verified}><IconCheck size={11} /></span></strong>
                <span>Locataire à Lyon</span>
              </span>
              <span className={styles.starsSmall}><Stars /></span>
            </figcaption>
          </motion.figure>

          {/* Note & statistiques Homely */}
          <motion.div className={styles.testiMid} {...reveal(0.08)}>
            <div className={styles.testiRating}>
              <div className={styles.testiRatingTop}>
                <strong><CountUp to={4.9} decimals={1} /></strong>
                <span className={styles.stars}><Stars /></span>
              </div>
              <span className={styles.testiRatingLabel}>Note moyenne · App&nbsp;Store &amp; Google&nbsp;Play</span>
              <span className={styles.testiRatingSub}>Plus de 12&nbsp;000 avis sur Homely</span>
            </div>
            <div className={styles.testiStats}>
              <div className={styles.testiStat}>
                <strong><CountUp to={98} suffix="%" /></strong>
                <span>Satisfaction</span>
              </div>
              <div className={styles.testiStat}>
                <strong><CountUp to={50} prefix="+" suffix="K" /></strong>
                <span>Utilisateurs</span>
              </div>
            </div>
            <div className={styles.testiMini}>
              <img src="/landing/face-2.jpg" alt="Lilly Mercier" className={styles.testiMiniAvatar} />
              <div>
                <strong>Lilly Mercier</strong>
                <span>Primo-accédante, Rouen</span>
              </div>
              <span className={styles.starsSmall}><Stars /></span>
            </div>
          </motion.div>

          {/* Avis secondaires */}
          <motion.div className={styles.testiCol} {...reveal(0.16)}>
            <figure className={styles.testiSide}>
              <figcaption className={styles.testiPerson}>
                <img src="/landing/face-3.jpg" alt="Léna Ohayon" className={styles.testiMiniAvatar} />
                <span className={styles.testiName}>
                  <strong>Léna Ohayon</strong>
                  <span>A acheté à Nantes</span>
                </span>
              </figcaption>
              <blockquote>Je ne pourrais plus m&apos;en passer : l&apos;IA comprend vraiment ce que je cherche.</blockquote>
              <span className={styles.starsSmall}><Stars /></span>
            </figure>
            <figure className={styles.testiSide}>
              <figcaption className={styles.testiPerson}>
                <img src="/landing/face-4.jpg" alt="Marie-Jeanne Wagner" className={styles.testiMiniAvatar} />
                <span className={styles.testiName}>
                  <strong>Marie-Jeanne Wagner</strong>
                  <span>Propriétaire, Bordeaux</span>
                </span>
              </figcaption>
              <blockquote>J&apos;ai déniché un bien rare dans mon quartier avant même qu&apos;il ne sorte ailleurs.</blockquote>
              <span className={styles.starsSmall}><Stars /></span>
            </figure>
          </motion.div>
        </div>
      </section>

      {/* ── Pricing / FAQ ───────────────────────────────── */}
      <section id="tarifs" className={styles.pricing}>
        <Reveal className={styles.sectionHead}>
          <Pill icon={IconBuilding}>Tarifs</Pill>
          <h2 className={styles.sectionTitle}>Une tarification simple et transparente</h2>
          <p className={styles.sectionSub}>
            Aucun frais caché. Cherchez, comparez et trouvez avec une seule offre.
          </p>
        </Reveal>

        <div className={styles.pricingLayout}>
          <div className={styles.pricingCol}>
            <motion.div className={styles.planCard} {...reveal()}>
              <div className={styles.planHead}>
                <span className={styles.planIcon}><IconHome size={20} /></span>
                <h3>Abonnement</h3>
              </div>
              <p className={styles.planDesc}>Pour celles et ceux qui veulent trouver vite et bien.</p>
              <div className={styles.planPrice}>9 €<span>/mois</span></div>
              <Magnetic>
                <Link href="/" className={styles.darkBtn}>Essai gratuit</Link>
              </Magnetic>
              <ul className={styles.planList}>
                {PLAN_FEATURES.map((f) => (
                  <li key={f}><IconCheck size={16} /> {f}</li>
                ))}
              </ul>
            </motion.div>

            <motion.div className={styles.clubCard} {...reveal(0.08)}>
              <div>
                <h4>Rejoignez le Club Homely</h4>
                <p>Pour les chercheurs les plus exigeants.</p>
              </div>
              <div className={styles.clubAvatars}>
                <span /><span /><span /><span />
                <em>+25K</em>
              </div>
            </motion.div>
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
        <Reveal className={styles.sectionHead}>
          <Pill icon={IconChat}>Blog</Pill>
          <h2 className={styles.sectionTitle}>Conseils immo de notre équipe</h2>
          <p className={styles.sectionSub}>
            Guides pratiques, tendances du marché et astuces pour réussir votre projet.
          </p>
        </Reveal>

        <div className={styles.blogGrid}>
          {ARTICLES.map((a, i) => (
            <motion.article key={a.title} className={styles.blogCard} {...reveal(i * 0.1)}>
              <div className={styles.blogImage}>
                <img src={a.img} alt="" className={styles.blogImg} />
              </div>
              <h3>{a.title}</h3>
              <span className={styles.blogDate}>{a.date}</span>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className={styles.cta}>
        <div className={styles.ctaBg} />
        <div className={styles.ctaAura} aria-hidden />
        <div className={styles.ctaContent}>
          <Reveal>
            <Pill icon={IconSparkle}>Prêt à emménager&nbsp;?</Pill>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className={styles.ctaTitle}>Votre futur chez-vous<br />commence ici.</h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className={styles.ctaSub}>
              Rejoignez 50 000+ utilisateurs qui font confiance à Homely pour trouver leur logement,
              plus vite et plus sereinement.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <Magnetic>
              <Link href="/" className={styles.lightBtn}>Commencer gratuitement</Link>
            </Magnetic>
          </Reveal>

          <div className={styles.ctaStage}>
            {/* Annonces réelles flottantes autour du téléphone */}
            <Reveal className={`${styles.ctaCardPos} ${styles.ctaCardLeft}`} delay={0.3}>
              <motion.div
                className={styles.ctaCard}
                animate={reduce ? undefined : { y: [0, -12, 0] }}
                transition={reduce ? undefined : { duration: 5.5, ease: 'easeInOut', repeat: Infinity }}
              >
                <img src="/landing/feat-visit.jpg" alt="Appartement à Lyon" />
                <div className={styles.ctaCardBody}>
                  <strong>Appartement lumineux</strong>
                  <span>Lyon 6e · 3 pièces</span>
                  <em>329 000 €</em>
                </div>
              </motion.div>
            </Reveal>

            <PhoneMockup className={styles.ctaPhone} screen="/landing/app-achat.jpg" />

            <Reveal className={`${styles.ctaCardPos} ${styles.ctaCardRight}`} delay={0.42}>
              <motion.div
                className={styles.ctaCard}
                animate={reduce ? undefined : { y: [0, -16, 0] }}
                transition={reduce ? undefined : { duration: 6.5, ease: 'easeInOut', repeat: Infinity, delay: 0.4 }}
              >
                <img src="/landing/bento-summary.jpg" alt="Studio dans le Marais" />
                <div className={styles.ctaCardBody}>
                  <strong>Studio rénové</strong>
                  <span>Paris 4e · Le Marais</span>
                  <em>1 150 €/mois</em>
                </div>
              </motion.div>
            </Reveal>
          </div>
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
  const reduce = useReducedMotion();
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-flex' }}
          initial={reduce ? false : { opacity: 0, scale: 0.3, rotate: -30 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ delay: i * 0.08, type: 'spring', stiffness: 380, damping: 14 }}
        >
          <IconStar size={14} />
        </motion.span>
      ))}
    </>
  );
}
