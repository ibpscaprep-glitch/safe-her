import React from 'react';
import { Navigation, Hospital, Shield, Flame, ExternalLink } from 'lucide-react';

export default function NearbyServices() {
  const services = [
    {
      name: "Hospitals Near Me",
      query: "hospitals near me",
      description: "Emergency rooms & medical care",
      icon: <Hospital className="h-5 w-5 text-emerald-600" />,
      bg: "bg-emerald-50 border-emerald-100 text-emerald-700",
      hoverBg: "hover:bg-emerald-50/50 hover:border-emerald-200"
    },
    {
      name: "Police Stations Near Me",
      query: "police stations near me",
      description: "Local precincts & law enforcement",
      icon: <Shield className="h-5 w-5 text-blue-600" />,
      bg: "bg-blue-50 border-blue-100 text-blue-700",
      hoverBg: "hover:bg-blue-50/50 hover:border-blue-200"
    },
    {
      name: "Fire Stations Near Me",
      query: "fire stations near me",
      description: "First responders & fire safety",
      icon: <Flame className="h-5 w-5 text-orange-600" />,
      bg: "bg-orange-50 border-orange-100 text-orange-700",
      hoverBg: "hover:bg-orange-50/50 hover:border-orange-200"
    }
  ];

  const handleRedirect = (query) => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="glass-panel p-6 border border-white/60">
      <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2 mb-2">
        <Navigation className="h-5 w-5 text-safety-purple-600 animate-pulse" />
        <span>Nearby Safety Services</span>
      </h2>
      <p className="text-xs text-slate-500 mb-5">
        Tap to locate critical emergency services near your current location on Google Maps.
      </p>

      <div className="space-y-4">
        {services.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleRedirect(item.query)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 ${item.hoverBg} bg-white/50 hover:shadow-md transition-all duration-200 group active:scale-[0.98] text-left`}
          >
            <div className="flex items-center space-x-3.5">
              <div className={`p-3 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                {item.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm group-hover:text-slate-900 transition-colors">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-500">
                  {item.description}
                </p>
              </div>
            </div>
            
            <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-slate-100 text-slate-400 group-hover:text-slate-600 transition-all flex items-center justify-center shadow-sm border border-slate-100">
              <ExternalLink className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
