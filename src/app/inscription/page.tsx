'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { IconChevronLeft } from '@/components/icons';
import { useUser } from '@/lib/UserContext';

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - 18 - i);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function InscriptionStep1() {
  const router = useRouter();
  const { saveUser } = useUser();
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [marketing, setMarketing] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveUser({ prenom, nom, email });
    router.push('/inscription/communaute');
  }

  return (
    <div className={styles.page}>

      <header className={styles.header}>
        <button
          className={styles.backButton}
          type="button"
          aria-label="Retour"
          onClick={() => router.back()}
        >
          <IconChevronLeft size={20} />
        </button>
        <h1 className={styles.headerTitle}>Finaliser l&apos;inscription</h1>
        <div className={styles.headerSpacer} />
      </header>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>

        <div className={styles.fieldGroup}>
          <Input
            inputType="text"
            placeholder="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            autoComplete="given-name"
          />
          <Input
            inputType="text"
            placeholder="Nom de famille"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            autoComplete="family-name"
          />
          <p className={styles.hint}>
            Assurez-vous qu&apos;il correspond au nom sur votre pièce d&apos;identité.
          </p>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Date de naissance</label>
          <div className={styles.birthdayRow}>
            <select
              className={styles.dateSelect}
              value={day}
              onChange={(e) => setDay(e.target.value)}
              required
            >
              <option value="" disabled>Jour</option>
              {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select
              className={styles.dateSelect}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            >
              <option value="" disabled>Mois</option>
              {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
            <select
              className={styles.dateSelect}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            >
              <option value="" disabled>Année</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <p className={styles.hint}>
            Vous devez avoir au moins 18 ans pour vous inscrire. Votre date de naissance ne sera pas partagée avec d&apos;autres utilisateurs.
          </p>
        </div>

        <div className={styles.fieldGroup}>
          <Input
            inputType="email"
            placeholder="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <p className={styles.hint}>
            Nous vous enverrons des confirmations de vos annonces et reçus par e-mail.
          </p>
        </div>

        <Input
          inputType="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <p className={styles.terms}>
          En sélectionnant <strong>Accepter et continuer</strong>, j&apos;accepte les{' '}
          <Link href="#" className={styles.termsLink}>Conditions d&apos;utilisation</Link>{' '}
          de Homely et je reconnais la{' '}
          <Link href="#" className={styles.termsLink}>Politique de confidentialité</Link>.
        </p>

        <Button type="submit" variant="brand" className={styles.submitButton}>
          Accepter et continuer
        </Button>

        <div className={styles.marketingBlock}>
          <p className={styles.marketingText}>
            Homely vous enverra des offres réservées aux membres, de l&apos;inspiration et des e-mails marketing.
            Vous pouvez vous désinscrire à tout moment dans les paramètres de votre compte.
          </p>
          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
            />
            <span className={styles.checkboxLabel}>
              Je ne souhaite pas recevoir de messages marketing de Label.
            </span>
          </label>
        </div>

      </form>
    </div>
  );
}
