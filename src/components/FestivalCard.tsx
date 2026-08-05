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
        return <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase bg-[#FF5C35] text-white border border-[#1A1A1A]">🔥 진행 중</span>;
      case 'upcoming':
        return <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase bg-[#1A1A1A] text-white">📅 개최 예정</span>;
      case 'always':
        return <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase bg-[#FAF7F2] text-[#1A1A1A] border border-[#1A1A1A]">♾️ 연중/상시</span>;
      case 'past':
      default:
        return <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase bg-gray-200 text-[#1A1A1A]">종료/기타</span>;
    }
  };

  return (
    <div
      onClick={() => onSelect(festival)}
      className="group relative bg-white border-2 border-[#1A1A1A] rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:shadow-[6px_6px_0px_0px_rgba(255,92,53,1)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Image Banner Container */}
      <div className="relative h-48 w-full bg-[#FAF7F2] border-b-2 border-[#1A1A1A] overflow-hidden">
        <img
          src={imgSrc}
          alt={festival.title}
          onError={() => setImgSrc('https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80')}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#1A1A1A] text-white border border-[#1A1A1A]">
              {festival.district}
            </span>
            {festival.isFree ? (
              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#FF5C35] text-white border border-[#1A1A1A]">
                FREE (무료)
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#FAF7F2] text-[#1A1A1A] border border-[#1A1A1A]">
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
            className="pointer-events-auto p-2 rounded-xl bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] hover:bg-[#FF5C35] hover:text-white transition transform active:scale-90 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]"
            title={isBookmarked ? '관심 축제 해제' : '관심 축제 등록'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#FF5C35] text-[#FF5C35]' : ''}`} />
          </button>
        </div>

        {/* Bottom image overlay info */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          {getStatusBadge()}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Title */}
          <h3 className="text-base font-black text-[#1A1A1A] group-hover:text-[#FF5C35] transition line-clamp-1 uppercase tracking-tight">
            {festival.title}
          </h3>

          {/* Subtitle / Tagline */}
          {festival.tagline && (
            <p className="text-xs text-[#1A1A1A]/70 line-clamp-1 italic font-medium">
              "{festival.tagline}"
            </p>
          )}

          {/* Date info */}
          <div className="flex items-start gap-2 text-xs font-bold text-[#1A1A1A] pt-1">
            <Calendar className="w-4 h-4 text-[#FF5C35] shrink-0 mt-0.5" />
            <span className="line-clamp-2">
              {festival.dateText || festival.usageDay || '일정 정보 확인 중'}
            </span>
          </div>

          {/* Location info */}
          <div className="flex items-start gap-2 text-xs font-bold text-[#1A1A1A]/70">
            <MapPin className="w-4 h-4 text-[#1A1A1A] shrink-0 mt-0.5" />
            <span className="line-clamp-1">{festival.address}</span>
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-3 border-t-2 border-[#1A1A1A] flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#1A1A1A]">
          <div className="flex items-center gap-2">
            {festival.tel && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-[#1A1A1A]/70">
                <Phone className="w-3 h-3 text-[#FF5C35]" />
                {festival.tel.split('~')[0]}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[#FF5C35] group-hover:translate-x-1 transition">
            <span>MORE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

