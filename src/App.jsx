import { useEffect, useState } from 'react';
import { Scrollama, Step } from 'react-scrollama';
import Top2000Chart from './components/Top2000Chart.jsx';
import { useTop2000Data } from './hooks/useTop2000Data.js';

const MOBILE_BREAKPOINT = 400;

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

const STORY_STEPS = [
  {
    id: 'intro',
    eyebrow: 'Chapter 1: The Shape of Memory',
    title: 'A Constellation of Music',
    summary:
      'This is the Top 2000: a musical galaxy of 2,000 songs chosen by millions of listeners. Each circle is a song, positioned by its release year. The larger the circle, the higher its rank.',
  },
  {
    id: 'gold-rush',
    eyebrow: 'The Golden Era',
    title: 'The Weight of the 70s & 80s',
    summary:
      'Look at the density here. Despite the passage of time, the "Golden Era" of pop and rock (1970–1989) still commands the list, contributing 903 songs—nearly 45% of all tracks. It remains the emotional anchor for the majority of voters.',
  },
  {
    id: 'oldest',
    eyebrow: 'Chapter 2: The Anomalies',
    title: 'Echoes from the Past',
    summary:
      'Before the rock explosion of the 60s, only a handful of voices survive in our collective memory. Elvis Presley, Johnny Cash, Chuck Berry, and Billie Holiday—these pioneers of rock, blues, and jazz still command respect, defying the "recency bias" of pop culture.',
  },
  {
    id: 'modern',
    eyebrow: 'Modern Classics',
    title: 'Breaking Through',
    summary:
      'Entering the pantheon of the Top 2000 is difficult for new releases from the 2010s. Yet, a select few—Adele with "Someone Like You" (rank 47), Racoon\'s "Oceaan" (rank 24), and Claudia de Breij\'s "Mag Ik Dan Bij Jou" (rank 8)—have achieved this rare feat, proving that powerful new voices can still break through.',
  },
  {
    id: 'hidden-gems',
    eyebrow: 'Chapter 3: The Uncrowned Kings',
    title: 'Loved, But Never Charted',
    summary:
      'Perhaps the most remarkable discovery: 378 songs (nearly 19%) never reached the weekly Top 40 when released. Yet they now rank among the greatest—including "Stairway to Heaven" (rank 3), "Piano Man" (rank 4), and Pink Floyd\'s masterpieces. True quality transcends commercial success.',
  },
  {
    id: 'explore',
    eyebrow: 'Chapter 4: Your Turn',
    title: 'Explore the Galaxy',
    summary: '',
    interactive: true, // Flag to indicate this step needs special rendering
  },
];

function App() {
  const isMobile = useIsMobile();
  const [activeStep, setActiveStep] = useState(-1); // Start with -1 so first step gets transition effect
  const { songs, loading, error } = useTop2000Data();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDecade, setSelectedDecade] = useState('all');

  const handleStepEnter = ({ data }) => {
    if (typeof data === 'number') {
      setActiveStep(data);
    }
  };

  const handleStepExit = ({ data, direction }) => {
    // When scrolling up and exiting a step, deactivate it immediately
    if (direction === 'up' && typeof data === 'number') {
      // Set to previous step or -1 if leaving the first step
      setActiveStep(data - 1);
    }
  };

  return (
    <>
      <div id="intro" className="outer-margin">
        <h1 className="title">Top 2000✨Music Galaxy</h1>
        <p>
          Each year since 1999 the 2000 most popular songs of all time, as voted by listeners, run continuously from
          December 25 until New Year&apos;s Eve on a dedicated countdown show—turning the playlist into a shared
          year-end ritual for everyone tuning in.
        </p>
        {isMobile && (
          <p className="mobile">
            Visit this page on your laptop to see a much bigger interactive version and discover the artist and song of
            each of the 2000 songs!
          </p>
        )}
        <p className="credit-note">
          This is a personal project by <strong>Yijie Gu</strong>. <br />
          Original data from{' '}
          <a href="http://www.nporadio2.nl/top2000" target="_blank" rel="noreferrer">
            Radio 2&apos;s Top 2000
          </a>{' '}
          <span className="credit-divider">|</span> {' '}
          <a href="https://www.top40.nl/" target="_blank" rel="noreferrer">
            Mediamarkt&apos;s weekly Top 40
          </a>
          .
        </p>
      </div>

      <main className="outer-margin scrolly-container">
        {!isMobile && songs.length > 0 && (
          <div className="scrolly-graphic">
            <Top2000Chart 
              isMobile={isMobile} 
              activeStep={activeStep} 
              songs={songs}
              searchQuery={searchQuery}
              selectedDecade={selectedDecade}
            />
          </div>
        )}
        <div className="scrolly-copy">
          <Scrollama offset={0.65} onStepEnter={handleStepEnter} onStepExit={handleStepExit}>
            {STORY_STEPS.map((step, index) => (
              <Step data={index} key={step.id}>
                <div className={`scrolly-step ${step.interactive ? 'scrolly-step-interactive' : ''} ${activeStep === index ? 'is-active' : ''}`}>
                  <p className="scrolly-eyebrow">{step.eyebrow}</p>
                  <h2>{step.title}</h2>
                  <p>{step.summary}</p>
                  
                  {step.interactive && (
                    <div className="explore-controls">
                      <input
                        type="text"
                        className="search-input"
                        placeholder="Search by song or artist..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      
                      <div className="decade-filters">
                        {['all', '50s', '60s', '70s', '80s', '90s', '00s', '10s'].map((decade) => (
                          <button
                            key={decade}
                            className={`filter-btn ${selectedDecade === decade ? 'active' : ''}`}
                            onClick={() => setSelectedDecade(decade)}
                          >
                            {decade === 'all' ? 'All' : decade.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Step>
            ))}
          </Scrollama>
          {loading && <p>Loading Top 2000 data...</p>}
          {error && <p className="error-text">Failed to load data. Please try again later.</p>}
          {isMobile && (
            <div className="scrolly-mobile-note">
              <p>Please view on a desktop for the full interactive experience.</p>
            </div>
          )}
        </div>
      </main>

    </>
  );
}

export default App;

