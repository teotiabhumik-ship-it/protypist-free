// ═══════════════════════════════════════════════════════════════════════════════
// ProTypist / TypePulse - Public API Connector & Custom Document Importer Modal
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { Globe, Download, Upload, Plus, FileText, Check, Loader2, X } from 'lucide-react';
import { PublicApiManager, type OnlineFetchedPassage } from '../lib/publicApi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectPassage: (text: string, title: string) => void;
}

export const PublicApiModal: React.FC<Props> = ({ isOpen, onClose, onSelectPassage }) => {
  const [activeTab, setActiveTab] = useState<'api' | 'custom' | 'cached'>('api');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Custom text state
  const [customTitle, setCustomTitle] = useState('');
  const [customText, setCustomText] = useState('');

  // Cached passages
  const cachedList = PublicApiManager.getCachedPassages();

  if (!isOpen) return null;

  const handleFetchQuotable = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const item = await PublicApiManager.fetchQuotableQuotes();
      onSelectPassage(item.text, item.title);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(`Failed to connect to Quotable API. Working offline.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchWikipedia = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const item = await PublicApiManager.fetchWikipediaSummary();
      onSelectPassage(item.text, item.title);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(`Failed to connect to Wikipedia API. Working offline.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCustom = () => {
    if (!customText.trim()) return;
    const item = PublicApiManager.saveCustomPassage(
      customTitle || 'Custom Imported Document',
      customText
    );
    onSelectPassage(item.text, item.title);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCustomTitle(file.name.replace(/\.[^/.]+$/, ''));
        setCustomText(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div
        className="w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        style={{
          background: 'var(--card, #0f172a)',
          borderColor: 'color-mix(in srgb, var(--sub, #64748b) 30%, transparent)',
          color: 'var(--text, #f8fafc)',
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <Globe className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-base">Passage Catalog & Online API Connectors</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg opacity-70 hover:opacity-100 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-800 px-6 pt-2 bg-black/20 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('api')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'api'
                ? 'border-sky-400 text-sky-400 font-bold'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            Online Public APIs
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'custom'
                ? 'border-sky-400 text-sky-400 font-bold'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            Custom Document / Upload
          </button>
          <button
            onClick={() => setActiveTab('cached')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'cached'
                ? 'border-sky-400 text-sky-400 font-bold'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            Offline Cached ({cachedList.length})
          </button>
        </div>

        {/* Tab content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              <p className="text-xs opacity-75 leading-relaxed">
                Fetch fresh texts dynamically from public open-source endpoints. Fetched passages
                are automatically saved to local storage so you can practice them offline later.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleFetchQuotable}
                  disabled={isLoading}
                  className="p-4 rounded-xl border border-slate-800 bg-black/20 hover:border-sky-500/50 hover:bg-sky-500/5 transition text-left space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-sky-400">Quotable Public API</span>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                    ) : (
                      <Download className="w-4 h-4 opacity-50 group-hover:opacity-100 text-sky-400" />
                    )}
                  </div>
                  <p className="text-[11px] opacity-70">
                    Fetch rich literary and philosophical quotes from historical figures.
                  </p>
                </button>

                <button
                  onClick={handleFetchWikipedia}
                  disabled={isLoading}
                  className="p-4 rounded-xl border border-slate-800 bg-black/20 hover:border-purple-500/50 hover:bg-purple-500/5 transition text-left space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-purple-400">Wikipedia Summary API</span>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    ) : (
                      <Download className="w-4 h-4 opacity-50 group-hover:opacity-100 text-purple-400" />
                    )}
                  </div>
                  <p className="text-[11px] opacity-70">
                    Fetch random encyclopedic summaries across science, history, and culture.
                  </p>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold opacity-75">Document Title:</label>
                <label className="px-2.5 py-1 rounded border text-xs font-semibold cursor-pointer hover:bg-white/5 transition flex items-center space-x-1.5">
                  <Upload className="w-3.5 h-3.5 text-sky-400" />
                  <span>Upload .TXT File</span>
                  <input
                    type="file"
                    accept=".txt,.md,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. My Custom Essay or Coding Exercise"
                className="w-full p-2.5 rounded-lg border bg-slate-950 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-sky-400"
              />

              <div className="space-y-1">
                <label className="text-xs font-bold opacity-75">Passage Content:</label>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Paste any custom paragraph, editorial, or notes here..."
                  className="w-full h-40 p-3 rounded-lg border bg-slate-950 font-mono text-xs leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
              </div>

              <button
                onClick={handleSaveCustom}
                disabled={!customText.trim()}
                className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow transition disabled:opacity-50"
              >
                Load Custom Document into Typing Engine
              </button>
            </div>
          )}

          {activeTab === 'cached' && (
            <div className="space-y-2">
              {cachedList.length === 0 ? (
                <div className="py-8 text-center text-xs opacity-60">
                  No online passages cached yet. Fetch from Quotable or Wikipedia to store them offline.
                </div>
              ) : (
                <div className="divide-y divide-slate-800 text-xs">
                  {cachedList.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        onSelectPassage(c.text, c.title);
                        onClose();
                      }}
                      className="py-2.5 px-3 rounded-lg hover:bg-white/5 cursor-pointer flex items-center justify-between group transition"
                    >
                      <div>
                        <div className="font-bold text-sky-400 group-hover:underline">
                          {c.title}
                        </div>
                        <div className="text-[11px] opacity-60 truncate max-w-md mt-0.5">
                          {c.text}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 uppercase">
                        {c.source}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
