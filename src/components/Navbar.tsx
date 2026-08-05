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
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    부산 축제 모아
                  </h1>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    BUSAN FESTIVAL
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  부산광역시 공식 데이터 연동 · 지역별 & 날짜별 축제 탐색기 ({totalCount}개)
                </p>
              </div>
            </div>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="데이터 새로고침"
              className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>

          {/* Search bar & Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] sm:min-w-[260px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="축제명, 장소, 키워드 검색..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-800/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Mode Toggle Buttons */}
            <div className="flex items-center p-1 bg-slate-800/80 border border-slate-700/80 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">목록</span>
              </button>

              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  viewMode === 'calendar'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">달력</span>
              </button>

              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  viewMode === 'map'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">지도</span>
              </button>
            </div>

            {/* Bookmarks Toggle */}
            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition ${
                showBookmarksOnly
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-inner'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${showBookmarksOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>관심 축제</span>
              {bookmarkCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                  {bookmarkCount}
                </span>
              )}
            </button>

            {/* Refresh button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="최신 정보 새로고침"
              className="hidden md:flex p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
