import React from 'react';
import { Festival } from '../types';
import { MapPin, Navigation, Compass, ExternalLink, Calendar, Bookmark } from 'lucide-react';
import { DISTRICT_COORDINATES, BUSAN_DISTRICTS } from '../utils/festivalUtils';

interface MapViewProps {
  festivals: Festival[];
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  onSelectFestival: (festival: Festival) => void;
  bookmarkedIds: Set<number>;
  onToggleBookmark: (id: number) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  festivals,
  selectedDistrict,
  onSelectDistrict,
  onSelectFestival,
  bookmarkedIds,
  onToggleBookmark
}) => {
  const [activePin, setActivePin] = React.useState<Festival | null>(null);

  // Map projection bounds for Busan:
  // Min Lat: 35.02, Max Lat: 35.28
  // Min Lng: 128.90, Max Lng: 129.28
  const minLat = 35.02;
  const maxLat = 35.28;
  const minLng = 128.90;
  const maxLng = 129.28;

  const projectCoords = (lat: number, lng: number) => {
    // Map latitude to Y % (higher lat = lower Y % on screen)
    const yPct = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
    // Map longitude to X %
    const xPct = ((lng - minLng) / (maxLng - minLng)) * 100;

    return {
      x: Math.max(5, Math.min(95, xPct)),
      y: Math.max(5, Math.min(95, yPct))
    };
  };

  return (
    <div className="space-y-4">
      {/* Top Map Notice & District Quick Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              부산 축제 지도 탐색기
            </h3>
            <p className="text-xs text-slate-400">
              부산광역시 각 구/군 위치에 위치한 축제를 클릭하여 확인해보세요.
            </p>
          </div>
        </div>

        {/* Selected District Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">현재 구/군:</span>
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950">
            {selectedDistrict === 'all' || selectedDistrict === '전체' ? '부산 전지역' : selectedDistrict}
          </span>
        </div>
      </div>

      {/* Main Interactive Map Canvas Box */}
      <div className="relative w-full h-[520px] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
        
        {/* Ocean & Land Visual Styling Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 opacity-90" />
        
        {/* Decorative Grid Lines */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: `24px 24px`
          }}
        />

        {/* Sea Label decor */}
        <div className="absolute bottom-6 right-8 text-xs font-bold tracking-widest text-cyan-500/20 uppercase pointer-events-none">
          BUSAN SOUTH SEA / 광안리 · 해운대 앞바다
        </div>

        {/* District Labels Layer */}
        {Object.entries(DISTRICT_COORDINATES).map(([distName, coords]) => {
          const { x, y } = projectCoords(coords.lat, coords.lng);
          const isSelected = selectedDistrict === distName;

          return (
            <button
              key={distName}
              onClick={() => onSelectDistrict(distName)}
              style={{ left: `${x}%`, top: `${y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-lg text-[10px] font-bold transition z-10 ${
                isSelected
                  ? 'bg-cyan-400 text-slate-950 ring-2 ring-cyan-300 scale-110 z-20 shadow-lg'
                  : 'bg-slate-900/70 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              {distName}
            </button>
          );
        })}

        {/* Festival Pins Layer */}
        {festivals.map((fest) => {
          const { x, y } = projectCoords(fest.lat, fest.lng);
          const isBookmarked = bookmarkedIds.has(fest.id);
          const isActive = activePin?.id === fest.id;

          return (
            <button
              key={fest.id}
              onClick={() => setActivePin(fest)}
              style={{ left: `${x}%`, top: `${y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-transform duration-200 z-20 group ${
                isActive ? 'scale-125 z-30' : 'hover:scale-125'
              }`}
              title={`${fest.title} (${fest.district})`}
            >
              <div className={`relative flex items-center justify-center w-7 h-7 rounded-full shadow-lg ${
                fest.status === 'ongoing'
                  ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/30 animate-bounce'
                  : isBookmarked
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                  : 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300'
              }`}>
                <MapPin className="w-4 h-4 fill-current" />
              </div>

              {/* Tooltip on Hover */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block whitespace-nowrap bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 shadow-xl pointer-events-none z-40">
                {fest.title}
              </div>
            </button>
          );
        })}

        {/* Active Pin Popup Preview Box */}
        {activePin && (
          <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-80 bg-slate-900/95 border border-slate-700 rounded-2xl p-4 shadow-2xl backdrop-blur-md z-40 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {activePin.district}
                </span>
                <span className="text-xs font-semibold text-amber-300">
                  {activePin.isFree ? '무료' : '유료'}
                </span>
              </div>
              <button
                onClick={() => setActivePin(null)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            <h4 className="text-sm font-bold text-white mt-1 line-clamp-1">
              {activePin.title}
            </h4>

            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
              {activePin.place}
            </p>

            <div className="flex items-center gap-1 text-[11px] text-slate-300 mt-2">
              <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="line-clamp-1">{activePin.dateText}</span>
            </div>

            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => onToggleBookmark(activePin.id)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700"
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.has(activePin.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>

              <button
                onClick={() => onSelectFestival(activePin)}
                className="flex-1 py-1.5 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition"
              >
                <span>상세보기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
