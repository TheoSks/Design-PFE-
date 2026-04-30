'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { IconGoogle, IconApple, IconPhone, IconMail, IconX } from '@/components/icons';

type Mode = 'phone' | 'email';

const COUNTRIES = [
  { code: 'FR', label: 'France', dial: '+33' },
  { code: 'BE', label: 'Belgique', dial: '+32' },
  { code: 'CH', label: 'Suisse', dial: '+41' },
  { code: 'LU', label: 'Luxembourg', dial: '+352' },
  { code: 'CA', label: 'Canada', dial: '+1' },
  { code: 'US', label: 'États-Unis', dial: '+1' },
  { code: 'GB', label: 'Royaume-Uni', dial: '+44' },
];

export default function ComptePage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('phone');
  const [country, setCountry] = useState('FR');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const isValid = mode === 'phone' ? phone.replace(/\D/g, '').length >= 6 : /\S+@\S+\.\S+/.test(email);

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    router.push('/inscription');
  }

  return (
    <div className={styles.page}>

      {/* Header */}
      <header className={styles.header}>
        <button
          className={styles.closeButton}
          type="button"
          aria-label="Fermer"
          onClick={() => router.push('/')}
        >
          <IconX size={20} />
        </button>
        <h1 className={styles.headerTitle}>Connexion ou inscription</h1>
        <div className={styles.headerSpacer} />
      </header>

      <div className={styles.content}>

        <h2 className={styles.welcome}>Bienvenue sur Label Immo</h2>

        <form className={styles.form} onSubmit={handleContinue} noValidate>

          {mode === 'phone' && (
            <div className={styles.phoneGroup}>
              <div className={styles.countryField}>
                <label className={styles.miniLabel}>Pays / Région</label>
                <select
                  className={styles.countrySelect}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label} ({c.dial})
                    </option>
                  ))}
                </select>
              </div>
              <Input
                inputType="tel"
                placeholder="Numéro de téléphone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
              <p className={styles.hint}>
                Nous vous appellerons ou enverrons un SMS pour confirmer votre numéro. Tarifs standards applicables.
              </p>
            </div>
          )}

          {mode === 'email' && (
            <Input
              inputType="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          )}

          <Button
            type="submit"
            variant="brand"
            disabled={!isValid}
            className={styles.continueButton}
          >
            Continuer
          </Button>
        </form>

        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>ou</span>
          <span className={styles.dividerLine} />
        </div>

        <div className={styles.social}>
          {mode === 'phone' ? (
            <button
              type="button"
              className={styles.socialButton}
              onClick={() => setMode('email')}
            >
              <IconMail size={20} />
              Continuer avec un e-mail
            </button>
          ) : (
            <button
              type="button"
              className={styles.socialButton}
              onClick={() => setMode('phone')}
            >
              <IconPhone size={20} />
              Continuer avec un téléphone
            </button>
          )}
          <button type="button" className={styles.socialButton}>
            <IconApple size={20} />
            Continuer avec Apple
          </button>
          <button type="button" className={styles.socialButton}>
            <IconGoogle size={20} />
            Continuer avec Google
          </button>
        </div>

        <p className={styles.legal}>
          En continuant, vous acceptez nos{' '}
          <Link href="#" className={styles.legalLink}>Conditions d&apos;utilisation</Link>
          {' '}et notre{' '}
          <Link href="#" className={styles.legalLink}>Politique de confidentialité</Link>.
        </p>

      </div>
    </div>
  );
}
