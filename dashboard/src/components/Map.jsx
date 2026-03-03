import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

export default function Map({ geoData, wardData, selectedType }) {
    const svgRef = useRef();
    const wrapperRef = useRef();
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            if (!geoData || !wardData || !selectedType) return;
            if (!wrapperRef.current || !svgRef.current) return;

            const timeByWard = new Map();
            const hardshipByWard = new Map();
            let maxTime = 0;

            wardData.forEach((ward) => {
                if (!ward.services) return;
                const time = ward.services[selectedType];
                if (time !== undefined) {
                    timeByWard.set(ward.ward, time);
                    hardshipByWard.set(ward.ward, ward.hardship_index);
                    if (time > maxTime) maxTime = time;
                }
            });

            const { width, height } = wrapperRef.current.getBoundingClientRect();
            const w = Math.max(width, 200);
            const h = Math.max(height, 200);
            const margin = 20;

            const svg = d3.select(svgRef.current);
            svg.selectAll("*").remove();

            const projection = d3.geoMercator().fitSize([w - margin * 2, h - margin * 2], geoData);
            const pathGenerator = d3.geoPath().projection(projection);

            const colorScale = d3.scaleSequential(d3.interpolateYlOrRd).domain([0, maxTime || 1]);

            const g = svg.append("g").attr("transform", `translate(${margin}, ${margin})`);

            let tooltip = d3.select("#map-tooltip");
            if (tooltip.empty()) {
                tooltip = d3.select("body").append("div")
                    .attr("id", "map-tooltip")
                    .attr("class", "absolute hidden bg-zinc-900 text-white p-3 rounded-lg text-sm shadow-xl z-50 pointer-events-none")
                    .style("opacity", 0);
            }

            const features = geoData.features || [];

            g.selectAll("path")
                .data(features)
                .enter()
                .append("path")
                .attr("d", pathGenerator)
                .attr("fill", (d) => {
                    const wardNum = d.properties?.ward;
                    const time = timeByWard.get(wardNum);
                    return time !== undefined ? colorScale(time) : "#f4f4f5";
                })
                .attr("stroke", "#e4e4e7")
                .attr("stroke-width", 1)
                .attr("class", "transition-colors duration-200 cursor-pointer")
                .on("mouseover", function (event, d) {
                    d3.select(this).attr("stroke", "#18181b").attr("stroke-width", 2);

                    const wardNum = d.properties?.ward;
                    const time = timeByWard.get(wardNum);
                    const hardship = hardshipByWard.get(wardNum);

                    tooltip.transition().duration(200).style("opacity", 1);
                    tooltip.html(`
            <div class="font-bold mb-1">Ward ${wardNum || 'Unknown'}</div>
            <div class="flex justify-between gap-4">
              <span class="text-zinc-400">Response:</span> 
              <span>${time !== undefined ? time.toFixed(1) + ' hrs' : 'N/A'}</span>
            </div>
            <div class="flex justify-between gap-4">
              <span class="text-zinc-400">Hardship:</span> 
              <span>${hardship !== undefined ? hardship.toFixed(0) : 'N/A'}</span>
            </div>
          `)
                        .style("left", (event.pageX + 15) + "px")
                        .style("top", (event.pageY - 28) + "px")
                        .classed("hidden", false);
                })
                .on("mouseout", function () {
                    d3.select(this).attr("stroke", "#e4e4e7").attr("stroke-width", 1);
                    tooltip.transition().duration(500).style("opacity", 0).on('end', () => tooltip.classed('hidden', true));
                });

        } catch (err) {
            console.error("Map D3 Error:", err);
            setError(err.message);
        }
    }, [geoData, wardData, selectedType]);

    if (error) {
        return <div className="p-4 text-red-600 bg-red-50 rounded-xl border border-red-200">Map Rendering Error: {error}</div>;
    }

    return (
        <div ref={wrapperRef} className="w-full h-[600px] bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-2 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-600 shadow-sm">
                Chicago Wards
            </div>
            <svg ref={svgRef} className="w-full h-full" />
        </div>
    );
}
