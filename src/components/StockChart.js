import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types'; // Optional: For prop type validation

function StockChart({ ticker, notes, selectedNote, setSelectedNote, chartData }) {
  const [data, setData] = useState([]);
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  // Helper function to extract data from JSON
  const extractDataFromJSON = (jsonData) => {
    if (
      !jsonData.chart ||
      !jsonData.chart.result ||
      !Array.isArray(jsonData.chart.result) ||
      jsonData.chart.result.length === 0
    ) {
      console.error('Invalid JSON structure:', jsonData);
      return [];
    }

    const result = jsonData.chart.result[0];
    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close;

    if (!timestamps || !closes || timestamps.length !== closes.length) {
      console.error('Timestamps and closing prices are mismatched:', { timestamps, closes });
      return [];
    }

    return timestamps.map((ts, idx) => ({
      date: new Date(ts * 1000), // Convert UNIX timestamp to JavaScript Date object
      price: closes[idx],
    })).filter(d => d.date && d.price != null);
  };

  // Helper function to find the nearest data point
  const getNearestDataPoint = (date, data) => {
    // Ensure data is sorted by date in ascending order
    const sortedData = data.slice().sort((a, b) => a.date - b.date);

    // Use d3.bisector to find the insertion point
    const bisect = d3.bisector(d => d.date).left;
    const index = bisect(sortedData, date);

    if (index === 0) {
      return sortedData[0];
    } else if (index >= sortedData.length) {
      return sortedData[sortedData.length - 1];
    } else {
      const d0 = sortedData[index - 1];
      const d1 = sortedData[index];
      // Choose the closest date on or before the note date
      return date - d0.date > d1.date - date ? d1 : d0;
    }
  };

  useEffect(() => {
    if (!chartData) return;

    // Ensure chartData is an object
    if (typeof chartData !== 'object') {
      console.error('chartData is not a JSON object:', chartData);
      return;
    }

    const parsedData = extractDataFromJSON(chartData);
    setData(parsedData);
  }, [chartData]);

  useEffect(() => {
    if (data.length === 0) return;

    const drawChart = () => {
      const container = containerRef.current;
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove(); // Clear previous chart

      const aspectRatio = 16 / 9;
      const containerWidth = container.clientWidth;
      const containerHeight = containerWidth / aspectRatio;

      svg.attr('width', containerWidth)
         .attr('height', containerHeight);

      const margin = { top: 20, right: 30, bottom: 30, left: 40 };
      const width = containerWidth - margin.left - margin.right;
      const height = containerHeight - margin.top - margin.bottom;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const xDomain = d3.extent(data, d => d.date);
      if (xDomain[1] < today) {
        xDomain[1] = today;
      }

      const x = d3.scaleTime()
        .domain(xDomain)
        .range([margin.left, width - margin.right]);

      const minPrice = d3.min(data, d => d.price);
      const maxPrice = d3.max(data, d => d.price);
      const yDomainMin = Math.max(0, minPrice - (maxPrice - minPrice) * 0.1);
      const yDomainMax = maxPrice + (maxPrice - minPrice) * 0.1;

      const y = d3.scaleLinear()
        .domain([yDomainMin, yDomainMax])
        .nice()
        .range([height - margin.bottom, margin.top]);

      const line = d3.line()
        .defined(d => !isNaN(d.price))
        .x(d => x(d.date))
        .y(d => y(d.price));

      // Add X Axis
      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

      // Add Y Axis
      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

      // Add Line Path
      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', line);

      const latestDataPoint = data[data.length - 1];

      // Add Hover Functionality
      const focus = svg.append('g')
        .attr('class', 'focus')
        .style('display', 'none');

      focus.append('circle')
        .attr('r', 5)
        .attr('fill', 'steelblue');

      focus.append('rect')
        .attr('class', 'tooltip')
        .attr('width', 105)
        .attr('height', 52)
        .attr('x', 10)
        .attr('y', -22)
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('fill', 'white')
        .attr('stroke', 'steelblue');

      focus.append('text')
        .attr('class', 'tooltip-date')
        .attr('x', 18)
        .attr('y', 0);

      focus.append('text')
        .attr('class', 'tooltip-price')
        .attr('x', 18)
        .attr('y', 20);

      svg.append('rect')
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height)
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .on('mouseover', () => focus.style('display', null))
        .on('mouseout', () => focus.style('display', 'none'))
        .on('mousemove', mousemove)
        .on('click', () => setSelectedNote(null));

      const bisectDate = d3.bisector(d => d.date).left;

      function mousemove(event) {
        const [mouseX] = d3.pointer(event);
        const x0 = x.invert(mouseX);
        const i = bisectDate(data, x0, 1);
        if (i >= data.length) return;
        const d0 = data[i - 1];
        const d1 = data[i];
        if (!d0 || !d1) return;
        const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        focus.attr('transform', `translate(${x(d.date)},${y(d.price)})`);
        focus.select('.tooltip-date').text(`${d3.timeFormat('%Y-%m-%d')(d.date)}`);
        focus.select('.tooltip-price').text(`${d.price.toFixed(2)}`);
      }

      // Plotting Notes
      notes.forEach(note => {
        const dateString = note.noteDate.split('T')[0];
        const noteDate = d3.timeParse("%Y-%m-%d")(dateString);
        if (!noteDate) {
          console.error('Failed to parse note date:', note.noteDate);
          return;
        }

        // Find the nearest data point on or before the note date
        const noteData = getNearestDataPoint(noteDate, data) || latestDataPoint;

        // Check if noteData exists
        if (!noteData) {
          console.error('No data point found for note:', note);
          return;
        }

        const isSelected = selectedNote && selectedNote.id === note.id;
        let fillColor = 'gray';
        if (note.transactionType === 'buy') fillColor = 'rgb(34, 197, 94)';
        if (note.transactionType === 'sell') fillColor = 'rgb(239, 68, 68)';

        const group = svg.append('g')
          .attr('transform', `translate(${x(noteData.date)},${y(noteData.price)})`)
          .on('click', (event) => {
            event.stopPropagation();
            setSelectedNote(note);
          })
          .style('cursor', 'pointer');

        group.append('circle')
          .attr('r', isSelected ? 18 : 10)
          .attr('fill', fillColor)
          .attr('stroke', isSelected ? 'white' : 'none')
          .attr('stroke-width', isSelected ? 2 : 0);

        group.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '.3em')
          .attr('fill', 'white')
          .style('font-size', isSelected ? '18px' : '10px')
          .style('pointer-events', 'none')
          .text(note.transactionType ? note.quantity : '0');

        let tooltipContent = `Note: ${note.content}`;
        if (note.transactionType) {
          const price = parseFloat(note.price);
          const quantity = parseInt(note.quantity);
          if (!isNaN(price) && !isNaN(quantity)) {
            const totalValue = price * quantity;
            tooltipContent += `\n${note.transactionType === 'buy' ? 'Bought' : 'Sold'}: ${totalValue.toFixed(2)}`;
            tooltipContent += `\nQuantity: ${quantity}`;
            tooltipContent += `\nQuote: ${price.toFixed(2)}`;
          } else {
            tooltipContent += `\n${note.transactionType === 'buy' ? 'Bought' : 'Sold'}`;
            tooltipContent += `\nQuantity: ${note.quantity}`;
            tooltipContent += `\nQuote: ${note.price}`;
          }
        }

        group.append('title')
          .text(tooltipContent);
      });
    };

    drawChart();

    const resizeObserver = new ResizeObserver(() => {
      drawChart();
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [data, notes, selectedNote, setSelectedNote]);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{ticker} Stock Chart</h2>
        <div className="w-full" ref={containerRef}>
          <svg ref={svgRef} style={{ width: '100%', height: 'auto' }}></svg>
        </div>
      </div>
    </div>
  );
}

StockChart.propTypes = {
  ticker: PropTypes.string.isRequired,
  notes: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedNote: PropTypes.object,
  setSelectedNote: PropTypes.func.isRequired,
  chartData: PropTypes.object.isRequired,
};

export default StockChart;
