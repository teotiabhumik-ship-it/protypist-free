// ═══════════════════════════════════════════════════════════════════════════════
// ProTypist / TypePulse - ProType & Professional Color Themes
// Sets CSS variables on :root for seamless live theme switching
// ═══════════════════════════════════════════════════════════════════════════════

export interface Theme {
  id: string;
  name: string;
  bg: string;
  card: string;
  main: string;
  caret: string;
  sub: string;
  text: string;
  error: string;
}

export const THEMES: Record<string, Theme> = {
  serikaDark: {
    id: 'serikaDark',
    name: 'Serika Dark',
    bg: '#323437',
    card: '#2c2e31',
    main: '#e2b714',
    caret: '#e2b714',
    sub: '#646669',
    text: '#d1d0c5',
    error: '#ca4754',
  },
  carbon: {
    id: 'carbon',
    name: 'Carbon',
    bg: '#313131',
    card: '#282828',
    main: '#f66e0d',
    caret: '#f66e0d',
    sub: '#616161',
    text: '#f5e6c8',
    error: '#e22d30',
  },
  dracula: {
    id: 'dracula',
    name: 'Dracula',
    bg: '#282a36',
    card: '#21222c',
    main: '#bd93f9',
    caret: '#ff79c6',
    sub: '#6272a4',
    text: '#f8f8f2',
    error: '#ff5555',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    bg: '#0a0a1a',
    card: '#14142b',
    main: '#00ff9f',
    caret: '#ff007f',
    sub: '#3a3a5c',
    text: '#00e5ff',
    error: '#ff003c',
  },
  nord: {
    id: 'nord',
    name: 'Nord',
    bg: '#2e3440',
    card: '#242933',
    main: '#88c0d0',
    caret: '#81a1c1',
    sub: '#4c566a',
    text: '#eceff4',
    error: '#bf616a',
  },
  gruvbox: {
    id: 'gruvbox',
    name: 'Gruvbox',
    bg: '#282828',
    card: '#1d2021',
    main: '#fabd2f',
    caret: '#fe8019',
    sub: '#928374',
    text: '#ebdbb2',
    error: '#fb4934',
  },
  moonlight: {
    id: 'moonlight',
    name: 'Moonlight',
    bg: '#191a2a',
    card: '#151624',
    main: '#c099ff',
    caret: '#ff757f',
    sub: '#595f85',
    text: '#c8d3f5',
    error: '#ff5370',
  },
  paperLight: {
    id: 'paperLight',
    name: 'Paper Light',
    bg: '#f8f9fa',
    card: '#ffffff',
    main: '#2563eb',
    caret: '#2563eb',
    sub: '#94a3b8',
    text: '#1e293b',
    error: '#ef4444',
  },
  terminalGreen: {
    id: 'terminalGreen',
    name: 'Terminal Matrix',
    bg: '#0c100d',
    card: '#131e15',
    main: '#10b981',
    caret: '#34d399',
    sub: '#243328',
    text: '#4ade80',
    error: '#f87171',
  },
  sscBlue: {
    id: 'sscBlue',
    name: 'TCS iON Official Blue',
    bg: '#1a2936',
    card: '#244c6d',
    main: '#f39c12',
    caret: '#f39c12',
    sub: '#8faec7',
    text: '#ffffff',
    error: '#e74c3c',
  },
};

export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  const r = document.documentElement;
  r.style.setProperty('--bg', theme.bg);
  r.style.setProperty('--card', theme.card);
  r.style.setProperty('--main', theme.main);
  r.style.setProperty('--caret', theme.caret);
  r.style.setProperty('--sub', theme.sub);
  r.style.setProperty('--text', theme.text);
  r.style.setProperty('--error', theme.error);
}
