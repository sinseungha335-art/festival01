import React from 'react';
import { Sparkles, Calendar, MapPin, Grid, Bookmark, Search, RefreshCw, Compass } from 'lucide-react';
import { ViewMode } from '../types';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  bookmarkCount: number;
  showBookmarksOnly: boolean;
  setShowBookmarksOnly: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  totalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  bookmarkCount,
  showBookmarksOnly,
  setShowBookmarksOnly,
  searchQuery,
  setSearchQuery,
  onRefresh,
  isLoading,
  totalCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2] border-b-2 border-[#1A1A1A] text-[#1A1A1A] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] text-[#FF5C35] flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(255,92,53,1)]">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black tracking-tight text-[#1A1A1A]">
                    부산 축제 모아
                  </h1>
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-md bg-[#FF5C35] text-white border border-[#1A1A1A]">
                    BUSAN FESTIVAL
                  </span>
                </div>
                <p className="text-xs font-bold text-[#1A1A1A]/70 uppercase tracking-wider">
                  공공데이터 포털 API 연동 · {totalCount}개 축제 탐색
                </p>
              </div>
            </div>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="데이터 새로고침"
              className="md:hidden p-2 rounded-xl bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] hover:bg-[#FF5C35] hover:text-white transition shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#FF5C35]' : ''}`} />
            </button>
          </div>

          {/* Search bar & Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] sm:min-w-[260px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="축제명, 장소, 키워드 검색..."
                className="w-full pl-9 pr-8 py-2 text-xs font-bold bg-white border-2 border-[#1A1A1A] rounded-xl text-[#1A1A1A] placeholder-[#1A1A1A]/50 focus:outline-none focus:ring-2 focus:ring-[#FF5C35] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-[#1A1A1A] hover:text-[#FF5C35]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Mode Toggle Buttons */}
            <div className="flex items-center p-1 bg-white border-2 border-[#1A1A1A] rounded-xl shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-[#1A1A1A] text-white shadow-sm'
                    : 'text-[#1A1A1A] hover:bg-[#FAF7F2]'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">목록</span>
              </button>

              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition ${
                  viewMode === 'calendar'
                    ? 'bg-[#1A1A1A] text-white shadow-sm'
                    : 'text-[#1A1A1A] hover:bg-[#FAF7F2]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">달력</span>
              </button>

              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition ${
                  viewMode === 'map'
                    ? 'bg-[#1A1A1A] text-white shadow-sm'
                    : 'text-[#1A1A1A] hover:bg-[#FAF7F2]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">지도</span>
              </button>
            </div>

            {/* Bookmarks Toggle */}
            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] transition shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] ${
                showBookmarksOnly
                  ? 'bg-[#FF5C35] text-white'
                  : 'bg-white text-[#1A1A1A] hover:bg-[#FAF7F2]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${showBookmarksOnly ? 'fill-white text-white' : 'text-[#1A1A1A]'}`} />
              <span>관심 축제</span>
              {bookmarkCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-md text-[10px] font-black bg-[#1A1A1A] text-white border border-white">
                  {bookmarkCount}
                </span>
              )}
            </button>

            {/* Refresh button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="최신 정보 새로고침"
              className="hidden md:flex p-2 rounded-xl bg-white border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#FF5C35]' : ''}`} />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};

