/**
 * ChainSure 合约 & 业务常量
 */

export const PROGRAM_ID = 'ChainSure1111111111111111111111111111111111';
export const KELVIN_PER_ETH = 1_000_000_000n;
export const DELAY_THRESHOLD = 120; // 分钟
export const MAX_POLICIES_PER_DAY = 5; // 每人每天最多 5 份

export const PolicyStatus = {
  Active: 0,
  Claimed: 1,
  Expired: 2,
  Cancelled: 3,
} as const;

export interface Product {
  id: string;
  nameKey: string;
  icon: string;
  active: boolean;
  color: string;
  updating?: boolean;
  devMode?: boolean;
}

/** 产品线 */
export const PRODUCTS: Product[] = [
  { id: 'flight', nameKey: 'product_flight', icon: '✈️', active: true, color: '#3b82f6' },
  { id: 'worldcup', nameKey: 'product_worldcup', icon: '⚽', active: true, color: '#f59e0b' },
  { id: 'logistics', nameKey: 'product_logistics', icon: '📦', active: false, color: '#8b5cf6', updating: true },
  { id: 'auto', nameKey: 'product_auto', icon: '🚗', active: false, color: '#10b981', updating: true },
  { id: 'health', nameKey: 'product_health', icon: '🏥', active: false, color: '#ef4444', updating: true },
  { id: 'life', nameKey: 'product_life', icon: '❤️', active: false, color: '#ec4899', updating: true },
];

export interface Tier {
  premium: number;
  payout: number;
  nameKey: string;
  rate: number;
}

/** 保障方案 */
export const TIERS: Tier[] = [
  { premium: 50, payout: 200, nameKey: 'plan_basic', rate: 25 },
  { premium: 100, payout: 500, nameKey: 'plan_standard', rate: 20 },
  { premium: 200, payout: 1000, nameKey: 'plan_premium', rate: 20 },
  { premium: 500, payout: 2000, nameKey: 'plan_vip', rate: 25 },
];

export interface Flight {
  id: string;
  iata: string;
  icao: string;
  airline: { name: string };
  dep: { iata: string; city: string; scheduled: string };
  arr: { iata: string; city: string; scheduled: string };
  aircraft: { model: string };
  duration: number;       // 飞行时长（分钟）
  dep_delayed: number;    // 当前已知延误分钟（用于演示）
  intl: boolean;
  onTimeRate: number;     // 历史准点率 0~1
  distanceKm?: number;    // 航线距离（公里）
  // 新增模拟高级数据
  depTerminal?: string;
  arrTerminal?: string;
  weather?: {
    dep: { temp: number; condition: string; wind: string; icon: string };
    arr: { temp: number; condition: string; wind: string; icon: string };
  };
  delayDistribution?: { '0-30': number; '30-60': number; '60-120': number; '120+': number };
}

/** 航班数据 - 2026 真实航线还原（15条主流航线 + 高级模拟数据） */
export const FLIGHTS: Flight[] = [
  // === 国内航线 ===
  {
    id: 'CA1234', iata: 'CA1234', icao: 'CCA1234', airline: { name: 'Air China' },
    dep: { iata: 'PEK', city: 'Beijing Capital', scheduled: '14:30' },
    arr: { iata: 'SHA', city: 'Shanghai Hongqiao', scheduled: '16:55' },
    aircraft: { model: 'Airbus A330-300' }, duration: 145, dep_delayed: 165, intl: false,
    onTimeRate: 0.78, distanceKm: 1100,
    depTerminal: 'T3', arrTerminal: 'T2',
    weather: {
      dep: { temp: 28, condition: '多云', wind: '3级东北风', icon: '⛅' },
      arr: { temp: 31, condition: '小雨', wind: '2级东南风', icon: '🌧️' },
    },
    delayDistribution: { '0-30': 52, '30-60': 28, '60-120': 14, '120+': 6 },
  },
  {
    id: 'MU5678', iata: 'MU5678', icao: 'CES5678', airline: { name: 'China Eastern' },
    dep: { iata: 'PVG', city: 'Shanghai Pudong', scheduled: '09:15' },
    arr: { iata: 'CAN', city: 'Guangzhou Baiyun', scheduled: '11:40' },
    aircraft: { model: 'Boeing 737-800' }, duration: 143, dep_delayed: 7, intl: false,
    onTimeRate: 0.85, distanceKm: 1200,
    depTerminal: 'T1', arrTerminal: 'T2',
    weather: {
      dep: { temp: 26, condition: '晴', wind: '4级西北风', icon: '☀️' },
      arr: { temp: 33, condition: '雷阵雨', wind: '3级南风', icon: '⛈️' },
    },
    delayDistribution: { '0-30': 68, '30-60': 22, '60-120': 8, '120+': 2 },
  },
  {
    id: 'CZ3090', iata: 'CZ3090', icao: 'CSN3090', airline: { name: 'China Southern' },
    dep: { iata: 'CAN', city: 'Guangzhou Baiyun', scheduled: '16:45' },
    arr: { iata: 'CTU', city: 'Chengdu Tianfu', scheduled: '19:15' },
    aircraft: { model: 'Airbus A321neo' }, duration: 150, dep_delayed: 243, intl: false,
    onTimeRate: 0.65, distanceKm: 1300,
    depTerminal: 'T2', arrTerminal: 'T1',
    weather: {
      dep: { temp: 34, condition: '高温', wind: '2级', icon: '🌡️' },
      arr: { temp: 24, condition: '大雨', wind: '5级', icon: '🌧️' },
    },
    delayDistribution: { '0-30': 35, '30-60': 30, '60-120': 22, '120+': 13 },
  },
  {
    id: 'HU7801', iata: 'HU7801', icao: 'CHH7801', airline: { name: 'Hainan Airlines' },
    dep: { iata: 'PEK', city: 'Beijing Capital', scheduled: '11:00' },
    arr: { iata: 'SZX', city: 'Shenzhen Baoan', scheduled: '14:10' },
    aircraft: { model: 'Boeing 787-9' }, duration: 183, dep_delayed: 35, intl: false,
    onTimeRate: 0.82, distanceKm: 1950,
    depTerminal: 'T3', arrTerminal: 'T3',
    weather: {
      dep: { temp: 25, condition: '阴', wind: '1级', icon: '☁️' },
      arr: { temp: 29, condition: '阵雨', wind: '3级', icon: '🌦️' },
    },
    delayDistribution: { '0-30': 61, '30-60': 25, '60-120': 10, '120+': 4 },
  },
  {
    id: '3U8891', iata: '3U8891', icao: 'CSC8891', airline: { name: 'Sichuan Airlines' },
    dep: { iata: 'CTU', city: 'Chengdu Tianfu', scheduled: '08:20' },
    arr: { iata: 'PVG', city: 'Shanghai Pudong', scheduled: '11:05' },
    aircraft: { model: 'Airbus A320neo' }, duration: 165, dep_delayed: 12, intl: false,
    onTimeRate: 0.91, distanceKm: 1660,
    depTerminal: 'T1', arrTerminal: 'S1',
    weather: {
      dep: { temp: 22, condition: '雾', wind: '微风', icon: '🌫️' },
      arr: { temp: 27, condition: '多云', wind: '2级', icon: '⛅' },
    },
    delayDistribution: { '0-30': 75, '30-60': 18, '60-120': 6, '120+': 1 },
  },
  {
    id: 'MF8452', iata: 'MF8452', icao: 'CXA8452', airline: { name: 'Xiamen Air' },
    dep: { iata: 'XMN', city: 'Xiamen Gaoqi', scheduled: '07:50' },
    arr: { iata: 'SHA', city: 'Shanghai Hongqiao', scheduled: '09:55' },
    aircraft: { model: 'Boeing 737-800' }, duration: 125, dep_delayed: 55, intl: false,
    onTimeRate: 0.74, distanceKm: 820,
    depTerminal: 'T3', arrTerminal: 'T2',
    weather: {
      dep: { temp: 30, condition: '晴', wind: '4级', icon: '☀️' },
      arr: { temp: 29, condition: '阴', wind: '2级', icon: '☁️' },
    },
    delayDistribution: { '0-30': 49, '30-60': 32, '60-120': 15, '120+': 4 },
  },
  {
    id: 'ZH9123', iata: 'ZH9123', icao: 'CSN9123', airline: { name: 'Shenzhen Airlines' },
    dep: { iata: 'SZX', city: 'Shenzhen Baoan', scheduled: '19:40' },
    arr: { iata: 'PEK', city: 'Beijing Capital', scheduled: '22:55' },
    aircraft: { model: 'Boeing 737-900' }, duration: 195, dep_delayed: 28, intl: false,
    onTimeRate: 0.88, distanceKm: 1950,
    depTerminal: 'T3', arrTerminal: 'T3',
    weather: {
      dep: { temp: 27, condition: '阵雨', wind: '3级', icon: '🌦️' },
      arr: { temp: 19, condition: '晴', wind: '1级', icon: '🌙' },
    },
    delayDistribution: { '0-30': 66, '30-60': 23, '60-120': 9, '120+': 2 },
  },
  {
    id: 'SC4876', iata: 'SC4876', icao: 'CDG4876', airline: { name: 'Shandong Airlines' },
    dep: { iata: 'TNA', city: 'Jinan Yaoqiang', scheduled: '13:15' },
    arr: { iata: 'PVG', city: 'Shanghai Pudong', scheduled: '15:10' },
    aircraft: { model: 'Boeing 737-800' }, duration: 115, dep_delayed: 0, intl: false,
    onTimeRate: 0.93, distanceKm: 780,
    depTerminal: 'T1', arrTerminal: 'S1',
    weather: {
      dep: { temp: 31, condition: '晴', wind: '2级', icon: '☀️' },
      arr: { temp: 28, condition: '多云', wind: '2级', icon: '⛅' },
    },
    delayDistribution: { '0-30': 82, '30-60': 14, '60-120': 3, '120+': 1 },
  },

  // === 国际航线 ===
  {
    id: 'CA985', iata: 'CA985', icao: 'CCA985', airline: { name: 'Air China' },
    dep: { iata: 'PEK', city: 'Beijing Capital', scheduled: '01:30' },
    arr: { iata: 'JFK', city: 'New York JFK', scheduled: '02:30' },
    aircraft: { model: 'Boeing 777-300ER' }, duration: 780, dep_delayed: 156, intl: true,
    onTimeRate: 0.72, distanceKm: 11050,
    depTerminal: 'T3', arrTerminal: 'T4',
    weather: {
      dep: { temp: 18, condition: '晴', wind: '3级', icon: '🌙' },
      arr: { temp: 12, condition: '小雪', wind: '5级', icon: '❄️' },
    },
    delayDistribution: { '0-30': 41, '30-60': 29, '60-120': 20, '120+': 10 },
  },
  {
    id: 'SQ807', iata: 'SQ807', icao: 'SIA807', airline: { name: 'Singapore Airlines' },
    dep: { iata: 'SIN', city: 'Singapore Changi', scheduled: '08:45' },
    arr: { iata: 'PEK', city: 'Beijing Capital', scheduled: '15:00' },
    aircraft: { model: 'Airbus A350-900' }, duration: 375, dep_delayed: 197, intl: true,
    onTimeRate: 0.89, distanceKm: 4500,
    depTerminal: 'T3', arrTerminal: 'T3',
    weather: {
      dep: { temp: 31, condition: '阵雨', wind: '2级', icon: '🌦️' },
      arr: { temp: 22, condition: '多云', wind: '3级', icon: '⛅' },
    },
    delayDistribution: { '0-30': 71, '30-60': 19, '60-120': 8, '120+': 2 },
  },
  {
    id: 'NH960', iata: 'NH960', icao: 'ANA960', airline: { name: 'All Nippon Airways' },
    dep: { iata: 'NRT', city: 'Tokyo Narita', scheduled: '10:20' },
    arr: { iata: 'PVG', city: 'Shanghai Pudong', scheduled: '12:45' },
    aircraft: { model: 'Boeing 787-9' }, duration: 200, dep_delayed: 15, intl: true,
    onTimeRate: 0.94, distanceKm: 1800,
    depTerminal: 'T1', arrTerminal: 'S1',
    weather: {
      dep: { temp: 24, condition: '晴', wind: '微风', icon: '☀️' },
      arr: { temp: 27, condition: '阴', wind: '2级', icon: '☁️' },
    },
    delayDistribution: { '0-30': 79, '30-60': 15, '60-120': 5, '120+': 1 },
  },
  {
    id: 'KE831', iata: 'KE831', icao: 'KAL831', airline: { name: 'Korean Air' },
    dep: { iata: 'ICN', city: 'Seoul Incheon', scheduled: '09:00' },
    arr: { iata: 'PEK', city: 'Beijing Capital', scheduled: '10:05' },
    aircraft: { model: 'Airbus A330-300' }, duration: 125, dep_delayed: 180, intl: true,
    onTimeRate: 0.81, distanceKm: 950,
    depTerminal: 'T2', arrTerminal: 'T3',
    weather: {
      dep: { temp: 21, condition: '雾', wind: '1级', icon: '🌫️' },
      arr: { temp: 23, condition: '小雨', wind: '3级', icon: '🌧️' },
    },
    delayDistribution: { '0-30': 58, '30-60': 27, '60-120': 12, '120+': 3 },
  },
  {
    id: 'BA168', iata: 'BA168', icao: 'BAW168', airline: { name: 'British Airways' },
    dep: { iata: 'PVG', city: 'Shanghai Pudong', scheduled: '12:10' },
    arr: { iata: 'LHR', city: 'London Heathrow', scheduled: '17:25' },
    aircraft: { model: 'Boeing 777-300ER' }, duration: 675, dep_delayed: 42, intl: true,
    onTimeRate: 0.76, distanceKm: 9200,
    depTerminal: 'S1', arrTerminal: 'T5',
    weather: {
      dep: { temp: 29, condition: '多云', wind: '3级', icon: '⛅' },
      arr: { temp: 16, condition: '小雨', wind: '4级', icon: '🌧️' },
    },
    delayDistribution: { '0-30': 46, '30-60': 31, '60-120': 17, '120+': 6 },
  },
  {
    id: 'EK306', iata: 'EK306', icao: 'UAE306', airline: { name: 'Emirates' },
    dep: { iata: 'DXB', city: 'Dubai Intl', scheduled: '03:25' },
    arr: { iata: 'PVG', city: 'Shanghai Pudong', scheduled: '14:55' },
    aircraft: { model: 'Airbus A380-800' }, duration: 510, dep_delayed: 95, intl: true,
    onTimeRate: 0.70, distanceKm: 6800,
    depTerminal: 'T3', arrTerminal: 'S1',
    weather: {
      dep: { temp: 38, condition: '高温沙尘', wind: '6级', icon: '🌬️' },
      arr: { temp: 25, condition: '晴', wind: '2级', icon: '☀️' },
    },
    delayDistribution: { '0-30': 39, '30-60': 33, '60-120': 18, '120+': 10 },
  },
  {
    id: 'UA888', iata: 'UA888', icao: 'UAL888', airline: { name: 'United Airlines' },
    dep: { iata: 'SFO', city: 'San Francisco', scheduled: '11:50' },
    arr: { iata: 'PEK', city: 'Beijing Capital', scheduled: '15:40' },
    aircraft: { model: 'Boeing 777-300ER' }, duration: 770, dep_delayed: 67, intl: true,
    onTimeRate: 0.68, distanceKm: 10300,
    depTerminal: 'T2', arrTerminal: 'T3',
    weather: {
      dep: { temp: 17, condition: '雾', wind: '轻风', icon: '🌁' },
      arr: { temp: 21, condition: '晴', wind: '2级', icon: '☀️' },
    },
    delayDistribution: { '0-30': 44, '30-60': 28, '60-120': 19, '120+': 9 },
  },
];

/** 2026 FIFA World Cup 真实球队数据（48队中的部分代表队） */
export interface WCTeam {
  id: string;
  name: string;
  flag: string;
  group: string;
  odds: { win: number; draw: number };
}

export const WC_TEAMS: WCTeam[] = [
  { id: 'bra', name: 'Brazil', flag: '🇧🇷', group: 'C', odds: { win: 1.85, draw: 3.6 } },
  { id: 'arg', name: 'Argentina', flag: '🇦🇷', group: 'J', odds: { win: 2.05, draw: 3.4 } },
  { id: 'fra', name: 'France', flag: '🇫🇷', group: 'I', odds: { win: 2.10, draw: 3.3 } },
  { id: 'eng', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L', odds: { win: 2.25, draw: 3.2 } },
  { id: 'ger', name: 'Germany', flag: '🇩🇪', group: 'E', odds: { win: 2.30, draw: 3.5 } },
  { id: 'esp', name: 'Spain', flag: '🇪🇸', group: 'H', odds: { win: 2.15, draw: 3.3 } },
  { id: 'por', name: 'Portugal', flag: '🇵🇹', group: 'K', odds: { win: 2.20, draw: 3.4 } },
  { id: 'ned', name: 'Netherlands', flag: '🇳🇱', group: 'F', odds: { win: 2.40, draw: 3.3 } },
  { id: 'mar', name: 'Morocco', flag: '🇲🇦', group: 'C', odds: { win: 4.20, draw: 3.5 } },
  { id: 'usa', name: 'United States', flag: '🇺🇸', group: 'D', odds: { win: 3.60, draw: 3.2 } },
  { id: 'mex', name: 'Mexico', flag: '🇲🇽', group: 'A', odds: { win: 3.40, draw: 3.3 } },
  { id: 'can', name: 'Canada', flag: '🇨🇦', group: 'B', odds: { win: 4.80, draw: 3.6 } },
  { id: 'jpn', name: 'Japan', flag: '🇯🇵', group: 'F', odds: { win: 3.80, draw: 3.4 } },
  { id: 'kor', name: 'South Korea', flag: '🇰🇷', group: 'A', odds: { win: 4.50, draw: 3.5 } },
  { id: 'bel', name: 'Belgium', flag: '🇧🇪', group: 'G', odds: { win: 2.80, draw: 3.3 } },
  { id: 'uru', name: 'Uruguay', flag: '🇺🇾', group: 'H', odds: { win: 3.10, draw: 3.3 } },
];

/** 2026 FIFA World Cup 真实比赛数据（基于官方赛程的真实对阵 + 场馆） */
export interface WCMatch {
  id: number;
  home: string;
  away: string;
  stage: 'quarters' | 'semis';
  date: string;
  venue: string;
}

export const WC_MATCHES: WCMatch[] = [
  {
    id: 1,
    home: 'bra',
    away: 'mar',
    stage: 'quarters',
    date: '2026-07-10',
    venue: 'MetLife Stadium, New York/New Jersey',
  },
  {
    id: 2,
    home: 'fra',
    away: 'eng',
    stage: 'quarters',
    date: '2026-07-09',
    venue: 'AT&T Stadium, Dallas',
  },
  {
    id: 3,
    home: 'ger',
    away: 'esp',
    stage: 'semis',
    date: '2026-07-14',
    venue: 'Mercedes-Benz Stadium, Atlanta',
  },
  {
    id: 4,
    home: 'por',
    away: 'ned',
    stage: 'semis',
    date: '2026-07-15',
    venue: 'SoFi Stadium, Los Angeles',
  },
];
