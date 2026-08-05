export interface RawFestivalItem {
  UC_SEQ: number;
  MAIN_TITLE: string;
  GUGUN_NM: string;
  LAT: number | string;
  LNG: number | string;
  PLACE: string;
  TITLE: string;
  SUBTITLE: string;
  MAIN_PLACE: string;
  ADDR1: string;
  ADDR2: string;
  CNTCT_TEL: string;
  HOMEPAGE_URL: string;
  TRFC_INFO: string;
  USAGE_DAY: string;
  USAGE_DAY_WEEK_AND_TIME: string;
  USAGE_AMOUNT: string;
  MAIN_IMG_NORMAL: string;
  MAIN_IMG_THUMB: string;
  ITEMCNTNTS: string;
  MIDDLE_SIZE_RM1: string;
}

export interface Festival {
  id: number;
  title: string;
  rawTitle: string;
  tagline: string;
  district: string; // 구/군 (e.g. 해운대구)
  place: string;
  address: string;
  lat: number;
  lng: number;
  tel: string;
  homepage: string;
  trafficInfo: string;
  usageDay: string;
  dateText: string;
  startDate: string | null; // YYYY-MM-DD
  endDate: string | null;   // YYYY-MM-DD
  years: number[];          // e.g. [2025, 2026]
  months: number[];         // e.g. [5, 6]
  usageAmount: string;
  isFree: boolean;
  imgNormal: string;
  imgThumb: string;
  contents: string;
  accessibility: string;
  status: 'ongoing' | 'upcoming' | 'past' | 'always';
}

export interface FilterState {
  district: string;        // 'all' or district name e.g. '해운대구'
  year: string;            // 'all', '2025', '2026'
  month: string;           // 'all', '1', '2', ..., '12'
  status: string;          // 'all', 'ongoing', 'upcoming', 'always'
  fee: string;             // 'all', 'free', 'paid'
  searchQuery: string;
  onlyBookmarks: boolean;
}

export type ViewMode = 'grid' | 'map' | 'calendar';
