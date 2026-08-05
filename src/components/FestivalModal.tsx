import React from 'react';
import { Festival } from '../types';
import { X, Calendar, MapPin, Phone, Globe, Bookmark, Share2, Copy, Check, Bus, Accessibility, DollarSign, ExternalLink } from 'lucide-react';

interface FestivalModalProps {
  festival: Festival | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
}

export const FestivalModal: React.FC<FestivalModalProps> = ({
  festival,
  onClose,
  isBookmarked,
  onToggleBookmark
}) => {
  const [copied, setCopied] = React.useState(false);
  const [imgSrc, setImgSrc] = React.useState('');

  React.useEffect(() => {
    if (festival) {
      setImgSrc(festival.imgNormal || festival.imgThumb);
      setCopied(false);
    }
  }, [festival]);

  if (!festival) return null;

  const handleCopyAddress = () => {
    if (festival.address) {
      navigator.clipboard.writeText(festival.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: festival.title,
        text: `[부산 축제] ${festival.title} - ${festival.dateText}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      handleCopyAddress();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/80 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white border-2 border-[#1A1A1A] rounded-2xl shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Image & Action Bar */}
        <div className="relative h-64 sm:h-72 w-full bg-[#FAF7F2] border-b-2 border-[#1A1A1A] shrink-0">
          <img
            src={imgSrc}
            alt={festival.title}
            onError={() => setImgSrc('https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80')}
            className="w-full h-full object-cover"
          />

          {/* Close & Share & Bookmark Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-white text-[#1A1A1A] hover:bg-[#FF5C35] hover:text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition"
              title="공유하기"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleBookmark(festival.id)}
              className="p-2.5 rounded-xl bg-white text-[#1A1A1A] hover:bg-[#FF5C35] hover:text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition"
              title="관심 축제 저장"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#FF5C35] text-[#FF5C35]' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-[#1A1A1A] text-white hover:bg-[#FF5C35] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Title Overlay */}
          <div className="absolute bottom-4 left-6 right-6 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-[#1A1A1A] text-white border border-[#1A1A1A]">
                {festival.district}
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-[#FF5C35] text-white border border-[#1A1A1A]">
                {festival.usageAmount || '입장료 연동 중'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight bg-[#1A1A1A]/85 p-2 rounded-xl backdrop-blur-md border border-[#1A1A1A] inline-block">
              {festival.title}
            </h2>
          </div>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#1A1A1A] divide-y-2 divide-[#1A1A1A]">
          
          {/* Tagline / Subtitle */}
          {festival.tagline && festival.tagline !== festival.title && (
            <div className="pb-2">
              <p className="text-sm font-black text-[#FF5C35] italic">
                "{festival.tagline}"
              </p>
            </div>
          )}

          {/* Schedule & Date info */}
          <div className="pt-5 space-y-3">
            <h4 className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#FF5C35]" />
              FESTIVAL SCHEDULE (개최 일정)
            </h4>
            <div className="bg-[#FAF7F2] border-2 border-[#1A1A1A] rounded-xl p-4 space-y-1 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
              <p className="text-base font-black text-[#1A1A1A]">
                {festival.dateText || '일정 정보 확인 중'}
              </p>
              {festival.usageDay && (
                <p className="text-xs font-bold text-[#1A1A1A]/70">
                  운영 상세: {festival.usageDay}
                </p>
              )}
            </div>
          </div>

          {/* Location & Address */}
          <div className="pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF5C35]" />
                LOCATION & ADDRESS (위치 및 주소)
              </h4>
              <button
                onClick={handleCopyAddress}
                className="flex items-center gap-1.5 text-xs font-black text-[#FF5C35] hover:text-[#1A1A1A] transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '복사완료!' : '주소 복사'}</span>
              </button>
            </div>

            <div className="bg-[#FAF7F2] border-2 border-[#1A1A1A] rounded-xl p-4 space-y-1 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
              <p className="text-sm font-black text-[#1A1A1A]">
                {festival.place}
              </p>
              <p className="text-xs font-bold text-[#1A1A1A]/70">
                {festival.address}
              </p>
            </div>
          </div>

          {/* Traffic / Transit info */}
          {festival.trafficInfo && (
            <div className="pt-5 space-y-3">
              <h4 className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
                <Bus className="w-4 h-4 text-[#FF5C35]" />
                PUBLIC TRANSIT (대중교통 안내)
              </h4>
              <div className="bg-[#FAF7F2] border-2 border-[#1A1A1A] rounded-xl p-4 text-xs font-bold leading-relaxed text-[#1A1A1A] whitespace-pre-line shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
                {festival.trafficInfo}
              </div>
            </div>
          )}

          {/* Detailed Content Description */}
          {festival.contents && (
            <div className="pt-5 space-y-3">
              <h4 className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider">
                FESTIVAL OVERVIEW (축제 상세 소개)
              </h4>
              <p className="text-xs font-medium leading-relaxed text-[#1A1A1A] bg-[#FAF7F2] border-2 border-[#1A1A1A] rounded-xl p-4 whitespace-pre-line shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
                {festival.contents}
              </p>
            </div>
          )}

          {/* Accessibility Info */}
          {festival.accessibility && (
            <div className="pt-5 space-y-3">
              <h4 className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
                <Accessibility className="w-4 h-4 text-[#FF5C35]" />
                ACCESSIBILITY (장애인 편의시설)
              </h4>
              <div className="bg-[#FFF4E5] border-2 border-[#1A1A1A] rounded-xl p-4 text-xs font-bold text-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
                {festival.accessibility}
              </div>
            </div>
          )}

          {/* Contact & Homepage Buttons */}
          <div className="pt-5 flex flex-wrap items-center gap-3">
            {festival.tel && (
              <a
                href={`tel:${festival.tel}`}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 bg-white text-[#1A1A1A] rounded-xl text-xs font-black border-2 border-[#1A1A1A] hover:bg-[#FAF7F2] transition shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]"
              >
                <Phone className="w-4 h-4 text-[#FF5C35]" />
                <span>문의: {festival.tel}</span>
              </a>
            )}

            {festival.homepage && (
              <a
                href={festival.homepage.startsWith('http') ? festival.homepage : `http://${festival.homepage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 bg-[#FF5C35] text-white rounded-xl text-xs font-black border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] transition shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] uppercase tracking-wider"
              >
                <Globe className="w-4 h-4" />
                <span>공식 홈페이지</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

