import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

function StockChart({ ticker, notes, selectedNote, setSelectedNote }) {
  const [data, setData] = useState([]);
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/yahoo-stock-data', {
          params: {
            symbol: ticker,
            period1: Math.floor(new Date('2022-01-01').getTime() / 1000),
            period2: Math.floor(new Date().getTime() / 1000),
            interval: '1d'
          }
        });

        const parsedData = d3.csvParse(response.data);
        parsedData.forEach(d => {
          d.date = d3.timeParse("%Y-%m-%d")(d.Date);
          d.price = +d['Close'];
        });
        setData(parsedData);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchStockData();
  }, [ticker]);

  useEffect(() => {
    if (data.length === 0) return;

    const drawChart = () => {
      const container = containerRef.current;
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

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

      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', line);

      const latestDataPoint = data[data.length - 1];

      // Add hover functionality
      const focus = svg.append('g')
        .attr('class', 'focus')
        .style('display', 'none');

      focus.append('circle')
        .attr('r', 5)
        .attr('fill', 'steelblue');

      focus.append('rect')
        .attr('class', 'tooltip')
        //.attr('width', 150)  // Increased width
        .attr('width', 105)  // Increased width
        .attr('height', 52)  // Increased height
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
        const x0 = x.invert(d3.pointer(event)[0]);
        const i = bisectDate(data, x0, 1);
        if (i >= data.length) return; // Exit if we're beyond the data range
        const d0 = data[i - 1];
        const d1 = data[i];
        if (!d0 || !d1) return; // Exit if we don't have valid data points
        const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        focus.attr('transform', `translate(${x(d.date)},${y(d.price)})`);
        //focus.select('.tooltip-date').text(`Date: ${d3.timeFormat('%Y-%m-%d')(d.date)}`);
        //focus.select('.tooltip-price').text(`Price: $${d.price.toFixed(2)}`);
        focus.select('.tooltip-date').text(`${d3.timeFormat('%Y-%m-%d')(d.date)}`);
        focus.select('.tooltip-price').text(`$${d.price.toFixed(2)}`);
      }

      notes.forEach(note => {
        const dateString = note.noteDate.split('T')[0];
        const noteDate = d3.timeParse("%Y-%m-%d")(dateString);
        if (!noteDate) {
          console.error('Failed to parse note date:', note.noteDate);
          return;
        }

        let noteData = data.find(d => d.date && d.date.getTime() === noteDate.getTime());
        
        // If noteData is not found (e.g., for today's notes), use the latest data point
        if (!noteData) {
          noteData = {...latestDataPoint, date: noteDate};
        }

        const isSelected = selectedNote && selectedNote.id === note.id;
        let fillColor = 'gray';  // Default color for notes without transactions
        if (note.transactionType === 'buy') fillColor = 'rgb(34, 197, 94)';  // green-500
        if (note.transactionType === 'sell') fillColor = 'rgb(239, 68, 68)';  // red-500

        const group = svg.append('g')
          .attr('transform', `translate(${x(noteDate)},${y(noteData.price)})`)
          .on('click', (event) => {
            event.stopPropagation();
            setSelectedNote(note);
          })
          .style('cursor', 'pointer');

        // Circle
        group.append('circle')
          .attr('r', isSelected ? 18 : 10)
          .attr('fill', fillColor)
          .attr('stroke', isSelected ? 'white' : 'none')
          .attr('stroke-width', isSelected ? 2 : 0);

        // Text (quantity)
        group.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.3em')
        .attr('fill', 'white')
        .style('font-size', isSelected ? '18px' : '10px')
        .style('pointer-events', 'none')
        .text(note.transactionType ? note.quantity : '0');

        // Tooltip
        let tooltipContent = `Note: ${note.content}`;
        if (note.transactionType) {
          const price = parseFloat(note.price);
          const quantity = parseInt(note.quantity);
          if (!isNaN(price) && !isNaN(quantity)) {
            const totalValue = price * quantity;
            tooltipContent += `\n${note.transactionType === 'buy' ? 'Bought' : 'Sold'}: $${totalValue.toFixed(2)}`;
            tooltipContent += `\nQuantity: ${quantity}`;
            tooltipContent += `\nQuote: $${price.toFixed(2)}`;
          } else {
            tooltipContent += `\n${note.transactionType === 'buy' ? 'Bought' : 'Sold'}`;
            tooltipContent += `\nQuantity: ${note.quantity}`;
            tooltipContent += `\nQuote: $${note.price}`;
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

export default StockChart;