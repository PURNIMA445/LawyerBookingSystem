// StepsLineChart.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const StepsLineChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 400;

    svg.attr('width', width).attr('height', height);

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.day)))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.steps)])
      .range([height, 0]);

    const line = d3.line()
      .x(d => xScale(new Date(d.day)))
      .y(d => yScale(d.steps));

    svg.append('path')
      .data([data])
      .attr('class', 'line')
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2);

    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    svg.append('g').call(d3.axisLeft(yScale));

  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default StepsLineChart;
