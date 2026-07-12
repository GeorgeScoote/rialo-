import { useApp } from '@/state/AppContext';
import { useLang } from '@i18n/LangContext';
import { Button, Card } from '@components/ui';
import { FONT_MONO, T } from '@/theme/tokens';

/** 未知 hash 路径的 404 页 */
export function NotFoundPage() {
  const { setPage } = useApp();
  const { $ } = useLang();
  const path = window.location.hash.replace(/^#\/?/, '') || '/';

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '72px 24px' }}>
      <Card style={{ textAlign: 'center', padding: '48px 32px' }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 56, fontWeight: 800, color: T.gold, letterSpacing: '-0.04em', lineHeight: 1 }}>
          {$('not_found_code')}
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.tx, marginTop: 16, marginBottom: 10 }}>
          {$('not_found_title')}
        </h1>
        <p style={{ fontSize: 14, color: T.tx3, lineHeight: 1.65, marginBottom: 20 }}>
          {$('not_found_desc')}
        </p>
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 12,
            color: T.tx4,
            padding: '10px 14px',
            borderRadius: 8,
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid ' + T.b,
            marginBottom: 28,
            wordBreak: 'break-all',
          }}
        >
          {$('not_found_path')}: /{path}
        </div>
        <Button onClick={() => setPage('home')} size="lg">
          {$('not_found_back')}
        </Button>
      </Card>
    </div>
  );
}
