import React from 'react';
import { Trophy, CheckCircle2, Check, Layout, ThumbsUp } from 'lucide-react';

export default function RightSidebar() {
  return (
    <aside className="w-80 flex flex-col gap-4 shrink-0 hidden xl:flex">
      {/* Card 1: Why this UI works? */}
      <div className="dash-card p-4 bg-white border border-slate-200">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 mb-3 text-slate-800 font-bold text-sm">
          <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Trophy size={14} />
          </div>
          <span>Why this UI works?</span>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <span>Dual-pane design</span>
            </div>
            <p className="text-[11px] text-slate-500 pl-5 mt-0.5">
              Map + data side by side for better context
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <span>Clean & modern interface</span>
            </div>
            <p className="text-[11px] text-slate-500 pl-5 mt-0.5">
              Easy to navigate, less clutter
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <span>Visual risk indicators</span>
            </div>
            <p className="text-[11px] text-slate-500 pl-5 mt-0.5">
              Color-coded parcels, alerts, and score
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <span>Quick actions</span>
            </div>
            <p className="text-[11px] text-slate-500 pl-5 mt-0.5">
              Upload documents, generate certificates
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <span>Responsive & scalable</span>
            </div>
            <p className="text-[11px] text-slate-500 pl-5 mt-0.5">
              Works on desktop and tablet
            </p>
          </div>
        </div>
      </div>

      {/* Card 2: Alternative Layout Options */}
      <div className="dash-card p-4 bg-white border border-slate-200">
        <div className="font-bold text-sm text-slate-800 pb-2.5 border-b border-slate-100 mb-3">
          Alternative Layout Options
        </div>

        <div className="space-y-2.5">
          {/* Option 1 */}
          <div className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 flex items-center gap-3 transition-all cursor-pointer">
            <div className="w-12 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
              <div className="w-8 h-6 border border-slate-300 rounded bg-white"></div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">1. Tab-Based Layout</div>
              <div className="text-[10px] text-slate-500">(Simple) - Good for minimal users</div>
            </div>
          </div>

          {/* Option 2 */}
          <div className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 flex items-center gap-3 transition-all cursor-pointer">
            <div className="w-12 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
              <div className="w-8 h-6 border border-slate-300 rounded bg-white flex flex-col gap-0.5 p-0.5">
                <div className="h-1 bg-slate-200 rounded"></div>
                <div className="h-1 bg-slate-200 rounded"></div>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">2. Single Page Scroll</div>
              <div className="text-[10px] text-slate-500">(Modern) - All info in one continuous view</div>
            </div>
          </div>

          {/* Option 3: Selected Active Pro Layout */}
          <div className="p-2.5 rounded-xl border-2 border-emerald-600 bg-emerald-50/40 flex items-center gap-3 shadow-sm transition-all cursor-pointer">
            <div className="w-12 h-10 rounded-lg bg-emerald-100/70 border border-emerald-300 flex items-center justify-center shrink-0">
              <div className="w-8 h-6 border border-emerald-400 rounded bg-white flex">
                <div className="w-2 bg-emerald-700"></div>
                <div className="flex-1 bg-emerald-50"></div>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-950">3. Sidebar + Right Panel</div>
              <div className="text-[10px] text-emerald-800 font-medium">(Pro) - Best for power users (our choice)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Recommended Note */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs shadow-sm">
        <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1.5">
          <CheckCircle2 size={16} className="text-emerald-700" />
          <span>Recommended</span>
        </div>
        <p className="text-[11px] text-emerald-800 leading-relaxed">
          The Dual-Pane Dashboard gives the best balance of map visualization, data, and workflow. It's visually appealing, easy to use, and perfect for your FarmAI use case.
        </p>
      </div>
    </aside>
  );
}
