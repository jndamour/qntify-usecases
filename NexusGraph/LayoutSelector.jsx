import { useEffect, useState } from 'react';
import { LAYOUT_OPTIONS } from './layouts';

export default function LayoutSelector({ value, onChange }) {
  const [collapsed, setCollapsed] = useState(true);
  const current = LAYOUT_OPTIONS.find(o => o.id === value);

  // Keyboard shortcuts 1-5
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === 'INPUT') return;
      const opt = LAYOUT_OPTIONS.find(o => o.key === e.key);
      if (opt) {
        onChange(opt.id);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onChange]);

  return (
    <div className={`nx-layout-sel${collapsed ? ' nx-layout-sel--collapsed' : ''}`}>
      <div
        className="nx-ls-label"
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="nx-ls-label-text">
          <span>Layout</span>
          <span className="nx-ls-current">· {current?.label || 'Force-directed'}</span>
        </div>
        <div className="nx-ls-chevron" />
      </div>
      <div className="nx-ls-options">
        {LAYOUT_OPTIONS.map(opt => (
          <button
            key={opt.id}
            type="button"
            className={`nx-ls-opt${value === opt.id ? ' nx-ls-opt--active' : ''}`}
            onClick={() => {
              onChange(opt.id);
              setCollapsed(true);
            }}
          >
            <span>{opt.label}</span>
            <span className="nx-ls-key">{opt.key}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
