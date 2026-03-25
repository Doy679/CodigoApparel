export const postalCodes: { [city: string]: string } = {
  // METRO MANILA
  "MANILA": "1000", "QUEZON CITY": "1100", "CALOOCAN": "1400", "LAS PIÑAS": "1740", "MAKATI": "1200", "MALABON": "1470", "MANDALUYONG": "1550", "MARIKINA": "1800", "MUNTINLUPA": "1770", "NAVOTAS": "1485", "PARAÑAQUE": "1700", "PASAY": "1300", "PASIG": "1600", "PATEROS": "1620", "SAN JUAN": "1500", "TAGUIG": "1630", "VALENZUELA": "1440",
  
  // CEBU
  "CEBU CITY": "6000", "MANDAUE CITY": "6014", "LAPU-LAPU CITY": "6015", "TALISAY CITY": "6045", "DANAO CITY": "6004", "TOLEDO CITY": "6038", "BOGO CITY": "6010", "CARCAR CITY": "6019", "NAGA CITY": "6037", "CONSOLACION": "6001", "LILOAN": "6002", "COMPOSTELA": "6003", "CORDOVA": "6017", "MINGLANILLA": "6046", "SAN FERNANDO": "6018", "ARGAO": "6021", "BALAMBAN": "6041", "BANTAYAN": "6052", "BARILI": "6036", "BOGO": "6010", "CARCAR": "6019", "CARMEN": "6005", "CATMON": "6006", "DANAO": "6004", "DUMANJUG": "6035", "MEDELLIN": "6012", "MOALBOAL": "6032", "OSLOB": "6025", "SIBUNGA": "6020", "TOLEDO": "6038", "TUBURAN": "6043",

  // CAVITE
  "DASMARIÑAS": "4114", "BACOOR": "4102", "IMUS": "4103", "CAVITE CITY": "4100", "TAGAYTAY CITY": "4120", "TRECE MARTIRES CITY": "4109", "GENERAL TRIAS": "4107", "SILANG": "4118", "KAWIT": "4104", "ROSARIO": "4106", "TANZA": "4108", "NAIC": "4110", "CARMONA": "4116", "GEN. MARIANO ALVAREZ": "4117",

  // LAGUNA
  "BIÑAN": "4024", "SANTA ROSA": "4026", "CABUYAO": "4025", "CALAMBA": "4027", "SAN PABLO CITY": "4000", "SAN PEDRO": "4023", "LOS BAÑOS": "4030", "STA. CRUZ": "4009", "PAGSANJAN": "4008",

  // BATANGAS
  "BATANGAS CITY": "4200", "LIPA CITY": "4217", "TANAUAN CITY": "4232", "SANTO TOMAS": "4234", "NASUGBU": "4231", "BAUAN": "4201", "LEMERY": "4209", "BALAYAN": "4213", "CALATAGAN": "4215",

  // RIZAL
  "ANTIPOLO": "1870", "CAINTA": "1900", "TAYTAY": "1920", "ANGONO": "1930", "BINANGONAN": "1940", "SAN MATEO": "1960", "RODRIGUEZ": "1860", "MORONG": "1960", "TANAY": "1980",

  // BULACAN
  "MALOLOS": "3000", "MEYCAUAYAN CITY": "3020", "SAN JOSE DEL MONTE": "3023", "BALIUAG": "3006", "MARILAO": "3019", "SANTA MARIA": "3022", "BOCAUE": "3018", "GUIGUINTO": "3015", "PLARIDEL": "3004", "HAGONOY": "3002",

  // PAMPANGA
  "ANGELES CITY": "2009", "SAN FERNANDO CITY": "2000", "MABALACAT": "2010", "LUBAO": "2005", "MEXICO": "2021", "GUAGUA": "2003", "APALIT": "2016", "ARAYAT": "2012",

  // PANGASINAN
  "DAGUPAN CITY": "2400", "URDANETA CITY": "2428", "SAN CARLOS CITY": "2420", "ALAMINOS CITY": "2404", "LINGAYEN": "2401", "MANGALDAN": "2432", "CALASIAO": "2418",

  // BENGUET
  "BAGUIO CITY": "2600", "LA TRINIDAD": "2601", "ITOGON": "2604", "TUBA": "2603",

  // ILOILO
  "ILOILO CITY": "5000", "PASSI CITY": "5037", "OTON": "5020", "PAVIA": "5001", "STA. BARBARA": "5002", "DUMANGAS": "5006", "POTOTAN": "5008",

  // NEGROS OCCIDENTAL
  "BACOLOD CITY": "6100", "BAGO CITY": "6101", "CADIZ CITY": "6121", "SILAY CITY": "6116", "TALISAY CITY NEGROS": "6115", "VICTORIAS CITY": "6119", "SAGAY CITY": "6122", "KABANKALAN CITY": "6111",

  // DAVAO
  "DAVAO CITY": "8000", "DIGOS CITY": "8002", "TAGUM CITY": "8100", "PANABO CITY": "8105", "SAMAL CITY": "8119", "MATI CITY": "8200",

  // MISAMIS ORIENTAL
  "CAGAYAN DE ORO": "9000", "EL SALVADOR CITY": "9017", "GINGOOG CITY": "9014",

  // ZAMBOANGA
  "ZAMBOANGA CITY": "7000", "PAGADIAN CITY": "7016", "DIPOLOG CITY": "7100",

  // SOUTH COTABATO
  "GENERAL SANTOS": "9500", "KORONADAL CITY": "9506", "POLOMOLOK": "9504"
};

/**
 * Normalizes a city name for lookup.
 * Removes common prefixes/suffixes like "City of", "Municipality of", "City", etc.
 */
export const getZipCode = (cityName: string): string => {
  if (!cityName) return "";
  
  const normalize = (name: string) => {
    return name.toUpperCase()
      .replace(/^CITY OF /g, "")
      .replace(/^MUNICIPALITY OF /g, "")
      .replace(/ CITY$/g, "")
      .replace(/ MUNICIPALITY$/g, "")
      .replace(/[^A-Z0-9 ]/g, "") // Remove special chars like dots or dashes for better matching
      .trim();
  };

  const cleanInput = normalize(cityName);
  
  // Try exact match first on keys
  for (const [key, value] of Object.entries(postalCodes)) {
    if (normalize(key) === cleanInput) return value;
  }
  
  return "";
};

export interface LocationHierarchy {
  [province: string]: {
    [city: string]: string[];
  };
}

export const locationHierarchy: LocationHierarchy = {
  "Cebu": {
    "Cebu City": ["Apas", "Banilad", "Capitol Site", "Guadalupe", "Lahug", "Mabolo", "Talamban", "Tisa"],
    "Mandaue City": ["Bakilid", "Banilad", "Basak", "Cabancalan", "Canduman", "Casuntingan", "Centro", "Guizo", "Ibabao-Estancia", "Labogon", "Looc", "Maguikay", "Mantuyong", "Opao", "Pagsabungan", "Pakna-an", "Subangdaku", "Tabok", "Tipolo", "Umapad"],
    "Lapu-Lapu City": ["Basak", "Babag", "Gun-ob", "Mactan", "Marigondon", "Pajac", "Poblacion", "Pusok"],
    "Talisay City": ["Bulacao", "Candulawan", "Dumlog", "Lawaan I", "Lawaan II", "Lawaan III", "Linao", "Poblacion"]
  },
  "Metro Manila": {
    "Manila": ["Binondo", "Ermita", "Intramuros", "Malate", "Paco", "Pandacan", "Sampaloc", "Tondo"],
    "Quezon City": ["Fairview", "Commonwealth", "Batasan Hills", "Novaliches", "Diliman", "Cubao"],
    "Makati": ["Bel-Air", "Poblacion", "San Lorenzo", "Dasmariñas", "Magallanes", "Guadalupe Nuevo"],
    "Taguig": ["Fort Bonifacio", "BGC", "Western Bicutan", "Upper Bicutan", "Signal Village"]
  },
  "Cavite": {
    "Dasmariñas": ["Burol", "Langkaan", "Paliparan", "Salawag", "Sampaloc", "San Agustin"],
    "Bacoor": ["Molino I", "Molino II", "Molino III", "Molino IV", "San Nicolas"],
    "Imus": ["Anabu I", "Anabu II", "Bayan Luma", "Carsadang Bago", "Malagasang I"]
  },
  "Davao del Sur": {
    "Davao City": ["Agdao", "Buhangin", "Bunawan", "Calinan", "Paquibato", "Poblacion", "Talomo", "Toril"]
  }
};

export const allProvinces = Object.keys(locationHierarchy).sort();
