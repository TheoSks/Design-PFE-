'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { Input } from '@/components/ui/Input';
import {
  IconChevronLeft,
  IconMail,
  IconPhone,
  IconLock,
  IconBell,
  IconHeart,
  IconLocation,
  IconUser,
} from '@/components/icons';
import { useUser } from '@/lib/UserContext';

export default function MonComptePage() {
  const router = useRouter();
  const { user, updateUser, clearUser } = useUser();

  const [prenom, setPrenom] = useState(user?.prenom ?? '');
  const [nom, setNom] = useState(user?.nom ?? '');
  const [ville, setVille] = useState(user?.ville ?? '');
  const [statut, setStatut] = useState(user?.statut ?? 'locataire');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [notifPush, setNotifPush] = useState(user?.notifPush ?? true);
  const [newsletter, setNewsletter] = useState(user?.newsletter ?? false);
  const [saved, setSaved] = useState(false);

  /* Resync si user arrive après le premier render (SSR edge case) */
  useEffect(() => {
    if (!user) return;
    setPrenom(user.prenom);
    setNom(user.nom);
    setVille(user.ville);
    setStatut(user.statut);
    setBio(user.bio);
    setEmail(user.email);
    setPhone(user.phone);
    setNotifPush(user.notifPush);
    setNewsletter(user.newsletter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    updateUser({ prenom, nom, ville, statut, bio, email, phone, notifPush, newsletter });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleLogout() {
    clearUser();
    router.push('/compte');
  }

  const displayName = [prenom, nom].filter(Boolean).join(' ') || 'Votre profil';
  const initials = [prenom[0], nom[0]].filter(Boolean).join('').toUpperCase() || '?';

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <header className={styles.header}>
        <button
          className={styles.backButton}
          type="button"
          aria-label="Retour"
          onClick={() => router.back()}
        >
          <IconChevronLeft size={20} />
        </button>
        <h1 className={styles.headerTitle}>Mon compte</h1>
        <div className={styles.headerSpacer} />
      </header>

      <form onSubmit={handleSave} noValidate>

        {/* ── Hero avatar ── */}
        <div className={styles.hero}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/PFE.svg" alt="" aria-hidden="true" className={styles.heroBg} />
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>
              {user?.avatarUrl
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={user.avatarUrl} alt={displayName} className={styles.avatarImg} />
                : <span className={styles.avatarInitials}>{initials}</span>
              }
            </div>
            <button type="button" className={styles.avatarEditBtn} aria-label="Modifier la photo">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>
          </div>
          <p className={styles.heroName}>{displayName}</p>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            {statut.charAt(0).toUpperCase() + statut.slice(1)}{ville ? ` · ${ville}` : ''}
          </div>
        </div>

        {/* ── Mon profil ── */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderIcon}><IconUser size={16} /></div>
            <h2 className={styles.cardTitle}>Mon profil</h2>
          </div>
          <p className={styles.cardDesc}>Visible par les bailleurs et agents immobiliers.</p>

          <div className={styles.fields}>
            <div className={styles.row2}>
              <Input label="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} autoComplete="given-name" />
              <Input label="Nom" value={nom} onChange={(e) => setNom(e.target.value)} autoComplete="family-name" />
            </div>
            <Input
              label="Ville"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              iconLeft={<IconLocation size={16} />}
              autoComplete="address-level2"
            />
            <div className={styles.selectField}>
              <label className={styles.selectLabel}>Je suis</label>
              <div className={styles.selectWrap}>
                <select className={styles.select} value={statut} onChange={(e) => setStatut(e.target.value)}>
                  <option value="locataire">Locataire</option>
                  <option value="proprietaire">Propriétaire</option>
                  <option value="acheteur">Acheteur</option>
                  <option value="vendeur">Vendeur</option>
                  <option value="investisseur">Investisseur</option>
                </select>
                <svg className={styles.selectChevron} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
            <div className={styles.textareaField}>
              <label className={styles.selectLabel}>
                À propos de moi <span className={styles.optional}>(optionnel)</span>
              </label>
              <textarea
                className={styles.textarea}
                placeholder="Présentez-vous en quelques mots pour inspirer confiance aux bailleurs…"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={400}
              />
              <span className={styles.charCount}>{bio.length} / 400</span>
            </div>
          </div>
        </section>

        {/* ── Mes informations ── */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderIcon}><IconMail size={16} /></div>
            <h2 className={styles.cardTitle}>Mes informations</h2>
          </div>
          <p className={styles.cardDesc}>Ces données sont privées et ne sont jamais partagées.</p>
          <div className={styles.fields}>
            <Input
              label="Email"
              inputType="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              iconLeft={<IconMail size={16} />}
              autoComplete="email"
            />
            <Input
              label="Téléphone"
              inputType="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              iconLeft={<IconPhone size={16} />}
              autoComplete="tel"
            />
          </div>
          <button type="button" className={styles.infoRow}>
            <span className={styles.infoRowLeft}>
              <span className={styles.infoRowIcon}><IconLock size={15} /></span>
              <span className={styles.infoRowLabel}>Modifier le mot de passe</span>
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </section>

        {/* ── Préférences ── */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderIcon}><IconBell size={16} /></div>
            <h2 className={styles.cardTitle}>Préférences</h2>
          </div>
          <div className={styles.toggleList}>
            <div className={styles.toggleItem}>
              <div className={styles.toggleText}>
                <span className={styles.toggleLabel}>Notifications push</span>
                <span className={styles.toggleDesc}>Alertes de nouvelles annonces selon vos critères</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notifPush}
                className={`${styles.toggle} ${notifPush ? styles.toggleOn : ''}`}
                onClick={() => setNotifPush((v) => !v)}
                aria-label="Activer les notifications push"
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>
            <div className={styles.toggleItem}>
              <div className={styles.toggleText}>
                <span className={styles.toggleLabel}>Newsletter</span>
                <span className={styles.toggleDesc}>Actualités et tendances du marché immobilier</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={newsletter}
                className={`${styles.toggle} ${newsletter ? styles.toggleOn : ''}`}
                onClick={() => setNewsletter((v) => !v)}
                aria-label="Activer la newsletter"
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>
          </div>
        </section>

        {/* ── Mes favoris ── */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderIcon}><IconHeart size={16} /></div>
            <h2 className={styles.cardTitle}>Mes favoris</h2>
            <Link href="/recherche" className={styles.seeAll}>Voir tout</Link>
          </div>
          <p className={styles.cardDesc}>Les annonces que vous avez aimées.</p>
          <div className={styles.emptyFavoris}>
            <div className={styles.emptyIcon}>
              <IconHeart size={26} />
            </div>
            <p className={styles.emptyTitle}>Aucun favori pour le moment</p>
            <p className={styles.emptyHint}>
              Appuyez sur le ♥ sur une annonce pour la retrouver ici.
            </p>
            <Link href="/recherche" className={styles.emptyLink}>
              Explorer des annonces
            </Link>
          </div>
        </section>

        {/* ── Actions ── */}
        <div className={styles.actions}>
          <button type="submit" className={`${styles.saveBtn} ${saved ? styles.saveBtnDone : ''}`}>
            {saved
              ? <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  Enregistré !
                </>
              : 'Enregistrer les modifications'
            }
          </button>
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            Se déconnecter
          </button>
        </div>

      </form>
    </div>
  );
}
