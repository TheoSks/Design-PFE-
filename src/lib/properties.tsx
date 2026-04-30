import {
  IconRuler,
  IconBuilding,
  IconDoor,
  IconBed,
  IconShower,
  IconBath,
} from '@/components/icons';
import React from 'react';

export interface PropertyData {
  id: string;
  title: string;
  location: string;
  price: string;
  pricePerM2: string;
  images: string[];
  specs: { icon: React.ReactNode; label: string }[];
  description: string[];
  characteristics: { icon: React.ReactNode; label: string; value: string }[];
  specificites: string[];
  dpe: { grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'; value: number };
  ges: { grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'; value: number };
  copropriete: { label: string; value: string }[];
  environnement: string[];
  pricingDetails: { label: string; value: string }[];
  advertiser: { name: string; address: string; siret: string; carte: string };
  coordinates: { lat: number; lng: number };
  reference: string;
  // Card-level fields
  cardTitle: string;
  cardLocation: string;
  cardPrice: string;
  cardFeatures: { label: string }[];
  badgeLabel?: string;
  badgeColor?: 'blue' | 'green' | 'orange' | 'amber' | 'purple';
}

export const PROPERTIES: PropertyData[] = [
  {
    id: 'appartement-lumineux-paris',
    title: 'Spacieux 4 pièces avec balcon plein sud à Paris',
    location: '75019 Paris',
    price: '599 000 €',
    pricePerM2: '7 779 €/m²',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    ],
    specs: [
      { icon: React.createElement(IconRuler, { size: 24 }), label: '77 m²' },
      { icon: React.createElement(IconBuilding, { size: 24 }), label: '3ème étage' },
      { icon: React.createElement(IconDoor, { size: 24 }), label: '4 pièces' },
      { icon: React.createElement(IconBed, { size: 24 }), label: '3 chambres' },
      { icon: React.createElement(IconShower, { size: 24 }), label: "1 salle d'eau" },
      { icon: React.createElement(IconBath, { size: 24 }), label: '1 salle de bain' },
    ],
    description: [
      "Découvrez ce superbe appartement de 4 pièces, idéalement situé dans le quartier prisé de Rosa Parks à Paris. Niché au troisième étage d'un immeuble moderne érigé en 2015, cet espace de 77 m² conjugue à merveille confort et design contemporain.",
      "Dès l'entrée, une vaste pièce de vie baignée de lumière naturelle vous accueille, s'ouvrant sur un balcon de 12 m² orienté plein sud, parfait pour profiter des journées ensoleillées.",
      "Les résidents apprécieront la vue dégagée et l'état impeccable de cet appartement, véritable havre de paix en plein cœur de la ville.",
      "Le quartier se distingue par sa qualité de vie exceptionnelle, avec un accès immédiat aux transports en commun, notamment la gare Rosa Parks à moins de 100 m.",
    ],
    characteristics: [
      { icon: React.createElement(IconRuler, { size: 24 }), label: 'Surface', value: '77 m²' },
      { icon: React.createElement(IconBuilding, { size: 24 }), label: 'Étage', value: '3ème' },
      { icon: React.createElement(IconDoor, { size: 24 }), label: 'Nombre de pièces', value: '4' },
      { icon: React.createElement(IconBed, { size: 24 }), label: 'Chambres', value: '3' },
      { icon: React.createElement(IconShower, { size: 24 }), label: "Salle d'eau", value: '1' },
      { icon: React.createElement(IconBath, { size: 24 }), label: 'Salle de bain', value: '1' },
    ],
    specificites: ['Balcon', 'Ascenseur', 'Carrelage', 'Double vitrage', 'Cuisine aménagée', 'Séjour', 'Parquet', 'Cave', 'Place de parking'],
    dpe: { grade: 'C', value: 118 },
    ges: { grade: 'C', value: 118 },
    copropriete: [
      { label: 'Nombre de lots', value: 'Non renseigné' },
      { label: 'Charges de copropriété', value: '3 768 € / an' },
      { label: 'Procédures syndicales en cours', value: 'Non' },
    ],
    environnement: ['Bus', 'Collège', 'Lycée', 'Situé en centre ville', 'Centre commercial', 'Crèche', 'Métro', 'Parc', 'École primaire'],
    pricingDetails: [
      { label: 'Prix de vente', value: '599 000 €' },
      { label: 'Honoraires', value: 'À la charge du vendeur' },
    ],
    advertiser: { name: 'Label Immo', address: '25 rue du Mail, 75002 Paris', siret: '851800235', carte: 'CPI 9301 2016 000 017 847' },
    coordinates: { lat: 48.8963, lng: 2.3838 },
    reference: 'f5209eb4-574f-4d32-996a-f30653',
    cardTitle: 'Spacieux 4 pièces avec balcon plein sud',
    cardLocation: 'Paris 19e, Île-de-France',
    cardPrice: '599 000 €',
    cardFeatures: [{ label: '4 pièces' }, { label: '77 m²' }],
    badgeLabel: 'Coup de cœur',
    badgeColor: 'blue',
  },
  {
    id: 'maison-familiale-versailles',
    title: 'Maison familiale avec jardin à Versailles',
    location: '78000 Versailles',
    price: '350 000 €',
    pricePerM2: '2 917 €/m²',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
    ],
    specs: [
      { icon: React.createElement(IconRuler, { size: 24 }), label: '120 m²' },
      { icon: React.createElement(IconBuilding, { size: 24 }), label: 'RDC + 1' },
      { icon: React.createElement(IconDoor, { size: 24 }), label: '5 pièces' },
      { icon: React.createElement(IconBed, { size: 24 }), label: '4 chambres' },
      { icon: React.createElement(IconShower, { size: 24 }), label: "1 salle d'eau" },
      { icon: React.createElement(IconBath, { size: 24 }), label: '1 salle de bain' },
    ],
    description: [
      "Belle maison familiale de 120 m² avec jardin privatif de 200 m², située dans un quartier résidentiel calme de Versailles.",
      "Le rez-de-chaussée comprend un grand séjour lumineux ouvert sur le jardin, une cuisine équipée et un WC. L'étage dessert quatre chambres et une salle de bain.",
      "Proche des commerces et des transports, cette maison offre un cadre de vie idéal pour une famille.",
    ],
    characteristics: [
      { icon: React.createElement(IconRuler, { size: 24 }), label: 'Surface', value: '120 m²' },
      { icon: React.createElement(IconBuilding, { size: 24 }), label: 'Étage', value: 'RDC + 1' },
      { icon: React.createElement(IconDoor, { size: 24 }), label: 'Nombre de pièces', value: '5' },
      { icon: React.createElement(IconBed, { size: 24 }), label: 'Chambres', value: '4' },
      { icon: React.createElement(IconShower, { size: 24 }), label: "Salle d'eau", value: '1' },
      { icon: React.createElement(IconBath, { size: 24 }), label: 'Salle de bain', value: '1' },
    ],
    specificites: ['Jardin', 'Garage', 'Double vitrage', 'Cuisine aménagée', 'Cheminée', 'Parquet', 'Cave'],
    dpe: { grade: 'D', value: 195 },
    ges: { grade: 'D', value: 195 },
    copropriete: [
      { label: 'Nombre de lots', value: 'Non applicable' },
      { label: 'Charges de copropriété', value: 'Non applicable' },
      { label: 'Procédures syndicales en cours', value: 'Non' },
    ],
    environnement: ['Bus', 'Gare RER', 'Collège', 'Lycée', 'Centre commercial', 'Parc', 'École primaire'],
    pricingDetails: [
      { label: 'Prix de vente', value: '350 000 €' },
      { label: 'Honoraires', value: 'À la charge du vendeur' },
    ],
    advertiser: { name: 'Label Immo', address: '12 rue de la Paix, 78000 Versailles', siret: '912345678', carte: 'CPI 7801 2020 000 012 345' },
    coordinates: { lat: 48.8048, lng: 2.1204 },
    reference: 'a3b2c1d0-1234-5678-abcd-ef0123456789',
    cardTitle: 'Maison familiale avec jardin',
    cardLocation: 'Versailles, Yvelines',
    cardPrice: '350 000 €',
    cardFeatures: [{ label: '5 pièces' }, { label: '120 m²' }],
    badgeLabel: 'Pépite rare',
    badgeColor: 'purple',
  },
  {
    id: 'villa-vue-mer-nice',
    title: 'Villa contemporaine vue mer panoramique à Nice',
    location: '06000 Nice',
    price: '890 000 €',
    pricePerM2: '3 179 €/m²',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    ],
    specs: [
      { icon: React.createElement(IconRuler, { size: 24 }), label: '280 m²' },
      { icon: React.createElement(IconBuilding, { size: 24 }), label: '2 niveaux' },
      { icon: React.createElement(IconDoor, { size: 24 }), label: '7 pièces' },
      { icon: React.createElement(IconBed, { size: 24 }), label: '5 chambres' },
      { icon: React.createElement(IconShower, { size: 24 }), label: "2 salles d'eau" },
      { icon: React.createElement(IconBath, { size: 24 }), label: '2 salles de bain' },
    ],
    description: [
      "Superbe villa contemporaine de 280 m² offrant une vue mer panoramique exceptionnelle sur la Baie des Anges.",
      "L'espace de vie principal s'ouvre sur une terrasse de 60 m² avec piscine à débordement. La cuisine est entièrement équipée avec des matériaux haut de gamme.",
      "Les cinq chambres, dont une suite parentale avec dressing et salle de bain privative, sont réparties sur deux niveaux.",
      "Quartier résidentiel prisé, proche du centre-ville et de l'aéroport de Nice-Côte d'Azur.",
    ],
    characteristics: [
      { icon: React.createElement(IconRuler, { size: 24 }), label: 'Surface', value: '280 m²' },
      { icon: React.createElement(IconBuilding, { size: 24 }), label: 'Niveaux', value: '2' },
      { icon: React.createElement(IconDoor, { size: 24 }), label: 'Nombre de pièces', value: '7' },
      { icon: React.createElement(IconBed, { size: 24 }), label: 'Chambres', value: '5' },
      { icon: React.createElement(IconShower, { size: 24 }), label: "Salle d'eau", value: '2' },
      { icon: React.createElement(IconBath, { size: 24 }), label: 'Salle de bain', value: '2' },
    ],
    specificites: ['Piscine', 'Terrasse', 'Garage double', 'Climatisation', 'Vue mer', 'Cuisine aménagée', 'Dressing', 'Jardin paysagé', 'Alarme'],
    dpe: { grade: 'B', value: 85 },
    ges: { grade: 'A', value: 42 },
    copropriete: [
      { label: 'Nombre de lots', value: 'Non applicable' },
      { label: 'Charges de copropriété', value: 'Non applicable' },
      { label: 'Procédures syndicales en cours', value: 'Non' },
    ],
    environnement: ['Bus', 'Tram', 'Plage', 'Centre commercial', 'Aéroport', 'Restaurant', 'Collège', 'Lycée'],
    pricingDetails: [
      { label: 'Prix de vente', value: '890 000 €' },
      { label: 'Honoraires', value: 'À la charge de l\'acquéreur (3%)' },
    ],
    advertiser: { name: 'Côte d\'Azur Prestige', address: '8 Promenade des Anglais, 06000 Nice', siret: '823456789', carte: 'CPI 0601 2018 000 098 765' },
    coordinates: { lat: 43.7102, lng: 7.2620 },
    reference: 'b7c8d9e0-abcd-1234-5678-fedcba987654',
    cardTitle: 'Villa contemporaine vue mer panoramique',
    cardLocation: 'Nice, Alpes-Maritimes',
    cardPrice: '890 000 €',
    cardFeatures: [{ label: '7 pièces' }, { label: '280 m²' }],
    badgeLabel: 'Très demandé',
    badgeColor: 'amber',
  },
];

export function getPropertyById(id: string): PropertyData | undefined {
  return PROPERTIES.find((p) => p.id === id);
}
