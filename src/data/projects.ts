export interface Project {
  slug: string;
  title: string;
  setting: string;
  category: 'Residential' | 'Retreats';
  scope: string;
  image: string;
  detailImage: string;
  alt: string;
  detailAlt: string;
  description: string;
  material: string;
}

export const projects: Project[] = [
  {
    slug: 'the-courtyard',
    title: 'The Courtyard',
    setting: 'A Mediterranean residence',
    category: 'Residential',
    scope: 'Complete pool renewal',
    image: 'courtyard',
    detailImage: 'stone-detail',
    alt: 'Courtyard pool concept with renewed limestone coping, dark water, and a warmly lit stone residence at dusk',
    detailAlt: 'Warm travertine pool coping meeting deep green water, showing the proposed natural stone finish',
    description: 'A quieter relationship between a home and its water. This concept brings warm limestone, a deep mineral finish, and softly integrated lighting into one continuous landscape. The existing footprint becomes the starting point for a new way of spending time outside.',
    material: 'Travertine · mineral plaster · warm light',
  },
  {
    slug: 'among-the-olives',
    title: 'Among the Olives',
    setting: 'A garden retreat',
    category: 'Residential',
    scope: 'Resurfacing & landscape',
    image: 'olive-pool',
    detailImage: 'garden-detail',
    alt: 'Garden pool concept with pale stone decking, olive trees, and a mineral pool finish in afternoon light',
    detailAlt: 'A quiet limestone terrace beside olive trees and a renewed garden pool',
    description: 'Water belongs to the garden as much as it does to the house. A soft mineral surface and a restrained stone edge allow this pool to settle into its surroundings. Olive trees provide shade; a generous terrace makes space for unhurried afternoons.',
    material: 'Limestone · olive trees · mineral plaster',
  },
  {
    slug: 'the-long-weekend',
    title: 'The Long Weekend',
    setting: 'A coastal guesthouse',
    category: 'Retreats',
    scope: 'Pool, deck & lighting',
    image: 'coastal-pool',
    detailImage: 'water-detail',
    alt: 'Coastal guesthouse pool concept with a natural stone terrace, timber shade, and a sea horizon at golden hour',
    detailAlt: 'Sunlight rippling over a soft green pool finish beside a handcrafted stone edge',
    description: 'An open horizon, a place to gather, and very little else. This retreat concept pairs a renewed pool with weathering timber and warm stone. The terrace follows the water, connecting the guesthouse to the landscape beyond.',
    material: 'Sandstone · timber · soft green tile',
  },
  {
    slug: 'after-the-light',
    title: 'After the Light',
    setting: 'A secluded residence',
    category: 'Residential',
    scope: 'Lighting & material renewal',
    image: 'evening-pool',
    detailImage: 'interior',
    alt: 'Evening pool concept with carefully integrated amber lighting and a restored timber terrace',
    detailAlt: 'Warm walnut and limestone pool pavilion with a view toward the water at dusk',
    description: 'A pool has a life after the sun goes down. This study explores how a few carefully placed sources of light can reveal the texture of stone, guide the edge of a terrace, and give the water a quieter presence in the evening.',
    material: 'Walnut · limestone · integrated lighting',
  },
];

export const services = [
  { number: '01', title: 'Surfaces & tile', text: 'A new character, from the water up. Considered finishes that feel as good as they look.', id: 'surfaces' },
  { number: '02', title: 'Decks & surroundings', text: 'Natural materials and thoughtful transitions. A pool that belongs to its landscape.', id: 'surroundings' },
  { number: '03', title: 'Light & atmosphere', text: 'Quietly integrated lighting. Spaces that invite you to stay a little longer.', id: 'lighting' },
  { number: '04', title: 'Complete renewal', text: 'One coherent vision, from the first conversation to the final detail.', id: 'renewal' },
];
