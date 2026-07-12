/** 应用内页面路由（hash：#/home） */
export const APP_PAGES = ['home', 'policies', 'claims', 'wallet'] as const;

export type AppPage = (typeof APP_PAGES)[number];

/** 路由状态：合法页面或 404 */
export type AppRoute = AppPage | 'not-found';

export function isAppPage(value: string): value is AppPage {
  return (APP_PAGES as readonly string[]).includes(value);
}

/** 从 location.hash 解析路由（未知路径返回 not-found） */
export function parseHashRoute(): AppRoute {
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  const segment = raw.split(/[?#]/)[0]?.toLowerCase() ?? '';
  if (!segment) return 'home';
  return isAppPage(segment) ? segment : 'not-found';
}

/** @deprecated 请用 parseHashRoute；非法 hash 会回落到 home */
export function parseHashPage(): AppPage {
  const route = parseHashRoute();
  return route === 'not-found' ? 'home' : route;
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
