export interface LegacyCurrency {
  name: string;
  // units per euro
  rate: number;
}

// fixed euro conversion rates, see
// https://www.ecb.europa.eu/euro/intro/html/index.en.html
export const LEGACY_CURRENCIES: Record<string, LegacyCurrency> = {
  ATS: { name: "Österreichischer Schilling", rate: 13.7603 },
  BEF: { name: "Belgischer Franken", rate: 40.3399 },
  BGN: { name: "Bulgarischer Lew", rate: 1.95583 },
  CYP: { name: "Zypern-Pfund", rate: 0.585274 },
  DEM: { name: "Deutsche Mark", rate: 1.95583 },
  EEK: { name: "Estnische Krone", rate: 15.6466 },
  ESP: { name: "Spanische Peseta", rate: 166.386 },
  FIM: { name: "Finnische Mark", rate: 5.94573 },
  FRF: { name: "Französischer Franc", rate: 6.55957 },
  GRD: { name: "Griechische Drachme", rate: 340.75 },
  HRK: { name: "Kroatische Kuna", rate: 7.5345 },
  IEP: { name: "Irisches Pfund", rate: 0.787564 },
  ITL: { name: "Italienische Lira", rate: 1936.27 },
  LTL: { name: "Litauischer Litas", rate: 3.4528 },
  LUF: { name: "Luxemburgischer Franken", rate: 40.3399 },
  LVL: { name: "Lettischer Lats", rate: 0.702804 },
  MTL: { name: "Maltesische Lira", rate: 0.4293 },
  NLG: { name: "Niederländischer Gulden", rate: 2.20371 },
  PTE: { name: "Portugiesischer Escudo", rate: 200.482 },
  SIT: { name: "Slowenischer Tolar", rate: 239.64 },
  SKK: { name: "Slowakische Krone", rate: 30.126 },
};

export const LEGACY_ISO_CODES = Object.keys(LEGACY_CURRENCIES);

export const isLegacyCurrency = (isoCode: string) =>
  LEGACY_ISO_CODES.includes(isoCode);
