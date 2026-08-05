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
      <div className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] text-[#FF5C35] flex items-center justify-center border-2 border-[#1A1A1A]">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#1A1A1A]">
              BUSAN MAP EXPLORER (부산 축제 지도 탐색기)
            </h3>
            <p className="text-xs font-medium text-[#1A1A1A]/70">
              부산 각 구/군의 위치에 있는 축제를 클릭하여 상세 정보를 확인하세요.
            </p>
          </div>
        </div>

        {/* Selected District Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#1A1A1A]/70">SELECTED:</span>
          <span className="px-3 py-1 rounded-xl text-xs font-black bg-[#FF5C35] text-white border-2 border-[#1A1A1A]">
            {selectedDistrict === 'all' || selectedDistrict === '전체' ? 'BUSAN ALL' : selectedDistrict}
          </span>
        </div>
      </div>

      {/* Main Interactive Map Canvas Box */}
      <div className="relative w-full h-[520px] bg-[#FAF7F2] border-2 border-[#1A1A1A] rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] flex items-center justify-center">
        
        {/* Decorative Grid Lines */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#1A1A1A 1.5px, transparent 1.5px)`,
            backgroundSize: `24px 24px`
          }}
        />

        {/* Sea Label decor */}
        <div className="absolute bottom-6 right-8 text-xs font-black tracking-widest text-[#1A1A1A]/30 uppercase pointer-events-none">
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
              className={`absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-[10px] font-black transition z-10 border-2 border-[#1A1A1A] ${
                isSelected
                  ? 'bg-[#FF5C35] text-white scale-110 z-20 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]'
                  : 'bg-white text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'
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
              <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] ${
                fest.status === 'ongoing'
                  ? 'bg-[#FF5C35] text-white animate-bounce'
                  : isBookmarked
                  ? 'bg-[#1A1A1A] text-amber-300'
                  : 'bg-white text-[#1A1A1A]'
              }`}>
                <MapPin className="w-4 h-4 fill-current" />
              </div>

              {/* Tooltip on Hover */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block whitespace-nowrap bg-[#1A1A1A] text-white text-[11px] font-black px-3 py-1 rounded-lg border border-[#1A1A1A] shadow-xl pointer-events-none z-40">
                {fest.title}
              </div>
            </button>
          );
        })}

        {/* Active Pin Popup Preview Box */}
        {activePin && (
          <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-80 bg-white border-2 border-[#1A1A1A] rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] z-40 animate-in fade-in duration-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-[#1A1A1A] text-white">
                  {activePin.district}
                </span>
                <span className="text-xs font-black text-[#FF5C35]">
                  {activePin.isFree ? '무료' : '유료'}
                </span>
              </div>
              <button
                onClick={() => setActivePin(null)}
                className="text-[#1A1A1A] hover:text-[#FF5C35] font-black text-xs p-1"
              >
                ✕
              </button>
            </div>

            <h4 className="text-sm font-black text-[#1A1A1A] mt-2 line-clamp-1">
              {activePin.title}
            </h4>

            <p className="text-xs font-bold text-[#1A1A1A]/70 line-clamp-1 mt-0.5">
              {activePin.place}
            </p>

            <div className="flex items-center gap-1 text-[11px] font-bold text-[#1A1A1A] mt-2">
              <Calendar className="w-3.5 h-3.5 text-[#FF5C35] shrink-0" />
              <span className="line-clamp-1">{activePin.dateText}</span>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-3 border-t-2 border-[#1A1A1A]">
              <button
                onClick={() => onToggleBookmark(activePin.id)}
                className="p-2 rounded-xl bg-[#FAF7F2] text-[#1A1A1A] border-2 border-[#1A1A1A] hover:bg-[#FF5C35] hover:text-white transition"
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.has(activePin.id) ? 'fill-[#FF5C35] text-[#FF5C35]' : ''}`} />
              </button>

              <button
                onClick={() => onSelectFestival(activePin)}
                className="flex-1 py-2 px-3 bg-[#FF5C35] text-white hover:bg-[#1A1A1A] font-black text-xs rounded-xl border-2 border-[#1A1A1A] flex items-center justify-center gap-1 transition shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]"
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
