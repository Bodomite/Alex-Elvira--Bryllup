// ============================================================
//  ALT BRYLLUPSSPECIFIKT INDHOLD STYRES HERFRA
//  Ret tekster, tider og steder her – resten af siden følger med.
// ============================================================

const maps = (q) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;

export const config = {
  bride: 'Elvira',
  groom: 'Alexander',
  monogram: 'E & A',
  coupleNames: 'Elvira & Alexander',
  surname: 'Kragelund Karlsen Majkjær',

  // Dato & tid for vielsen (bruges til nedtælling)
  weddingDateISO: '2027-08-07T11:00:00',
  dateText: '7. August 2027',
  year: 2027,

  church: {
    name: 'Sæby Kirke',
    address: 'Sæby Kirke, 9300 Sæby',
    mapsUrl: maps('Sæby Kirke, 9300 Sæby'),
  },
  venue: {
    name: 'Tolne Skovpavillon',
    address: 'Tolne Skovpavillon, 9870 Sindal',
    mapsUrl: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent('Sæby Kirke, 9300 Sæby')}&destination=${encodeURIComponent('Tolne Skovpavillon, 9870 Sindal')}`,
  },

  rsvp: {
    email: 'majkjaer@outlook.dk',
    deadline: '1. juni 2027',
  },
  toastmaster: {
    name: 'Camilla Møller Andersen',
    email: 'majkjaer_bryllup@outlook.dk',
    deadline: '1. juli 2027',
  },

  // Ønskeskyen: indsæt ID'et fra linket, fx
  // https://onskeskyen.dk/da/wishlists/XXXXXXXXXXXX  ->  'XXXXXXXXXXXX'
  // Ønskerne hentes automatisk – intet skal vedligeholdes manuelt.
  wishlistId: '',

  // Programmet – mere tilføjes, når det er på plads.
  // `programPending: true` viser en lille note om at programmet følger.
  programPending: true,
  program: [
    {
      time: '11:00',
      title: 'Vielse',
      location: 'Sæby Kirke',
      mapsLabel: 'Find Kirken Her',
      mapsKey: 'church',
      description:
        'Vielsen finder sted i Sæby Kirke. Traditionen tro skal gommens familie sidde i kirkens højre side, mens brudens familie skal sidde til venstre.',
    },
    {
      time: 'Senere',
      title: 'Fest',
      location: 'Tolne Skovpavillon',
      mapsLabel: 'Find Skovpavillonen Her',
      mapsKey: 'venue',
      description:
        'Festen holdes på Tolne Skovpavillon midt i den smukke Tolne Skov. Det detaljerede program for dagen følger.',
    },
  ],
};

export const API = {
  heroList: '/list_hero.php',
  photos: '/list_photos.php',
  upload: '/upload.php',
  deletePhoto: '/delete_photo.php',
  submitDiet: '/submit_diet.php',
  adminDiet: '/admin_diet.php',
  exportDiet: '/export_diet.php',
  wishlist: '/wishlist.php',
};
