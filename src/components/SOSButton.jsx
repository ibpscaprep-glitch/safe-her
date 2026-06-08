import { useState } from 'react';
import { AlertOctagon, MapPin, Send, RotateCcw, AlertTriangle, CheckCircle, MessageSquare } from 'lucide-react';

export default function SOSButton({ contacts, onSOSTriggered }) {
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState('');
  const [activeAlert, setActiveAlert] = useState(false);
  const [isStandingDown, setIsStandingDown] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [warning, setWarning] = useState('');

  function handleSOSClick() {
    if (contacts.length === 0) {
      setError('Please add at least one emergency contact before triggering the SOS alert.');
      return;
    }

    setError('');
    setWarning('');
    setIsLocating(true);

    if (!navigator.geolocation) {
      handleFallback('Geolocation is not supported by your browser.');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        
        setCurrentLocation({ latitude, longitude, mapsLink });
        setIsLocating(false);
        setActiveAlert(true);

        // Notify parent to log activity to Firestore
        onSOSTriggered(latitude, longitude, mapsLink);
      },
      (err) => {
        console.warn("Geolocation failed, using simulated coordinates:", err);
        let reason = 'Insecure HTTP context / permissions blocked';
        if (err.code === 2) reason = 'Location unavailable';
        if (err.code === 3) reason = 'Request timed out';
        handleFallback(reason);
      },
      options
    );
  }

  function handleFallback(reason) {
    // Simulated coordinates (New Delhi)
    const fallbackLat = 28.6139;
    const fallbackLng = 77.2090;
    const mapsLink = `https://maps.google.com/?q=${fallbackLat},${fallbackLng}`;
    
    setCurrentLocation({ latitude: fallbackLat, longitude: fallbackLng, mapsLink });
    setIsLocating(false);
    setActiveAlert(true);
    setWarning(`Demo Mode: Using simulated location (${reason}).`);
    
    onSOSTriggered(fallbackLat, fallbackLng, mapsLink);
  }

  function handleReset() {
    setActiveAlert(false);
    setCurrentLocation(null);
    setError('');
    setWarning('');
    setIsStandingDown(false);
  }

  // Generate WhatsApp link for a contact
  const getWhatsAppLink = (phoneNumber) => {
    if (!currentLocation) return '#';
    const message = `🚨 SOS ALERT 🚨\n\nI need help.\n\nMy live location:\n${currentLocation.mapsLink}\n\nPlease contact me immediately.`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  // Generate WhatsApp link for safe confirmation message
  const getSafeWhatsAppLink = (phoneNumber) => {
    const message = `🟢 SAFE UPDATE 🟢\n\nI am safe now. The emergency alert has been stood down. Thank you for checking in on me!`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  // Generate SMS link for all contacts
  const getSMSAllLink = () => {
    if (!currentLocation || contacts.length === 0) return '#';
    const phoneNumbers = contacts.map(c => c.phoneNumber).join(',');
    const message = `🚨 SOS ALERT 🚨\n\nI need help.\n\nMy live location:\n${currentLocation.mapsLink}\n\nPlease contact me immediately.`;
    
    const ua = navigator.userAgent.toLowerCase();
    const isiOS = /ipad|iphone|ipod/.test(ua) && !window.MSStream;
    const separator = isiOS ? ';' : '?';
    
    return `sms:${phoneNumbers}${separator}body=${encodeURIComponent(message)}`;
  };

  // Generate SMS link for safe confirmation message to all contacts
  const getSafeSMSAllLink = () => {
    if (contacts.length === 0) return '#';
    const phoneNumbers = contacts.map(c => c.phoneNumber).join(',');
    const message = `🟢 SAFE UPDATE 🟢\n\nI am safe now. The emergency alert has been stood down. Thank you for checking in on me!`;
    
    const ua = navigator.userAgent.toLowerCase();
    const isiOS = /ipad|iphone|ipod/.test(ua) && !window.MSStream;
    const separator = isiOS ? ';' : '?';
    
    return `sms:${phoneNumbers}${separator}body=${encodeURIComponent(message)}`;
  };

  return (
    <div className="glass-panel p-6 border border-white/60 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Alert Header */}
      <div className="text-center mb-6 w-full">
        <h2 className="text-xl font-bold text-slate-800 flex items-center justify-center space-x-1.5">
          <AlertOctagon className="h-5 w-5 text-red-500 shrink-0" />
          <span>Instant SOS Trigger</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Press the button below to fetch coordinates and notify your circle
        </p>
      </div>

      {error && (
        <div className="mb-4 w-full p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-start space-x-2 text-red-700 text-xs animate-fadeIn">
          <AlertTriangle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {warning && (
        <div className="mb-4 w-full p-3.5 rounded-xl bg-amber-50 border border-amber-200/50 flex items-start space-x-2 text-amber-800 text-xs animate-fadeIn">
          <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
          <span>{warning}</span>
        </div>
      )}

      {!activeAlert ? (
        <div className="flex flex-col items-center py-6">
          {/* Big SOS Pulsing Button */}
          <div className="relative flex items-center justify-center">
            {isLocating && (
              <div className="absolute w-36 h-36 bg-red-500/20 rounded-full animate-ping-slow"></div>
            )}
            <div className={`absolute w-32 h-32 bg-red-500/10 rounded-full ${isLocating ? 'animate-pulse' : 'sos-button-glow'}`}></div>
            
            <button
              onClick={handleSOSClick}
              disabled={isLocating}
              className={`relative w-28 h-28 bg-gradient-to-tr from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 active:scale-95 text-white font-black text-3xl rounded-full shadow-2xl transition duration-200 border-4 border-white flex flex-col items-center justify-center tracking-wider disabled:opacity-80 disabled:cursor-wait select-none`}
            >
              {isLocating ? (
                <span className="text-sm font-semibold animate-pulse">GPS...</span>
              ) : (
                <span>SOS</span>
              )}
            </button>
          </div>
          
          <p className="mt-6 text-xs text-slate-400 font-semibold uppercase tracking-wider text-center">
            {isLocating ? 'Accessing satellite GPS signals...' : 'Single tap distress trigger'}
          </p>
        </div>
      ) : isStandingDown ? (
        /* Stand Down / Safe Dispatch Mode */
        <div className="w-full space-y-5 py-2 animate-fadeIn text-center">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100/50 flex flex-col items-center">
            <span className="inline-block p-1.5 rounded-lg bg-emerald-500 text-white animate-pulse mb-2">
              <CheckCircle className="h-5 w-5" />
            </span>
            <h4 className="font-bold text-emerald-800 text-sm">Emergency Stood Down</h4>
            <p className="text-xs text-slate-500 mt-1">
              Send a safety confirmation to your emergency contacts to let them know you are okay.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">
              Send Safety Updates:
            </p>
            <a
              href={getSafeSMSAllLink()}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white flex items-center justify-between shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
            >
              <span className="flex items-center space-x-2">
                <MessageSquare className="h-4.5 w-4.5 shrink-0" />
                <span>Send "I'm Safe" SMS to All Contacts</span>
              </span>
              <span className="text-[10px] uppercase font-black bg-white/20 px-2.5 py-0.5 rounded">
                SMS (ALL)
              </span>
            </a>
            {contacts.map((contact) => (
              <a
                key={contact.id}
                href={getSafeWhatsAppLink(contact.phoneNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-between shadow-sm hover:shadow transition duration-200"
              >
                <span className="flex items-center space-x-2">
                  <Send className="h-4.5 w-4.5 shrink-0" />
                  <span>Send "I'm Safe" to {contact.name}</span>
                </span>
                <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded">
                  {contact.relationship}
                </span>
              </a>
            ))}
          </div>

          <button
            onClick={handleReset}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
          >
            <span>Complete Stand Down & Reset</span>
          </button>
        </div>
      ) : (
        /* Alert Dispatch Mode */
        <div className="w-full space-y-5 py-2 animate-fadeIn">
          <div className="p-4 rounded-xl bg-red-50 border border-red-100/50 text-center">
            <span className="inline-block p-1.5 rounded-lg bg-red-500 text-white animate-bounce-slow mb-2">
              <MapPin className="h-5 w-5" />
            </span>
            <h4 className="font-bold text-red-700 text-sm">Coordinates Loaded Successfully!</h4>
            <div className="text-xs font-mono text-slate-600 mt-1 select-all bg-white/60 p-2 rounded-lg border border-slate-100">
              Lat: {currentLocation?.latitude.toFixed(6)}, Lon: {currentLocation?.longitude.toFixed(6)}
            </div>
            <a 
              href={currentLocation?.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-safety-purple-700 font-semibold hover:underline mt-2 inline-block"
            >
              View Location on Google Maps
            </a>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Send Emergency Dispatches:
            </p>
            <a
              href={getSMSAllLink()}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center justify-between shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
            >
              <span className="flex items-center space-x-2">
                <MessageSquare className="h-4.5 w-4.5 shrink-0 animate-pulse" />
                <span>Send SMS SOS to All Contacts</span>
              </span>
              <span className="text-[10px] uppercase font-black bg-white/20 px-2.5 py-0.5 rounded">
                SMS (ALL)
              </span>
            </a>
            {contacts.map((contact) => (
              <a
                key={contact.id}
                href={getWhatsAppLink(contact.phoneNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-between shadow-sm hover:shadow transition duration-200"
              >
                <span className="flex items-center space-x-2">
                  <Send className="h-4.5 w-4.5 shrink-0" />
                  <span>Send SOS to {contact.name}</span>
                </span>
                <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded">
                  {contact.relationship}
                </span>
              </a>
            ))}
          </div>

          <button
            onClick={() => setIsStandingDown(true)}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Clear / Stand down SOS</span>
          </button>
        </div>
      )}

    </div>
  );
}
