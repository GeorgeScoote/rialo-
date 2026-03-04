/**
 * ChainSure Internationalization (i18n)
 * 
 * Supported languages:
 * - zh: Chinese (中文)
 * - en: English
 * - ja: Japanese (日本語)
 * - ko: Korean (한국어)
 */

export const LANGUAGES = {
  zh: { code: 'zh', name: '中文', flag: '🇨🇳' },
  en: { code: 'en', name: 'English', flag: '🇺🇸' },
  ja: { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ko: { code: 'ko', name: '한국어', flag: '🇰🇷' },
} as const;

export type LanguageCode = keyof typeof LANGUAGES;

export const translations = {
  zh: {
    // Navigation
    nav_insure: '投保',
    nav_policies: '保单',
    nav_claims: '理赔',
    nav_wallet: '钱包',

    // Header
    brand_sub: '航班保险',
    page_title: '航班延误保障',
    page_desc: '选择您的航班和保障方案，延误超过 {threshold} 分钟将自动触发链上理赔',
    smart_contract: '智能合约',

    // Products
    product_flight: '航班延误',
    product_health: '医疗保障',
    product_auto: '车辆保险',
    product_life: '人寿保险',
    coming_soon: '即将上线',

    // Flight Selection
    select_flight: '选择航班',
    filter_all: '全部',
    filter_domestic: '国内',
    filter_international: '国际',
    intl_badge: '国际',
    delay_badge: '延误 {min}m',
    ontime_badge: '准点率高',

    // Date
    select_date: '出发日期',
    tomorrow: '明天',
    day_after: '后天',
    plus_7_days: '+7天',
    select_future_date: '请选择未来日期',

    // Plans
    select_plan: '选择保障方案',
    plan_basic: '基础',
    plan_standard: '标准',
    plan_premium: '高级',
    plan_vip: '尊享',
    premium_label: '保费',
    payout_label: '延误≥{threshold}分钟赔付',
    rate_hint: '费率 {rate}%：支付 {premium} RLO，延误可获赔 {payout} RLO',

    // Order
    order_confirm: '订单确认',
    you_pay: '您需支付',
    you_get: '延误可获赔',
    policy_details: '保单详情',
    flight_label: '航班',
    route_label: '航线',
    date_label: '日期',
    condition_label: '理赔条件',
    delay_condition: '延误 ≥ {threshold} 分钟',
    return_rate: '回报率：支付 {premium} 可获赔 {payout}，最高 {multiplier}x 回报',

    // Actions
    connect_wallet: '连接钱包',
    connecting: '连接中...',
    confirm_pay: '确认支付 {amount} RLO',
    processing: '处理中...',
    connect_first: '请先连接钱包',
    future_date_only: '只能购买未来日期的航班保险',
    insufficient_balance: '余额不足',
    daily_limit_reached: '今日保单已达上限（{max}份/天）',
    daily_limit_hint: '今日已购 {count}/{max} 份',

    // Policies Page
    my_policies: '我的保单',
    policies_count: '{count} 份',
    no_policies: '暂无保单',
    no_policies_desc: '购买航班延误保险后，保单将显示在这里',
    go_insure: '去投保',
    active_policies: '生效中',
    history_policies: '历史记录',
    policy_active: '生效中',
    can_settle: '航班已起飞，可以结算',
    waiting_flight: '等待 {date} 航班起飞',
    settle_now: '立即结算',
    settling: '结算中...',
    waiting: '等待中',
    claimed: '已理赔',
    expired: '已过期',
    delay_min: '延误 {min} 分钟',

    // Claims Page
    claims_title: '理赔记录',
    no_claims: '暂无理赔记录',
    no_claims_desc: '航班延误超过 {threshold} 分钟将自动理赔',
    total_claimed: '累计理赔',
    claim_details: '理赔明细',
    claim_time: '理赔时间',

    // Wallet Page
    wallet_title: '钱包',
    balance: '余额',
    connected: '已连接',
    address: '地址',
    disconnect: '断开连接',
    tx_history: '交易记录',
    no_tx: '暂无交易记录',
    tx_connect: '钱包已连接',
    tx_disconnect: '钱包已断开',
    tx_purchase: '购买 {flight} 保险',
    tx_claim: '{flight} 理赔到账 (延误{min}分钟)',
    tx_expire: '{flight} 保单过期 (延误{min}分钟)',

    // Network
    protocol: '协议',
    network: '网络',
    contract: '合约',
  },

  en: {
    nav_insure: 'Insure',
    nav_policies: 'Policies',
    nav_claims: 'Claims',
    nav_wallet: 'Wallet',

    brand_sub: 'Flight Insurance',
    page_title: 'Flight Delay Protection',
    page_desc:
      'Select your flight and coverage plan. Claims are automatically triggered on-chain when delays exceed {threshold} minutes',
    smart_contract: 'Smart Contract',

    product_flight: 'Flight Delay',
    product_health: 'Health',
    product_auto: 'Auto',
    product_life: 'Life',
    coming_soon: 'Soon',

    select_flight: 'Select Flight',
    filter_all: 'All',
    filter_domestic: 'Domestic',
    filter_international: "Int'l",
    intl_badge: "Int'l",
    delay_badge: 'Delay {min}m',
    ontime_badge: 'On-time',

    select_date: 'Departure Date',
    tomorrow: 'Tomorrow',
    day_after: 'In 2 days',
    plus_7_days: '+7 days',
    select_future_date: 'Select a future date',

    select_plan: 'Select Coverage Plan',
    plan_basic: 'Basic',
    plan_standard: 'Standard',
    plan_premium: 'Premium',
    plan_vip: 'VIP',
    premium_label: 'Premium',
    payout_label: 'Payout if delay ≥{threshold}min',
    rate_hint: 'Rate {rate}%: Pay {premium} RLO, get {payout} RLO if delayed',

    order_confirm: 'Order Confirmation',
    you_pay: 'You Pay',
    you_get: 'Payout if Delayed',
    policy_details: 'Policy Details',
    flight_label: 'Flight',
    route_label: 'Route',
    date_label: 'Date',
    condition_label: 'Claim Condition',
    delay_condition: 'Delay ≥ {threshold} min',
    return_rate: 'Return: Pay {premium}, get {payout}, up to {multiplier}x',

    connect_wallet: 'Connect Wallet',
    connecting: 'Connecting...',
    confirm_pay: 'Confirm Payment {amount} RLO',
    processing: 'Processing...',
    connect_first: 'Please connect wallet first',
    future_date_only: 'Can only purchase for future flights',
    insufficient_balance: 'Insufficient balance',
    daily_limit_reached: 'Daily limit reached ({max} policies/day)',
    daily_limit_hint: 'Today: {count}/{max} policies',

    my_policies: 'My Policies',
    policies_count: '{count} policies',
    no_policies: 'No Policies',
    no_policies_desc: 'Your policies will appear here after purchase',
    go_insure: 'Get Insured',
    active_policies: 'Active',
    history_policies: 'History',
    policy_active: 'Active',
    can_settle: 'Flight departed, ready to settle',
    waiting_flight: 'Waiting for {date} departure',
    settle_now: 'Settle Now',
    settling: 'Settling...',
    waiting: 'Waiting',
    claimed: 'Claimed',
    expired: 'Expired',
    delay_min: 'Delayed {min} min',

    claims_title: 'Claim History',
    no_claims: 'No Claims Yet',
    no_claims_desc: 'Claims are auto-processed when delay exceeds {threshold} minutes',
    total_claimed: 'Total Claimed',
    claim_details: 'Claim Details',
    claim_time: 'Claim Time',

    wallet_title: 'Wallet',
    balance: 'Balance',
    connected: 'Connected',
    address: 'Address',
    disconnect: 'Disconnect',
    tx_history: 'Transaction History',
    no_tx: 'No transactions yet',
    tx_connect: 'Wallet connected',
    tx_disconnect: 'Wallet disconnected',
    tx_purchase: 'Purchased {flight} insurance',
    tx_claim: '{flight} claim received (delay {min}min)',
    tx_expire: '{flight} policy expired (delay {min}min)',

    protocol: 'Protocol',
    network: 'Network',
    contract: 'Contract',
  },

  ja: {
    nav_insure: '加入',
    nav_policies: '保険証券',
    nav_claims: '請求',
    nav_wallet: 'ウォレット',

    brand_sub: 'フライト保険',
    page_title: 'フライト遅延保障',
    page_desc:
      'フライトと補償プランを選択。{threshold}分以上の遅延で自動的にオンチェーン請求が実行されます',
    smart_contract: 'スマートコントラクト',

    product_flight: 'フライト遅延',
    product_health: '医療',
    product_auto: '自動車',
    product_life: '生命',
    coming_soon: '近日公開',

    select_flight: 'フライトを選択',
    filter_all: 'すべて',
    filter_domestic: '国内',
    filter_international: '国際',
    intl_badge: '国際',
    delay_badge: '遅延 {min}分',
    ontime_badge: '定時運航',

    select_date: '出発日',
    tomorrow: '明日',
    day_after: '明後日',
    plus_7_days: '+7日',
    select_future_date: '将来の日付を選択してください',

    select_plan: '補償プランを選択',
    plan_basic: 'ベーシック',
    plan_standard: 'スタンダード',
    plan_premium: 'プレミアム',
    plan_vip: 'VIP',
    premium_label: '保険料',
    payout_label: '遅延≥{threshold}分で支払い',
    rate_hint: '料率 {rate}%：{premium} RLO支払い、遅延時{payout} RLO受取',

    order_confirm: '注文確認',
    you_pay: 'お支払い',
    you_get: '遅延時の受取',
    policy_details: '保険詳細',
    flight_label: 'フライト',
    route_label: '路線',
    date_label: '日付',
    condition_label: '請求条件',
    delay_condition: '遅延 ≥ {threshold} 分',
    return_rate: 'リターン：{premium}支払い→{payout}受取、最大{multiplier}倍',

    connect_wallet: 'ウォレット接続',
    connecting: '接続中...',
    confirm_pay: '{amount} RLO 支払いを確認',
    processing: '処理中...',
    connect_first: '先にウォレットを接続してください',
    future_date_only: '将来のフライトのみ購入可能です',
    insufficient_balance: '残高不足',
    daily_limit_reached: '本日の上限に達しました（{max}件/日）',
    daily_limit_hint: '本日: {count}/{max} 件',

    my_policies: 'マイ保険証券',
    policies_count: '{count} 件',
    no_policies: '保険証券なし',
    no_policies_desc: '購入後、保険証券がここに表示されます',
    go_insure: '加入する',
    active_policies: '有効',
    history_policies: '履歴',
    policy_active: '有効',
    can_settle: 'フライト出発済み、決済可能',
    waiting_flight: '{date} の出発を待っています',
    settle_now: '今すぐ決済',
    settling: '決済中...',
    waiting: '待機中',
    claimed: '請求済み',
    expired: '期限切れ',
    delay_min: '遅延 {min} 分',

    claims_title: '請求履歴',
    no_claims: '請求履歴なし',
    no_claims_desc: '{threshold}分以上の遅延で自動請求されます',
    total_claimed: '請求総額',
    claim_details: '請求明細',
    claim_time: '請求時刻',

    wallet_title: 'ウォレット',
    balance: '残高',
    connected: '接続済み',
    address: 'アドレス',
    disconnect: '切断',
    tx_history: '取引履歴',
    no_tx: '取引履歴なし',
    tx_connect: 'ウォレット接続完了',
    tx_disconnect: 'ウォレット切断',
    tx_purchase: '{flight} 保険を購入',
    tx_claim: '{flight} 請求受取 (遅延{min}分)',
    tx_expire: '{flight} 保険期限切れ (遅延{min}分)',

    protocol: 'プロトコル',
    network: 'ネットワーク',
    contract: 'コントラクト',
  },

  ko: {
    nav_insure: '가입',
    nav_policies: '보험증권',
    nav_claims: '청구',
    nav_wallet: '지갑',

    brand_sub: '항공 보험',
    page_title: '항공편 지연 보장',
    page_desc:
      '항공편과 보장 플랜을 선택하세요. {threshold}분 이상 지연 시 온체인에서 자동으로 청구가 실행됩니다',
    smart_contract: '스마트 컨트랙트',

    product_flight: '항공 지연',
    product_health: '의료',
    product_auto: '자동차',
    product_life: '생명',
    coming_soon: '출시 예정',

    select_flight: '항공편 선택',
    filter_all: '전체',
    filter_domestic: '국내',
    filter_international: '국제',
    intl_badge: '국제',
    delay_badge: '지연 {min}분',
    ontime_badge: '정시 운항',

    select_date: '출발일',
    tomorrow: '내일',
    day_after: '모레',
    plus_7_days: '+7일',
    select_future_date: '미래 날짜를 선택하세요',

    select_plan: '보장 플랜 선택',
    plan_basic: '베이직',
    plan_standard: '스탠다드',
    plan_premium: '프리미엄',
    plan_vip: 'VIP',
    premium_label: '보험료',
    payout_label: '지연≥{threshold}분 시 지급',
    rate_hint: '요율 {rate}%: {premium} RLO 지불, 지연 시 {payout} RLO 수령',

    order_confirm: '주문 확인',
    you_pay: '결제 금액',
    you_get: '지연 시 수령',
    policy_details: '보험 상세',
    flight_label: '항공편',
    route_label: '노선',
    date_label: '날짜',
    condition_label: '청구 조건',
    delay_condition: '지연 ≥ {threshold} 분',
    return_rate: '수익률: {premium} 지불 → {payout} 수령, 최대 {multiplier}배',

    connect_wallet: '지갑 연결',
    connecting: '연결 중...',
    confirm_pay: '{amount} RLO 결제 확인',
    processing: '처리 중...',
    connect_first: '먼저 지갑을 연결하세요',
    future_date_only: '미래 항공편만 구매 가능합니다',
    insufficient_balance: '잔액 부족',
    daily_limit_reached: '일일 한도 도달 ({max}건/일)',
    daily_limit_hint: '오늘: {count}/{max} 건',

    my_policies: '내 보험증권',
    policies_count: '{count} 건',
    no_policies: '보험증권 없음',
    no_policies_desc: '구매 후 보험증권이 여기에 표시됩니다',
    go_insure: '가입하기',
    active_policies: '유효',
    history_policies: '기록',
    policy_active: '유효',
    can_settle: '항공편 출발 완료, 정산 가능',
    waiting_flight: '{date} 출발 대기 중',
    settle_now: '지금 정산',
    settling: '정산 중...',
    waiting: '대기 중',
    claimed: '청구 완료',
    expired: '만료됨',
    delay_min: '지연 {min} 분',

    claims_title: '청구 기록',
    no_claims: '청구 기록 없음',
    no_claims_desc: '{threshold}분 이상 지연 시 자동으로 청구됩니다',
    total_claimed: '총 청구액',
    claim_details: '청구 상세',
    claim_time: '청구 시간',

    wallet_title: '지갑',
    balance: '잔액',
    connected: '연결됨',
    address: '주소',
    disconnect: '연결 해제',
    tx_history: '거래 기록',
    no_tx: '거래 기록 없음',
    tx_connect: '지갑 연결 완료',
    tx_disconnect: '지갑 연결 해제',
    tx_purchase: '{flight} 보험 구매',
    tx_claim: '{flight} 청구 수령 (지연 {min}분)',
    tx_expire: '{flight} 보험 만료 (지연 {min}분)',

    protocol: '프로토콜',
    network: '네트워크',
    contract: '컨트랙트',
  },
} as const;

// Helper function for translation with parameter substitution
export function t(
  lang: LanguageCode,
  key: string,
  params: Record<string, string | number> = {}
): string {
  let text = (translations[lang] as any)?.[key] || (translations.zh as any)[key] || key;

  Object.entries(params).forEach(([k, v]) => {
    text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  });

  return text;
}

// Get browser language or default to Chinese
export function getBrowserLanguage(): LanguageCode {
  const browserLang = navigator.language.split('-')[0];
  return (browserLang in LANGUAGES ? browserLang : 'zh') as LanguageCode;
}

export default translations;
