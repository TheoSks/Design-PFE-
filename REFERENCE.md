# 📋 Fichier de Référence — Design System PFE

> **Application mobile de recherche immobilière augmentée par l'IA**  
> Product Design · UX/UI · Design System — PFE 2025–2026  
> **Auteur :** Théo Gaggio — Product Designer  
> **Programme :** RNCP Niveau 7 — Manager de Projets Digitaux

---

## 1. Problématique & Vision

> *Comment l'intelligence artificielle peut-elle améliorer l'expérience de recherche immobilière sans dénaturer le rôle des acteurs du secteur, tout en respectant les contraintes RGPD et les standards d'accessibilité ?*

**Ambition :** Simplifier la recherche immobilière sans dénaturer le métier.  
**Positionnement :** L'IA agit comme facilitateur d'expérience — et non comme gadget — face aux plateformes existantes (SeLoger, Leboncoin, Jinka, Bien'ici, PAP).

---

## 2. Liens & Ressources

| Ressource | Lien |
|---|---|
| Fichier Figma (Design System) | https://www.figma.com/design/PmqsndekhjJTOY8MEzKFFr/Design-system-PFE |
| Dépôt GitHub | https://github.com/theosks/design-pfe- |

---

## 3. Profils Utilisateurs

| Profil | Description |
|---|---|
| Étudiants en mobilité | Jeunes cherchant un logement lors d'une mobilité géographique |
| Jeunes actifs | Primo-accédants ou locataires (25–35 ans) |
| Familles | En recherche d'un logement adapté à leurs critères de vie |
| Professionnels immobilier | Agents et mandataires partenaires de la plateforme |

---

## 4. Fonctionnalités

### MVP
| Feature | Description |
|---|---|
| Recherche classique | Filtres avancés : type, surface, prix, localisation |
| Assistant IA conversationnel | Affinage de la recherche en langage naturel |
| Score Qualité de Vie | Indicateur croisant transports, commerces, espaces verts, bruit |
| Comparateur d'annonces | Synthèse IA entre plusieurs biens |
| Alertes intelligentes | Notifications personnalisées selon le profil utilisateur |

### Évolutions futures
| Feature | Description |
|---|---|
| Recherche vocale | Input vocal pour l'assistant IA |
| Vue carte augmentée | Carte interactive avec données de qualité de vie |
| Mode hors-ligne | Consultation des annonces sauvegardées sans connexion |
| Intégration agences | API partenaires pour annonces exclusives |

---

## 5. Inventaire des Écrans

| Écran | Description | Statut |
|---|---|---|
| Splash Screen | Premier lancement, onboarding | Maquetté |
| Inscription | Création de compte | Maquetté |
| Finaliser inscription | Complétion du profil utilisateur | Maquetté |
| Explore / Accueil | Recherche classique avec filtres | Maquetté |
| Homepage | Vue principale après connexion | Maquetté |
| Résultats | Liste des annonces avec Score QdV | Maquetté |
| Chat IA | Assistant conversationnel | Maquetté |

---

## 6. Design System — Tokens

> Source : Figma — `PmqsndekhjJTOY8MEzKFFr`

### 6.1 Couleurs

#### Backgrounds
| Token | Valeur | Usage |
|---|---|---|
| `--background/base` | `#fafafa` | Fond principal (clair) |
| `--background/neutral/strong` | `#0a0a0a` | Fond sombre |
| `--background/brand/strong` | `#2b7fff` | Bleu principal (CTA, accent) |
| `--background/brand/bolder` | `#51a2ff` | Bleu clair (hover, secondaire) |
| `--background/brand/strong/pressed` | `#8ec5ff` | Bleu très clair (état pressé) |

#### Texte
| Token | Valeur | Usage |
|---|---|---|
| `--text/base/strong` | `#0a0a0a` | Texte principal |
| `--text/base/moderate` | `#545454` | Texte secondaire / légendes |
| `--text/brand/bolder` | `#155dfc` | Texte lien / accent |
| `--text/inverse` | `#ffffff` | Texte sur fond sombre |

#### Bordures
| Token | Valeur | Usage |
|---|---|---|
| `--border/default` | `rgba(10,10,10,0.08)` | Bordure légère / séparateur |
| `--border/neutral/bolder` | `#d4d4d4` | Bordure visible |
| `--border/brand/medium` | `#93c5fd` | Bordure bleue |

#### Ombres
| Token | Valeur | Usage |
|---|---|---|
| `--shadow/brand/moderate` | `#2b7fff57` | Ombre bleue (composants IA) |

### 6.2 Typographie

| Token | Valeur |
|---|---|
| `--font/family/heading` | `SF Pro` (Bold) |
| `--font/family/primary` | `SF Pro` (Medium) |
| `--font/weight/bold` | `700` |
| `--font/weight/accent` | `500` |
| `--font/size/xs` | `12px` |
| `--font/size/md` | `16px` |
| `--font/size/lg` | `18px` |
| `--font/size/4xl` | `36px` |

### 6.3 Layout & Espacement

| Token | Valeur |
|---|---|
| `--layout/border/thin` | `1px` |
| Grille (desktop) | 9 colonnes, pas de 200px, marges 160px |
| Canvas de référence | 1920×1080px (desktop) |

---

## 7. Structure du Fichier Figma

```
📂 Design-system-PFE
│
├── 🖼️  Cover
│
├── 📱 Écrans
│   ├── Splash Screen 01
│   ├── Inscription
│   ├── Finaliser inscription
│   ├── Explore / Accueil
│   ├── Homepage
│   ├── Résultats
│   └── Chat IA
│
├── 🧩 Composants
│   ├── Logo
│   ├── Cards (Annonce · Score QdV)
│   ├── Boutons & Formulaires
│   ├── Navigation (Header · Tab Bar)
│   └── Composants IA ✨
│
└── 🎨 Foundations
    ├── Couleurs & Tokens
    ├── Typographie
    ├── Grille & Espacements
    └── Ombres & Radius
```

---

## 8. Outils & Stack

| Outil | Usage |
|---|---|
| Figma | Maquettes, prototypes, Design System |
| Zeroheight | Documentation du Design System |
| FigJam | User flows, ateliers d'idéation |
| Notion | Gestion de projet, spécifications |

---

## 9. Méthodologie

```
Recherche utilisateur
       ↓
Benchmark (SeLoger · Jinka · Leboncoin · Bien'ici · PAP)
       ↓
Personas & User Flows
       ↓
Priorisation MoSCoW
       ↓
Design System → Maquettes → Prototype
       ↓
Tests utilisateurs & itérations
```

---

## 10. Accessibilité & Conformité

- **WCAG 2.1 AA** — Contrastes vérifiés sur tous les composants
- **RGPD** — Encadrement de l'usage des données personnelles et de l'IA
- Tokens sémantiques garantissant cohérence et accessibilité à l'échelle

---

## 11. Planning

| Phase | Période | Livrable |
|---|---|---|
| Cadrage & Spécifications | Janv. 2026 | Document de cadrage |
| Recherche utilisateur | Fév. 2026 | Personas, user flows |
| Design System | Fév.–Mars 2026 | Tokens & composants Figma |
| Maquettes & Prototype | Mars–Avr. 2026 | Prototype interactif |
| Tests & Itérations | Avr. 2026 | Rapport de tests |
| Soutenance | Mai 2026 | — |

---

*Dernière mise à jour : Avril 2026*
