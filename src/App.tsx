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
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] font-sans selection:bg-[#FF5C35] selection:text-white">
      
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Error Notification */}
        {error && (
          <div className="bg-[#FFF4E5] border-2 border-[#1A1A1A] rounded-xl p-4 flex items-center justify-between text-[#1A1A1A] text-xs font-bold shadow-[3px_3px_0px_0px_rgba(26,26,26,1)]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FF5C35] shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchFestivals}
              className="px-3 py-1.5 bg-[#1A1A1A] text-white hover:bg-[#FF5C35] font-extrabold text-xs rounded-lg transition uppercase tracking-wider"
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
          <div className="min-h-[300px] flex flex-col items-center justify-center space-y-3 py-16">
            <RefreshCw className="w-8 h-8 text-[#FF5C35] animate-spin" />
            <p className="text-sm font-extrabold uppercase tracking-widest text-[#1A1A1A]">
              부산 축제 공공데이터를 불러오는 중입니다...
            </p>
          </div>
        ) : (
          /* Main Views (Grid, Map, Calendar) */
          <div>
            {viewMode === 'grid' && (
              <div className="space-y-6">
                {/* Result Summary Bar */}
                <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-[#1A1A1A]/70 px-1 border-b-2 border-[#1A1A1A] pb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#FF5C35]" />
                    <span>
                      TOTAL FESTIVALS: <strong className="text-[#1A1A1A] font-black text-sm">{filteredFestivals.length}</strong> ITEMS FOUND
                    </span>
                  </div>
                </div>

                {filteredFestivals.length === 0 ? (
                  <div className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-12 text-center space-y-4 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                    <Compass className="w-12 h-12 text-[#1A1A1A]/40 mx-auto" />
                    <h3 className="text-lg font-black text-[#1A1A1A] uppercase tracking-wide">
                      NO MATCHING FESTIVALS FOUND
                    </h3>
                    <p className="text-xs text-[#1A1A1A]/70 max-w-md mx-auto font-medium">
                      검색어 또는 필터 조건을 변경하여 다시 확인해보세요.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="px-5 py-2.5 bg-[#FF5C35] text-white hover:bg-[#1A1A1A] font-black text-xs rounded-xl border-2 border-[#1A1A1A] transition shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]"
                    >
                      RESET FILTERS
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      <footer className="border-t-2 border-[#1A1A1A] bg-[#FAF7F2] py-10 text-center text-xs font-bold text-[#1A1A1A]/70 space-y-2 uppercase tracking-widest">
        <p>BUSAN PUBLIC DATA PORTAL (DATA.GO.KR) FESTIVAL API INTEGRATED</p>
        <p>© 2026 BUSAN FESTIVAL EXPLORER. VERCEL READY.</p>
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
