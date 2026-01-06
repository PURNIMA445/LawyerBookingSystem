// GenderPieChart.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GenderPieChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal(["#ff8c00", "#32cd32", "#ff6347"]);

    const pie = d3.pie().value(d => d.count);
    const arc = d3.arc().outerRadius(radius - 10).innerRadius(0);
    const labelArc = d3.arc().outerRadius(radius - 40).innerRadius(radius - 40);

    svg.attr('width', width).attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const g = svg.select('g').selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    g.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label));

    g.append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .text(d => d.data.label);

  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default GenderPieChart;
