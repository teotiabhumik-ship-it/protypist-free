import React, { useState, useMemo } from 'react';
import { SSC_PYQ_PASSAGES, type SscPyqPassage } from '@/lib/sscPyqPassages';
import { Search, X, Check, BookOpen, Shuffle, FileText, Clock, Award } from 'lucide-react';

interface SscPyqModalProps {
  isOpen: boolean;
  currentPassageId?: string;
  onSelect: (passage: SscPyqPassage) => void;
  onClose: () => void;
}

export const SscPyqModal: React.FC<SscPyqModalProps> = ({
  isOpen,
  currentPassageId,
  onSelect,
  onClose,
}) => {
  const [selectedExam, setSelectedExam] = useState<'ALL' | 'SSC CGL Tier-II' | 'SSC CHSL DEST'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPassages = useMemo(() => {
    return SSC_PYQ_PASSAGES.filter((p) => {
      const matchExam = selectedExam === 'ALL' || p.exam === selectedExam;
      const matchQuery =
        searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shift.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.year).includes(searchQuery);
      return matchExam && matchQuery;
    });
  }, [selectedExam, searchQuery]);

  if (!isOpen) return null;

  const handleRandomSelect = () => {
    const pool = filteredPassages.length > 0 ? filteredPassages : SSC_PYQ_PASSAGES;
    const random = pool[Math.floor(Math.random() * pool.length)];
    onSelect(random);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-white text-slate-800 shadow-2xl overflow-hidden border border-slate-200"
        style={{ fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif' }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Official SSC DEST Previous Year Passages
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-amber-400 text-slate-900">
                  TCS iON
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Authentic ~2,000 Key Depression (15-Minute) passages from SSC CGL Tier-II & CHSL DEST past shifts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          {/* Exam Filter Tabs */}
          <div className="flex items-center space-x-1.5 bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
            {(
              [
                { id: 'ALL', label: `All Passages (${SSC_PYQ_PASSAGES.length})` },
                { id: 'SSC CGL Tier-II', label: 'SSC CGL Tier-II (8)' },
                { id: 'SSC CHSL DEST', label: 'SSC CHSL DEST (4)' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedExam(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedExam === tab.id
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topic, year, or keyword..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Passages Grid / List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 max-h-[58vh]">
          {filteredPassages.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <FileText className="w-10 h-10 mx-auto text-slate-300" />
              <div className="font-semibold text-sm">No passages found matching your search.</div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedExam('ALL');
                }}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredPassages.map((passage) => {
              const isCurrent = currentPassageId === passage.id;
              const isCgl = passage.exam === 'SSC CGL Tier-II';

              return (
                <div
                  key={passage.id}
                  onClick={() => {
                    onSelect(passage);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    isCurrent
                      ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/80 hover:shadow-sm'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isCgl
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {passage.exam} • {passage.year}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {passage.shift}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        {passage.category}
                      </span>
                      {isCurrent && (
                        <span className="flex items-center text-[10px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded-full border border-blue-200 shadow-xs">
                          <Check className="w-3 h-3 mr-1" />
                          Currently Active
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {passage.title}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                      {passage.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                      <span className="flex items-center">
                        <Award className="w-3 h-3 mr-1 text-slate-400" />
                        <strong>{passage.targetKeystrokes.toLocaleString()}</strong>&nbsp;Key Depressions
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>
                        <strong>{passage.wordCount}</strong> words
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-slate-400" />
                        15 Minutes
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(passage);
                        onClose();
                      }}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all shadow-xs ${
                        isCurrent
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-slate-900 text-white hover:bg-blue-600'
                      }`}
                    >
                      {isCurrent ? 'Active Passage' : 'Select Passage →'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-500">
            <span>Showing {filteredPassages.length} of {SSC_PYQ_PASSAGES.length} official PYQ papers</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRandomSelect}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition flex items-center space-x-1.5"
            >
              <Shuffle className="w-3.5 h-3.5 text-slate-500" />
              <span>Surprise Shift</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-300 text-slate-800 font-semibold hover:bg-slate-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
