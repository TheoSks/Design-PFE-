# 🏠 Design System PFE — Théo G.

> Application mobile de recherche immobilière augmentée par l'IA  
> **Product Design · UX/UI · Design System** — PFE 2025–2026

> [!WARNING]
> 🚧 **Projet en cours** — Ce dépôt est un work in progress. Les maquettes, le design system et la documentation évoluent continuellement au fil de l'avancement du PFE. Tout est susceptible de changer : composants, tokens, écrans, nomenclature. Ne pas considérer comme version finale.

---

## 📌 Présentation

Ce dépôt documente le Design System et les maquettes réalisés dans le cadre de mon Projet de Fin d'Études. Le projet consiste en une application mobile de recherche immobilière repensée, où l'IA agit comme facilitateur d'expérience — et non comme gadget — face aux plateformes existantes (SeLoger, Leboncoin, BienIci, Nexity…).

L'ambition : **simplifier la recherche immobilière sans dénaturer le métier.**

🔗 [Voir le fichier Figma →](https://www.figma.com/design/PmqsndekhjJTOY8MEzKFFr/Design-system-PFE)

---

## 🎯 Problématique

> Comment l'intelligence artificielle peut-elle améliorer l'expérience de recherche immobilière sans dénaturer le rôle des acteurs du secteur, tout en respectant les contraintes RGPD et les standards d'accessibilité ?

---

## 📱 Écrans & Parcours

| Écran | Description |
|---|---|
| Splash Screen | Premier lancement, onboarding |
| Inscription | Création de compte & finalisation du profil |
| Homepage / Explore | Point d'entrée — prompt conversationnel |
| Chat IA | Assistant conversationnel en langage naturel |
| Résultats | Liste des annonces filtrées avec Score Qualité de Vie |

---

## 🗺️ User Flow — Prototype actuel

```
Homepage (prompt vide)
       ↓
Saisie de la recherche ("Appartement Rouen 60m2")
       ↓
Chat IA — questions de relance (quartier, luminosité, extérieur...)
       ↓
Réponse utilisateur ("Rive droite, balcon, proche métro")
       ↓
Résultats filtrés — 24 annonces · tags IA · Score QdV
```

---

## ✨ Fonctionnalités

### MVP

**1. Chat IA comme point d'entrée unique**  
Un prompt conversationnel remplace tous les filtres classiques. L'utilisateur décrit sa recherche naturellement et l'IA extrait automatiquement les critères. Elle relance avec des questions contextuelles avant d'afficher les résultats.

**2. Score Qualité de Vie**  
Différenciateur central du projet. Chaque bien est évalué sur 4 dimensions :

| Critère | Description |
|---|---|
| 🚇 Transports | Proximité et fréquence des lignes |
| 🛒 Commerces | Accès aux services du quotidien |
| 🌿 Espaces verts | Parcs et nature à proximité |
| 🔇 Bruit | Niveau sonore du quartier (jour / nuit) |

> ⚠️ **Point de friction (test utilisateur)** — Le score n'est pas proposé proactivement par l'IA. Il apparaît uniquement si l'utilisateur mentionne un critère lié au cadre de vie. **Piste : déclencher automatiquement le Score QdV dès qu'un critère de vie est évoqué dans le chat.**

**3. Résultats filtrés par l'IA**  
Après la conversation, l'IA présente les annonces les plus pertinentes avec un récapitulatif, des tags contextuels générés automatiquement (ex. *"Belle luminosité"*) et le Score QdV sur chaque carte.

> ⚠️ **Point de friction (test utilisateur)** — Les tags ne sont pas compris spontanément. Le retour en arrière pour modifier les critères n'est pas intuitif. **Pistes : info-bulle sur les tags + bouton "Modifier mes critères" visible depuis les résultats.**

**4. Comparateur d'annonces avec synthèse IA** *(à venir)*  
L'utilisateur sélectionne 2 à 3 biens, l'IA génère une synthèse comparative incluant le Score QdV, les points forts/faibles et une recommandation.

> 🚧 Non présent dans le prototype actuel — prévu pour la prochaine itération.

**5. Alertes intelligentes** *(à venir)*  
Notifications personnalisées selon le profil utilisateur.

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

## 🧪 Test Utilisateur — Résultats clés

**Profil testé** : Jeune couple (Maxime 29 ans, Marine 27 ans) — premier achat — exploration sans urgence. Bonne expérience avec les apps immo classiques (SeLoger, BienIci, Leboncoin, Nexity).

| Étape | Résultat | Observé |
|---|---|---|
| Compréhension homepage | Immédiate, sans explication | ✅ |
| Premier geste : prompt | Oui, sans chercher de filtres | ✅ |
| Hésitation avant de taper | Oui, quelques secondes | ✅ |
| Réponse aux relances IA | Fluide après la première hésitation | ✅ |
| Compréhension Score QdV | Partielle — nécessite une remarque de l'utilisateur | ⚠️ |
| Retour pour modifier critères | Non trouvé intuitivement | ⚠️ |

> *"Elle me pose des questions, c'est bien ça."* — Maxime, tâche 2

---

## 🎨 Design System

### Fondations — Tokens CSS

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
│   ├── Splash Screen
│   ├── Inscription
│   ├── Finaliser inscription
│   ├── Explore / Accueil
│   ├── Homepage
│   ├── Chat IA
│   └── Résultats
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

## 🔗 Références produit

| Produit | Ce qu'on s'en inspire |
|---|---|
| **Zefir / ZIA** | Recherche conversationnelle, relances contextuelles, assistant 24/7 |
| **SeLoger / BienIci** | Référence UX à dépasser sur la rigidité des filtres |
| **Jinka** | Agrégation multi-sources |

---

## 🛠️ Outils

| Outil | Usage |
|---|---|
| Figma | Maquettes, prototypes, Design System |
| Zeroheight | Documentation du Design System |
| FigJam | User flows, ateliers d'idéation |
| Notion | Gestion de projet, spécifications |

---

## 📐 Méthodologie

```
Recherche utilisateur
       ↓
Benchmark (SeLoger · Jinka · Leboncoin · Bien'ici · PAP · Zefir)
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
