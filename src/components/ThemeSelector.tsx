import React, { useEffect, useState } from 'react';
import { THEMES, applyTheme } from '@/lib/themes';

export const ThemeSelector: React.FC = () => {
  const [active, setActive] = useState('darkMagic');

  useEffect(() => {
    const saved = localStorage.getItem('typepulse_theme') || 'darkMagic';
    if (THEMES[saved]) {
      setActive(saved);
      applyTheme(THEMES[saved]);
    }
  }, []);

  const select = (id: string) => {
    setActive(id);
    applyTheme(THEMES[id]);
    localStorage.setItem('typepulse_theme', id);
  };

  return (
    <div className="flex items-center space-x-1.5">
      {Object.values(THEMES).map((t) => (
        <button
          key={t.id}
          onClick={() => select(t.id)}
          title={t.name}
          className="w-4 h-4 rounded-full border-2 transition-transform hover:scale-125"
          style={{
            backgroundColor: t.main,
            borderColor: active === t.id ? t.text : 'transparent',
          }}
        />
      ))}
    </div>
  );
};
