import type { Request, Response } from 'express';

const SERVICE_KEY = process.env.BUSAN_FESTIVAL_SERVICE_KEY || 
  "Lg9oty7Y%2B0H352dMVa9xFCks84Y9encRMu%2BsKI2kCuE6rx8wAk82jKLiH5TjJb2%2BfYRaEbg4M3LtG214YbHcIw%3D%3D";

// Fallback dataset for serverless environment
const FALLBACK_FESTIVALS = [
  {
    "UC_SEQ": 327,
    "MAIN_TITLE": "부산바다축제(한,영, 중간,중번,일)",
    "GUGUN_NM": "수영구",
    "LAT": 35.151604,
    "LNG": 129.11713,
    "PLACE": "광안리해수욕장, 다대포해수욕장",
    "TITLE": "여름은 부산에서! 부산바다축제",
    "SUBTITLE": "",
    "MAIN_PLACE": "광안리해수욕장",
    "ADDR1": "부산광역시 수영구 광안해변로 219",
    "ADDR2": "",
    "CNTCT_TEL": "051-713-5000",
    "HOMEPAGE_URL": "http://www.bfo.or.kr",
    "TRFC_INFO": "도시철도 2호선 광안역 3, 5번 출구 도보 10분",
    "USAGE_DAY": "",
    "USAGE_DAY_WEEK_AND_TIME": "2025. 8. 1. ~ 8. 3.",
    "USAGE_AMOUNT": "무료",
    "MAIN_IMG_NORMAL": "https://www.visitbusan.net/uploadImgs/files/cntnts/20191222153509121_ttiel",
    "MAIN_IMG_THUMB": "https://www.visitbusan.net/uploadImgs/files/cntnts/20191222153509121_thumbL",
    "ITEMCNTNTS": "부산의 여름을 뜨겁게 달구는 대표적인 바다 축제! 광안리와 다대포 해수욕장을 배경으로 다채로운 공연과 불꽃쇼, 물총싸움 등 환상적인 여름 파티가 펼쳐집니다.",
    "MIDDLE_SIZE_RM1": "장애인 주차장, 휠체어 접근 가능"
  },
  {
    "UC_SEQ": 328,
    "MAIN_TITLE": "태종대 수국축제(한,영,중간,중번,일)",
    "GUGUN_NM": "영도구",
    "LAT": 35.05602,
    "LNG": 129.08812,
    "PLACE": "태종대, 태종사",
    "TITLE": "수국꽃문화축제",
    "SUBTITLE": "",
    "MAIN_PLACE": "태종사",
    "ADDR1": "부산광역시 영도구 전망로 119",
    "ADDR2": "",
    "CNTCT_TEL": "051-419-4061~6",
    "HOMEPAGE_URL": "",
    "TRFC_INFO": "버스 8, 30, 88, 101 태종대 하차",
    "USAGE_DAY": "",
    "USAGE_DAY_WEEK_AND_TIME": "2025. 7. 5.(토) ~ 7. 13.(일)",
    "USAGE_AMOUNT": "무료",
    "MAIN_IMG_NORMAL": "https://www.visitbusan.net/uploadImgs/files/cntnts/20191222160520749_ttiel",
    "MAIN_IMG_THUMB": "https://www.visitbusan.net/uploadImgs/files/cntnts/20191222160520749_thumbL",
    "ITEMCNTNTS": "초여름 태종사 일대를 물들이는 오색찬란한 수국 물결! 30여 종 5000여 그루의 수국 군락지에서 힐링 산책과 포토존을 경험하세요.",
    "MIDDLE_SIZE_RM1": "장애인 화장실, 장애인 주차장, 다누비 순환열차 휠체어리프트"
  },
  {
    "UC_SEQ": 329,
    "MAIN_TITLE": "센텀맥주축제(한,영,중간,중번,일)",
    "GUGUN_NM": "해운대구",
    "LAT": 35.170998,
    "LNG": 129.12697,
    "PLACE": "센텀맥주축제",
    "TITLE": "맥주를 사랑한다면 센텀맥주축제",
    "SUBTITLE": "",
    "MAIN_PLACE": "센텀맥주축제",
    "ADDR1": "부산광역시 해운대구 수영강변대로 120",
    "ADDR2": "",
    "CNTCT_TEL": "051-850-9344",
    "HOMEPAGE_URL": "http://www.beerfestival.co.kr",
    "TRFC_INFO": "도시철도 2호선 센텀시티역 6번 출구 도보 5분",
    "USAGE_DAY": "",
    "USAGE_DAY_WEEK_AND_TIME": "2026. 05. 22. ~ 05. 31.",
    "USAGE_AMOUNT": "성인 20,000원(맥주 무제한 제공)",
    "MAIN_IMG_NORMAL": "https://www.visitbusan.net/uploadImgs/files/cntnts/20191227114742493_ttiel",
    "MAIN_IMG_THUMB": "https://www.visitbusan.net/uploadImgs/files/cntnts/20191227114742493_thumbL",
    "ITEMCNTNTS": "도심 속 시원한 생맥주 무제한 제공! EDM 파티와 다양한 무대 공연, 페이스페인팅 이벤트가 함께하는 젊음의 축제.",
    "MIDDLE_SIZE_RM1": "휠체어 이동 가능"
  },
  {
    "UC_SEQ": 332,
    "MAIN_TITLE": "부산불꽃축제(한, 영, 중간, 중번, 일)",
    "GUGUN_NM": "수영구",
    "LAT": 35.152725,
    "LNG": 129.11848,
    "PLACE": "광안리해수욕장 일원",
    "TITLE": "밤하늘을 놓는 광안리 불꽃의 향연",
    "SUBTITLE": "",
    "MAIN_PLACE": "광안리해수욕장",
    "ADDR1": "부산광역시 수영구 광안해변로 219",
    "ADDR2": "",
    "CNTCT_TEL": "051-713-5000",
    "HOMEPAGE_URL": "http://www.bfo.or.kr",
    "TRFC_INFO": "도시철도 2호선 광안역 또는 금련산역 도보 10분",
    "USAGE_DAY": "",
    "USAGE_DAY_WEEK_AND_TIME": "2025.11.15.(토)",
    "USAGE_AMOUNT": "무료 (유료좌석 별도)",
    "MAIN_IMG_NORMAL": "https://www.visitbusan.net/uploadImgs/files/cntnts/20191227120713758_ttiel",
    "MAIN_IMG_THUMB": "https://www.visitbusan.net/uploadImgs/files/cntnts/20191227120713758_thumbL",
    "ITEMCNTNTS": "광안대교를 배경으로 펼쳐지는 세계적 수준의 초대형 불꽃 연출과 음악 레이저 쇼. 부산의 가을 밤하늘을 수놓습니다.",
    "MIDDLE_SIZE_RM1": "장애인 편의구역 마련"
  },
  {
    "UC_SEQ": 340,
    "MAIN_TITLE": "해운대 빛축제(한,영,중간,중번,일)",
    "GUGUN_NM": "해운대구",
    "LAT": 35.15849,
    "LNG": 129.15987,
    "PLACE": "해운대해수욕장, 구남로 백사장 일원",
    "TITLE": "겨울 해운대의 은빛 로맨스",
    "SUBTITLE": "",
    "MAIN_PLACE": "해운대해수욕장",
    "ADDR1": "부산광역시 해운대구 해운대해변로 264",
    "ADDR2": "",
    "CNTCT_TEL": "051-749-4062",
    "HOMEPAGE_URL": "",
    "TRFC_INFO": "도시철도 2호선 해운대역 3, 5번 출구 도보 5분",
    "USAGE_DAY": "",
    "USAGE_DAY_WEEK_AND_TIME": "2025년 11월 29일 ~ 2026년 1월 18일점등시간 : 18:00~23:00",
    "USAGE_AMOUNT": "무료",
    "MAIN_IMG_NORMAL": "https://www.visitbusan.net/uploadImgs/files/cntnts/20191227131707577_ttiel",
    "MAIN_IMG_THUMB": "https://www.visitbusan.net/uploadImgs/files/cntnts/20191227131707577_thumbL",
    "ITEMCNTNTS": "백사장에 그려지는 환상적인 미디어 파도와 해운대 구남로를 가득 채우는 빛 조형물들의 로맨틱한 향연.",
    "MIDDLE_SIZE_RM1": "평지 도보 이동 용이"
  }
];

export default async function handler(req: Request, res: Response) {
  try {
    const url = `https://apis.data.go.kr/6260000/FestivalService/getFestivalKr?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=100&resultType=json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Public API HTTP error: ${response.status}`);
    }

    const data = await response.json();
    const items = data?.getFestivalKr?.item;

    if (Array.isArray(items) && items.length > 0) {
      return res.status(200).json({
        success: true,
        source: 'api',
        total: data?.getFestivalKr?.totalCount || items.length,
        items
      });
    } else {
      throw new Error('API output invalid or empty items');
    }
  } catch (err: any) {
    console.error('Failed to fetch from Busan Festival Public API:', err.message);
    return res.status(200).json({
      success: true,
      source: 'fallback',
      warning: 'Public API request failed, serving default festival dataset',
      items: FALLBACK_FESTIVALS
    });
  }
}
