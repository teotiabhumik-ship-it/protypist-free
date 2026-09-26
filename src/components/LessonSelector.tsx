import React, { useState } from 'react';
import { TYPING_LESSONS, TypingLesson } from '@/lib/lessons';

interface Props {
  currentLessonId: string;
  onSelectLesson: (lesson: TypingLesson) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const LessonSelector: React.FC<Props> = ({
  currentLessonId,
  onSelectLesson,
  isOpen,
  onClose,
}) => {
  const [selectedModule, setSelectedModule] = useState<string>('All');

  if (!isOpen) return null;

  const modules = ['All', ...Array.from(new Set(TYPING_LESSONS.map((l) => l.module)))];

  const filteredLessons = selectedModule === 'All'
    ? TYPING_LESSONS
    : TYPING_LESSONS.filter((l) => l.module === selectedModule);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.15s_ease]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-xl border shadow-2xl overflow-hidden font-mono"
        style={{
          background: 'var(--card)',
          borderColor: 'color-mix(in srgb, var(--sub) 30%, transparent)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'color-mix(in srgb, var(--sub) 20%, transparent)' }}
        >
          <div>
            <h2 className="text-base font-bold tracking-wide" style={{ color: 'var(--main)' }}>
              🎓 Structured Typing Lessons
            </h2>
            <p className="text-xs" style={{ color: 'var(--sub)' }}>
              Master touch typing step-by-step from home-row fundamentals to rhythmic fluency.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-sm transition-opacity hover:opacity-75"
            style={{ background: 'var(--bg)', color: 'var(--sub)' }}
          >
            ✕
          </button>
        </div>

        {/* Module Filter Tabs */}
        <div
          className="flex items-center gap-1.5 px-5 py-2.5 overflow-x-auto border-b text-xs"
          style={{
            background: 'var(--bg)',
            borderColor: 'color-mix(in srgb, var(--sub) 15%, transparent)',
          }}
        >
          {modules.map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className="px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all"
              style={{
                background: selectedModule === mod ? 'var(--main)' : 'transparent',
                color: selectedModule === mod ? 'var(--bg)' : 'var(--sub)',
                fontWeight: selectedModule === mod ? 'bold' : 'normal',
              }}
            >
              {mod}
            </button>
          ))}
        </div>

        {/* Lessons List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {filteredLessons.map((lesson) => {
            const isCurrent = lesson.id === currentLessonId;

            return (
              <div
                key={lesson.id}
                onClick={() => {
                  onSelectLesson(lesson);
                  onClose();
                }}
                className="p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:scale-[1.008]"
                style={{
                  background: isCurrent
                    ? 'color-mix(in srgb, var(--main) 12%, var(--bg))'
                    : 'var(--bg)',
                  borderColor: isCurrent
                    ? 'var(--main)'
                    : 'color-mix(in srgb, var(--sub) 25%, transparent)',
                }}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                      style={{
                        background: 'color-mix(in srgb, var(--main) 20%, transparent)',
                        color: 'var(--main)',
                      }}
                    >
                      Lvl {lesson.level} · {lesson.module}
                    </span>
                    <h3
                      className="text-sm font-bold group-hover:text-[var(--main)] transition-colors"
                      style={{ color: isCurrent ? 'var(--main)' : 'var(--text)' }}
                    >
                      {lesson.title}
                    </h3>
                  </div>

                  <p className="text-xs line-clamp-1" style={{ color: 'var(--sub)' }}>
                    {lesson.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1 pt-1">
                    <span className="text-[10px] mr-1" style={{ color: 'var(--sub)' }}>
                      Targets:
                    </span>
                    {lesson.targetKeys.map((k) => (
                      <span
                        key={k}
                        className="px-1.5 py-0.2 rounded font-mono text-[10px] border"
                        style={{
                          background: 'var(--card)',
                          borderColor: 'color-mix(in srgb, var(--sub) 30%, transparent)',
                          color: 'var(--text)',
                        }}
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center sm:self-center">
                  <button
                    className="px-4 py-1.5 rounded text-xs font-bold transition-all w-full sm:w-auto"
                    style={{
                      background: isCurrent ? 'var(--main)' : 'var(--card)',
                      color: isCurrent ? 'var(--bg)' : 'var(--text)',
                      border: isCurrent
                        ? 'none'
                        : '1px solid color-mix(in srgb, var(--sub) 30%, transparent)',
                    }}
                  >
                    {isCurrent ? 'Active ✓' : 'Practice →'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
