# 🏠 Design System PFE — Théo G.

> Application mobile de recherche immobilière augmentée par l'IA  
> **Product Design · UX/UI · Design System** — PFE 2025–2026

> [!WARNING]
> 🚧 **Projet en cours** — Ce dépôt est un work in progress. Les maquettes, le design system et la documentation évoluent continuellement au fil de l'avancement du PFE. Tout est susceptible de changer : composants, tokens, écrans, nomenclature. Ne pas considérer comme version finale.

---

## 📌 Présentation

Ce dépôt documente le **Design System** et les **maquettes** réalisés dans le cadre de mon Projet de Fin d'Études. Le projet consiste en une application mobile de recherche immobilière repensée, où l'IA agit comme facilitateur d'expérience — et non comme gadget — face aux plateformes existantes (SeLoger, Leboncoin, Jinka…).

L'ambition : **simplifier la recherche immobilière sans dénaturer le métier**.

🔗 **[Voir le fichier Figma →](https://www.figma.com/design/PmqsndekhjJTOY8MEzKFFr/Design-system-PFE)**

---

## 🎯 Problématique

> Comment l'intelligence artificielle peut-elle améliorer l'expérience de recherche immobilière sans dénaturer le rôle des acteurs du secteur, tout en respectant les contraintes RGPD et les standards d'accessibilité ?

---

## 📱 Écrans & Parcours

Le fichier Figma couvre l'ensemble des écrans applicatifs :

| Écran | Description |
|---|---|
| **Splash Screen** | Premier lancement, onboarding |
| **Inscription** | Création de compte & finalisation du profil |
| **Homepage / Explore** | Recherche classique avec filtres |
| **Résultats** | Liste des annonces avec Score Qualité de Vie |
| **Chat IA** | Assistant conversationnel en langage naturel |

---

## 🎨 Design System

### Fondations — Tokens CSS

Le Design System repose sur un système de tokens organisés par catégories :

```
🎨 Couleurs
├── --background/base              #fafafa
├── --background/neutral/strong    #0a0a0a   (fond sombre)
├── --background/brand/strong      #2b7fff   (bleu principal)
├── --background/brand/bolder      #51a2ff   (bleu clair)
├── --text/base/strong             #0a0a0a
├── --text/base/moderate           #545454
├── --text/brand/bolder            #155dfc
├── --text/inverse                 #ffffff
├── --border/default               rgba(10,10,10,0.08)
└── --border/neutral/bolder        #d4d4d4

✍️ Typographie
├── --font/family/heading          SF Pro Bold
├── --font/family/primary          SF Pro Medium
├── --font/size/xs                 12px
├── --font/size/md                 16px
├── --font/size/lg                 18px
└── --font/size/4xl                36px

📐 Layout & Espacements
├── --layout/border/thin           1px
├── --radius                       Tokens de rayon
└── --shadow                       Tokens d'ombre
```

### Structure du fichier Figma

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

## ✨ Fonctionnalités clés

### MVP
- 🔍 **Recherche classique** avec filtres avancés (type, surface, prix, localisation)
- 🤖 **Assistant IA conversationnel** pour affiner sa recherche en langage naturel
- 🌿 **Score Qualité de Vie** — indicateur croisant transports, commerces, espaces verts, bruit
- 📊 **Comparateur d'annonces** avec synthèse IA
- 🔔 **Alertes intelligentes** personnalisées selon le profil utilisateur

### Évolutions futures
- 🎙️ Recherche vocale
- 🗺️ Vue carte augmentée
- 📱 Mode hors-ligne
- 🔗 Intégration agences partenaires

---

## 👤 Profils utilisateurs ciblés

- 🎓 Étudiants en mobilité
- 👔 Jeunes actifs (primo-accédants ou locataires)
- 👨‍👩‍👧 Familles en recherche de logement
- 🏢 Professionnels de l'immobilier

---

## 🛠️ Outils

| Outil | Usage |
|---|---|
| **Figma** | Maquettes, prototypes, Design System |
| **Zeroheight** | Documentation du Design System |
| **FigJam** | User flows, ateliers d'idéation |
| **Notion** | Gestion de projet, spécifications |

---

## 📐 Méthodologie

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

## ♿ Accessibilité & Conformité

- Respect des critères **WCAG 2.1 AA** — contrastes vérifiés sur tous les composants
- Conformité **RGPD** — encadrement de l'usage des données et de l'IA
- Tokens sémantiques garantissant cohérence et accessibilité à l'échelle

---

## 📅 Planning

| Phase | Période | Livrable |
|---|---|---|
| Cadrage & Spécifications | Janv. 2026 | Document de cadrage |
| Recherche utilisateur | Fév. 2026 | Personas, user flows |
| Design System | Fév.–Mars 2026 | Tokens & composants Figma |
| Maquettes & Prototype | Mars–Avr. 2026 | Prototype interactif |
| Tests & Itérations | Avr. 2026 | Rapport de tests |
| Soutenance | Mai 2026 | — |

---

## 👨‍🎨 Auteur

**Théo Gaggio** — Product Designer  
PFE RNCP Niveau 7 — Manager de Projets Digitaux

[![Figma](https://img.shields.io/badge/Figma-Design%20System-F24E1E?logo=figma&logoColor=white)](https://www.figma.com/design/PmqsndekhjJTOY8MEzKFFr/Design-system-PFE)

---

*Projet réalisé dans le cadre du Projet de Fin d'Études — 2025–2026*
