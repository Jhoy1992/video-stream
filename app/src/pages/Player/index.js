import React, { useState, useEffect } from 'react';

import { Container } from './styles';

function Player({ history, location }) {
  const [video, setVideo] = useState('');
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    const { name, subs } = location.state.movie;
    setVideo(`http://192.168.1.250:3001/videos/${name}`);

    if (subs.length) {
      const newSubs = subs.map(sub => {
        const label = /_([^.vtt]+)\.vtt/gi.exec(sub)[0].toUpperCase();
        const lang =
          /_\d\w(.*).vtt/gi.exec(sub)[1].toLowerCase() === 'pob'
            ? 'pt-BR'
            : 'eng';

        return { src: sub, label, lang };
      });

      setSubs(newSubs);
    }
  }, [location.state.movie]);

  return (
    <Container>
      <video key={video} crossOrigin="anonymous" controls>
        <source src={video} type="video/mp4" />
        {subs.length &&
          subs.map(sub => (
            <track
              key={sub.src}
              src={`http://192.168.1.250:3001/subs/${sub.src}`}
              label={sub.label}
              kind="subtitles"
              srcLang={sub.lang}
            />
          ))}
      </video>
    </Container>
  );
}

export default Player;
