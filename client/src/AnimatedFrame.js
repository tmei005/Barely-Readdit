import React from 'react';
import frame1 from './assets/Barely-Readdit-Logo-1.png';
import frame2 from './assets/Barely-Readdit-Logo-2.png';
import frame3 from './assets/Barely-Readdit-Logo-3.png';

const AnimatedFrame = ({ width, height }) => {
  const [frameIndex, setFrameIndex] = React.useState(0);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setFrameIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 250); // 250ms = 0.25s

    return () => clearInterval(intervalId);
  }, []);

  const frames = [frame1, frame2, frame3];

  const frame = frames[frameIndex];

  const frameStyles = {
    backgroundImage: `url(${frame})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat', // added to prevent image repetition
    width: width,
    height: height,
    
  };

  return (
    <div style={frameStyles} className="[REDACTED]" />
  );
};

export default AnimatedFrame;