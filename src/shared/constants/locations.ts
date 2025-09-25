export interface TelAvivLocation {
  id: string;
  name: string;
  description: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export const TEL_AVIV_LOCATIONS: TelAvivLocation[] = [
  {
    id: 'city_center',
    name: 'City Center (Merkaz HaIr)',
    description: 'Around Dizengoff, King George, Rothschild',
    coordinates: { latitude: 32.0755, longitude: 34.7755 }
  },
  {
    id: 'lev_hair',
    name: 'Lev HaIr (Heart of the City)',
    description: 'Historic & cultural center',
    coordinates: { latitude: 32.0668, longitude: 34.7705 }
  },
  {
    id: 'kerem_hateimanim',
    name: 'Kerem HaTeimanim',
    description: 'Next to Carmel Market, old Yemenite quarter',
    coordinates: { latitude: 32.0644, longitude: 34.7705 }
  },
  {
    id: 'florentin',
    name: 'Florentin',
    description: 'Hipster/artsy neighborhood, south Tel Aviv',
    coordinates: { latitude: 32.0594, longitude: 34.7705 }
  },
  {
    id: 'neve_tzedek',
    name: 'Neve Tzedek',
    description: 'The first neighborhood outside Jaffa, now trendy & upscale',
    coordinates: { latitude: 32.0611, longitude: 34.7655 }
  },
  {
    id: 'jaffa',
    name: 'Jaffa (Yafo)',
    description: 'Old Jaffa, Ajami, Giv\'at Aliya',
    coordinates: { latitude: 32.0550, longitude: 34.7500 }
  },
  {
    id: 'allenby_carmel',
    name: 'Allenby & Carmel Market area',
    description: 'Bustling central district',
    coordinates: { latitude: 32.0644, longitude: 34.7705 }
  },
  {
    id: 'sarona_hakirya',
    name: 'Sarona & HaKirya',
    description: 'Modern towers, shopping, near the IDF HQ',
    coordinates: { latitude: 32.0700, longitude: 34.7900 }
  },
  {
    id: 'hayarkon_namal',
    name: 'HaYarkon / Namal Tel Aviv (Port)',
    description: 'Nightlife, sea promenade',
    coordinates: { latitude: 32.0900, longitude: 34.7700 }
  },
  {
    id: 'bavli',
    name: 'Bavli',
    description: 'Quiet residential area',
    coordinates: { latitude: 32.0800, longitude: 34.7800 }
  },
  {
    id: 'montefiore',
    name: 'Montefiore',
    description: 'Mix of residential and office spaces',
    coordinates: { latitude: 32.0750, longitude: 34.7750 }
  },
  {
    id: 'shapira',
    name: 'Shapira',
    description: 'South, diverse & mixed community',
    coordinates: { latitude: 32.0550, longitude: 34.7800 }
  },
  {
    id: 'neve_shaanan',
    name: 'Neve Sha\'anan',
    description: 'Central bus station area',
    coordinates: { latitude: 32.0600, longitude: 34.7800 }
  },
  {
    id: 'kikar_hamedina',
    name: 'Kikar HaMedina & Northern Center',
    description: 'Luxury shops and residential',
    coordinates: { latitude: 32.0900, longitude: 34.7800 }
  },
  {
    id: 'old_north',
    name: 'Old North (HaTzafon HaYashan)',
    description: 'Around Dizengoff north, Ibn Gabirol',
    coordinates: { latitude: 32.0850, longitude: 34.7750 }
  },
  {
    id: 'new_north',
    name: 'New North (HaTzafon HaHadash)',
    description: 'Around Park HaYarkon',
    coordinates: { latitude: 32.1000, longitude: 34.7800 }
  },
  {
    id: 'ramat_aviv',
    name: 'Ramat Aviv',
    description: 'Includes Tel Aviv University, upscale',
    coordinates: { latitude: 32.1100, longitude: 34.8000 }
  },
  {
    id: 'kiryat_shalom',
    name: 'Kiryat Shalom',
    description: 'Southern residential neighborhood',
    coordinates: { latitude: 32.0400, longitude: 34.7800 }
  },
  {
    id: 'yad_eliyahu',
    name: 'Yad Eliyahu',
    description: 'Known for Menora Mivtachim Arena (basketball)',
    coordinates: { latitude: 32.0500, longitude: 34.7900 }
  },
  {
    id: 'ramat_hahayal',
    name: 'Ramat HaHayal',
    description: 'Hi-tech and business hub',
    coordinates: { latitude: 32.1200, longitude: 34.8200 }
  },
  {
    id: 'hatikva_quarter',
    name: 'Hatikva Quarter',
    description: 'Traditional working-class area, known for Hatikva Market',
    coordinates: { latitude: 32.0500, longitude: 34.7700 }
  }
];

export const getLocationById = (id: string): TelAvivLocation | undefined => {
  return TEL_AVIV_LOCATIONS.find(location => location.id === id);
};

export const getLocationByName = (name: string): TelAvivLocation | undefined => {
  return TEL_AVIV_LOCATIONS.find(location => 
    location.name.toLowerCase().includes(name.toLowerCase())
  );
};
