'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import { Logo } from '@/components/ui/Logo';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BurgerMenu } from '@/components/ui/BurgerMenu';
import { IconSparkle, IconSend, IconMenu } from '@/components/icons';
import { PROPERTIES, type PropertyData } from '@/lib/properties';
import { RENTALS } from '@/lib/rentals';


// ── Types ────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'ai';
  text: string;
  showResultsLink?: boolean;
}

interface SearchCriteria {
  transaction?: 'achat' | 'location'; // acheter ou louer
  type?: string;       // appartement, maison, studio, loft…
  city?: string;       // paris, lyon, bordeaux…
  area?: string;       // surface
  budget?: string;     // budget
  rooms?: string;      // nombre de pièces
  features: string[];  // balcon, jardin, parking, lumineux…
  neighborhood?: string;
}

// ── Keyword extraction ───────────────────────────────────────
function extractCriteria(text: string, existing: SearchCriteria): SearchCriteria {
  const lower = text.toLowerCase();
  const criteria = { ...existing, features: [...existing.features] };

  // Transaction
  if (lower.match(/\blouer\b|\blocation\b|\bà louer\b|\ben location\b|\bloue\b|\blouer$/)) criteria.transaction = 'location';
  else if (lower.match(/\bacheter\b|\bachat\b|\bachète\b|\bacquérir\b|\bà vendre\b|\bvente\b|\bacheter$/)) criteria.transaction = 'achat';
  // Chips shortcuts
  if (lower === 'louer') criteria.transaction = 'location';
  if (lower === 'acheter') criteria.transaction = 'achat';

  // Type de bien
  if (lower.match(/appartement/)) criteria.type = 'appartement';
  else if (lower.match(/maison/)) criteria.type = 'maison';
  else if (lower.match(/studio/)) criteria.type = 'studio';
  else if (lower.match(/loft/)) criteria.type = 'loft';
  else if (lower.match(/villa/)) criteria.type = 'villa';

  // Ville
  const cities = ['paris', 'lyon', 'marseille', 'bordeaux', 'toulouse', 'nantes', 'nice', 'rouen', 'lille', 'strasbourg', 'montpellier', 'rennes'];
  for (const city of cities) {
    if (lower.includes(city)) { criteria.city = city.charAt(0).toUpperCase() + city.slice(1); break; }
  }

  // Arrondissement
  const arrMatch = lower.match(/(\d{1,2})(e|ème|er)\s*(arrondissement)?/);
  if (arrMatch) criteria.neighborhood = `${arrMatch[1]}e arrondissement`;

  // Quartier
  const quartiers = ['quartier calme', 'centre.ville', 'zone résidentielle', 'périphérie', 'rive droite', 'rive gauche'];
  for (const q of quartiers) {
    if (lower.match(new RegExp(q))) { criteria.neighborhood = q.replace('.', '-'); break; }
  }

  // Surface
  const surfMatch = lower.match(/(\d{2,3})\s*m[²2]/);
  if (surfMatch) criteria.area = `${surfMatch[1]} m²`;

  // Budget
  const budgetMatch = lower.match(/(\d[\d\s]*)\s*€(?:\/mois)?/) || lower.match(/budget\s*(\d[\d\s]*)/);
  if (budgetMatch) {
    const amount = budgetMatch[1].replace(/\s/g, '');
    criteria.budget = criteria.transaction === 'location' ? `${amount} €/mois` : `${amount} €`;
  }

  // Pièces
  const roomsMatch = lower.match(/(\d)\s*pi[eè]ce/) || lower.match(/t(\d)/);
  if (roomsMatch) criteria.rooms = roomsMatch[1] + ' pièces';

  // Features
  const featureMap: Record<string, string> = {
    'balcon': 'balcon', 'terrasse': 'terrasse', 'jardin': 'jardin', 'piscine': 'piscine',
    'parking': 'parking', 'garage': 'garage', 'cave': 'cave', 'ascenseur': 'ascenseur',
    'luminos': 'luminosité', 'lumineux': 'luminosité', 'calme': 'quartier calme',
    'vue mer': 'vue mer', 'vue dégagée': 'vue dégagée', 'dernier étage': 'dernier étage',
    'étage élevé': 'étage élevé', 'orientation sud': 'orientation sud',
    'double exposition': 'double exposition', 'grandes fenêtres': 'grandes fenêtres',
    'proche transport': 'proche transports', 'proche métro': 'proche métro',
    'proche école': 'proche école', 'meublé': 'meublé',
    'rénové': 'rénové', 'neuf': 'neuf', 'ancien': 'ancien',
  };
  for (const [keyword, feature] of Object.entries(featureMap)) {
    if (lower.includes(keyword) && !criteria.features.includes(feature)) {
      criteria.features.push(feature);
    }
  }

  return criteria;
}

// ── Contextual response generation ────────────────────────────
function generateResponse(criteria: SearchCriteria, msgCount: number): { text: string; chips: string[]; showResultsLink?: boolean } {
  const parts: string[] = [];
  const missing: string[] = [];
  const chips: string[] = [];

  // Compute what we know
  const known: string[] = [];
  if (criteria.type) known.push(criteria.type);
  if (criteria.city) known.push(`à ${criteria.city}`);
  if (criteria.area) known.push(criteria.area);
  if (criteria.budget) known.push(`budget ${criteria.budget}`);
  if (criteria.rooms) known.push(criteria.rooms);
  if (criteria.features.length) known.push(criteria.features.join(', '));

  // What's missing
  if (!criteria.transaction) missing.push('transaction');
  if (!criteria.type) missing.push('type');
  if (!criteria.city) missing.push('city');
  if (!criteria.area && !criteria.rooms) missing.push('size');
  if (!criteria.budget) missing.push('budget');
  if (criteria.city && !criteria.neighborhood) missing.push('neighborhood');
  if (criteria.features.length === 0) missing.push('features');

  // Random result counts
  const count = 30 + Math.floor(Math.random() * 150);

  // Build the response text
  const transactionLabel = criteria.transaction === 'location' ? 'en location' : criteria.transaction === 'achat' ? 'à l\'achat' : '';
  if (msgCount <= 1) {
    // First response
    parts.push(`J'ai trouvé ${count} ${criteria.type || 'biens'}${transactionLabel ? ` disponibles ${transactionLabel}` : ''} correspondant à votre recherche${criteria.city ? ` sur ${criteria.city}` : ''}${criteria.area ? ` autour de ${criteria.area}` : ''}.`);
  } else {
    // Follow-up
    parts.push(`Parfait, j'affine votre recherche. Je cherche maintenant un${criteria.type === 'maison' || criteria.type === 'villa' ? 'e' : ''} ${criteria.type || 'bien'}${transactionLabel ? ` ${transactionLabel}` : ''}${criteria.city ? ` à ${criteria.city}` : ''}${criteria.features.length > 0 ? ` avec ${criteria.features.slice(-2).join(' et ')}` : ''}.`);
    parts.push(`J'ai réduit la sélection à ${count} résultats.`);
  }

  const isLocation = criteria.transaction === 'location';

  // Ask follow-up questions based on what's missing
  if (missing.includes('transaction')) {
    parts.push(`\n· Vous recherchez à acheter ou à louer ?`);
    chips.push('Acheter', 'Louer');
  }
  if (missing.includes('type')) {
    parts.push(`· Quel type de bien recherchez-vous (appartement, maison, studio) ?`);
    chips.push('Appartement', 'Maison', 'Studio');
  }
  if (missing.includes('city')) {
    parts.push(`· Dans quelle ville ou région souhaitez-vous chercher ?`);
    chips.push('Paris', 'Lyon', 'Bordeaux');
  }
  if (missing.includes('size')) {
    parts.push(`· Quelle surface ou combien de pièces souhaitez-vous ?`);
    chips.push('40-60m²', '60-80m²', '3 pièces');
  }
  if (missing.includes('budget')) {
    if (isLocation) {
      parts.push(`· Quel est votre budget mensuel pour le loyer ?`);
      chips.push('700 €/mois', '1 200 €/mois', '1 800 €/mois');
    } else {
      parts.push(`· Quel est votre budget d'achat approximatif ?`);
      chips.push('200 000 €', '400 000 €', '600 000 €');
    }
  }
  if (missing.includes('neighborhood') && criteria.city) {
    parts.push(`· Souhaitez-vous privilégier un quartier particulier à ${criteria.city}, ou êtes-vous ouvert(e) à différentes zones ?`);
    chips.push('Quartier calme', 'Centre-ville', 'Zone résidentielle');
  }
  if (missing.includes('features') && !missing.includes('type')) {
    parts.push(`· Y a-t-il des critères importants pour vous (luminosité, extérieur, étage, parking) ?`);
    chips.push('Avec balcon', 'Lumineux', 'Dernier étage', 'Parking');
  }

  // If everything is filled, propose to show results
  if (missing.length === 0 || (missing.length === 1 && missing[0] === 'features')) {
    parts.push(`\nVotre recherche est bien définie ! Je peux vous montrer les ${count} résultats correspondants.`);
    chips.length = 0;
    chips.push('Avec balcon', 'Proche transports', 'Lumineux');
    return { text: parts.join('\n'), chips, showResultsLink: true };
  }

  return { text: parts.join('\n'), chips, showResultsLink: false };
}

// ── Match scoring ────────────────────────────────────────────
function computeMatchScore(property: PropertyData, criteria: SearchCriteria): number {
  let score = 0;
  let total = 0;

  // Type match (weight 20)
  if (criteria.type) {
    total += 20;
    const title = property.title.toLowerCase();
    const t = criteria.type.toLowerCase();
    if (t === 'appartement' && (title.includes('appartement') || !!title.match(/t\d/))) score += 20;
    else if (title.includes(t)) score += 20;
  }

  // City match (weight 25)
  if (criteria.city) {
    total += 25;
    const loc = (property.location + ' ' + property.cardLocation).toLowerCase();
    if (loc.includes(criteria.city.toLowerCase())) score += 25;
  }

  // Rooms match (weight 15)
  if (criteria.rooms) {
    total += 15;
    const spec = property.specs.find((s) => s.label.includes('pièce'));
    if (spec) {
      const propRooms = parseInt(spec.label.match(/(\d+)/)?.[1] || '0', 10);
      const wantedRooms = parseInt(criteria.rooms.match(/(\d+)/)?.[1] || '0', 10);
      if (propRooms === wantedRooms) score += 15;
      else if (Math.abs(propRooms - wantedRooms) === 1) score += 8;
    }
  }

  // Budget match (weight 20)
  if (criteria.budget) {
    total += 20;
    const propPrice = parseInt(property.price.replace(/[^\d]/g, ''), 10) || 0;
    const wantedBudget = parseInt(criteria.budget.replace(/[^\d]/g, ''), 10) || 0;
    if (wantedBudget > 0 && propPrice > 0) {
      const ratio = propPrice / wantedBudget;
      if (ratio <= 1) score += 20;
      else if (ratio <= 1.15) score += 14;
      else if (ratio <= 1.3) score += 8;
    }
  }

  // Area match (weight 10)
  if (criteria.area) {
    total += 10;
    const spec = property.specs.find((s) => s.label.includes('m²'));
    if (spec) {
      const propArea = parseInt(spec.label.match(/(\d+)/)?.[1] || '0', 10);
      const wantedArea = parseInt(criteria.area.match(/(\d+)/)?.[1] || '0', 10);
      if (wantedArea > 0 && propArea > 0) {
        const diff = Math.abs(propArea - wantedArea) / wantedArea;
        if (diff <= 0.1) score += 10;
        else if (diff <= 0.25) score += 7;
        else if (diff <= 0.4) score += 4;
      }
    }
  }

  // Features match (weight 10)
  if (criteria.features.length > 0) {
    total += 10;
    const allText = (property.title + ' ' + property.description.join(' ') + ' ' + property.specificites.join(' ') + ' ' + property.environnement.join(' ')).toLowerCase();
    let featureHits = 0;
    for (const f of criteria.features) {
      if (allText.includes(f.toLowerCase())) featureHits++;
    }
    score += Math.round((featureHits / criteria.features.length) * 10);
  }

  // If no criteria at all, give base score
  if (total === 0) return 50;

  return Math.round((score / total) * 100);
}

function getMatchColor(score: number): 'green' | 'blue' | 'orange' | 'amber' {
  if (score >= 80) return 'green';
  if (score >= 60) return 'blue';
  if (score >= 40) return 'orange';
  return 'amber';
}

function getMatchLabel(score: number): string {
  if (score >= 90) return `${score}% · Match parfait`;
  if (score >= 75) return `${score}% · Très compatible`;
  if (score >= 55) return `${score}% · Compatible`;
  return `${score}% · Partiel`;
}


// ── Component ────────────────────────────────────────────────
export default function ChatPageInner() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'results'>('chat');
  const [menuOpen, setMenuOpen] = useState(false);
  const [chips, setChips] = useState<string[]>(['Acheter', 'Louer', 'Paris', 'Appartement']);
  const [isTyping, setIsTyping] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [criteriaSnapshot, setCriteriaSnapshot] = useState<SearchCriteria>({ features: [] });
  const criteriaRef = useRef<SearchCriteria>({ features: [] });
  const msgCountRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialQuery && !hasInitialized.current) {
      hasInitialized.current = true;
      sendMessage(initialQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', text: text.trim() }]);
    setInput('');
    setIsTyping(true);

    // Update criteria with new user input
    criteriaRef.current = extractCriteria(text, criteriaRef.current);
    msgCountRef.current += 1;

    setTimeout(() => {
      const response = generateResponse(criteriaRef.current, msgCountRef.current);
      setMessages((prev) => [...prev, { role: 'ai', text: response.text, showResultsLink: response.showResultsLink }]);
      setChips(response.chips);
      setCriteriaSnapshot({ ...criteriaRef.current, features: [...criteriaRef.current.features] });
      if (response.showResultsLink) setHasResults(true);
      setIsTyping(false);
    }, 900);
  }

  // Compute matched & sorted results
  const source = criteriaSnapshot.transaction === 'location' ? RENTALS : PROPERTIES;
  const matchedResults = useMemo(() => {
    return source
      .map((p) => ({ property: p, score: computeMatchScore(p, criteriaSnapshot) }))
      .sort((a, b) => b.score - a.score);
  }, [source, criteriaSnapshot]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className={styles.page}>
      <BurgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Header */}
      <header className={styles.header}>
        <Link href="/" aria-label="Accueil">
          <Logo size="sm" />
        </Link>
        <div className={styles.headerActions}>
          <button className={styles.menuButton} type="button" aria-label="Menu" onClick={() => setMenuOpen(true)}>
            <IconMenu size={20} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'chat' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('chat')}
          type="button"
        >
          <IconSparkle size={14} />
          Filtrer avec IA
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'results' ? styles.tabActive : ''} ${!hasResults ? styles.tabLocked : ''}`}
          onClick={() => hasResults && setActiveTab('results')}
          type="button"
          disabled={!hasResults}
          title={!hasResults ? 'Affinez votre recherche pour débloquer les résultats' : undefined}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor"/>
            <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor"/>
            <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor"/>
            <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"/>
          </svg>
          Résultats
        </button>
      </div>

      {/* Tab content with slide transition */}
      <div className={styles.tabContent}>

        {/* Chat panel */}
        <div className={`${styles.panel} ${activeTab === 'chat' ? styles.panelActive : styles.panelLeft}`}>
          {/* Chat area */}
          <main className={styles.main}>
        {messages.length === 0 && !isTyping && (
          <div className={styles.emptyState}>
            <IconSparkle size={32} />
            <p>Décrivez le bien que vous recherchez…</p>
          </div>
        )}

        <div className={styles.messages}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={msg.role === 'user' ? styles.userBubbleWrapper : styles.aiBubbleWrapper}
            >
              {msg.role === 'user' ? (
                <div className={styles.userBubble}>{msg.text}</div>
              ) : (
                <div className={styles.aiBubble}>
                  {msg.text.split('\n').map((line, j) =>
                    line ? (
                      <p key={j} className={line.startsWith('·') ? styles.aiPoint : styles.aiText}>
                        {line}
                      </p>
                    ) : null
                  )}
                  {msg.showResultsLink && (
                    <button
                      className={styles.resultsLink}
                      onClick={() => setActiveTab('results')}
                      type="button"
                    >
                      Voir les annonces →
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className={styles.aiBubbleWrapper}>
              <div className={styles.aiBubble}>
                <div className={styles.typingIndicator}>
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Bottom: chips + input */}
      <div className={styles.bottom}>
        {chips.length > 0 && (
          <div className={styles.chips}>
            {chips.map((chip) => (
              <button key={chip} className={styles.chip} onClick={() => sendMessage(chip)} type="button">
                {chip}
              </button>
            ))}
          </div>
        )}

        <form className={styles.inputRow} onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            placeholder="Affiner mes critères"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          <button className={styles.sendButton} type="submit" disabled={!input.trim()} aria-label="Envoyer">
            <IconSend size={18} />
          </button>
        </form>
      </div>
        </div>{/* end chat panel */}

        {/* Results panel */}
        <div className={`${styles.panel} ${activeTab === 'results' ? styles.panelActive : styles.panelRight}`}>
          <div className={styles.resultsList}>
            {matchedResults.map(({ property: p, score }) => (
              <Card
                key={p.id}
                images={p.images}
                imageAlt={p.cardTitle}
                title={p.cardTitle}
                location={p.cardLocation}
                price={p.cardPrice}
                features={p.cardFeatures}
                badge={<Badge variant="ia" color={getMatchColor(score)}>{getMatchLabel(score)}</Badge>}
                href={`/annonce/${p.id}`}
              />
            ))}
          </div>
        </div>{/* end results panel */}

      </div>{/* end tabContent */}
    </div>
  );
}
