import React from 'react';
import { Festival } from '../types';
import { Calendar, MapPin, Phone, Globe, Bookmark, ExternalLink, Ticket, Sparkles } from 'lucide-react';

interface FestivalCardProps {
  festival: Festival;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
  onSelect: (festival: Festival) => void;
}

export const FestivalCard: React.FC<FestivalCardProps> = ({
  festival,
  isBookmarked,
  onToggleBookmark,
  onSelect
}) => {
  const [imgSrc, setImgSrc] = React.useState(festival.imgNormal || festival.imgThumb);

  const getStatusBadge = () => {
    switch (festival.status) {
      case 'ongoing':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 border border-emerald-400 shadow-sm animate-pulse">🔥 진행 중</span>;
      case 'upcoming':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/80 text-white border border-blue-400/50">📅 개최 예정</span>;
      case 'always':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/80 text-white border border-purple-400/50">♾️ 연중/상시</span>;
      case 'past':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">종료/기타</span>;
    }
  };

  return (
    <div
      onClick={() => onSelect(festival)}
      className="group relative bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Banner Container */}
      <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
        <img
          src={imgSrc}
          alt={festival.title}
          onError={() => setImgSrc('https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80')}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-900/85 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
              {festival.district}
            </span>
            {festival.isFree ? (
              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-500/90 backdrop-blur-md text-slate-950">
                무료
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-900/85 backdrop-blur-md text-amber-300 border border-amber-500/30">
                유료
              </span>
            )}
          </div>

          {/* Bookmark button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(festival.id);
            }}
            className="pointer-events-auto p-2 rounded-xl bg-slate-900/80 backdrop-blur-md text-slate-300 hover:text-amber-400 border border-slate-700 hover:border-amber-400 transition transform active:scale-90"
            title={isBookmarked ? '관심 축제 해제' : '관심 축제 등록'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Bottom image overlay info */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          {getStatusBadge()}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Title */}
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">
            {festival.title}
          </h3>

          {/* Subtitle / Tagline */}
          <p className="text-xs text-slate-400 line-clamp-1 italic">
            "{festival.tagline}"
          </p>

          {/* Date info */}
          <div className="flex items-start gap-2 text-xs text-slate-300 pt-1">
            <Calendar className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">
              {festival.dateText || festival.usageDay || '일정 정보 확인 중'}
            </span>
          </div>

          {/* Location info */}
          <div className="flex items-start gap-2 text-xs text-slate-400">
            <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{festival.address}</span>
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            {festival.tel && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Phone className="w-3 h-3 text-slate-500" />
                {festival.tel.split('~')[0]}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-cyan-400 font-medium group-hover:translate-x-0.5 transition">
            <span>상세보기</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
