import React, { useEffect, useState, useMemo } from 'react';
import { Festival, FilterState, ViewMode, RawFestivalItem } from './types';
import { parseFestivalItem } from './utils/festivalUtils';
import { Navbar } from './components/Navbar';
import { FilterSection } from './components/FilterSection';
import { FestivalCard } from './components/FestivalCard';
import { FestivalModal } from './components/FestivalModal';
import { MapView } from './components/MapView';
import { CalendarView } from './components/CalendarView';
import { StatsOverview } from './components/StatsOverview';
import { Compass, AlertTriangle, RefreshCw, Layers } from 'lucide-react';

export default function App() {
  const [rawFestivals, setRawFestivals] = useState<RawFestivalItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);

  // Local storage bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('busan_festival_bookmarks');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    district: '전체',
    year: 'all',
    month: 'all',
    status: 'all',
    fee: 'all',
    searchQuery: '',
    onlyBookmarks: false
  });

  // Fetch Festivals Data from Express API
  const fetchFestivals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/festivals');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      if (data && Array.isArray(data.items)) {
        setRawFestivals(data.items);
      } else {
        throw new Error('API response format error');
      }
    } catch (err: any) {
      console.error('Error loading festival data:', err);
      setError('축제 데이터를 불러오는 중 문제가 발생했습니다. 최신 기본 데이터를 표시합니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFestivals();
  }, []);

  // Sync bookmarks to localStorage
  const toggleBookmark = (id: number) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem('busan_festival_bookmarks', JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Parse raw items to clean Festival objects
  const festivals: Festival[] = useMemo(() => {
    return rawFestivals.map(parseFestivalItem);
  }, [rawFestivals]);

  // Filtered Festivals
  const filteredFestivals = useMemo(() => {
    return festivals.filter(f => {
      // District Filter
      if (filters.district !== '전체' && f.district !== filters.district) {
        return false;
      }

      // Year Filter
      if (filters.year !== 'all') {
        const targetYear = parseInt(filters.year, 10);
        if (f.years.length > 0 && !f.years.includes(targetYear)) {
          return false;
        }
      }

      // Month Filter
      if (filters.month !== 'all') {
        const targetMonth = parseInt(filters.month, 10);
        if (f.months.length > 0 && !f.months.includes(targetMonth)) {
          return false;
        }
      }

      // Status Filter
      if (filters.status !== 'all' && f.status !== filters.status) {
        return false;
      }

      // Fee Filter
      if (filters.fee === 'free' && !f.isFree) return false;
      if (filters.fee === 'paid' && f.isFree) return false;

      // Bookmarks Filter
      if (filters.onlyBookmarks && !bookmarkedIds.has(f.id)) {
        return false;
      }

      // Keyword Search Filter
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const inTitle = f.title.toLowerCase().includes(q);
        const inDistrict = f.district.toLowerCase().includes(q);
        const inPlace = f.place.toLowerCase().includes(q);
        const inAddress = f.address.toLowerCase().includes(q);
        const inTagline = f.tagline.toLowerCase().includes(q);
        const inContents = f.contents.toLowerCase().includes(q);
        if (!inTitle && !inDistrict && !inPlace && !inAddress && !inTagline && !inContents) {
          return false;
        }
      }

      return true;
    });
  }, [festivals, filters, bookmarkedIds]);

  const resetFilters = () => {
    setFilters({
      district: '전체',
      year: 'all',
      month: 'all',
      status: 'all',
      fee: 'all',
      searchQuery: '',
      onlyBookmarks: false
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Sticky Navbar */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        bookmarkCount={bookmarkedIds.size}
        showBookmarksOnly={filters.onlyBookmarks}
        setShowBookmarksOnly={(val) => setFilters(p => ({ ...p, onlyBookmarks: val }))}
        searchQuery={filters.searchQuery}
        setSearchQuery={(val) => setFilters(p => ({ ...p, searchQuery: val }))}
        onRefresh={fetchFestivals}
        isLoading={isLoading}
        totalCount={festivals.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Error Notification */}
        {error && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between text-amber-200 text-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchFestivals}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-lg transition"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* Stats Overview */}
        <StatsOverview festivals={festivals} />

        {/* Filter Section (District & Date/Month) */}
        <FilterSection
          filters={filters}
          setFilters={setFilters}
          festivals={festivals}
          onReset={resetFilters}
        />

        {/* Loading Spinner State */}
        {isLoading && festivals.length === 0 ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center space-y-3 py-12">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
            <p className="text-sm font-medium text-slate-400">
              부산 축제 정보를 불러오는 중입니다...
            </p>
          </div>
        ) : (
          /* Main Views (Grid, Map, Calendar) */
          <div>
            {viewMode === 'grid' && (
              <div className="space-y-4">
                {/* Result Summary Bar */}
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>
                      조회 결과: <strong className="text-white">{filteredFestivals.length}</strong>개 축제
                    </span>
                  </div>
                </div>

                {filteredFestivals.length === 0 ? (
                  <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                    <Compass className="w-10 h-10 text-slate-600 mx-auto" />
                    <h3 className="text-base font-bold text-slate-300">
                      조건에 맞는 축제를 찾을 수 없습니다
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      다른 구/군이나 월을 선택하시거나 검색어를 확인해보세요.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs rounded-xl border border-slate-700 transition"
                    >
                      필터 전체 초기화
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredFestivals.map(f => (
                      <FestivalCard
                        key={f.id}
                        festival={f}
                        isBookmarked={bookmarkedIds.has(f.id)}
                        onToggleBookmark={toggleBookmark}
                        onSelect={setSelectedFestival}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {viewMode === 'map' && (
              <MapView
                festivals={filteredFestivals}
                selectedDistrict={filters.district}
                onSelectDistrict={(d) => setFilters(p => ({ ...p, district: d }))}
                onSelectFestival={setSelectedFestival}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={toggleBookmark}
              />
            )}

            {viewMode === 'calendar' && (
              <CalendarView
                festivals={filteredFestivals}
                onSelectFestival={setSelectedFestival}
              />
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500 space-y-2">
        <p>부산광역시 공공데이터 포털 (apis.data.go.kr) FestivalService 연동</p>
        <p>© 2026 Busan Festival Explorer. All rights reserved.</p>
      </footer>

      {/* Detail Modal */}
      <FestivalModal
        festival={selectedFestival}
        onClose={() => setSelectedFestival(null)}
        isBookmarked={selectedFestival ? bookmarkedIds.has(selectedFestival.id) : false}
        onToggleBookmark={toggleBookmark}
      />

    </div>
  );
}
