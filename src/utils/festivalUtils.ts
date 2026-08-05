import { Festival, RawFestivalItem } from '../types';

export function cleanTitle(title: string): string {
  if (!title) return '';
  return title
    .replace(/\s*\([^)]*\)\s*$/, '')
    .replace(/\/\/[^)]*$/, '')
    .trim();
}

export function parseFestivalItem(raw: RawFestivalItem): Festival {
  const title = cleanTitle(raw.MAIN_TITLE);
  const district = (raw.GUGUN_NM || '').trim();
  const dateText = (raw.USAGE_DAY_WEEK_AND_TIME || raw.USAGE_DAY || '').trim();
  const usageAmount = (raw.USAGE_AMOUNT || '').trim();

  const isFree = usageAmount.includes('무료') || 
                 usageAmount === '0원' || 
                 usageAmount.includes('무상') || 
                 usageAmount === '없음' || 
                 usageAmount === '';

  // Extract years
  const yearMatches = dateText.match(/\b(202[4-8])\b/g);
  const years = yearMatches ? Array.from(new Set(yearMatches.map(Number))) : [];

  // Extract months
  const monthsSet = new Set<number>();
  
  // Look for Month patterns like "8. 1", "05. 22", "11월 29일", "5. 15", "07."
  const monthRegexes = [
    /(\d{1,2})\s*월/g,
    /(\d{4})\.\s*(\d{1,2})/g,
    /\.\s*(\d{1,2})\s*\.\s*\d{1,2}/g
  ];

  monthRegexes.forEach(regex => {
    let match;
    while ((match = regex.exec(dateText)) !== null) {
      const monthNum = parseInt(match[2] || match[1], 10);
      if (monthNum >= 1 && monthNum <= 12) {
        monthsSet.add(monthNum);
      }
    }
  });

  const months = Array.from(monthsSet).sort((a, b) => a - b);

  // Derive start/end date estimates for filtering
  let startDate: string | null = null;
  let endDate: string | null = null;

  // Simple ISO date matcher if available
  const isoDates = dateText.match(/\b(202[4-8])[\.\-년]\s*(\d{1,2})[\.\-월]\s*(\d{1,2})/g);
  if (isoDates && isoDates.length > 0) {
    const formatIso = (str: string) => {
      const parts = str.match(/\d+/g);
      if (parts && parts.length >= 3) {
        const y = parts[0];
        const m = parts[1].padStart(2, '0');
        const d = parts[2].padStart(2, '0');
        return `${y}-${m}-${d}`;
      }
      return null;
    };
    startDate = formatIso(isoDates[0]);
    if (isoDates.length > 1) {
      endDate = formatIso(isoDates[isoDates.length - 1]);
    } else {
      endDate = startDate;
    }
  }

  // Determine status (ongoing, upcoming, past, always)
  // Current simulated today: August 2026 or dynamic Date comparison
  const now = new Date();
  const currentYear = now.getFullYear(); // 2026
  const currentMonth = now.getMonth() + 1; // 8
  const currentDateStr = now.toISOString().split('T')[0];

  let status: Festival['status'] = 'always';

  if (!dateText || dateText.includes('상시') || dateText.includes('매주') || years.length === 0) {
    status = 'always';
  } else if (startDate && endDate) {
    if (currentDateStr >= startDate && currentDateStr <= endDate) {
      status = 'ongoing';
    } else if (currentDateStr < startDate) {
      status = 'upcoming';
    } else {
      status = 'past';
    }
  } else if (years.length > 0) {
    const maxYear = Math.max(...years);
    if (maxYear > currentYear) {
      status = 'upcoming';
    } else if (maxYear === currentYear) {
      if (months.length > 0) {
        const maxMonth = Math.max(...months);
        const minMonth = Math.min(...months);
        if (currentMonth >= minMonth && currentMonth <= maxMonth) {
          status = 'ongoing';
        } else if (currentMonth < minMonth) {
          status = 'upcoming';
        } else {
          status = 'past';
        }
      } else {
        status = 'upcoming';
      }
    } else {
      status = 'past';
    }
  }

  const latNum = typeof raw.LAT === 'number' ? raw.LAT : parseFloat(raw.LAT) || 35.1795543;
  const lngNum = typeof raw.LNG === 'number' ? raw.LNG : parseFloat(raw.LNG) || 129.0756416;

  return {
    id: raw.UC_SEQ,
    title,
    rawTitle: raw.MAIN_TITLE,
    tagline: raw.TITLE || raw.SUBTITLE || raw.PLACE || title,
    district: district || '기타',
    place: raw.PLACE || raw.MAIN_PLACE || raw.ADDR1 || '부산광역시',
    address: raw.ADDR1 || '부산광역시',
    lat: latNum,
    lng: lngNum,
    tel: raw.CNTCT_TEL || '',
    homepage: raw.HOMEPAGE_URL || '',
    trafficInfo: raw.TRFC_INFO || '',
    usageDay: raw.USAGE_DAY || '',
    dateText,
    startDate,
    endDate,
    years,
    months,
    usageAmount: usageAmount || '무료 또는 연동 정보 확인',
    isFree,
    imgNormal: raw.MAIN_IMG_NORMAL || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    imgThumb: raw.MAIN_IMG_THUMB || raw.MAIN_IMG_NORMAL || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80',
    contents: raw.ITEMCNTNTS || '',
    accessibility: raw.MIDDLE_SIZE_RM1 || '',
    status
  };
}

export const BUSAN_DISTRICTS = [
  '전체',
  '해운대구',
  '수영구',
  '중구',
  '부산진구',
  '금정구',
  '기장군',
  '영도구',
  '남구',
  '북구',
  '동래구',
  '사하구',
  '강서구',
  '동구',
  '서구',
  '연제구',
  '사상구'
];

export const DISTRICT_COORDINATES: Record<string, { lat: number; lng: number }> = {
  '해운대구': { lat: 35.1631, lng: 129.1636 },
  '수영구': { lat: 35.1456, lng: 129.1132 },
  '중구': { lat: 35.1062, lng: 129.0326 },
  '부산진구': { lat: 35.1630, lng: 129.0531 },
  '금정구': { lat: 35.2429, lng: 129.0924 },
  '기장군': { lat: 35.2447, lng: 129.2223 },
  '영도구': { lat: 35.0912, lng: 129.0678 },
  '남구': { lat: 35.1365, lng: 129.0842 },
  '북구': { lat: 35.1972, lng: 128.9902 },
  '동래구': { lat: 35.2048, lng: 129.0838 },
  '사하구': { lat: 35.1046, lng: 128.9751 },
  '강서구': { lat: 35.2122, lng: 128.9801 },
  '동구': { lat: 35.1293, lng: 129.0454 },
  '서구': { lat: 35.0979, lng: 129.0244 },
  '연제구': { lat: 35.1763, lng: 129.0798 },
  '사상구': { lat: 35.1527, lng: 128.9913 },
};
