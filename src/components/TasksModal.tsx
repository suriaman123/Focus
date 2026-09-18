import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QuestTask } from '../types';
import { sound } from '../utils/audio';
import { Check, Flame, Award, Gift, Calendar, ArrowRight, Download, Upload } from 'lucide-react';

interface TasksModalProps {
  tasks: QuestTask[];
  onClaimReward: (taskId: string) => void;
  streak: number;
  longestStreak: number;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TasksModal: React.FC<TasksModalProps> = ({
  tasks,
  onClaimReward,
  streak,
  longestStreak,
  onExportData,
  onImportData,
}) => {
  const daysUntilStreakEgg = 7 - (streak % 7 || 7);

  const dailyTasks = tasks.filter((t) => t.category === 'daily');
  const milestoneTasks = tasks.filter((t) => t.category === 'milestone');

  const handleClaim = (taskId: string) => {
    sound.playSingingBowl(528, 2.5);
    onClaimReward(taskId);
  };

  return (
    <div id="sanctuary-tasks-page" className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#c8a97e] mb-1.5">
            <Gift className="w-3.5 h-3.5" />
            Dedication & Milestones
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#ede8df] font-light">
            Sanctuary Tasks
          </h1>
          <p className="text-xs sm:text-sm text-[#8a8f98] mt-1">
            Complete daily rites and long-term milestones to receive extra eggs and companion blessings.
          </p>
        </div>

        {/* Export / Import Data for GitHub Pages */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExportData}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#ede8df] text-xs flex items-center gap-1.5 border border-white/10 transition-colors"
            title="Export Sanctuary Backup (JSON)"
          >
            <Download className="w-3.5 h-3.5" /> Export Data
          </button>

          <label className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#ede8df] text-xs flex items-center gap-1.5 border border-white/10 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" /> Import
            <input type="file" accept=".json" onChange={onImportData} className="hidden" />
          </label>
        </div>
      </div>

      {/* 7-Day Streak Banner */}
      <div className="bg-gradient-to-r from-[#181b25] to-[#12141c] border border-amber-500/20 rounded-3xl p-6 mb-8 relative overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Flame className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl text-[#ede8df]">
                  {streak}-Day Focus Streak
                </h3>
                <span className="text-[10px] font-mono text-[#8a8f98] bg-white/5 px-2 py-0.5 rounded-md">
                  Best: {longestStreak} Days
                </span>
              </div>
              <p className="text-xs text-[#a0a5b2] mt-0.5">
                Every 7 consecutive days in your sanctuary bestows an extra companion egg!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {/* 7-day visual dots */}
            {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
              const currentCycleDay = streak % 7 === 0 && streak > 0 ? 7 : streak % 7;
              const isPastOrCurrent = dayNum <= currentCycleDay;
              const isLast = dayNum === 7;

              return (
                <div key={dayNum} className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-mono border transition-all ${
                      isPastOrCurrent
                        ? isLast
                          ? 'bg-amber-500 text-[#0c0e12] border-amber-400 font-bold shadow-md'
                          : 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                        : 'bg-white/5 text-[#636872] border-white/5'
                    }`}
                  >
                    {isLast ? <Gift className="w-3.5 h-3.5" /> : dayNum}
                  </div>
                  <span className="text-[9px] text-[#636872] mt-1 font-mono">D{dayNum}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tasks Lists */}
      <div className="space-y-8">
        {/* Daily Rites */}
        <div>
          <h3 className="font-serif text-xl text-[#ede8df] mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#c8a97e]" />
            Daily Focus Rites
          </h3>
          <div className="space-y-3">
            {dailyTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#13161f] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-[#ede8df]">{task.title}</h4>
                    {task.completed && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Done
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#8a8f98] mt-0.5">{task.description}</p>
                  {/* Progress bar */}
                  <div className="flex items-center gap-3 mt-2 max-w-xs">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#c8a97e] rounded-full transition-all"
                        style={{ width: `${Math.min(100, (task.current / task.target) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[#8a8f98]">
                      {task.current} / {task.target} {task.unit}
                    </span>
                  </div>
                </div>

                {/* Reward Action */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-mono text-[#787e8d]">Reward</div>
                    <div className="text-xs font-semibold text-[#c8a97e]">
                      {task.rewardType === 'egg' ? `+${task.rewardAmount} Extra Egg` : `+${task.rewardAmount}h Pet Age`}
                    </div>
                  </div>

                  <button
                    onClick={() => handleClaim(task.id)}
                    disabled={!task.completed || task.claimed}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                      task.claimed
                        ? 'bg-white/5 text-[#555a64] cursor-not-allowed'
                        : task.completed
                        ? 'bg-[#c8a97e] hover:bg-[#d8bb93] text-[#0c0e12] shadow-md active:scale-95'
                        : 'bg-white/5 text-[#787e8d] opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {task.claimed ? 'Claimed' : task.completed ? 'Claim Reward' : 'In Progress'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div>
          <h3 className="font-serif text-xl text-[#ede8df] mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#c8a97e]" />
            Sanctuary Milestones
          </h3>
          <div className="space-y-3">
            {milestoneTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#13161f] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-[#ede8df]">{task.title}</h4>
                    {task.completed && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Done
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#8a8f98] mt-0.5">{task.description}</p>
                  {/* Progress bar */}
                  <div className="flex items-center gap-3 mt-2 max-w-xs">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (task.current / task.target) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[#8a8f98]">
                      {task.current} / {task.target} {task.unit}
                    </span>
                  </div>
                </div>

                {/* Reward Action */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-mono text-[#787e8d]">Reward</div>
                    <div className="text-xs font-semibold text-amber-300">
                      {task.rewardType === 'egg' ? `+${task.rewardAmount} Extra Egg` : `+${task.rewardAmount}h Pet Age`}
                    </div>
                  </div>

                  <button
                    onClick={() => handleClaim(task.id)}
                    disabled={!task.completed || task.claimed}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                      task.claimed
                        ? 'bg-white/5 text-[#555a64] cursor-not-allowed'
                        : task.completed
                        ? 'bg-amber-400 hover:bg-amber-300 text-[#0c0e12] shadow-md active:scale-95'
                        : 'bg-white/5 text-[#787e8d] opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {task.claimed ? 'Claimed' : task.completed ? 'Claim Reward' : 'In Progress'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
