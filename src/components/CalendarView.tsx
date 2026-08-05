import React from 'react';
import { Festival } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ExternalLink } from 'lucide-react';

interface CalendarViewProps {
  festivals: Festival[];
  onSelectFestival: (festival: Festival) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  festivals,
  onSelectFestival
}) => {
  const [currentYear, setCurrentYear] = React.useState(2026);
  const [currentMonth, setCurrentMonth] = React.useState(5); // May 2026 as default or dynamic

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  // Filter festivals that are active in this year and month
  const monthFestivals = React.useMemo(() => {
    return festivals.filter(f => {
      // Check year match
      const yearMatch = f.years.length === 0 || f.years.includes(currentYear);
      // Check month match
      const monthMatch = f.months.length === 0 || f.months.includes(currentMonth);
      return yearMatch && monthMatch;
    });
  }, [festivals, currentYear, currentMonth]);

  // Days in selected month calculation
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfWeek = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay(); // 0 = Sun
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth);

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyPrefixSlots = Array.from({ length: startDayOfWeek }, (_, i) => i);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-6">
      
      {/* Month Navigator Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {currentYear}년 {currentMonth}월 축제 달력
            </h3>
            <p className="text-xs text-slate-400">
              해당 월에 개최되는 부산의 주요 축제 일정 ({monthFestivals.length}개)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="이전 달"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold px-3 py-1 bg-slate-800 rounded-lg text-cyan-300">
            {currentYear}. {currentMonth < 10 ? `0${currentMonth}` : currentMonth}
          </span>

          <button
            onClick={nextMonth}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="다음 달"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of Week Bar */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-slate-400 border-b border-slate-800 pb-2">
        <span className="text-rose-400">일</span>
        <span>월</span>
        <span>화</span>
        <span>수</span>
        <span>목</span>
        <span>금</span>
        <span className="text-cyan-400">토</span>
      </div>

      {/* Calendar Grid Matrix */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        
        {/* Empty slots for offset */}
        {emptyPrefixSlots.map((_, idx) => (
          <div key={`empty-${idx}`} className="min-h-[90px] sm:min-h-[110px] rounded-xl bg-slate-950/30 border border-slate-900/50" />
        ))}

        {/* Day Cells */}
        {daysArray.map((day) => {
          // Find festivals that might occur on this day
          const dayFestivals = monthFestivals.filter(f => {
            if (f.startDate && f.endDate) {
              const startDay = new Date(f.startDate).getDate();
              const endDay = new Date(f.endDate).getDate();
              const startMonth = new Date(f.startDate).getMonth() + 1;
              const endMonth = new Date(f.endDate).getMonth() + 1;

              if (startMonth === currentMonth && endMonth === currentMonth) {
                return day >= startDay && day <= endDay;
              }
            }
            return true; // If specific day range is flexible, list in the month
          });

          return (
            <div
              key={day}
              className="min-h-[90px] sm:min-h-[110px] p-1.5 sm:p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <span className="text-xs font-bold text-slate-300">
                {day}
              </span>

              <div className="space-y-1 overflow-y-auto max-h-[70px] scrollbar-none my-1">
                {dayFestivals.slice(0, 2).map((fest) => (
                  <button
                    key={fest.id}
                    onClick={() => onSelectFestival(fest)}
                    className="w-full text-left px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition line-clamp-1 border border-cyan-500/30"
                    title={fest.title}
                  >
                    {fest.title}
                  </button>
                ))}

                {dayFestivals.length > 2 && (
                  <div className="text-[9px] text-slate-500 text-center font-medium">
                    +{dayFestivals.length - 2}개 더보기
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
