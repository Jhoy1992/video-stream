import React, { useState, useEffect } from 'react';

import { Container } from './styles';

function Player({ history, location }) {
  const [video, setVideo] = useState('');
  const [sub, setSub] = useState('');

  useEffect(() => {
    const { name, sub } = location.state.movie;
    console.log(name, sub);
    setVideo(`http://192.168.1.250:3001/videos/${name}`);

    if (sub) {
      setSub(`http://192.168.1.250:3001/subs/${sub}`);
    }
  }, [location.state.movie]);

  return (
    <Container>
      <video key={video} crossOrigin="anonymous" controls>
        <source src={video} type="video/mp4" />
        {sub && (
          <track src={sub} label="Português" kind="subtitles" srcLang="pt-BR" />
        )}
      </video>
    </Container>
  );
}

export default Player;
