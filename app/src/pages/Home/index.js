import React, { useState, useEffect } from 'react';
import { FaClosedCaptioning } from 'react-icons/fa';

import api from '../../services/api';
import { Container, Movies, Movie, Title } from './styles';

import defaultThumbnail from '../../assets/default.jpg';

function Home({ history }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loadAvailableMovies = async () => {
      const { data } = await api.get('/');

      // eslint-disable-next-line
      data.map(movie => {
        movie.thumb = movie.thumb
          ? `http://192.168.1.250:3001/thumbs/${movie.thumb}`
          : defaultThumbnail;
      });

      setMovies(data);
    };

    loadAvailableMovies();
  }, []);

  const playMovie = movie => {
    history.push('/player', { movie });
  };

  return (
    <Container>
      <Movies>
        {movies.map(movie => (
          <Movie key={movie.name} onClick={() => playMovie(movie)}>
            <Title hasSubs={movie.sub}>
              <p>{movie.name}</p>
              <div>
                <FaClosedCaptioning size={22} />
              </div>
            </Title>

            <img src={movie.thumb} alt="Video thumbnail" />
          </Movie>
        ))}
      </Movies>
    </Container>
  );
}

export default Home;
