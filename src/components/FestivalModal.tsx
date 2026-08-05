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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Image & Action Bar */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-800 shrink-0">
          <img
            src={imgSrc}
            alt={festival.title}
            onError={() => setImgSrc('https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Close & Share & Bookmark Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md transition"
              title="공유하기"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleBookmark(festival.id)}
              className="p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-amber-400 border border-slate-700/80 backdrop-blur-md transition"
              title="관심 축제 저장"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md transition"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Title Overlay */}
          <div className="absolute bottom-4 left-6 right-6 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500 text-slate-950 shadow-md">
                {festival.district}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800/90 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                {festival.usageAmount || '입장료 연동 중'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {festival.title}
            </h2>
          </div>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 divide-y divide-slate-800/80">
          
          {/* Tagline / Subtitle */}
          {festival.tagline && festival.tagline !== festival.title && (
            <div className="pb-2">
              <p className="text-sm font-medium text-cyan-400 italic">
                "{festival.tagline}"
              </p>
            </div>
          )}

          {/* Schedule & Date info */}
          <div className="pt-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              축제 개최 일정
            </h4>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-1">
              <p className="text-base font-bold text-white">
                {festival.dateText || '일정 정보 확인 중'}
              </p>
              {festival.usageDay && (
                <p className="text-xs text-slate-400">
                  운영 상세: {festival.usageDay}
                </p>
              )}
            </div>
          </div>

          {/* Location & Address */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400" />
                행사장 위치 및 주소
              </h4>
              <button
                onClick={handleCopyAddress}
                className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '복사됨!' : '주소 복사'}</span>
              </button>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-1">
              <p className="text-sm font-semibold text-slate-200">
                {festival.place}
              </p>
              <p className="text-xs text-slate-400">
                {festival.address}
              </p>
            </div>
          </div>

          {/* Traffic / Transit info */}
          {festival.trafficInfo && (
            <div className="pt-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Bus className="w-4 h-4 text-amber-400" />
                대중교통 및 교통안내
              </h4>
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-xs leading-relaxed text-slate-300 whitespace-pre-line">
                {festival.trafficInfo}
              </div>
            </div>
          )}

          {/* Detailed Content Description */}
          {festival.contents && (
            <div className="pt-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                축제 소개
              </h4>
              <p className="text-xs leading-relaxed text-slate-300 whitespace-pre-line bg-slate-800/40 border border-slate-800 rounded-2xl p-4">
                {festival.contents}
              </p>
            </div>
          )}

          {/* Accessibility Info */}
          {festival.accessibility && (
            <div className="pt-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Accessibility className="w-4 h-4 text-emerald-400" />
                장애인 편의시설 정보
              </h4>
              <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-4 text-xs text-emerald-200">
                {festival.accessibility}
              </div>
            </div>
          )}

          {/* Contact & Homepage Buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            {festival.tel && (
              <a
                href={`tel:${festival.tel}`}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition"
              >
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>문의: {festival.tel}</span>
              </a>
            )}

            {festival.homepage && (
              <a
                href={festival.homepage.startsWith('http') ? festival.homepage : `http://${festival.homepage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-xl text-xs font-extrabold transition shadow-lg shadow-cyan-500/20"
              >
                <Globe className="w-4 h-4" />
                <span>공식 홈페이지 방문</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
