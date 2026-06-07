import React from 'react';
import { Phone, Shield, Heart, Activity } from 'lucide-react';

export default function EmergencyHelplines() {
  const helplines = [
    {
      name: "Emergency Support (ERSS)",
      number: "112",
      description: "National emergency response system",
      icon: <Shield className="h-5 w-5 text-red-600" />,
      bg: "bg-red-50 border-red-100 text-red-700",
      btnBg: "bg-red-600 hover:bg-red-700 text-white",
    },
    {
      name: "Women Helpline",
      number: "1091",
      description: "24/7 dedicated safety support",
      icon: <Heart className="h-5 w-5 text-safety-pink-600" />,
      bg: "bg-pink-50 border-pink-100 text-pink-700",
      btnBg: "bg-safety-pink-600 hover:bg-safety-pink-700 text-white",
    },
    {
      name: "Ambulance",
      number: "108",
      description: "Medical emergency assistance",
      icon: <Activity className="h-5 w-5 text-blue-600" />,
      bg: "bg-blue-50 border-blue-100 text-blue-700",
      btnBg: "bg-blue-600 hover:bg-blue-700 text-white",
    }
  ];

  return (
    <div className="glass-panel p-6 border border-white/60">
      <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2 mb-2">
        <Phone className="h-5 w-5 text-safety-purple-600" />
        <span>Emergency Helplines</span>
      </h2>
      <p className="text-xs text-slate-500 mb-5">
        One-tap to instantly dial direct public safety numbers.
      </p>

      <div className="space-y-4">
        {helplines.map((item, idx) => (
          <a
            key={idx}
            href={`tel:${item.number}`}
            className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white/50 hover:bg-white hover:shadow-md transition-all duration-200 group active:scale-[0.98]"
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
            
            <div className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wider ${item.btnBg} transition-all flex items-center space-x-1 shadow-sm`}>
              <Phone className="h-3.5 w-3.5 fill-current shrink-0" />
              <span>{item.number}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
