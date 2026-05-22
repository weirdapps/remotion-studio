import React from 'react';
import { Composition } from 'remotion';
import { DemoComposition } from './compositions/DemoComposition';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="DemoComposition"
      component={DemoComposition}
      durationInFrames={78 * 30}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
