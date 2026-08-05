import React from 'react';
import { Festival } from '../types';
import { Sparkles, Gift, Flame, MapPin } from 'lucide-react';

interface StatsOverviewProps {
  festivals: Festival[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ festivals }) => {
  const freeCount = festivals.filter(f => f.isFree).length;
  const ongoingCount = festivals.filter(f => f.status === 'ongoing').length;
  const upcomingCount = festivals.filter(f => f.status === 'upcoming').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      
      <div className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-4 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
        <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] text-[#FF5C35] flex items-center justify-center shrink-0 border border-[#1A1A1A]">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/70">총 축제 수</p>
          <p className="text-xl font-black text-[#1A1A1A]">{festivals.length}개</p>
        </div>
      </div>

      <div className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-4 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
        <div className="w-10 h-10 rounded-xl bg-[#FF5C35] text-white flex items-center justify-center shrink-0 border border-[#1A1A1A]">
          <Gift className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/70">무료 축제</p>
          <p className="text-xl font-black text-[#FF5C35]">{freeCount}개</p>
        </div>
      </div>

      <div className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-4 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
        <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] text-emerald-400 flex items-center justify-center shrink-0 border border-[#1A1A1A]">
          <Flame className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/70">진행 중</p>
          <p className="text-xl font-black text-[#1A1A1A]">{ongoingCount}개</p>
        </div>
      </div>

      <div className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-4 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
        <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#1A1A1A] flex items-center justify-center shrink-0 border-2 border-[#1A1A1A]">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/70">개최 예정</p>
          <p className="text-xl font-black text-[#1A1A1A]">{upcomingCount}개</p>
        </div>
      </div>

    </div>
  );
};

