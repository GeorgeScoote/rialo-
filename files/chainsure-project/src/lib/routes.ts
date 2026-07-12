/** 应用内页面路由（hash：#/home） */
export const APP_PAGES = ['home', 'policies', 'claims', 'wallet'] as const;

export type AppPage = (typeof APP_PAGES)[number];

export function isAppPage(value: string): value is AppPage {
  return (APP_PAGES as readonly string[]).includes(value);
}

/** 从 location.hash 解析当前页面 */
export function parseHashPage(): AppPage {
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  const segment = raw.split(/[?#]/)[0]?.toLowerCase() ?? '';
  return isAppPage(segment) ? segment : 'home';
}

/** 将页面同步到 hash；replace 用于初始化避免多余历史记录 */
export function syncHashPage(page: AppPage, replace = false): void {
  const hash = `#/${page}`;
  if (window.location.hash === hash) return;
  if (replace) {
    window.history.replaceState(null, '', hash);
  } else {
    window.location.hash = hash;
  }
}
