// StepsChart.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const StepsChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 300;

    svg.attr('width', width).attr('height', height);

    // X and Y Scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.day))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.steps)])
      .range([height, 0]);

    // Bars
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.day))
      .attr('y', d => yScale(d.steps))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d.steps))
      .attr('fill', 'steelblue');

    // X Axis
    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    // Y Axis
    svg.append('g').call(d3.axisLeft(yScale));

  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default StepsChart;
