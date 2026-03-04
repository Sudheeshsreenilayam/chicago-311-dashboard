import React, { useState, useRef, useEffect } from 'react';
import { Database, ExternalLink, ChevronDown } from 'lucide-react';

export default function Filter({ srTypes, selectedType, onSelect, wardData }) {
    const [isExportOpen, setIsExportOpen] = useState(false);
    const popoverRef = useRef(null);

    // Close popover if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setIsExportOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-zinc-200 mb-6 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
            <div className="flex-1">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Service Request Type</h3>
                <div className="flex flex-wrap gap-2">
                    {srTypes.map((type) => (
                        <button
                            key={type}
                            onClick={() => onSelect(type)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border cursor-pointer ${selectedType === type
                                ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm ring-1 ring-blue-600'
                                : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-900 shadow-sm'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full xl:w-auto pt-4 xl:pt-0 border-t border-zinc-100 xl:border-t-0 pl-0 xl:pl-6 xl:border-l relative" ref={popoverRef}>
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Access Raw Data</h3>

                <button
                    onClick={() => setIsExportOpen(!isExportOpen)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg text-sm font-semibold transition cursor-pointer shadow-sm w-full xl:w-48"
                >
                    <Database size={16} /> Source Data <ChevronDown size={14} className={`transition-transform duration-200 ${isExportOpen ? 'rotate-180' : ''}`} />
                </button>

                {isExportOpen && (
                    <div className="absolute top-full mt-2 right-0 w-64 bg-white border border-zinc-200 shadow-xl rounded-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="mb-2">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-2">City of Chicago Open Data</span>
                            <div className="mt-2 flex flex-col gap-1">
                                <a
                                    href="https://data.cityofchicago.org/Service-Requests/311-Service-Requests/v6vf-nfxy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-2.5 hover:bg-zinc-50 border border-transparent hover:border-zinc-200 rounded-lg text-sm text-zinc-700 font-semibold transition-all text-left cursor-pointer group"
                                >
                                    <Database size={16} className="text-blue-500" />
                                    <span>311 Service Requests</span>
                                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-zinc-400" />
                                </a>
                                <a
                                    href="https://data.cityofchicago.org/Health-Human-Services/Hardship-Index/hhd4-uf7v"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-2.5 hover:bg-zinc-50 border border-transparent hover:border-zinc-200 rounded-lg text-sm text-zinc-700 font-semibold transition-all text-left cursor-pointer group mt-1"
                                >
                                    <Database size={16} className="text-orange-500" />
                                    <span>Hardship Index</span>
                                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-zinc-400" />
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
