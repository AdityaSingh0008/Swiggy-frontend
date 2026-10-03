import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import client from '../api/client.js';
import CafeCard from '../components/CafeCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import MapView from '../components/MapView.jsx';

const TAGS = ['wifi', 'study-friendly', 'outdoor-seating', 'rooftop', 'quiet', 'late-night', 'organic'];

const DEFAULT_LOCATION = { lat: 26.9124, lng: 75.7873, label: 'Jaipur (default)' };

const Discover = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [radius, setRadius] = useState(10);
  const [view, setView] = useState('map'); // 'map' | 'list'
  
  // AI Concierge state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  const fetchCafes = useCallback(async (loc) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (loc) {
        params.set('lat', loc.lat);
        params.set('lng', loc.lng);
        params.set('radius', radius);
      }
      if (filterQuery) params.set('q', filterQuery);
      if (activeTag) params.set('tag', activeTag);
      const { data } = await client.get(`/cafes?${params.toString()}`);
      setCafes(data.cafes);
    } catch (err) {
      // fail silently, empty state will show
    } finally {
      setLoading(false);
    }
  }, [filterQuery, activeTag, radius]);

  const locateMe = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      setUserLocation(DEFAULT_LOCATION);
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, label: 'Your location' });
        setLocating(false);
      },
      () => {
        setUserLocation(DEFAULT_LOCATION);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  useEffect(() => {
    locateMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [mapCenter, setMapCenter] = useState(null);
  const [showSearchArea, setShowSearchArea] = useState(false);

  useEffect(() => {
    fetchCafes(userLocation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, filterQuery, activeTag, radius]);

  const handleMapMove = useCallback((newCenter) => {
    setMapCenter(newCenter);
    setShowSearchArea(true);
  }, []);

  const handleSearchArea = () => {
    if (mapCenter) {
      setUserLocation({ ...mapCenter, label: 'Map location' });
      setShowSearchArea(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1.5">Discover cafes near you</h1>
          <p className="text-slate-400 text-sm">
            {userLocation ? `Showing spots within ${radius}km of ${userLocation.label}` : 'Detecting your location…'}
          </p>
        </div>
        <button
          onClick={locateMe}
          disabled={locating}
          className="px-4 py-2.5 rounded-full text-sm font-semibold glass hover:bg-white/10 transition-colors whitespace-nowrap disabled:opacity-50"
        >
          {locating ? 'Locating…' : '📍 Use my location'}
        </button>
      </div>

      {/* AI Concierge Section */}
      <div className="mb-8 p-6 rounded-3xl glass border border-gold-400/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
            <h3 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-emerald-400 mb-2">
              ✨ Ask the AI Concierge
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Describe your vibe. Looking for a quiet place to study? A lively rooftop for dates?
            </p>
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                if (!aiPrompt) return;
                setAiLoading(true);
                try {
                  const res = await client.post('/ai/recommend', {
                    prompt: aiPrompt,
                    lat: userLocation?.lat,
                    lng: userLocation?.lng
                  });
                  setAiResponse(res.data.message);
                  if (res.data.recommendedCafes?.length > 0) {
                    setCafes(res.data.recommendedCafes);
                    // Clear other filters
                    setActiveTag('');
                    setFilterQuery('');
                  }
                } catch (err) {
                  setAiResponse("Sorry, I couldn't connect to the AI brain right now.");
                } finally {
                  setAiLoading(false);
                }
              }}
              className="flex gap-3"
            >
              <input
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="e.g. 'A quiet cozy place with fast wifi for a meeting'"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400/50 transition-colors"
              />
              <button 
                type="submit" 
                disabled={aiLoading}
                className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-400 text-ink-950 hover:shadow-glow transition-all disabled:opacity-50"
              >
                {aiLoading ? 'Thinking...' : 'Recommend'}
              </button>
            </form>
          </div>
          {aiResponse && (
            <div className="flex-1 bg-[#14151a]/80 p-5 rounded-2xl border border-white/5 text-sm leading-relaxed text-slate-300">
              <span className="text-emerald-400 font-bold mb-2 block">Concierge says:</span>
              {aiResponse}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <form 
          className="relative flex-1"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!searchInput) return;
            setLocating(true);
            try {
              // 1. Geocode the query to find the center location to pan to
              const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}&addressdetails=1&accept-language=en`);
              const data = await res.json();
              
              if (data && data.length > 0) {
                const bestMatch = data[0];
                const newLoc = { 
                  lat: Number(bestMatch.lat), 
                  lng: Number(bestMatch.lon), 
                  label: bestMatch.name || bestMatch.display_name.split(',')[0] 
                };
                
                // Pan map
                setUserLocation(newLoc);
                setMapCenter(newLoc);
                setShowSearchArea(false);

                // 2. We pass the EXACT natural language query to the backend as `filterQuery`.
                // The backend is now smart enough to use this string to fetch relevant places from OpenStreetMap
                // and bypass strict local DB name filtering for the newly discovered places!
                setFilterQuery(searchInput);
              } else {
                alert('Location not found. Try another city or cafe.');
              }
            } catch (err) {
              console.error(err);
            } finally {
              setLocating(false);
            }
          }}
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for cafes, restaurants, or cities (e.g. Starbucks, Sohna, Gurugram restaurants)..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-gold-400/50 transition-colors"
          />
          <span className="absolute left-3 top-3 text-slate-400">📍</span>
          <button type="submit" className="absolute right-2 top-2 px-3 py-1 bg-white/10 rounded-lg text-xs font-semibold hover:bg-white/20 transition-colors">
            Search
          </button>
        </form>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 whitespace-nowrap">Radius: {radius}km</label>
          <input
            type="range"
            min="1"
            max="20"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="accent-gold-400 w-28"
          />
        </div>
        <div className="flex rounded-xl overflow-hidden border border-white/10 shrink-0">
          <button
            onClick={() => setView('map')}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors ${view === 'map' ? 'bg-gold-400 text-ink-950' : 'text-slate-400 hover:text-white'}`}
          >
            Map
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors ${view === 'list' ? 'bg-gold-400 text-ink-950' : 'text-slate-400 hover:text-white'}`}
          >
            List
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTag('')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
            activeTag === '' ? 'border-gold-400 bg-gold-400/10 text-gold-400' : 'border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          All
        </button>
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? '' : tag)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors capitalize ${
              activeTag === tag ? 'border-gold-400 bg-gold-400/10 text-gold-400' : 'border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {tag.replace('-', ' ')}
          </button>
        ))}
      </div>

      {view === 'map' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10 relative">
          {showSearchArea && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
              <button
                onClick={handleSearchArea}
                className="px-5 py-2.5 rounded-full bg-emerald-500 text-ink-950 font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform"
              >
                Search this area
              </button>
            </div>
          )}
          <MapView 
            userLocation={userLocation} 
            cafes={cafes} 
            radiusKm={radius} 
            height="520px" 
            onMapMove={handleMapMove}
          />
        </motion.div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : cafes.length === 0 ? (
        <EmptyState
          title="No cafes found nearby"
          subtitle="Try increasing your search radius or clearing filters."
          icon="🗺️"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cafes.map((cafe, i) => <CafeCard key={cafe._id} cafe={cafe} index={i} />)}
        </div>
      )}
    </div>
  );
};

export default Discover;
