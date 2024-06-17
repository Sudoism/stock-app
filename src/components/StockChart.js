import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

function StockChart({ ticker, notes, setSelectedNote, selectedNote }) {
  const [data, setData] = useState([]);

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
          d.price = +d['Adj Close'];
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

    const svg = d3.select('#chart')
      .attr('width', 800)
      .attr('height', 400);

    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([d3.min(data, d => d.price) - 50, d3.max(data, d => d.price) + 50])
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

    // Add circles for notes
    notes.forEach(note => {
      const dateString = note.noteDate.split('T')[0];
      const noteDate = d3.timeParse("%Y-%m-%d")(dateString);
      if (!noteDate) {
        console.error('Failed to parse note date:', note.noteDate);
        return;
      }
      const noteData = data.find(d => d.date && d.date.getTime() === noteDate.getTime());
      if (!noteData) {
        console.warn('No matching data point found for note date:', note.noteDate);
        return;
      }
      svg.append('circle')
        .attr('cx', x(noteData.date))
        .attr('cy', y(noteData.price))
        .attr('r', 5)
        .attr('fill', selectedNote && selectedNote.id === note.id ? 'red' : 'blue')
        .on('click', (event) => {
          event.stopPropagation();
          setSelectedNote(note);
        })
        .append('title')
        .text(note.content);
    });

    svg.on('click', () => setSelectedNote(null));
  }, [data, notes, selectedNote, setSelectedNote]);

  return (
    <div className="w-2/3 p-4">
      <svg id="chart"></svg>
    </div>
  );
}

export default StockChart;
