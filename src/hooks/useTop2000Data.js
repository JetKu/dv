import { useEffect, useState } from 'react';
import * as d3 from 'd3';

const numberFields = ['rank', 'releaseYear', 'listHighestRank', 'x', 'y'];

export const useTop2000Data = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    d3
      .csv('/data/top2000_2016_positions.csv')
      .then((rows) => {
        if (!isMounted) return;
        const parsed = rows.map((row) => {
          const copy = { ...row };
          numberFields.forEach((field) => {
            copy[field] = row[field] ? +row[field] : 0;
          });
          return copy;
        });
        setSongs(parsed);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { songs, loading, error };
};

