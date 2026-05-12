const imageMap: Record<string, string> = {
  'Kenan Doğulu':   '/artists/kenan_dogulu.jpeg',
  'Orhan Gencebay': '/artists/orhan_gencebay.jpeg',
  'Candan Erçetin': '/artists/candan_ercetin.jpeg',
  'Sertab Erener':  '/artists/sertab_erener.jpeg',
  'Gülben Ergen':   '/artists/gulben_ergen.jpeg',
  'Barış Manço':    '/artists/baris_manco.jpeg',
  'Murat Boz':      '/artists/murat_boz.jpeg',
  'Erol Büyükburç': '/artists/erol_buyukburc.jpeg',
  'Demir Demirkan': '/artists/demir_demirkan.jpeg',
  'Zeynep Dizdar':  '/artists/zeynep_dizdar.jpeg',
  'Ferhat Göçer':   '/artists/ferhat_gocer.jpeg',
};

export function getArtistImage(name: string): string {
  return imageMap[name] ?? '/artists/default.jpeg';
}

const albumImageMap: Record<string, string> = {
  'Festival':  '/albums/festival.jpeg',
  'Patron':    '/albums/patron.jpeg',
  'Mançoloji': '/albums/mancoloji.jpeg',
  'Sakin Ol':  '/albums/sakin_ol.jpeg',
  'Turuncu':   '/albums/turuncu.jpeg',
  'Sade':      '/albums/sade.jpeg',
};

export function getAlbumImage(title: string, singerName: string): string {
  return albumImageMap[title] ?? getArtistImage(singerName);
}
