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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-400">총 부산 축제</p>
          <p className="text-lg font-extrabold text-white">{festivals.length}개</p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
          <Gift className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-400">무료 입장 축제</p>
          <p className="text-lg font-extrabold text-amber-300">{freeCount}개</p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
          <Flame className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-400">진행 중 축제</p>
          <p className="text-lg font-extrabold text-emerald-300">{ongoingCount}개</p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-400">개최 예정 축제</p>
          <p className="text-lg font-extrabold text-blue-300">{upcomingCount}개</p>
        </div>
      </div>

    </div>
  );
};
