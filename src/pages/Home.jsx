import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, MapPin, Users, Lock, Shield, ChevronRight, Heart } from 'lucide-react';

export default function Home() {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-white" />,
      iconBg: 'bg-safety-pink-500',
      title: 'Instant SOS',
      desc: 'Send immediate alert warnings to all chosen contacts with a single tap in distress.'
    },
    {
      icon: <MapPin className="h-6 w-6 text-white" />,
      iconBg: 'bg-safety-purple-600',
      title: 'Live Location Sharing',
      desc: 'Retrieves your current exact GPS coordinates via geolocation and generates a Google Maps locator link.'
    },
    {
      icon: <Users className="h-6 w-6 text-white" />,
      iconBg: 'bg-indigo-500',
      title: 'Emergency Contacts',
      desc: 'Store, update, and manage your trusted inner circle details with custom relationships and speed dials.'
    },
    {
      icon: <Lock className="h-6 w-6 text-white" />,
      iconBg: 'bg-emerald-500',
      title: 'Secure Account',
      desc: 'Your credentials and emergency configuration are locked down securely via Firebase Authentication.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column Text */}
            <div className="text-center lg:text-left space-y-6 max-w-xl mx-auto lg:mx-0">
              <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-safety-purple-100 text-safety-purple-800 text-xs font-semibold tracking-wider uppercase">
                <Shield className="h-3.5 w-3.5" />
                <span>Safeguarding Every Step</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Your Safety, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-safety-purple-700 to-safety-pink-500">
                  One Tap Away
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                SafeHer provides instant security coordinates when you need them most. 
                Register your trusted emergency contacts and alert them instantly with your live location.
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to={currentUser ? "/dashboard" : "/register"}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold gradient-btn flex items-center justify-center space-x-2 text-base shadow-lg"
                >
                  <span>Get Started</span>
                  <ChevronRight className="h-5 w-5" />
                </Link>
                {!currentUser && (
                  <Link
                    to="/login"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all flex items-center justify-center"
                  >
                    Login to Account
                  </Link>
                )}
              </div>
            </div>

            {/* Right Column Visual (Interactive UI Mockup) */}
            <div className="relative flex justify-center">
              {/* Outer Decorative Circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-safety-purple-200/50 rounded-full blur-3xl -z-10"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-safety-pink-200/40 rounded-full blur-2xl -z-10"></div>

              {/* Mockup Card */}
              <div className="w-full max-w-sm glass-panel p-6 shadow-2xl relative border border-white/60 animate-pulse-subtle">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <span className="text-xs text-red-500 font-semibold uppercase animate-pulse">Live Signal</span>
                  </div>
                  <div className="text-xs text-slate-400">SafeHer App</div>
                </div>

                <div className="flex flex-col items-center py-8">
                  {/* Outer Pulsing Rings */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-28 h-28 bg-red-500/20 rounded-full animate-ping-slow"></div>
                    <div className="absolute w-24 h-24 bg-red-500/40 rounded-full animate-pulse"></div>
                    
                    <button className="relative w-20 h-20 bg-gradient-to-tr from-red-600 to-rose-500 rounded-full text-white font-bold text-lg shadow-xl cursor-default flex items-center justify-center">
                      SOS
                    </button>
                  </div>

                  <p className="mt-8 text-center text-sm font-medium text-slate-700">
                    Tap to trigger instant alert signals
                  </p>
                  <p className="text-center text-xs text-slate-400 mt-1">
                    Will send coordinates to your core circle
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-around text-center text-xs text-slate-500">
                  <div>
                    <span className="block font-bold text-slate-800">1 Tap</span>
                    Alert Outbox
                  </div>
                  <div className="border-r border-slate-150"></div>
                  <div>
                    <span className="block font-bold text-slate-800">GPS Link</span>
                    Google Maps
                  </div>
                  <div className="border-r border-slate-150"></div>
                  <div>
                    <span className="block font-bold text-slate-800">100%</span>
                    Encrypted
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white border-t border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Engineered for Instant Emergency Aid
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              SafeHer is lightweight, highly reliable, and built specifically with a mobile-first user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50 rounded-2xl p-6 hover:bg-gradient-to-tr hover:from-white hover:to-slate-50 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 border border-slate-100/50"
              >
                <div className={`w-12 h-12 rounded-xl ${feat.iconBg} flex items-center justify-center mb-5 shadow-sm`}>
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-500 text-sm flex items-center space-x-1">
            <span>© 2026 SafeHer. Created with care for women safety.</span>
            <Heart className="h-3.5 w-3.5 text-safety-pink-500 fill-safety-pink-500" />
          </div>
          <div className="flex space-x-6 text-sm text-slate-500">
            <Link to={currentUser ? "/dashboard" : "/login"} className="hover:text-safety-purple-700">Dashboard</Link>
            <Link to={currentUser ? "/profile" : "/register"} className="hover:text-safety-purple-700">Profile</Link>
            <span className="cursor-default text-slate-300">|</span>
            <span className="cursor-default">Security Standard (SSL)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
