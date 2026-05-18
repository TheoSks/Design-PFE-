/**
 * Lifestyle tags used to describe the quality-of-life profile of a property's location.
 * Each tag combines an emoji visual cue with a short label so it reads at a glance on cards.
 */
export type LifestyleTag =
  | 'family'
  | 'quiet'
  | 'dynamic'
  | 'connected'
  | 'green'
  | 'student'
  | 'sport'
  | 'remote'
  | 'view'
  | 'beach';

interface LifestyleDef {
  label: string;
  emoji: string;
  short: string;
  /** Keywords that, when matched in user input, suggest this lifestyle tag. */
  keywords: string[];
}

export const LIFESTYLE: Record<LifestyleTag, LifestyleDef> = {
  family:    { label: 'Familial',         emoji: '👨‍👩‍👧', short: 'Familial',   keywords: ['famille', 'enfant', 'enfants', 'familial', 'famille avec enfants', 'parents'] },
  quiet:     { label: 'Calme & nature',   emoji: '🌿',     short: 'Calme',      keywords: ['calme', 'tranquille', 'paisible', 'serein', 'résidentiel', 'reposant'] },
  dynamic:   { label: 'Dynamique',         emoji: '✨',     short: 'Dynamique',  keywords: ['dynamique', 'vivant', 'animé', 'vie nocturne', 'sortir', 'bars', 'fête'] },
  connected: { label: 'Hyper-connecté',    emoji: '🚇',     short: 'Connecté',   keywords: ['transport', 'transports', 'métro', 'rer', 'gare', 'connecté', 'central'] },
  green:     { label: 'Vert',              emoji: '🌳',     short: 'Vert',       keywords: ['vert', 'parc', 'jardin', 'nature', 'verdure', 'arbres'] },
  student:   { label: 'Étudiant',          emoji: '🎓',     short: 'Étudiant',   keywords: ['étudiant', 'université', 'universités', 'fac', 'campus', 'école supérieure'] },
  sport:     { label: 'Sportif',           emoji: '🏃',     short: 'Sportif',    keywords: ['sport', 'sportif', 'salle de sport', 'piscine', 'running', 'vélo'] },
  remote:    { label: 'Télétravail',       emoji: '💻',     short: 'Télétravail',keywords: ['télétravail', 'home office', 'travailler à la maison', 'fibre', 'wifi'] },
  view:      { label: 'Vue exceptionnelle', emoji: '🌅',    short: 'Vue',        keywords: ['vue', 'panoramique', 'vue dégagée', 'vue mer', 'vue montagne'] },
  beach:     { label: 'Bord de mer',       emoji: '🏖️',    short: 'Mer',        keywords: ['mer', 'plage', 'côte', 'océan', 'bord de mer'] },
};

/** Detect lifestyle tags in a user text. Returns matched tags in order of appearance. */
export function extractLifestyleTags(text: string): LifestyleTag[] {
  const lower = text.toLowerCase();
  const matched: LifestyleTag[] = [];
  for (const [tag, def] of Object.entries(LIFESTYLE) as [LifestyleTag, LifestyleDef][]) {
    for (const kw of def.keywords) {
      if (lower.includes(kw) && !matched.includes(tag)) {
        matched.push(tag);
        break;
      }
    }
  }
  return matched;
}

/** Categorize raw environnement strings into themed groups. */
export interface EnvironmentCategory {
  key: 'transport' | 'commerces' | 'education' | 'nature' | 'vie';
  label: string;
  emoji: string;
  items: string[];
}

export function categorizeEnvironnement(items: string[]): EnvironmentCategory[] {
  const groups: EnvironmentCategory[] = [
    { key: 'transport', label: 'Transports',        emoji: '🚇', items: [] },
    { key: 'commerces', label: 'Commerces',         emoji: '🛒', items: [] },
    { key: 'education', label: 'Éducation',         emoji: '🎓', items: [] },
    { key: 'nature',    label: 'Nature & loisirs',  emoji: '🌳', items: [] },
    { key: 'vie',       label: 'Vie de quartier',   emoji: '🍽️', items: [] },
  ];

  const matchGroup = (item: string): EnvironmentCategory['key'] => {
    const l = item.toLowerCase();
    if (/m[ée]tro|bus|tram|rer|gare|a[ée]roport|station|train|transport/.test(l)) return 'transport';
    if (/[ée]cole|coll[èe]ge|lyc[ée]e|cr[èe]che|universit|campus|fac/.test(l)) return 'education';
    if (/parc|jardin|plage|nature|for[êe]t|lac|montagne|piscine/.test(l)) return 'nature';
    if (/restaurant|caf[ée]|bar|march[ée]|cinema|cin[ée]ma|th[ée]atre|salle/.test(l)) return 'vie';
    return 'commerces';
  };

  for (const item of items) {
    const group = groups.find((g) => g.key === matchGroup(item));
    if (group) group.items.push(item);
  }
  return groups.filter((g) => g.items.length > 0);
}

/** Compute a simple 0-10 score per lifestyle dimension based on lifestyle tags. */
export interface LifestyleScores {
  family: number;
  calm: number;
  connected: number;
  green: number;
  social: number;
}

export function computeLifestyleScores(tags: LifestyleTag[] | undefined, environnement: string[]): LifestyleScores {
  const set = new Set(tags ?? []);
  const env = environnement.join(' ').toLowerCase();

  const has = (tag: LifestyleTag) => (set.has(tag) ? 1 : 0);
  const envHas = (re: RegExp) => (re.test(env) ? 1 : 0);

  return {
    family:    Math.min(10, 5 + 2 * has('family')   + 2 * envHas(/[ée]cole|coll[èe]ge|lyc[ée]e|cr[èe]che/) + 1 * envHas(/parc|jardin/)),
    calm:      Math.min(10, 4 + 3 * has('quiet')    + 2 * has('green') + 1 * envHas(/parc|jardin|r[ée]sidentiel/)),
    connected: Math.min(10, 4 + 3 * has('connected') + 2 * envHas(/m[ée]tro|rer|gare|tram/)),
    green:     Math.min(10, 4 + 3 * has('green')    + 2 * envHas(/parc|jardin|plage|nature/)),
    social:    Math.min(10, 4 + 3 * has('dynamic')  + 2 * envHas(/restaurant|caf[ée]|bar|march[ée]|cin[ée]ma/)),
  };
}
