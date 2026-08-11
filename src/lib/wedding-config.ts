export type LinkConfig = {
  label: string;
  url: string | null;
};

export const weddingConfig = {
  couple: {
    names: 'Edgar & Brenda'
  },
  civil: {
    dateLabel: '23 de mayo de 2026',
    locationLabel: 'Celaya, Guanajuato'
  },
  religious: {
    dateIso: '2026-12-18T14:00:00-06:00',
    dateLabel: 'Viernes 18 de diciembre de 2026',
    timeLabel: '2:00 p. m.',
    churchName: 'Parroquia San Felipe de Jesús',
    churchAddress: 'Canal de Labradores y Presa Peñuelitas s/n, Presa Peñuelitas, Benito Juárez, 38030 Celaya, Gto.',
    churchMapUrl: 'https://maps.app.goo.gl/qZjnLNBJrub2dkgC6',
    receptionName: 'Salón Belvedere · Salón Alejandra',
    receptionAddress: 'Av. las Arboledas #400, Ejido de Santa María, 38010 Celaya, Gto.',
    receptionTimeLabel: '3:30 p. m.',
    receptionMapUrl: 'https://maps.app.goo.gl/c8KpKKNg4Ax6TiMp9',
    dressCode: 'Formal',
    dressCodeNotes: [
      'Caballeros: les pedimos evitar el color negro.',
      'Damas: les pedimos evitar el color blanco.'
    ],
    recommendations: [] as string[],
    confirmationWhatsApp: '524471419915'
  },
  storyVideo: {
    url: null as string | null,
    poster: null as string | null,
    title: 'Nuestra historia',
    description: 'De dos ciudades diferentes, dos historias comenzaron a acercarse sin saberlo.',
    autoplay: false,
    controls: true
  },
  gifts: {
    amazon: {
      label: 'Ver lista de regalos en Amazon',
      url: 'https://www.amazon.com.mx/wedding/guest-view/14A2SBR3GEMS'
    } satisfies LinkConfig,
    liverpool: {
      label: 'Ver mesa de regalos en Liverpool',
      url: 'https://mesaderegalos.liverpool.com.mx/gestiondeeventos/listaderegalos/60026024'
    } satisfies LinkConfig
  }
} as const;
