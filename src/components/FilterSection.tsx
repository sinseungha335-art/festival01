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
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-5">
      
      {/* 1. 지역별 조회 (District Filter Bar) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-200">
              부산 지역별 조회 (구/군)
            </h3>
            <span className="text-xs text-slate-400 font-normal">
              클릭하여 해당 구/군의 축제만 골라보세요
            </span>
          </div>

          {isFiltered && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20"
            >
              <RotateCcw className="w-3 h-3" />
              필터 초기화
            </button>
          )}
        </div>

        {/* District Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-700">
          {BUSAN_DISTRICTS.map(d => {
            const count = districtCounts[d] || 0;
            const isSelected = filters.district === d;
            return (
              <button
                key={d}
                onClick={() => handleDistrictClick(d)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/70 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{d}</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                    isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-700 text-slate-400'
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
      <div className="h-px bg-slate-800/80" />

      {/* 2. 날짜별 조회 (Date / Year / Month & Status) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Year & Month Selection */}
        <div className="md:col-span-8 space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-200">
              날짜별 / 월별 조회
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Year Selector */}
            <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-700/80">
              <span className="text-xs text-slate-400 px-2 font-medium">연도:</span>
              {years.map(y => {
                const isSel = (y === '전체' && filters.year === 'all') || filters.year === y;
                return (
                  <button
                    key={y}
                    onClick={() => handleYearClick(y)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition ${
                      isSel
                        ? 'bg-blue-500 text-white font-bold shadow'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {y === '전체' ? '전체' : `${y}년`}
                  </button>
                );
              })}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-700/80">
              <span className="text-xs text-slate-400 px-2 font-medium">상태:</span>
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
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition ${
                      isSel
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
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
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition border ${
                    isSel
                      ? 'bg-blue-600 text-white font-bold border-blue-400 shadow-sm'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fee & Quick Filters */}
        <div className="md:col-span-4 space-y-2 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-slate-200">
              입장료 / 가격 검색
            </h3>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700/80">
            {[
              { key: 'all', label: '전체' },
              { key: 'free', label: '🎁 무료 축제' },
              { key: 'paid', label: '🎫 유료 축제' }
            ].map(fee => {
              const isSel = filters.fee === fee.key;
              return (
                <button
                  key={fee.key}
                  onClick={() => setFilters(p => ({ ...p, fee: fee.key }))}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition ${
                    isSel
                      ? 'bg-purple-600 text-white font-bold shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {fee.label}
                </button>
              );
            })}
          </div>

          {/* Quick Active Tags indicator */}
          <div className="text-xs text-slate-400 flex items-center gap-1 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              선택한조건: {filters.district !== '전체' ? `[${filters.district}] ` : ''}
              {filters.month !== 'all' ? `[${filters.month}월] ` : ''}
              {filters.year !== 'all' ? `[${filters.year}년] ` : ''}
              {filters.status !== 'all' ? `[${filters.status}] ` : ''}
              {filters.fee !== 'all' ? `[${filters.fee === 'free' ? '무료' : '유료'}] ` : ''}
              {!isFiltered && '전체 축제 조회 중'}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
