import React, { useState, useEffect } from 'react';
import WardMap from './components/WardMap';
import Leaderboard from './components/Leaderboard';
import Filter from './components/Filter';
import { Activity, Map as MapIcon, BarChart2 } from 'lucide-react';

export default function App() {
  const [geoData, setGeoData] = useState(null);
  const [wardData, setWardData] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [srTypes, setSrTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [geoRes, dataRes, metaRes] = await Promise.all([
          fetch('https://raw.githubusercontent.com/Sudheeshsreenilayam/chicago-311-dashboard/main/dashboard/public/data/ward_boundaries.geojson'),
          fetch('https://raw.githubusercontent.com/Sudheeshsreenilayam/chicago-311-dashboard/main/dashboard/public/data/summary_data.json'),
          fetch('https://raw.githubusercontent.com/Sudheeshsreenilayam/chicago-311-dashboard/main/dashboard/public/data/metadata.json').catch(() => null)
        ]);

        if (!geoRes.ok || !dataRes.ok) {
          throw new Error('Failed to load data files');
        }

        const geoJson = await geoRes.json();
        const summaryData = await dataRes.json();

        if (metaRes && metaRes.ok) {
          try {
            const text = await metaRes.text();
            const metaJson = JSON.parse(text);
            setMetadata(metaJson);
          } catch (e) {
            console.warn("Metadata JSON not available yet", e);
          }
        }

        setGeoData(geoJson);
        setWardData(summaryData);

        // Extract available SR types
        const types = new Set();
        summaryData.forEach(w => {
          Object.keys(w.services).forEach(t => types.add(t));
        });

        const typeArray = Array.from(types).sort();
        setSrTypes(typeArray);
        if (typeArray.length > 0) {
          setSelectedType(typeArray[0]);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#fffee6] via-[#fffacd] to-[#fff0aa] font-sans text-zinc-900 pb-20">
      {/* Header */}
      <header className="bg-zinc-900/95 backdrop-blur-sm shadow-xl border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl border border-white/10 backdrop-blur-md shadow-sm">
                <Activity className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Chicago 311 Accountability</h1>
                <p className="text-zinc-400 text-sm mt-1 flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-yellow-500/80" />
                  Correlating City Services with Neighborhood Hardship
                </p>
              </div>
            </div>

            {/* Metadata Display */}
            {metadata && (
              <div className="bg-black/30 rounded-lg border border-white/10 px-4 py-3 flex flex-col md:items-end gap-1.5 text-xs text-zinc-400 font-medium shadow-inner">
                <div className="flex items-center gap-2 text-yellow-400 font-bold tracking-wide uppercase">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500"></span>
                  </span>
                  Live Data Sync
                </div>
                <div className="text-zinc-300 mt-0.5">
                  <strong className="text-zinc-500 font-semibold mr-1">Updated:</strong>
                  {(() => {
                    if (!metadata.last_updated) return "Unknown";
                    const parseableStr = metadata.last_updated.replace(" at ", " ");
                    const d = new Date(parseableStr);
                    if (isNaN(d)) return metadata.last_updated;
                    return d.toLocaleString(undefined, { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' });
                  })()}
                </div>
                <div><strong className="text-zinc-500 font-semibold mr-1">Timeline:</strong> {metadata.timeline_start} — {metadata.timeline_end}</div>
              </div>
            )}

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-500 font-medium">Loading Civic Data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl font-medium border border-red-200">
            {error} (Did you run the Python data script?)
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-6">

            {/* Context/Intro */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
              <h2 className="text-lg font-bold text-zinc-800 mb-2">Transparency in City Services</h2>
              <p className="text-zinc-600 leading-relaxed max-w-4xl">
                This dashboard tracks the median response times for essential 311 requests across Chicago's 50 wards.
                By comparing service speeds with the <strong>Hardship Index</strong> (a measure of economic disadvantage),
                we can identify potential inequities in how infrastructure is maintained across the city.
              </p>
            </div>

            {/* Filter */}
            {srTypes.length > 0 && (
              <Filter
                srTypes={srTypes}
                selectedType={selectedType}
                onSelect={setSelectedType}
                wardData={wardData}
              />
            )}

            <div className="flex flex-col gap-6">
              {/* Map Row */}
              <div className="w-full rounded-xl">
                <WardMap
                  geoData={geoData}
                  wardData={wardData}
                  selectedType={selectedType}
                />
              </div>

              {/* Leaderboard Row */}
              <div className="w-full">
                <Leaderboard
                  wardData={wardData}
                  selectedType={selectedType}
                />
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
