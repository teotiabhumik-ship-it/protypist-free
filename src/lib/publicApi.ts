// ═══════════════════════════════════════════════════════════════════════════════
// ProTypist / TypePulse - Public Online API Connectors & Smart Offline Cache
// Fetches live paragraphs from public endpoints and caches them permanently offline
// ═══════════════════════════════════════════════════════════════════════════════

export interface OnlineFetchedPassage {
  id: string;
  title: string;
  source: 'quotable' | 'wikipedia' | 'bacon' | 'custom';
  text: string;
  author?: string;
  fetchedAt: number;
}

const CACHE_STORAGE_KEY = 'typepulse_online_cached_passages_v1';

export class PublicApiManager {
  private static getCache(): OnlineFetchedPassage[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(CACHE_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return [];
  }

  private static saveToCache(item: OnlineFetchedPassage) {
    if (typeof window === 'undefined') return;
    try {
      const cache = this.getCache();
      // Avoid duplicate IDs
      if (!cache.some((c) => c.id === item.id)) {
        cache.unshift(item);
        // Retain up to 200 cached passages offline
        if (cache.length > 200) cache.pop();
        localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cache));
      }
    } catch {
      // Fallback
    }
  }

  public static getCachedPassages(): OnlineFetchedPassage[] {
    return this.getCache();
  }

  /**
   * Fetch from Quotable API (public, no key required)
   */
  public static async fetchQuotableQuotes(minWordCount = 30): Promise<OnlineFetchedPassage> {
    const res = await fetch(`https://api.quotable.io/quotes/random?minLength=150`);
    if (!res.ok) throw new Error(`Quotable HTTP ${res.status}`);
    const data = await res.json();
    const item = Array.isArray(data) ? data[0] : data;
    const passage: OnlineFetchedPassage = {
      id: `quotable-${item._id || Date.now()}`,
      title: `Quote: ${item.author || 'Unknown'}`,
      source: 'quotable',
      author: item.author,
      text: item.content,
      fetchedAt: Date.now(),
    };
    this.saveToCache(passage);
    return passage;
  }

  /**
   * Fetch Random Summary from English Wikipedia (public API)
   */
  public static async fetchWikipediaSummary(): Promise<OnlineFetchedPassage> {
    const res = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary', {
      headers: {
        Accept: 'application/json',
      },
    });
    if (!res.ok) throw new Error(`Wikipedia HTTP ${res.status}`);
    const data = await res.json();
    if (!data.extract || data.extract.trim().length < 50) {
      throw new Error('Wikipedia extract too short');
    }
    const passage: OnlineFetchedPassage = {
      id: `wiki-${data.pageid || Date.now()}`,
      title: data.title || 'Wikipedia Excerpt',
      source: 'wikipedia',
      text: data.extract,
      fetchedAt: Date.now(),
    };
    this.saveToCache(passage);
    return passage;
  }

  /**
   * Store a custom user-pasted or file-uploaded text
   */
  public static saveCustomPassage(title: string, text: string): OnlineFetchedPassage {
    const passage: OnlineFetchedPassage = {
      id: `custom-${Date.now()}`,
      title: title.trim() || 'Custom Document',
      source: 'custom',
      text: text.trim(),
      fetchedAt: Date.now(),
    };
    this.saveToCache(passage);
    return passage;
  }
}
