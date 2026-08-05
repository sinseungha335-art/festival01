import React from 'react';
import { BUSAN_DISTRICTS } from '../utils/festivalUtils';
import { FilterState, Festival } from '../types';
import { MapPin, Calendar, Filter, RotateCcw, CheckCircle2 } from 'lucide-react';

interface FilterSectionProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  festivals: Festival[];
  onReset: () => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  setFilters,
  festivals,
  onReset
}) => {
  // Compute count of festivals for each district
  const districtCounts = React.useMemo(() => {
    const counts: Record<string, number> = { '전체': festivals.length };
    BUSAN_DISTRICTS.forEach(d => {
      if (d !== '전체') counts[d] = 0;
    });
    festivals.forEach(f => {
      if (f.district) {
        counts[f.district] = (counts[f.district] || 0) + 1;
      }
    });
    return counts;
  }, [festivals]);

  const months = ['전체', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const years = ['전체', '2025', '2026'];

  const handleDistrictClick = (district: string) => {
    setFilters(prev => ({
      ...prev,
      district: prev.district === district ? '전체' : district
    }));
  };

  const handleMonthClick = (mStr: string) => {
    const mVal = mStr === '전체' ? 'all' : mStr.replace('월', '');
    setFilters(prev => ({ ...prev, month: mVal }));
  };

  const handleYearClick = (yStr: string) => {
    const yVal = yStr === '전체' ? 'all' : yStr;
    setFilters(prev => ({ ...prev, year: yVal }));
  };

  const isFiltered = filters.district !== '전체' || 
                     filters.year !== 'all' || 
                     filters.month !== 'all' || 
                     filters.status !== 'all' || 
                     filters.fee !== 'all' || 
                     filters.searchQuery !== '' || 
                     filters.onlyBookmarks;

  return (
    <div className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-6">
      
      {/* 1. 지역별 조회 (District Filter Bar) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#FF5C35]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1A1A1A]">
              BUSAN DISTRICT FILTER (부산 구/군)
            </h3>
          </div>

          {isFiltered && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-[#FF5C35] hover:text-[#1A1A1A] transition px-3 py-1.5 rounded-lg bg-[#FAF7F2] border-2 border-[#1A1A1A]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              RESET
            </button>
          )}
        </div>

        {/* District Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {BUSAN_DISTRICTS.map(d => {
            const count = districtCounts[d] || 0;
            const isSelected = filters.district === d;
            return (
              <button
                key={d}
                onClick={() => handleDistrictClick(d)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 border-2 border-[#1A1A1A] ${
                  isSelected
                    ? 'bg-[#1A1A1A] text-white shadow-[2px_2px_0px_0px_rgba(255,92,53,1)]'
                    : 'bg-[#FAF7F2] text-[#1A1A1A] hover:bg-[#FF5C35] hover:text-white'
                }`}
              >
                <span>{d}</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] rounded-md font-black ${
                    isSelected ? 'bg-[#FF5C35] text-white' : 'bg-white text-[#1A1A1A] border border-[#1A1A1A]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-0.5 bg-[#1A1A1A]" />

      {/* 2. 날짜별 조회 (Date / Year / Month & Status) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Year & Month Selection */}
        <div className="md:col-span-8 space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#FF5C35]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1A1A1A]">
              DATE & MONTH FILTER (날짜/월별)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Year Selector */}
            <div className="flex items-center gap-1 p-1 bg-[#FAF7F2] rounded-xl border-2 border-[#1A1A1A]">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#1A1A1A]/70 px-2">연도:</span>
              {years.map(y => {
                const isSel = (y === '전체' && filters.year === 'all') || filters.year === y;
                return (
                  <button
                    key={y}
                    onClick={() => handleYearClick(y)}
                    className={`px-2.5 py-1 text-xs font-black rounded-lg transition ${
                      isSel
                        ? 'bg-[#1A1A1A] text-white'
                        : 'text-[#1A1A1A] hover:bg-white'
                    }`}
                  >
                    {y === '전체' ? '전체' : `${y}년`}
                  </button>
                );
              })}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#FAF7F2] rounded-xl border-2 border-[#1A1A1A]">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#1A1A1A]/70 px-2">상태:</span>
              {[
                { key: 'all', label: '전체' },
                { key: 'ongoing', label: '🔥 진행중' },
                { key: 'upcoming', label: '📅 예정' },
                { key: 'always', label: '♾️ 상시' }
              ].map(st => {
                const isSel = filters.status === st.key;
                return (
                  <button
                    key={st.key}
                    onClick={() => setFilters(p => ({ ...p, status: st.key }))}
                    className={`px-2.5 py-1 text-xs font-black rounded-lg transition ${
                      isSel
                        ? 'bg-[#FF5C35] text-white'
                        : 'text-[#1A1A1A] hover:bg-white'
                    }`}
                  >
                    {st.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Month Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
            {months.map(m => {
              const mVal = m === '전체' ? 'all' : m.replace('월', '');
              const isSel = filters.month === mVal;
              return (
                <button
                  key={m}
                  onClick={() => handleMonthClick(m)}
                  className={`px-3 py-1 text-xs rounded-xl font-black whitespace-nowrap transition border-2 border-[#1A1A1A] ${
                    isSel
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-[#FAF7F2] text-[#1A1A1A] hover:bg-[#FF5C35] hover:text-white'
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fee & Quick Filters */}
        <div className="md:col-span-4 space-y-3 border-t-2 md:border-t-0 md:border-l-2 border-[#1A1A1A] pt-4 md:pt-0 md:pl-5">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#FF5C35]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1A1A1A]">
              ADMISSION FEE (입장료)
            </h3>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#FAF7F2] rounded-xl border-2 border-[#1A1A1A]">
            {[
              { key: 'all', label: '전체' },
              { key: 'free', label: '🎁 무료' },
              { key: 'paid', label: '🎫 유료' }
            ].map(fee => {
              const isSel = filters.fee === fee.key;
              return (
                <button
                  key={fee.key}
                  onClick={() => setFilters(p => ({ ...p, fee: fee.key }))}
                  className={`flex-1 py-1.5 text-xs font-black rounded-lg transition ${
                    isSel
                      ? 'bg-[#1A1A1A] text-white'
                      : 'text-[#1A1A1A] hover:bg-white'
                  }`}
                >
                  {fee.label}
                </button>
              );
            })}
          </div>

          {/* Quick Active Tags indicator */}
          <div className="text-xs font-bold text-[#1A1A1A]/80 flex items-center gap-1 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5C35]" />
            <span>
              필터: {filters.district !== '전체' ? `[${filters.district}] ` : ''}
              {filters.month !== 'all' ? `[${filters.month}월] ` : ''}
              {filters.year !== 'all' ? `[${filters.year}년] ` : ''}
              {filters.status !== 'all' ? `[${filters.status}] ` : ''}
              {filters.fee !== 'all' ? `[${filters.fee === 'free' ? '무료' : '유료'}] ` : ''}
              {!isFiltered && '전체 축제'}
            </span>
          </div>
        </div>

      </div>

    </div>
  );

};
