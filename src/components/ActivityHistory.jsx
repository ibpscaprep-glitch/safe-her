import React from 'react';
import { History, MapPin, ExternalLink, ShieldAlert } from 'lucide-react';

export default function ActivityHistory({ activities, loading }) {
  return (
    <div className="glass-panel p-6 border border-white/60">
      
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
          <History className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Recent SOS Logs</h2>
          <p className="text-xs text-slate-500">History of your triggered distress coordinates</p>
        </div>
      </div>

      {/* Activities List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 space-y-2">
          <div className="w-6 h-6 border-2 border-safety-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-400">Loading history...</span>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-slate-150 rounded-2xl">
          <div className="inline-flex p-3 rounded-full bg-slate-50 text-slate-400 mb-2">
            <History className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-slate-600">No distress history logged</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Your logs will show up here only when the SOS button is triggered.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 no-scrollbar">
          {activities.map((act) => (
            <div 
              key={act.id} 
              className="flex justify-between items-center p-3.5 bg-slate-50 hover:bg-slate-100/60 rounded-xl border border-slate-100 transition duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-red-100 text-red-600 mt-0.5">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div>
                  <span className="block font-semibold text-slate-800 text-xs sm:text-sm">
                    {act.dateTimeString}
                  </span>
                  <span className="block text-[10px] sm:text-xs font-mono text-slate-500 mt-1">
                    Lat: {act.latitude.toFixed(5)}, Lon: {act.longitude.toFixed(5)}
                  </span>
                </div>
              </div>

              {/* View map button */}
              <a
                href={act.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-safety-purple-700 hover:bg-white hover:text-safety-purple-900 border border-transparent hover:border-slate-200 transition flex items-center space-x-1 text-xs font-medium shrink-0"
              >
                <span>Maps</span>
                <ExternalLink className="h-3 w-3" />
              </a>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
