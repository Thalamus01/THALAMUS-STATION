import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface BiorhythmZone {
  hour: number;
  status: 'OPTIMAL' | 'RISK' | 'DANGER';
  score: number;
}

interface CircularClockProps {
  zones: BiorhythmZone[];
  currentHour: number;
  currentMinute: number;
}

export const CircularClock: React.FC<CircularClockProps> = ({ zones, currentHour, currentMinute }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.6;
    const outerRadius = radius * 0.9;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .html(''); // Clear previous

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Pie generator for 24 hours
    const pie = d3.pie<BiorhythmZone>()
      .value(1)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<BiorhythmZone>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .padAngle(0.02)
      .cornerRadius(4);

    // Color mapping
    const colorMap = {
      OPTIMAL: '#10b981', // emerald-500
      RISK: '#f59e0b',    // amber-500
      DANGER: '#ef4444'   // red-500
    };

    // Draw zones
    g.selectAll('.zone')
      .data(pie(zones))
      .enter()
      .append('path')
      .attr('class', 'zone')
      .attr('d', arc)
      .attr('fill', d => colorMap[d.data.status])
      .attr('opacity', 0.2)
      .on('mouseover', function() {
        d3.select(this).transition().duration(200).attr('opacity', 0.6);
      })
      .on('mouseout', function() {
        d3.select(this).transition().duration(200).attr('opacity', 0.2);
      });

    // Add hour labels
    const labelRadius = outerRadius + 20;
    g.selectAll('.hour-label')
      .data(zones.filter((_, i) => i % 3 === 0))
      .enter()
      .append('text')
      .attr('class', 'hour-label')
      .attr('transform', (d: BiorhythmZone) => {
        const angle = (d.hour * 15 - 90) * (Math.PI / 180);
        return `translate(${labelRadius * Math.cos(angle)}, ${labelRadius * Math.sin(angle)})`;
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#64748b')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .text((d: BiorhythmZone) => `${d.hour}h`);

    // Current time hand
    const handAngle = (currentHour * 15 + currentMinute * 0.25 - 90) * (Math.PI / 180);
    const handX = (outerRadius + 10) * Math.cos(handAngle);
    const handY = (outerRadius + 10) * Math.sin(handAngle);

    // Hand line
    g.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', handX)
      .attr('y2', handY)
      .attr('stroke', '#06b6d4')
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('filter', 'drop-shadow(0 0 5px rgba(6,182,212,0.5))');

    // Center point
    g.append('circle')
      .attr('r', 8)
      .attr('fill', '#0B0E11')
      .attr('stroke', '#06b6d4')
      .attr('stroke-width', 2);

    // Inner circle with capital cognitive display
    const innerG = g.append('g');
    innerG.append('circle')
      .attr('r', innerRadius - 10)
      .attr('fill', 'rgba(255,255,255,0.02)')
      .attr('stroke', 'rgba(255,255,255,0.05)');

  }, [zones, currentHour, currentMinute]);

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
