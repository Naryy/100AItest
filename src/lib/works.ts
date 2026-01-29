export interface Work {
  slug: string;
  title: string;
  date: string;
  location: string;
  description: string;
  tags: string[];
  images: string[]; // ファイル名のみ (例: "image1.jpg")
  featured?: boolean;
}

export const works: Work[] = [
  {
    slug: 'tokyo-night',
    title: '東京の夜景',
    date: '2024-03-15',
    location: '東京都',
    description: '東京の夜景を撮影しました。高層ビルの灯りが美しく輝いています。',
    tags: ['都市', '夜景', '東京'],
    featured: true,
    images: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg']
  },
  {
    slug: 'kyoto-temple',
    title: '京都の寺院',
    date: '2024-02-20',
    location: '京都府',
    description: '京都の歴史ある寺院を撮影しました。静寂な雰囲気が漂います。',
    tags: ['寺院', '京都', '歴史'],
    featured: true,
    images: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg']
  },
  {
    slug: 'hokkaido-snow',
    title: '北海道の雪景色',
    date: '2024-01-10',
    location: '北海道',
    description: '北海道の雪景色を撮影しました。一面の銀世界が広がります。',
    tags: ['雪', '自然', '北海道'],
    featured: true,
    images: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg']
  },
  {
    slug: 'osaka-street',
    title: '大阪の街並み',
    date: '2023-12-05',
    location: '大阪府',
    description: '大阪の活気ある街並みを撮影しました。',
    tags: ['都市', '街並み', '大阪'],
    images: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg']
  },
  {
    slug: 'fuji-sunrise',
    title: '富士山の朝焼け',
    date: '2023-11-18',
    location: '静岡県',
    description: '富士山の朝焼けを撮影しました。神秘的な美しさです。',
    tags: ['富士山', '自然', '朝焼け'],
    featured: true,
    images: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg']
  },
  {
    slug: 'okinawa-beach',
    title: '沖縄のビーチ',
    date: '2023-10-22',
    location: '沖縄県',
    description: '沖縄の美しいビーチを撮影しました。透き通る青い海が印象的です。',
    tags: ['海', '自然', '沖縄'],
    featured: true,
    images: ['01.jpg', '02.jpg', '03.jpg', '04.jpg']
  },
  {
    slug: 'nagoya-castle',
    title: '名古屋城',
    date: '2023-09-15',
    location: '愛知県',
    description: '名古屋城を撮影しました。歴史を感じる壮大な建築物です。',
    tags: ['城', '歴史', '名古屋'],
    featured: true,
    images: ['01.jpg', '02.jpg', '03.jpg', '04.jpg']
  },
];

export function getWorkBySlug(slug: string): Work | undefined {
  return works.find(work => work.slug === slug);
}

export function getAllWorks(): Work[] {
  return works.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedWorks(limit: number = 6): Work[] {
  return works
    .filter(work => work.featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
