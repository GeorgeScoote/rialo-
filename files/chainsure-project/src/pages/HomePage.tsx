import { useState } from 'react';
import { useApp } from '@/state/AppContext';
import { useLang } from '@i18n/LangContext';
import {
  DELAY_THRESHOLD,
  FLIGHTS,
  KELVIN_PER_ETH,
  MAX_POLICIES_PER_DAY,
  PRODUCTS,
  TIERS,
} from '@/lib/constants';
import { n } from '@/lib/format';
import { Badge, Button, Card } from '@components/ui';
import { NFTMintSection } from '@pages/NFTMintSection';
import { WorldCupSection } from '@pages/WorldCupSection';
import { FONT_MONO, FONT_SANS, T } from '@/theme/tokens';

export function HomePage() {
  const { wallet, balance, purchasePolicy, setPage, getTodayPolicyCount, canPurchaseMore } = useApp();
  const { $, lang } = useLang();
  const [product, setProduct] = useState('flight');
  const [fi, setFi] = useState(0);
  const [ti, setTi] = useState(1);
  const [tab, setTab] = useState<'all' | 'dom' | 'intl'>('all');
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState<any>(null);
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 基础筛选（国内/国际）
  let list = tab === 'all' ? FLIGHTS : tab === 'dom' ? FLIGHTS.filter((f) => !f.intl) : FLIGHTS.filter((f) => f.intl);
  // 搜索过滤
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter((f) =>
      f.iata.toLowerCase().includes(q) ||
      f.airline.name.toLowerCase().includes(q) ||
      f.dep.iata.toLowerCase().includes(q) ||
      f.arr.iata.toLowerCase().includes(q) ||
      f.dep.city.toLowerCase().includes(q) ||
      f.arr.city.toLowerCase().includes(q)
    );
  }
  // 确保当前选中航班在过滤结果中，否则自动切到第一条
  const currentFi = list.length > 0
    ? (list.some((f) => FLIGHTS.indexOf(f) === fi) ? fi : FLIGHTS.indexOf(list[0]))
    : 0;
  const fl = FLIGHTS[currentFi] || FLIGHTS[0];
  const tier = TIERS[ti];
  const premium = tier.premium;
  const payout = tier.payout;

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  })();
  const canPurchase = date > today;
  const balanceETH = Number(balance / KELVIN_PER_ETH);
  const todayCount = getTodayPolicyCount();
  const canBuyMore = canPurchaseMore();

  const handlePurchase = async () => {
    if (!wallet || !canPurchase || busy) return;
    if (!canBuyMore) {
      setError($('daily_limit_reached', { max: MAX_POLICIES_PER_DAY }));
      return;
    }
    if (balanceETH < premium) {
      setError($('insufficient_balance'));
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await purchasePolicy(fl, date, payout, premium);
      setPage('policies');
    } catch (e: any) {
      if (e.message.startsWith('DAILY_LIMIT:')) {
        setError($('daily_limit_reached', { max: MAX_POLICIES_PER_DAY }));
      } else {
        setError(e.message);
      }
    }
    setBusy(false);
  };

  const formatDate = (dateStr: string): string => {
    const d = new Date(dateStr);
    if (lang === 'zh') {
      const dp = dateStr.split('-');
      const wk = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
      return `${dp[0]}年${+dp[1]}月${+dp[2]}日 周${wk}`;
    } else if (lang === 'ja') {
      const dp = dateStr.split('-');
      const wk = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
      return `${dp[0]}年${+dp[1]}月${+dp[2]}日 (${wk})`;
    } else if (lang === 'ko') {
      const dp = dateStr.split('-');
      const wk = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
      return `${dp[0]}년 ${+dp[1]}월 ${+dp[2]}일 (${wk})`;
    }
    return d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  // 航线详情弹窗组件
  function FlightDetailModal() {
    if (!detail) return null;
    const d = detail;
    const delayed = d.dep_delayed >= DELAY_THRESHOLD;
    const ot = Math.round(d.onTimeRate * 100);

    return (
      <div
        onClick={() => setDetail(null)}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: T.card, border: '1px solid ' + T.b2, borderRadius: 20,
            width: 'min(520px, 92vw)',
            maxHeight: 'calc(100vh - 64px)',
            overflowY: 'auto',
            padding: '24px 28px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            margin: '20px 0',
          }}
        >
          {/* 标题 (sticky) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, position: 'sticky', top: 0, background: T.card, paddingBottom: 8, zIndex: 2 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: FONT_MONO }}>{d.iata}</div>
              <div style={{ fontSize: 13, color: T.tx3 }}>{d.airline.name} · {d.aircraft.model}</div>
            </div>
            <button onClick={() => setDetail(null)} style={{ background: 'transparent', border: '1px solid ' + T.b2, color: T.tx3, padding: '6px 14px', borderRadius: 8, cursor: 'pointer' }}>
              {$('close_btn')}
            </button>
          </div>

          <div style={{ fontSize: 12, color: T.tx4, marginBottom: 12 }}>{$('flight_details_sub')}</div>

          {/* 航线可视化 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: T.raised, borderRadius: 14, padding: '14px 16px', marginBottom: 14 }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 11, color: T.tx4 }}>{$('dep_label')}</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 22, fontWeight: 700, color: T.tx }}>{d.dep.iata}</div>
              <div style={{ fontSize: 12, color: T.tx3 }}>{d.dep.city}</div>
              <div style={{ fontSize: 13, marginTop: 4, color: T.gold }}>{d.dep.scheduled}</div>
            </div>

            <div style={{ textAlign: 'center', flex: 1, padding: '0 12px' }}>
              <div style={{ fontSize: 11, color: T.tx4, marginBottom: 2 }}>{Math.floor(d.duration / 60)}h {d.duration % 60}m · {d.distanceKm ? (d.distanceKm / 1000).toFixed(0) + 'k km' : ''}</div>
              <div style={{ height: 2, background: 'linear-gradient(to right, ' + T.gold + ', #fff3)', margin: '8px 0' }} />
              <div style={{ fontSize: 12, color: T.tx3 }}>✈️ { $('duration') }</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: T.tx4 }}>{$('arr_label')}</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 22, fontWeight: 700, color: T.tx }}>{d.arr.iata}</div>
              <div style={{ fontSize: 12, color: T.tx3 }}>{d.arr.city}</div>
              <div style={{ fontSize: 13, marginTop: 4, color: T.gold }}>{d.arr.scheduled}</div>
            </div>
          </div>

          {/* 关键数据 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div style={{ background: T.raised, borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: T.tx4 }}>{$('aircraft_label')}</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 16, fontWeight: 600, marginTop: 4 }}>{d.aircraft.model}</div>
            </div>
            <div style={{ background: T.raised, borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: T.tx4 }}>{$('distance_full')}</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 16, fontWeight: 600, marginTop: 4 }}>{d.distanceKm ? d.distanceKm.toLocaleString() + ' km' : '—'}</div>
            </div>
            <div style={{ background: T.raised, borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: T.tx4 }}>{$('ontime_label')}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 999 }}>
                  <div style={{ width: ot + '%', height: '100%', background: ot > 80 ? T.success : ot > 70 ? T.gold : T.warn, borderRadius: 999 }} />
                </div>
                <div style={{ fontFamily: FONT_MONO, fontWeight: 700, color: T.tx }}>{ot}%</div>
              </div>
            </div>
            <div style={{ background: T.raised, borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: T.tx4 }}>{$('delay_status')}</div>
              <div style={{ marginTop: 6 }}>
                <Badge variant={delayed ? 'warning' : 'success'}>
                  {delayed ? $('delay_badge', { min: d.dep_delayed }) : $('ontime_badge')}
                </Badge>
              </div>
            </div>
          </div>

          {/* 航站楼 + 天气 + 历史延误分布（高级模拟数据） */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: T.tx4, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🛫</span> <span>{$('terminal_label')}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              <div style={{ flex: 1, background: T.raised, borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
                {d.dep.iata} <span style={{ color: T.tx4 }}>{$('dep_label')}</span>：<strong>{d.depTerminal || '—'}</strong>
              </div>
              <div style={{ flex: 1, background: T.raised, borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
                {d.arr.iata} <span style={{ color: T.tx4 }}>{$('arr_label')}</span>：<strong>{d.arrTerminal || '—'}</strong>
              </div>
            </div>

            {/* 天气 */}
            {d.weather && (
              <>
                <div style={{ fontSize: 12, color: T.tx4, marginBottom: 8 }}>{$('weather_label')}</div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                  <div style={{ flex: 1, background: T.raised, borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ fontSize: 11, color: T.tx4 }}>{$('dep_weather')}</div>
                    <div style={{ fontSize: 18, margin: '4px 0' }}>{d.weather.dep.icon} {d.weather.dep.temp}°C</div>
                    <div style={{ fontSize: 12, color: T.tx2 }}>{d.weather.dep.condition} · {d.weather.dep.wind}</div>
                  </div>
                  <div style={{ flex: 1, background: T.raised, borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ fontSize: 11, color: T.tx4 }}>{$('arr_weather')}</div>
                    <div style={{ fontSize: 18, margin: '4px 0' }}>{d.weather.arr.icon} {d.weather.arr.temp}°C</div>
                    <div style={{ fontSize: 12, color: T.tx2 }}>{d.weather.arr.condition} · {d.weather.arr.wind}</div>
                  </div>
                </div>
              </>
            )}

            {/* 历史延误分布 */}
            {d.delayDistribution && (
              <>
                <div style={{ fontSize: 12, color: T.tx4, marginBottom: 6 }}>{$('delay_history')}</div>
                <div style={{ background: T.raised, borderRadius: 10, padding: '10px 12px' }}>
                  {Object.entries(d.delayDistribution as Record<string, number>).map(([k, v]) => {
                    const label = k === '0-30' ? $('delay_bucket_0') : k === '30-60' ? $('delay_bucket_30') : k === '60-120' ? $('delay_bucket_60') : $('delay_bucket_120');
                    return (
                      <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, fontSize: 12 }}>
                        <div style={{ width: 78, color: T.tx3 }}>{label}</div>
                        <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
                          <div style={{ width: `${v}%`, height: '100%', background: k === '120+' ? T.warn : T.gold, borderRadius: 99 }} />
                        </div>
                        <div style={{ width: 36, textAlign: 'right', fontFamily: FONT_MONO, color: T.tx }}>{v}%</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* 保险相关提示 */}
          <div style={{ background: T.goldBg, border: '1px solid ' + T.goldBd, borderRadius: 12, padding: '12px 14px', marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.gold, marginBottom: 6 }}>{$('insurance_tip_title')}</div>
            <div style={{ fontSize: 13, color: T.tx2, lineHeight: 1.5 }}>
              { $('if_delayed_payout', { threshold: DELAY_THRESHOLD }) } <strong>+{n(payout)} ETH</strong>
            </div>
            <div style={{ fontSize: 11, color: T.tx4, marginTop: 6 }}>
              {d.dep_delayed > 0 ? $('flight_demo_tip') : $('flight_good_history_tip')}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <Button onClick={() => { const idx = FLIGHTS.indexOf(d); if (idx >= 0) setFi(idx); setDetail(null); }} style={{ flex: 1 }}>
              {$('select_this')}
            </Button>
            <button onClick={() => setDetail(null)} style={{ flex: 1, padding: '12px 20px', borderRadius: 12, border: '1px solid ' + T.b2, background: 'transparent', color: T.tx2, cursor: 'pointer' }}>
              {$('close_btn')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 32px' }}>
      {/* 产品线选择 */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 32, overflowX: 'auto', paddingBottom: 4 }}>
        {PRODUCTS.map((p) => (
          <button
            key={p.id}
            onClick={() => p.active && setProduct(p.id)}
            disabled={!p.active}
            style={{
              padding: '12px 20px',
              borderRadius: 12,
              border: '1px solid ' + (product === p.id ? T.goldBd : p.active ? T.b : 'transparent'),
              background:
                product === p.id
                  ? 'linear-gradient(135deg, rgba(34,211,238,0.12) 0%, rgba(8,145,178,0.06) 100%)'
                  : p.active
                    ? 'rgba(17,27,48,0.6)'
                    : 'rgba(17,27,48,0.3)',
              opacity: p.active ? 1 : 0.5,
              cursor: p.active ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              transition: 'all 0.25s ease',
              boxShadow: product === p.id ? '0 4px 20px rgba(34,211,238,0.1)' : 'none',
              fontFamily: FONT_SANS,
              whiteSpace: 'nowrap',
            }}
          >
              <span style={{ fontSize: 20, filter: p.active ? 'none' : 'grayscale(1)' }}>{p.icon}</span>
            <span style={{ fontSize: 13, fontWeight: product === p.id ? 600 : 500, color: product === p.id ? T.gold : p.active ? T.tx2 : T.tx4 }}>{$(p.nameKey)}</span>
            {!p.active && !p.devMode && <Badge variant="default">{p.updating ? $('updating_soon') : $('coming_soon')}</Badge>}
            {p.devMode && <Badge variant="warning">{$('dev_mode')}</Badge>}
          </button>
        ))}
      </div>

      {/* 标题 */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: T.tx }}>
            {product === 'flight'
              ? $('page_title')
              : product === 'worldcup'
                ? $('worldcup_title')
                : $('page_title')}
          </h1>
        </div>
        <p style={{ fontSize: 14, color: T.tx3, lineHeight: 1.6, maxWidth: 520 }}>
          {product === 'flight'
            ? $('page_desc', { threshold: DELAY_THRESHOLD })
            : product === 'worldcup'
              ? $('worldcup_desc')
              : $('page_desc', { threshold: DELAY_THRESHOLD })}
        </p>
      </div>

      {product === 'worldcup' && <WorldCupSection />}

      {product === 'flight' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 28 }}>
          {/* 左：选择 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: T.tx2, letterSpacing: '-0.01em' }}>{$('select_flight')}</span>
                <div style={{ display: 'flex', gap: 4, background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 3 }}>
                  {(['all', 'dom', 'intl'] as const).map((k) => (
                    <button
                      key={k}
                      onClick={() => setTab(k)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 6,
                        border: 'none',
                        background: tab === k ? T.goldBg : 'transparent',
                        color: tab === k ? T.gold : T.tx4,
                        fontSize: 12,
                        fontWeight: tab === k ? 600 : 500,
                        cursor: 'pointer',
                        fontFamily: FONT_SANS,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {$(k === 'all' ? 'filter_all' : k === 'dom' ? 'filter_domestic' : 'filter_international')}
                    </button>
                  ))}
                </div>
              </div>

              {/* 搜索框 */}
              <div style={{ marginBottom: 12 }}>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={$('search_placeholder')}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid ' + T.b2,
                    background: 'rgba(0,0,0,0.3)',
                    color: T.tx,
                    fontSize: 13,
                    fontFamily: FONT_SANS,
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 340, overflowY: 'auto', paddingRight: 4 }}>
                {list.map((f) => {
                  const idx = FLIGHTS.indexOf(f);
                  const sel = fi === idx;
                  const delayed = f.dep_delayed >= DELAY_THRESHOLD;
                  return (
                    <div
                      key={f.id}
                      onClick={() => setFi(idx)}
                      style={{
                        padding: '16px 18px',
                        borderRadius: 12,
                        cursor: 'pointer',
                        border: '1px solid ' + (sel ? T.goldBd : 'rgba(255,255,255,0.04)'),
                        background: sel ? 'linear-gradient(135deg, rgba(34,211,238,0.08) 0%, rgba(17,27,48,0.9) 100%)' : 'rgba(255,255,255,0.02)',
                        transition: 'all 0.2s ease',
                        boxShadow: sel ? '0 2px 12px rgba(34,211,238,0.1)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontFamily: FONT_MONO, fontSize: 15, fontWeight: 700, color: sel ? T.gold : T.tx2, letterSpacing: '-0.01em' }}>{f.iata}</span>
                          <span style={{ fontSize: 12, color: T.tx4 }}>{f.airline.name}</span>
                          {f.intl && <Badge variant="info">{$('intl_badge')}</Badge>}
                        </div>
                        <Badge variant={delayed ? 'warning' : 'success'}>{delayed ? $('delay_badge', { min: f.dep_delayed }) : $('ontime_badge')}</Badge>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDetail(f); }}
                          style={{
                            marginLeft: 8,
                            padding: '2px 8px',
                            fontSize: 11,
                            borderRadius: 6,
                            border: '1px solid ' + T.b2,
                            background: 'transparent',
                            color: T.tx3,
                            cursor: 'pointer',
                            fontFamily: FONT_SANS,
                          }}
                        >
                          ℹ️
                        </button>
                      </div>
                      <div style={{ fontSize: 12, color: T.tx4, marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontFamily: FONT_MONO, color: sel ? T.tx2 : T.tx4 }}>{f.dep.iata}</span>
                        <span style={{ color: T.gold, fontSize: 10 }}>━━✈</span>
                        <span style={{ fontFamily: FONT_MONO, color: sel ? T.tx2 : T.tx4 }}>{f.arr.iata}</span>
                        <span style={{ marginLeft: 'auto', fontFamily: FONT_MONO }}>{f.dep.scheduled}</span>
                      </div>
                      {/* 增强信息：准点率 + 时长 + 距离 */}
                      <div style={{ fontSize: 11, color: T.tx4, marginTop: 8, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <span>{$('ontime_rate')}: <strong style={{ color: sel ? T.gold : T.tx2 }}>{Math.round(f.onTimeRate * 100)}%</strong></span>
                        <span>{$('duration')}: {Math.floor(f.duration / 60)}h {f.duration % 60}m</span>
                        {f.distanceKm && <span>{$('distance')}: {(f.distanceKm / 1000).toFixed(0)}k km</span>}
                      </div>
                    </div>
                  );
                })}
                {list.length === 0 && (
                  <div style={{ padding: '18px 12px', textAlign: 'center', color: T.tx4, fontSize: 13 }}>
                    { $('no_flight_result') }
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <span style={{ fontSize: 14, fontWeight: 600, color: T.tx2, display: 'block', marginBottom: 14, letterSpacing: '-0.01em' }}>{$('select_date')}</span>
              <div style={{ display: 'flex', gap: 12 }}>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={tomorrow}
                  style={{
                    flex: 1,
                    padding: '14px 16px',
                    borderRadius: 10,
                    border: '1px solid ' + T.b2,
                    background: 'rgba(0,0,0,0.3)',
                    color: T.tx,
                    fontSize: 14,
                    fontFamily: FONT_MONO,
                    outline: 'none',
                    transition: 'all 0.2s ease',
                  }}
                />
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['tomorrow', 'day_after', 'plus_7_days'] as const).map((lbKey, i) => {
                    const off = [1, 2, 7][i];
                    const d = new Date();
                    d.setDate(d.getDate() + off);
                    const v = d.toISOString().split('T')[0];
                    const s = date === v;
                    return (
                      <button
                        key={lbKey}
                        onClick={() => setDate(v)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 8,
                          border: '1px solid ' + (s ? T.goldBd : T.b),
                          background: s ? T.goldBg : 'transparent',
                          color: s ? T.gold : T.tx4,
                          fontSize: 12,
                          fontWeight: s ? 600 : 500,
                          cursor: 'pointer',
                          fontFamily: FONT_SANS,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {$(lbKey)}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: 13, color: canPurchase ? T.tx3 : T.error }}>
                {formatDate(date)} · {fl.dep.scheduled}
                {!canPurchase && <span style={{ marginLeft: 8 }}>⚠️ {$('select_future_date')}</span>}
              </div>
            </Card>

            <Card>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.tx2, display: 'block', marginBottom: 12 }}>{$('select_plan')}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {TIERS.map((t, i) => {
                  const sel = ti === i;
                  return (
                    <button
                      key={i}
                      onClick={() => setTi(i)}
                      style={{
                        padding: '16px 20px',
                        borderRadius: 10,
                        border: '1px solid ' + (sel ? T.goldBd : T.b),
                        background: sel ? T.goldBg : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 12, color: T.tx4, marginBottom: 4 }}>{$(t.nameKey)}</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                          <span style={{ fontSize: 11, color: T.tx4 }}>{$('premium_label')}</span>
                          <span style={{ fontFamily: FONT_MONO, fontSize: 18, fontWeight: 700, color: sel ? T.w : T.tx2 }}>{n(t.premium)}</span>
                          <span style={{ fontSize: 11, color: T.tx4 }}>ETH</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: T.gold, marginBottom: 4 }}>{$('payout_label', { threshold: DELAY_THRESHOLD })}</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, justifyContent: 'flex-end' }}>
                          <span style={{ fontFamily: FONT_MONO, fontSize: 20, fontWeight: 700, color: sel ? T.gold : T.tx3 }}>+{n(t.payout)}</span>
                          <span style={{ fontSize: 11, color: T.tx4 }}>ETH</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div style={{ marginTop: 12, padding: '10px 14px', background: T.bg, borderRadius: 8, fontSize: 12, color: T.tx4 }}>
                💡 {$('rate_hint', { rate: tier.rate, premium: n(premium), payout: n(payout) })}
              </div>
            </Card>
          </div>

          {/* 右：摘要 & 操作 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card style={{ background: T.raised }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 28, fontWeight: 700 }}>{fl.iata}</div>
                  <div style={{ fontSize: 13, color: T.tx3, marginTop: 4 }}>{fl.airline.name}</div>
                </div>
                <Badge variant={fl.dep_delayed >= DELAY_THRESHOLD ? 'warning' : 'success'}>{fl.dep_delayed >= DELAY_THRESHOLD ? $('delay_badge', { min: fl.dep_delayed }) : $('ontime_badge')}</Badge>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 20, padding: '16px 0', borderTop: '1px solid ' + T.b }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: T.tx4, textTransform: 'uppercase' }}>DEP</div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 20, fontWeight: 700, marginTop: 4 }}>{fl.dep.iata}</div>
                  <div style={{ fontSize: 12, color: T.tx3 }}>{fl.dep.city}</div>
                </div>
                <div style={{ padding: '0 16px', color: T.gold }}>✈️</div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: T.tx4, textTransform: 'uppercase' }}>ARR</div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 20, fontWeight: 700, marginTop: 4 }}>{fl.arr.iata}</div>
                  <div style={{ fontSize: 12, color: T.tx3 }}>{fl.arr.city}</div>
                </div>
              </div>

              {/* 增强摘要：准点率、时长、距离 */}
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid ' + T.b, fontSize: 12, color: T.tx3, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span>{$('ontime_rate')}: <strong style={{ color: T.gold }}>{Math.round(fl.onTimeRate * 100)}%</strong></span>
                <span>{$('duration')}: {Math.floor(fl.duration / 60)}h {fl.duration % 60}m</span>
                {fl.distanceKm && <span>{$('distance')}: {(fl.distanceKm / 1000).toFixed(0)}k km</span>}
              </div>
            </Card>

            <Card>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.tx2, display: 'block', marginBottom: 16 }}>{$('order_confirm')}</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div style={{ padding: '16px', background: T.bg, borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: T.tx4, marginBottom: 6 }}>{$('you_pay')}</div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 28, fontWeight: 700, color: T.tx }}>{n(premium)}</div>
                  <div style={{ fontSize: 11, color: T.tx4 }}>ETH</div>
                </div>
                <div style={{ padding: '16px', background: T.goldBg, border: '1px solid ' + T.goldBd, borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: T.gold, marginBottom: 6 }}>{$('you_get')}</div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 28, fontWeight: 700, color: T.gold }}>+{n(payout)}</div>
                  <div style={{ fontSize: 11, color: T.gold }}>ETH</div>
                </div>
              </div>

              <div style={{ fontSize: 12, color: T.tx4, marginBottom: 12 }}>{$('policy_details')}</div>
              {[
                [$('flight_label'), fl.iata],
                [$('route_label'), `${fl.dep.iata} → ${fl.arr.iata}`],
                [$('date_label'), `${date} ${fl.dep.scheduled}`],
                [$('condition_label'), $('delay_condition', { threshold: DELAY_THRESHOLD })],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                  <span style={{ color: T.tx4 }}>{k}</span>
                  <span style={{ fontFamily: FONT_MONO, color: T.tx2 }}>{v}</span>
                </div>
              ))}

              <div style={{ marginTop: 12, padding: '10px 14px', background: T.goldBg, border: '1px solid ' + T.goldBd, borderRadius: 8, fontSize: 12 }}>
                <span style={{ color: T.tx3 }}>💰 {$('return_rate', { premium: n(premium), payout: n(payout), multiplier: Math.round(payout / premium) })}</span>
              </div>
            </Card>

            {error && (
              <div style={{ padding: '12px 16px', borderRadius: 10, background: T.errorBg, border: '1px solid ' + T.errorBd, color: T.error, fontSize: 13 }}>{error}</div>
            )}

            {!wallet ? (
              <Card style={{ background: T.goldBg, border: '1px solid ' + T.goldBd, textAlign: 'center' }}>
                <span style={{ color: T.tx3, fontSize: 14 }}>{$('connect_first')}</span>
              </Card>
            ) : !canPurchase ? (
              <Card style={{ background: T.errorBg, border: '1px solid ' + T.errorBd, textAlign: 'center' }}>
                <span style={{ color: T.error, fontSize: 14 }}>{$('future_date_only')}</span>
              </Card>
            ) : !canBuyMore ? (
              <Card style={{ background: T.errorBg, border: '1px solid ' + T.errorBd, textAlign: 'center' }}>
                <span style={{ color: T.error, fontSize: 14 }}>{$('daily_limit_reached', { max: MAX_POLICIES_PER_DAY })}</span>
              </Card>
            ) : (
              <>
                <Button onClick={handlePurchase} disabled={busy || balanceETH < premium} size="lg" style={{ width: '100%' }}>
                  {busy ? $('processing') : $('confirm_pay', { amount: n(premium) })}
                </Button>
                {wallet && (
                  <div style={{ fontSize: 12, color: todayCount >= MAX_POLICIES_PER_DAY - 1 ? T.warn : T.tx4, textAlign: 'center', marginTop: 8 }}>
                    {$('daily_limit_hint', { count: todayCount, max: MAX_POLICIES_PER_DAY })}
                  </div>
                )}
              </>
            )}

            <div style={{ fontSize: 11, color: T.tx4, textAlign: 'center', padding: '8px 0' }}>ChainSure</div>
          </div>
        </div>
      )}

      {/* NFT Mint 区 */}
      <div style={{ marginTop: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.3), transparent)' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#c084fc', letterSpacing: '0.08em', textTransform: 'uppercase' }}>🎨 NFT Mint · {$('dev_mode')}</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.3), transparent)' }} />
        </div>
        <NFTMintSection />
      </div>

      {/* 航线详情弹窗 */}
      <FlightDetailModal />
    </div>
  );
}
