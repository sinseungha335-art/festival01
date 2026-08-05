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
    <div className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-6">
      
      {/* Month Navigator Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] text-[#FF5C35] flex items-center justify-center border-2 border-[#1A1A1A]">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#1A1A1A] uppercase tracking-wider">
              {currentYear}년 {currentMonth}월 FESTIVAL CALENDAR
            </h3>
            <p className="text-xs font-bold text-[#1A1A1A]/70">
              해당 월에 개최되는 부산의 주요 축제 일정 ({monthFestivals.length}개)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#FF5C35] hover:text-white text-[#1A1A1A] border-2 border-[#1A1A1A] transition shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]"
            title="이전 달"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-black px-3.5 py-1.5 bg-[#1A1A1A] text-white rounded-xl border border-[#1A1A1A]">
            {currentYear}. {currentMonth < 10 ? `0${currentMonth}` : currentMonth}
          </span>

          <button
            onClick={nextMonth}
            className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#FF5C35] hover:text-white text-[#1A1A1A] border-2 border-[#1A1A1A] transition shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]"
            title="다음 달"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of Week Bar */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-black text-[#1A1A1A] border-b-2 border-[#1A1A1A] pb-3 uppercase tracking-wider">
        <span className="text-[#FF5C35]">SUN (일)</span>
        <span>MON (월)</span>
        <span>TUE (화)</span>
        <span>WED (수)</span>
        <span>THU (목)</span>
        <span>FRI (금)</span>
        <span className="text-[#FF5C35]">SAT (토)</span>
      </div>

      {/* Calendar Grid Matrix */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        
        {/* Empty slots for offset */}
        {emptyPrefixSlots.map((_, idx) => (
          <div key={`empty-${idx}`} className="min-h-[90px] sm:min-h-[110px] rounded-xl bg-[#FAF7F2]/50 border-2 border-[#1A1A1A]/20" />
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
              className="min-h-[90px] sm:min-h-[110px] p-2 sm:p-2.5 rounded-xl bg-[#FAF7F2] border-2 border-[#1A1A1A] flex flex-col justify-between hover:bg-white transition shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]"
            >
              <span className="text-xs font-black text-[#1A1A1A]">
                {day}
              </span>

              <div className="space-y-1 overflow-y-auto max-h-[70px] scrollbar-none my-1">
                {dayFestivals.slice(0, 2).map((fest) => (
                  <button
                    key={fest.id}
                    onClick={() => onSelectFestival(fest)}
                    className="w-full text-left px-2 py-1 rounded text-[10px] font-black bg-[#FF5C35] text-white hover:bg-[#1A1A1A] transition line-clamp-1 border border-[#1A1A1A]"
                    title={fest.title}
                  >
                    {fest.title}
                  </button>
                ))}

                {dayFestivals.length > 2 && (
                  <div className="text-[9px] text-[#1A1A1A]/70 text-center font-black">
                    +{dayFestivals.length - 2} MORE
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
