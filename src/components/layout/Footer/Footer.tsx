'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { Logo } from '@/components/ui/Logo';
import { Input } from '@/components/ui/Input';
import { IconArrowRight } from '@/components/icons';
import { cn } from '@/lib/cn';

const footerLinks = {
  about: [
    'Notre histoire',
    'L\'équipe',
    'Carrières',
    'Presse',
    'Blog',
    'Contact',
  ],
  discover: ['Recherche IA'],
  legal: ['Mentions légales', 'CGU', 'Politique de confidentialité'],
};

export function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <Logo size="md" />
        </div>

        {/* Newsletter */}
        <div className={styles.newsletter}>
          <h3 className={styles.newsletterTitle}>
            Recevez des conseils d&apos;experts et nos dernières actualités
          </h3>
          <Input
            inputType="email"
            placeholder="Votre adresse e-mail"
            className={styles.newsletterInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            iconRight={
              <button
                type="button"
                className={cn(styles.submitButton, email.trim() && styles.submitButtonVisible)}
                aria-label="S'inscrire"
              >
                <IconArrowRight size={16} />
              </button>
            }
          />
        </div>

        {/* Link columns */}
        <div className={styles.linksGrid}>
          <div className={styles.linkColumn}>
            <h4 className={styles.linkHeading}>À propos</h4>
            <ul className={styles.linkList}>
              {footerLinks.about.map((link) => (
                <li key={link}>
                  <a href="#" className={styles.link}>{link}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.linkColumn}>
            <h4 className={styles.linkHeading}>Découvrir</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/landing" className={styles.link}>Découvrir l&apos;app</Link>
              </li>
              {footerLinks.discover.map((link) => (
                <li key={link}>
                  <a href="#" className={styles.link}>{link}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.linkColumn}>
            <h4 className={styles.linkHeading}>Légal</h4>
            <ul className={styles.linkList}>
              {footerLinks.legal.map((link) => (
                <li key={link}>
                  <a href="#" className={styles.link}>{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Address */}
        <div className={styles.address}>
          <p>123 Avenue des Champs-Élysées, 75008 Paris</p>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <p className={styles.privacy}>
            Vos données personnelles sont protégées conformément au RGPD.
          </p>
          <p className={styles.copyright}>© 2026 Application Théo</p>
        </div>
      </div>
    </footer>
  );
}
