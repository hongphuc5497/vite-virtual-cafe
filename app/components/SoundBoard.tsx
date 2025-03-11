import { useState } from 'react';
import { Howl } from 'howler';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';

const SOUND_MAP = {
  'coffee-shop': '/sounds/coffee-shop.mp3',
  'rain': '/sounds/rain.mp3',
  'fireplace': '/sounds/fireplace.mp3'
};

export default function SoundBoard({ presets }) {
  const [sounds, setSounds] = useState({});

  const toggleSound = (soundKey: string) => {
    if (sounds[soundKey]) {
      sounds[soundKey].stop();
      setSounds(prev => {
        const newSounds = { ...prev };
        delete newSounds[soundKey];
        return newSounds;
      });
    } else {
      const newSound = new Howl({
        src: [SOUND_MAP[soundKey]],
        loop: true,
        volume: 0.5
      });
      newSound.play();
      setSounds(prev => ({ ...prev, [soundKey]: newSound }));
    }
  };

  return (
    <div className="sound-board">
      {presets.map(preset => (
        <button 
          key={preset}
          onClick={() => toggleSound(preset)}
          className={sounds[preset] ? 'active' : ''}
        >
          {sounds[preset] ? <FiVolume2 /> : <FiVolumeX />}
          {preset.replace('-', ' ')}
        </button>
      ))}
    </div>
  );
}
