import { useState, useMemo } from 'react';
import * as d3 from 'd3';

const ExploreSection = ({ songs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const insights = useMemo(() => {
    if (!songs.length) return {};
    const neverTop40 = songs.filter((s) => s.listHighestRank === 0).length;
    const avgYear = Math.round(d3.mean(songs, (s) => s.releaseYear));
    const top10Count = songs.filter((s) => s.rank <= 10).length;
    return { neverTop40, avgYear, top10Count };
  }, [songs]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    highlightSongs(term, activeFilter);
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    highlightSongs(searchTerm, filter);
  };

  // Re-use logic similar to Top2000Chart but via global selection for simplicity,
  // or just dispatch an event if we wanted to decouple. Here we directly select.
  const highlightSongs = (term, filter) => {
    const allSongs = d3.selectAll('.song-group');
    const allBackgrounds = d3.selectAll('.song-background');

    allSongs.transition().duration(300).style('opacity', (d) => {
      const matchesSearch =
        !term ||
        d.title.toLowerCase().includes(term) ||
        d.artist.toLowerCase().includes(term);
      
      let matchesFilter = true;
      if (filter === 'Never Top 40') matchesFilter = d.listHighestRank === 0;
      if (filter === 'Top 10 Hits') matchesFilter = d.rank <= 10;
      if (filter === '80s') matchesFilter = d.releaseYear >= 1980 && d.releaseYear < 1990;

      return matchesSearch && matchesFilter ? 1 : 0.05;
    });

    // Dim backgrounds if filtering
    allBackgrounds.transition().duration(300).style('opacity', (term || filter !== 'All') ? 0.05 : 1);
  };

  return (
    <section className="explore-section outer-margin" id="explore">
      <div className="insight-grid">
        <div className="insight-card">
          <span className="insight-value">{insights.avgYear || 0}</span>
          <span className="insight-label">Average Release Year</span>
        </div>
        <div className="insight-card">
          <span className="insight-value">{insights.neverTop40 || 0}</span>
          <span className="insight-label">Songs Never in Top 40</span>
        </div>
        <div className="insight-card">
          <span className="insight-value">{songs.length}</span>
          <span className="insight-label">Total Songs Charted</span>
        </div>
      </div>

      <div className="search-container">
        <h2>Explore the Collection</h2>
        <input
          type="text"
          placeholder="Search for artist or song..."
          className="search-input"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="filter-tags">
          {['All', 'Never Top 40', 'Top 10 Hits', '80s'].map((f) => (
            <button
              key={f}
              className={`filter-tag ${activeFilter === f ? 'active' : ''}`}
              onClick={() => handleFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;

