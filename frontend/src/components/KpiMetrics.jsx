import React, { useState, useEffect, useCallback } from 'react';
import { FileText, CheckCircle2, AlertTriangle, AlertOctagon, Sprout, MapPin, Calendar } from 'lucide-react';

export default function KpiMetrics({ 
  totalRecords = 247, 
  matchedRecords = 189, 
  discrepanciesCount = 42, 
  highRiskCount = 16,
  location = 'Madurai, Tamil Nadu'
}) {
  const safeTotal = totalRecords > 0 ? totalRecords : 1;
  const matchedPct = ((matchedRecords / safeTotal) * 100).toFixed(1);
  const discrepanciesPct = ((discrepanciesCount / safeTotal) * 100).toFixed(1);
  const highRiskPct = ((highRiskCount / safeTotal) * 100).toFixed(1);

  // Live real-time clock state
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [currentLocation, setCurrentLocation] = useState(location || 'Madurai, Tamil Nadu');
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationSource, setLocationSource] = useState('Default'); // 'GPS' | 'IP' | 'Project' | 'Default'

  // Live ticking clock formatted as "DD Mon YYYY, HH:MM AM/PM"
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[now.getMonth()];
      const year = now.getFullYear();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedHours = String(hours).padStart(2, '0');
      setCurrentDateTime(`${day} ${month} ${year}, ${formattedHours}:${minutes} ${ampm}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000); // Live real-time clock ticks every second
    return () => clearInterval(timer);
  }, []);

  // Reverse geocoding helper using BigDataCloud with OSM fallback
  const reverseGeocode = async (lat, lon) => {
    try {
      // 1. Try BigDataCloud free client reverse geocoder (CORS friendly, fast)
      const bdcRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
      if (bdcRes.ok) {
        const bdc = await bdcRes.json();
        const city = bdc.city || bdc.locality || bdc.principalSubdivision || 'Madurai';
        const state = bdc.principalSubdivision || 'Tamil Nadu';
        return `${city}, ${state}`;
      }
    } catch (e) {
      // ignore and try fallback
    }

    try {
      // 2. Fallback to OpenStreetMap Nominatim
      const osmRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      if (osmRes.ok) {
        const osm = await osmRes.json();
        const city = osm.address?.city || osm.address?.town || osm.address?.village || osm.address?.county || osm.address?.state_district || 'Madurai';
        const state = osm.address?.state || 'Tamil Nadu';
        return `${city}, ${state}`;
      }
    } catch (e) {
      // ignore
    }

    return null;
  };

  // Detect user live location via Geolocation or IP fallback
  const detectLiveLocation = useCallback(async (isManualTrigger = false) => {
    setIsLocating(true);

    // Step A: Try Browser Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const resolved = await reverseGeocode(latitude, longitude);
          if (resolved) {
            setCurrentLocation(resolved);
            setIsGpsActive(true);
            setLocationSource('GPS');
          } else {
            setCurrentLocation(`${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`);
            setIsGpsActive(true);
            setLocationSource('GPS');
          }
          setIsLocating(false);
        },
        async (err) => {
          // Step B: Geolocation permission denied or timed out -> Fallback to IP Geolocation
          try {
            const ipRes = await fetch('https://ipwho.is/');
            if (ipRes.ok) {
              const ipData = await ipRes.json();
              if (ipData.success !== false && ipData.city) {
                const city = ipData.city || 'Madurai';
                const region = ipData.region || 'Tamil Nadu';
                setCurrentLocation(`${city}, ${region}`);
                setIsGpsActive(false);
                setLocationSource('IP');
                setIsLocating(false);
                return;
              }
            }
          } catch (ipErr) {
            // ignore
          }

          // Step C: Fallback to active project jurisdiction
          setCurrentLocation(location || 'Madurai, Tamil Nadu');
          setIsGpsActive(false);
          setLocationSource('Project');
          setIsLocating(false);
        },
        { timeout: 6000, enableHighAccuracy: true }
      );
    } else {
      // If browser doesn't have geolocation API
      try {
        const ipRes = await fetch('https://ipwho.is/');
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData.city) {
            setCurrentLocation(`${ipData.city}, ${ipData.region || 'Tamil Nadu'}`);
            setLocationSource('IP');
            setIsLocating(false);
            return;
          }
        }
      } catch (e) {}

      setCurrentLocation(location || 'Madurai, Tamil Nadu');
      setIsLocating(false);
    }
  }, [location]);

  // Auto-detect current location on initial mount
  useEffect(() => {
    detectLiveLocation(false);
  }, [detectLiveLocation]);

  // Sync location if project parcel jurisdiction prop changes and user is not on GPS
  useEffect(() => {
    if (!isGpsActive && location) {
      setCurrentLocation(location);
    }
  }, [location, isGpsActive]);

  // Clickable GPS toggle: switches between live device GPS / IP and project parcel jurisdiction
  const handleToggleLocation = () => {
    if (isGpsActive || locationSource === 'GPS') {
      // Toggle to project parcel site
      setIsGpsActive(false);
      setLocationSource('Project');
      setCurrentLocation(location || 'Keelathattaparai, Thoothukudi');
    } else {
      // Toggle to detect user device location
      detectLiveLocation(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Dashboard Title & Location / Timestamp Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
            <Sprout size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Land Intelligence Dashboard
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Verify. Compare. Detect. Protect.
            </p>
          </div>
        </div>

        {/* Dynamic Location & Real-Time Clock Capsule Pills (Matching UI mockup) */}
        <div className="flex items-center gap-2.5">
          {/* Location Capsule Pill */}
          <button
            type="button"
            onClick={handleToggleLocation}
            title={
              isGpsActive 
                ? "Live Device GPS Active (Click to switch to Project Registry Jurisdiction)" 
                : "Showing current location (Click to re-scan live device GPS)"
            }
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 hover:border-emerald-400 text-slate-700 shadow-xs hover:shadow-sm transition-all cursor-pointer group select-none"
          >
            <MapPin 
              size={14} 
              className={`text-emerald-600 shrink-0 stroke-[2.2] ${isLocating ? 'animate-bounce' : 'group-hover:scale-110'} transition-transform`} 
            />
            <span className="text-xs font-medium tracking-tight">
              {isLocating ? 'Detecting Location...' : currentLocation}
            </span>
            {isGpsActive ? (
              <span 
                className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" 
                title="Live Device GPS Active" 
              />
            ) : locationSource === 'IP' ? (
              <span 
                className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-0.5" 
                title="Network Location Active" 
              />
            ) : null}
          </button>

          {/* Real-time Live Clock Capsule Pill */}
          <div 
            title="Real-Time Live Clock (Auto-synchronized)" 
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-slate-700 shadow-xs select-none"
          >
            <Calendar size={14} className="text-slate-500 shrink-0 stroke-[2]" />
            <span className="font-mono text-xs font-medium tabular-nums tracking-tight">
              {currentDateTime || 'Loading Time...'}
            </span>
            <span 
              className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping ml-0.5" 
              title="Live Clock Ticking" 
            />
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Total Land Records */}
        <div className="dash-card p-4 flex items-center gap-3.5 transition-all duration-300 hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <FileText size={22} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Land Records</div>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{totalRecords}</div>
          </div>
        </div>

        {/* Card 2: Matched Records */}
        <div className="dash-card p-4 flex items-center justify-between transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Matched Records</div>
              <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{matchedRecords}</div>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 font-mono">
            {matchedPct}%
          </span>
        </div>

        {/* Card 3: Discrepancies Found */}
        <div className="dash-card p-4 flex items-center justify-between transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <AlertTriangle size={22} />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Discrepancies Found</div>
              <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{discrepanciesCount}</div>
            </div>
          </div>
          <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 font-mono">
            {discrepanciesPct}%
          </span>
        </div>

        {/* Card 4: High Risk Cases */}
        <div className="dash-card p-4 flex items-center justify-between transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <AlertOctagon size={22} />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">High Risk Cases</div>
              <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{highRiskCount}</div>
            </div>
          </div>
          <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 font-mono">
            {highRiskPct}%
          </span>
        </div>
      </div>
    </div>
  );
}
