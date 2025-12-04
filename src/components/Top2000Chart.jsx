import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const interestingSongs = [1989, 363, 270, 144, 232];
const davidBowieSongs = [7, 38, 87, 162, 182, 230, 270, 310, 379, 462, 472, 491, 523, 540, 576, 586, 612, 616, 778, 856, 961, 1144, 1203, 1632, 1736, 1875];
const princeSongs = [13, 207, 254, 354, 404, 585, 640, 702, 721, 937, 1268, 1365, 1378, 1409, 1658, 1761, 1771];

const Top2000Chart = ({ isMobile, activeStep, songs, searchQuery = '', selectedDecade = 'all' }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const container = d3.select(chartRef.current);
    container.selectAll('*').remove();

    if (isMobile || !songs || songs.length === 0) {
      return undefined;
    }

    const margin = { top: 120, right: 150, bottom: 0, left: -350 };
    const widthOriginal = 2150 - 100 - 150;
    const width = 1700 - margin.left - margin.right;
    const height = 620 - margin.top - margin.bottom;

    const svgWidth = width + margin.left + margin.right;
    const svgHeight = height + margin.top + margin.bottom;

    const svgRoot = container
      .append('svg')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('width', '100%')
      .style('height', 'auto')
      .style('display', 'block');

    const svg = svgRoot
      .append('g')
      .attr('class', 'top-wrapper')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const yearScale = d3.scaleLinear().domain([1939, 2016]).range([0, widthOriginal]);

    const rScale = d3
      .scaleSqrt()
      .domain([1, 10, 25, 50, 100, 250, 500, 1000, 2000])
      .range([25, 21, 17, 13, 10, 7, 5, 3, 2]);

    const colorScale = d3
      .scaleLinear()
      .domain([1, 6, 12, 18, 25, 32, 40])
      .range(['#000000', '#262626', '#474747', '#636363', '#7D7D7D', '#949494', '#ABABAB']);

    const data = [...songs];

    const decades = [1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
    decades.forEach((decade) => {
      data.push({
        rank: 0,
        releaseYear: decade,
        type: 'decade',
        x: yearScale(decade),
        y: height / 2,
      });
    });

      svg
        .append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0,${height / 2})`)
        .call(d3.axisBottom(yearScale).ticks(10, '.0f'));

      svg.selectAll('.axis text').attr('dy', '-0.25em');

      const songWrapper = svg.append('g').attr('class', 'song-wrapper');

      const song = songWrapper
        .selectAll('.song-group')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'song-group')
        .attr('transform', (d) => `translate(${d.x},${d.y})`)
        .style('opacity', 1) // Set initial opacity to 1
        .on('mouseover', (event, d) => {
          const tooltipSong = document.getElementById('tooltipSong');
          const tooltipArtist = document.getElementById('tooltipArtist');
          const tooltipRank = document.getElementById('tooltipRank');
          const tooltipTop40 = document.getElementById('tooltipTop40');
          const tooltipBackground = d3.select('#tooltipBackground');
          const tooltipWrapper = d3.select('#tooltipWrapper');

          tooltipSong.textContent = d.title;
          tooltipArtist.textContent = `${d.artist} | ${d.releaseYear}`;
          tooltipRank.textContent = `Position in Top 2000: ${d.rank}`;
          if (d.listHighestRank > 0 && d.listType !== 'tip') {
            tooltipTop40.textContent = `Highest position in weekly Top 40: ${d.listHighestRank}`;
          } else {
            tooltipTop40.textContent = 'Never appeared in the Top 40';
          }

          const maxSize = Math.max(
            tooltipSong.getComputedTextLength(),
            tooltipArtist.getComputedTextLength(),
            tooltipRank.getComputedTextLength(),
            tooltipTop40.getComputedTextLength(),
          );

          tooltipBackground
            .transition()
            .duration(100)
            .attr('x', -0.5 * maxSize * 1.2)
            .attr('width', maxSize * 1.2);

          tooltipWrapper
            .transition()
            .duration(200)
            .attr('transform', `translate(${d.x},${d.y + 40})`)
            .style('opacity', 1);
        })
        .on('mouseout', () => {
          d3.select('#tooltipWrapper').transition().duration(200).style('opacity', 0);
        });

      song
        .filter(
          (d) =>
            d.artist === 'The Beatles' ||
            davidBowieSongs.indexOf(d.rank) > -1 ||
            princeSongs.indexOf(d.rank) > -1 ||
            interestingSongs.indexOf(d.rank) > -1,
        )
        .append('circle')
        .attr('class', 'song-background')
        .attr('r', (d) => {
          const base = rScale(d.rank);
          if (d.artist === 'The Beatles' || davidBowieSongs.indexOf(d.rank) > -1 || princeSongs.indexOf(d.rank) > -1) {
            return base + 3;
          }
          if (interestingSongs.indexOf(d.rank) > -1) {
            return base + 4;
          }
          return base;
        })
        .style('opacity', 1) // Set initial opacity to 1
        .style('fill', (d) => {
          if (d.artist === 'The Beatles') return '#46a1ef';
          if (interestingSongs.indexOf(d.rank) > -1) return '#CB272E';
          if (davidBowieSongs.indexOf(d.rank) > -1) return '#f1aa11';
          if (princeSongs.indexOf(d.rank) > -1) return '#C287FF';
          return 'none';
        });

      song
        .append('circle')
        .attr('class', 'song')
        .attr('r', (d) => rScale(d.rank))
        .style('opacity', 1) // Ensure initial visibility
        .style('fill', (d) => {
          if (d.type === 'decade') return 'none';
          if (d.listHighestRank === 0 || d.listType === 'tip') return '#e0e0e0';
          return colorScale(d.listHighestRank);
        });

      song
        .filter((d) => d.rank > 0 && d.rank <= 10)
        .append('circle')
        .attr('r', (d) => rScale(d.rank) * 0.35)
        .style('opacity', 1)
        .style('fill', '#CB272E');

      song
        .filter((d) => d.rank > 0 && d.rank <= 10)
        .append('circle')
        .attr('r', (d) => rScale(d.rank) * 0.065)
        .style('opacity', 1)
        .style('fill', '#ffffff');

      const tooltipWrapper = svg
        .append('g')
        .attr('id', 'tooltipWrapper')
        .attr('class', 'tooltip-wrapper')
        .style('opacity', 0);

      tooltipWrapper
        .append('rect')
        .attr('id', 'tooltipBackground')
        .attr('class', 'tooltip-background')
        .attr('x', 0)
        .attr('y', -28)
        .attr('width', 0)
        .attr('height', 100)
        .attr('rx', 8);

      tooltipWrapper.append('text').attr('class', 'tooltip-artist').attr('id', 'tooltipArtist').attr('x', 0).attr('y', -4).attr('text-anchor', 'middle').text('');

      tooltipWrapper.append('text').attr('class', 'tooltip-song').attr('id', 'tooltipSong').attr('x', 0).attr('y', 17).attr('text-anchor', 'middle').text('');

      tooltipWrapper.append('text').attr('class', 'tooltip-rank').attr('id', 'tooltipRank').attr('x', 0).attr('y', 42).attr('text-anchor', 'middle').text('');

      tooltipWrapper.append('text').attr('class', 'tooltip-rank').attr('id', 'tooltipTop40').attr('x', 0).attr('y', 55).attr('text-anchor', 'middle').text('');

      // Position legends centered with spacing between them
      // widthOriginal is approximately 1900px
      // Place them in the center-right area with good spacing
      const legendGap = 100; // Space between the two legends
      const sizeLegendX = 800; // Position size legend (moved right a bit)
      const colorLegendX = sizeLegendX + 400 + legendGap; // Position color legend with gap
      
      const sizeLegend = svg.append('g').attr('class', 'size-legend').attr('transform', `translate(${sizeLegendX}, -40)`);

      sizeLegend.append('text').attr('class', 'legend-title').attr('x', -13).attr('y', -40).text('Position in Top 2000');

      const sizeDistance = [13, 65, 108, 144, 175, 203, 230, 255, 280];
      sizeLegend
        .selectAll('.song-size')
        .data(rScale.range())
        .enter()
        .append('circle')
        .attr('class', 'song-size')
        .attr('cx', (_, i) => sizeDistance[i])
        .attr('r', (d) => d);

      sizeLegend
        .append('circle')
        .attr('cx', sizeDistance[0])
        .attr('r', rScale.range()[0] * 0.35)
        .style('fill', '#CB272E');
      sizeLegend
        .append('circle')
        .attr('cx', sizeDistance[0])
        .attr('r', rScale.range()[0] * 0.065)
        .style('fill', '#ffffff');

      const sizeFont = [14, 13, 12, 11, 10, 9, 9, 8, 8];

      sizeLegend
        .selectAll('.song-legend-value')
        .data(rScale.domain())
        .enter()
        .append('text')
        .attr('class', 'song-legend-value')
        .attr('x', (_, i) => sizeDistance[i])
        .attr('y', 45)
        .style('font-size', (_, i) => sizeFont[i])
        .text((d) => d);

      const colorLegend = svg.append('g').attr('class', 'color-legend').attr('transform', `translate(${colorLegendX}, -40)`);

      colorLegend
        .append('text')
        .attr('class', 'legend-title')
        .attr('x', -13)
        .attr('y', -40)
        .text('Highest position reached in weekly Top 40');

      colorLegend
        .selectAll('.song-color')
        .data(colorScale.range())
        .enter()
        .append('circle')
        .attr('class', 'song-color')
        .attr('cx', (_, i) => 2 * i * rScale(100) * 1.2)
        .attr('r', rScale(100))
        .style('fill', (d) => d);

      colorLegend
        .append('circle')
        .attr('class', 'song-color')
        .attr('cx', 2 * 9 * rScale(100) * 1.2)
        .attr('r', rScale(100))
        .style('fill', '#e0e0e0');

      colorLegend
        .append('text')
        .attr('class', 'song-legend-value')
        .attr('x', 0)
        .attr('y', 45)
        .style('font-size', sizeFont[0])
        .text('1');

      colorLegend
        .append('text')
        .attr('class', 'song-legend-value')
        .attr('x', 2 * 6 * rScale(100) * 1.2)
        .attr('y', 45)
        .style('font-size', sizeFont[0])
        .text('40');

      colorLegend
        .append('text')
        .attr('class', 'song-legend-value')
        .attr('x', 2 * 9 * rScale(100) * 1.2)
        .attr('y', 40)
        .style('font-size', sizeFont[4])
        .text('never reached');

      colorLegend
        .append('text')
        .attr('class', 'song-legend-value')
        .attr('x', 2 * 9 * rScale(100) * 1.2)
        .attr('y', 51)
        .style('font-size', sizeFont[4])
        .text('the top 40*');
    return () => {
      container.selectAll('*').remove();
    };
  }, [isMobile, songs]);

  // Handle scrollytelling transitions
  useEffect(() => {
    if (!chartRef.current) return;
    
    const container = d3.select(chartRef.current);
    const allSongs = container.selectAll('.song-group');
    const allBackgrounds = container.selectAll('.song-background');
    
    // If no elements rendered yet, skip
    if (allSongs.empty()) return;
    
    // Reset state (show all)
    const resetView = () => {
      allSongs.transition().duration(500).style('opacity', 1);
      allBackgrounds.transition().duration(500).style('opacity', 1);
    };

    // -1: Initial state - do nothing, let initial opacity: 1 persist
    if (activeStep === -1) {
      return;
    }

    // 0: Intro - Show All
    if (activeStep === 0) {
      resetView();
    }

    // 1: The Golden Era (70s & 80s)
    if (activeStep === 1) {
      allSongs
        .transition()
        .duration(500)
        .style('opacity', (d) => {
          return d.releaseYear >= 1970 && d.releaseYear <= 1989 ? 1 : 0.1;
        });
      allBackgrounds.transition().duration(500).style('opacity', 0.1);
    }

    // 2: The Oldest (Before 60s)
    if (activeStep === 2) {
      allSongs
        .transition()
        .duration(500)
        .style('opacity', (d) => {
          return d.releaseYear < 1960 ? 1 : 0.1;
        });
      allBackgrounds.transition().duration(500).style('opacity', 0.1);
    }

    // 3: Modern Classics (2010+)
    if (activeStep === 3) {
      allSongs
        .transition()
        .duration(500)
        .style('opacity', (d) => {
          return d.releaseYear >= 2010 && d.rank <= 50 ? 1 : 0.1;
        });
      allBackgrounds.transition().duration(500).style('opacity', 0.1);
    }

    // 4: Hidden Gems (Never Top 40)
    if (activeStep === 4) {
      allSongs
        .transition()
        .duration(500)
        .style('opacity', (d) => {
          return d.listHighestRank === 0 ? 1 : 0.1;
        });
      allBackgrounds.transition().duration(500).style('opacity', 0);
    }

    // 5: Explore - Interactive filtering
    if (activeStep === 5) {
      // Apply search and decade filter
      const query = searchQuery.toLowerCase().trim();
      
      allSongs
        .transition()
        .duration(300)
        .style('opacity', (d) => {
          // Some helper-safe fields (decade helper nodes don't have artist/title)
          const artist = (d.artist || '').toLowerCase();
          const title = (d.title || '').toLowerCase();

          // Decade filter
          let matchesDecade = true;
          if (selectedDecade !== 'all') {
            const decadeStart = selectedDecade === '50s' ? 1950 : 
                                selectedDecade === '60s' ? 1960 :
                                selectedDecade === '70s' ? 1970 :
                                selectedDecade === '80s' ? 1980 :
                                selectedDecade === '90s' ? 1990 :
                                selectedDecade === '00s' ? 2000 :
                                selectedDecade === '10s' ? 2010 : 1950;
            const decadeEnd = decadeStart + 10;
            matchesDecade = d.releaseYear >= decadeStart && d.releaseYear < decadeEnd;
          }
          
          // Search filter
          let matchesSearch = true;
          if (query) {
            matchesSearch = artist.includes(query) || title.includes(query);
          }
          
          return matchesDecade && matchesSearch ? 1 : 0.08;
        });
      
      allBackgrounds
        .transition()
        .duration(300)
        .style('opacity', (d) => {
          const query = searchQuery.toLowerCase().trim();
          const artist = (d.artist || '').toLowerCase();
          const title = (d.title || '').toLowerCase();
          let matchesDecade = true;
          if (selectedDecade !== 'all') {
            const decadeStart = selectedDecade === '50s' ? 1950 : 
                                selectedDecade === '60s' ? 1960 :
                                selectedDecade === '70s' ? 1970 :
                                selectedDecade === '80s' ? 1980 :
                                selectedDecade === '90s' ? 1990 :
                                selectedDecade === '00s' ? 2000 :
                                selectedDecade === '10s' ? 2010 : 1950;
            const decadeEnd = decadeStart + 10;
            matchesDecade = d.releaseYear >= decadeStart && d.releaseYear < decadeEnd;
          }
          
          let matchesSearch = true;
          if (query) {
            matchesSearch = artist.includes(query) || title.includes(query);
          }
          
          return matchesDecade && matchesSearch ? 1 : 0.08;
        });
    }

  }, [activeStep, searchQuery, selectedDecade]);

  return <div id="chart" ref={chartRef} />;
};

export default Top2000Chart;

