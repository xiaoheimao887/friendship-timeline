import { useState, useRef, useEffect } from 'react';

interface LocationSearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationSearchProps {
  placeholder: string;
  value: string;
  onChange: (name: string, lat?: number, lng?: number) => void;
}

export function LocationSearch({ placeholder, value, onChange }: LocationSearchProps) {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const search = (text: string) => {
    setQuery(text);
    onChange(text);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim() || text.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&limit=5&accept-language=zh`,
          { headers: { 'User-Agent': 'FriendshipTimeline/1.0' } }
        );
        const data: LocationSearchResult[] = await res.json();
        setResults(data);
        setShowResults(data.length > 0);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 500);
  };

  const select = (r: LocationSearchResult) => {
    setQuery(r.display_name.split(',')[0]);
    onChange(r.display_name, parseFloat(r.lat), parseFloat(r.lon));
    setShowResults(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          value={query}
          onChange={e => search(e.target.value)}
          onFocus={() => { if (results.length > 0) setShowResults(true); }}
          className="w-full px-3 py-2 rounded-btn border border-warm-border bg-white focus:outline-none focus:ring-2 focus:ring-warm-primary/30 focus:border-warm-primary text-sm transition-colors"
          placeholder={placeholder}
        />
        {searching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-warm-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      {showResults && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white rounded-card-sm shadow-card border border-warm-border/50 max-h-48 overflow-y-auto">
          {results.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => select(r)}
              className="w-full text-left px-3 py-2 text-sm text-warm-text hover:bg-warm-bg transition-colors border-b border-warm-border/30 last:border-0"
            >
              <span className="line-clamp-1">{r.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
