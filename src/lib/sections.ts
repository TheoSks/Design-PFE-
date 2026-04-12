import { PROPERTIES, PropertyData } from './properties';

export interface Section {
  slug: string;
  title: string;
  cards: PropertyData[];
}

export const SECTIONS: Section[] = [
  {
    slug: 'belle-luminosite',
    title: 'Belle luminosité',
    cards: [PROPERTIES[0], PROPERTIES[1], PROPERTIES[2]],
  },
  {
    slug: 'maison-proche-rer-yvelines',
    title: 'Maison proche RER dans les Yvelines',
    cards: [PROPERTIES[1], PROPERTIES[0], PROPERTIES[2]],
  },
  {
    slug: 'vue-mer',
    title: 'Vue mer',
    cards: [PROPERTIES[2], PROPERTIES[0], PROPERTIES[1]],
  },
  {
    slug: 'belle-luminosite-2',
    title: 'Belle luminosité',
    cards: [PROPERTIES[0], PROPERTIES[2], PROPERTIES[1]],
  },
];

export function getSectionBySlug(slug: string): Section | undefined {
  return SECTIONS.find((s) => s.slug === slug);
}
