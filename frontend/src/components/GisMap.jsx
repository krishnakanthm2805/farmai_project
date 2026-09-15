import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Layers, Compass, Plus, Minus, Crosshair, MapPin } from 'lucide-react';

function MapAutoCentering({ centerCoords }) {
  const map = useMap();
  useEffect(() => {
    if (centerCoords) {
      map.flyTo(centerCoords, 16, { duration: 1.2 });
    }
  }, [centerCoords, map]);
  return null;
}

export default function GisMap({
  cadastralData,
  referenceLayers,
  selectedSurveyNo = '102/3A',
  reconciliationData,
  onSelectParcel
}) {
  const [mapMode, setMapMode] = useState('satellite'); // 'map' | 'satellite' | 'hybrid'

  const tileUrls = {
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    map: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    hybrid: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  };

  // Calculate true polygon centroid for accurate flyTo and center
  let centerPosition = [9.8227, 78.7844];
  if (reconciliationData?.cadastral_parcel?.geometry?.coordinates?.[0]?.[0]) {
    const coords = reconciliationData.cadastral_parcel.geometry.coordinates[0];
    const avgLat = coords.reduce((sum, pt) => sum + pt[1], 0) / coords.length;
    const avgLng = coords.reduce((sum, pt) => sum + pt[0], 0) / coords.length;
    centerPosition = [avgLat, avgLng];
  } else if (cadastralData?.features?.length > 0) {
    const feat = cadastralData.features.find(
      (f) => f.properties.survey_no === selectedSurveyNo || f.properties.survey_no.replace('/', '-') === selectedSurveyNo.replace('/', '-')
    ) || cadastralData.features[0];
    if (feat?.geometry?.coordinates?.[0]?.[0]) {
      const coords = feat.geometry.coordinates[0];
      const avgLat = coords.reduce((sum, pt) => sum + pt[1], 0) / coords.length;
      const avgLng = coords.reduce((sum, pt) => sum + pt[0], 0) / coords.length;
      centerPosition = [avgLat, avgLng];
    }
  }

  const currentTaluk = reconciliationData?.cadastral_parcel?.taluk || 'R.S. Mangalam';
  const currentDistrict = reconciliationData?.cadastral_parcel?.district || 'Ramanathapuram';
  const currentVillage = reconciliationData?.cadastral_parcel?.village || 'Rajasingamangalam';

  // Landmarks around the active center
  const landmarks = [
    {
      id: 'lm-taluk',
      name: `${currentTaluk} Taluk & SRO Office`,
      lat: centerPosition[0] + 0.0018,
      lng: centerPosition[1] + 0.0015,
      type: 'GOVERNMENT',
      icon: '🏛️'
    },
    {
      id: 'lm-water',
      name: `${currentVillage} Kanmoi / Water Reservoir`,
      lat: centerPosition[0] + 0.0022,
      lng: centerPosition[1] - 0.0012,
      type: 'WATERBODY',
      icon: '🌊'
    },
    {
      id: 'lm-junction',
      name: `${currentVillage} Panchayat Road Junction`,
      lat: centerPosition[0] - 0.0012,
      lng: centerPosition[1] + 0.0010,
      type: 'ROAD',
      icon: '🛣️'
    }
  ];

  // Selected Parcel Yellow Highlight Style
  const getParcelStyle = (feature) => {
    const sNo = feature.properties.survey_no;
    const isSelected = sNo === selectedSurveyNo || sNo.replace('/', '-') === selectedSurveyNo.replace('/', '-');

    if (isSelected) {
      return {
        color: '#EAB308', // Bright Golden Yellow
        weight: 4,
        opacity: 1,
        fillColor: '#FACC15',
        fillOpacity: 0.4,
        dashArray: null
      };
    }

    return {
      color: '#38BDF8',
      weight: 1.5,
      opacity: 0.75,
      fillColor: '#0284C7',
      fillOpacity: 0.15
    };
  };

  const waterbodyStyle = {
    color: '#3B82F6',
    weight: 2,
    opacity: 0.9,
    fillColor: '#2563EB',
    fillOpacity: 0.4
  };

  const roadStyle = {
    color: '#F97316',
    weight: 6,
    opacity: 0.75
  };

  const encroachmentStyle = {
    color: '#EF4444',
    weight: 2,
    opacity: 1,
    fillColor: '#DC2626',
    fillOpacity: 0.65
  };

  const encroachmentGeojsonList = reconciliationData?.discrepancies?.encroachments?.encroachment_polygons_geojson || [];

  return (
    <div className="dash-card overflow-hidden flex flex-col h-full relative">
      {/* Top Map Switcher & District Locator Header */}
      <div className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <button
              onClick={() => setMapMode('map')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                mapMode === 'map'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Map View
            </button>
            <button
              onClick={() => setMapMode('satellite')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                mapMode === 'satellite'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapMode('hybrid')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                mapMode === 'hybrid'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hybrid
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
            <MapPin size={12} className="text-emerald-600" />
            <span>{currentVillage}, {currentTaluk} ({currentDistrict})</span>
          </div>
        </div>

        {/* North Compass Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold shadow-sm">
          <Compass size={14} className="text-rose-500 animate-pulse" />
          <span>N</span>
        </div>
      </div>

      {/* Main Leaflet Map View */}
      <div className="flex-1 relative min-h-[420px]">
        <MapContainer
          center={centerPosition}
          zoom={16}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', minHeight: '420px' }}
        >
          <MapAutoCentering centerCoords={centerPosition} />

          <TileLayer
            attribution="&copy; Esri &mdash; FarmAI GeoLand"
            url={tileUrls[mapMode]}
          />

          {/* Cadastral Parcels */}
          {cadastralData && (
            <GeoJSON
              key={`cadastral-${selectedSurveyNo}-${mapMode}-${centerPosition[0]}`}
              data={cadastralData}
              style={getParcelStyle}
              onEachFeature={(feature, layer) => {
                const p = feature.properties;
                layer.bindPopup(`
                  <div class="p-2 text-slate-800 text-xs font-sans">
                    <div class="font-bold text-sm text-emerald-800">Survey #${p.survey_no}</div>
                    <div class="text-slate-600 mt-1"><strong>Owner:</strong> ${p.registered_owner}</div>
                    <div class="text-slate-600"><strong>Village:</strong> ${p.village}, ${p.taluk}</div>
                    <div class="text-slate-600"><strong>Area:</strong> ${p.gis_area_acres} Acres (${p.gis_area_sqm} m²)</div>
                    <div class="text-slate-600"><strong>Classification:</strong> ${p.land_classification}</div>
                  </div>
                `);
                layer.on('click', () => {
                  if (onSelectParcel) onSelectParcel(p.survey_no);
                });
              }}
            />
          )}

          {/* Waterbodies & Buffers */}
          {referenceLayers?.waterbodies && (
            <GeoJSON
              key={`waterbodies-layer-${centerPosition[0]}`}
              data={referenceLayers.waterbodies}
              style={waterbodyStyle}
            />
          )}

          {/* Road Network & Buffers */}
          {referenceLayers?.roads && (
            <GeoJSON
              key={`roads-layer-${centerPosition[0]}`}
              data={referenceLayers.roads}
              style={roadStyle}
            />
          )}

          {/* Encroachments */}
          {encroachmentGeojsonList.map((feat, idx) => (
            <GeoJSON
              key={`encroachment-${idx}`}
              data={feat}
              style={encroachmentStyle}
            />
          ))}

          {/* Landmark Pins */}
          {landmarks.map((lm) => (
            <CircleMarker
              key={lm.id}
              center={[lm.lat, lm.lng]}
              radius={6}
              pathOptions={{
                color: '#FFFFFF',
                weight: 2,
                fillColor: lm.type === 'WATERBODY' ? '#2563EB' : lm.type === 'GOVERNMENT' ? '#10B981' : '#F59E0B',
                fillOpacity: 0.9
              }}
            >
              <Popup>
                <div className="p-1.5 text-xs font-sans">
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <span>{lm.icon}</span> {lm.name}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{currentVillage}, {currentTaluk}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Selected Parcel Badge Tag floating in map center */}
        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 z-[400] bg-slate-900/90 text-white border border-yellow-400/80 px-4 py-2 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-3 pointer-events-none">
          <div className="w-6 h-6 rounded-full bg-yellow-400 text-slate-900 font-bold flex items-center justify-center text-xs shrink-0 shadow">
            📍
          </div>
          <div>
            <div className="text-xs font-extrabold text-yellow-300 flex items-center gap-1.5">
              <span>S.No: {selectedSurveyNo}</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/40">
                {currentTaluk}
              </span>
            </div>
            <div className="text-[10px] text-slate-300 font-mono flex items-center gap-2">
              <span>Area: {reconciliationData?.document_claimed?.area_acres || 0.83} Ac</span>
              <span>•</span>
              <span className="text-slate-400 truncate max-w-[140px]">
                {reconciliationData?.cadastral_parcel?.registered_owner || 'முஸ்தபா (Mustafa)'}
              </span>
            </div>
          </div>
        </div>

        {/* Floating Callout Tags */}
        <div className="absolute top-10 right-28 z-[400] bg-rose-600/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md pointer-events-none border border-rose-400 flex items-center gap-1">
          <span>🌊</span> Water Body Buffer Zone (30m)
        </div>

        <div className="absolute bottom-28 right-24 z-[400] bg-amber-600/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md pointer-events-none border border-amber-400 flex items-center gap-1">
          <span>🛣️</span> Road RoW Buffer (10m)
        </div>

        {/* Map Legend Overlay (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-[400] bg-slate-900/90 text-slate-200 p-3 rounded-xl border border-slate-700/80 shadow-xl backdrop-blur-md text-[10px] space-y-1.5">
          <div className="font-bold text-slate-300 text-[11px] border-b border-slate-700 pb-1 flex items-center justify-between">
            <span>GIS Map Legend</span>
            <span className="text-[9px] text-emerald-400 font-normal">{currentDistrict}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-yellow-400 border border-yellow-300"></span>
            <span>Your Land (#{selectedSurveyNo})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-sky-500/50 border border-sky-400"></span>
            <span>Cadastral Parcels</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-blue-600/60 border border-blue-400"></span>
            <span>Water Body Buffer (30m)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-amber-500/80 border border-amber-400"></span>
            <span>Road Buffer (10m)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white"></span>
            <span>Taluk / SRO Landmarks</span>
          </div>
        </div>

        {/* Mini-map Inset (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-[400] w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-700/90 bg-slate-900 shadow-xl pointer-events-none hidden sm:block">
          <div className="w-full h-full bg-[#18281F] flex items-center justify-center relative">
            <span className="absolute top-1 left-2 text-[9px] font-bold text-slate-400 font-mono">N</span>
            <div className="w-8 h-8 border border-emerald-400/80 bg-emerald-500/20 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
