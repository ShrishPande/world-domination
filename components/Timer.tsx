import React, { useState, useEffect } from 'react';
import { GAME_DURATION } from '../constants';
import HourglassIcon from './icons/HourglassIcon';

interface TimerProps {
  onTimeUp: () => void;
  isPaused: boolean;
}

const Timer: React.FC<TimerProps> = ({ onTimeUp, isPaused }) => {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp, isPaused]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const timeColor = timeLeft < 60 ? 'text-red-500' : timeLeft < 300 ? 'text-yellow-400' : 'text-cyan-400';

  return (
    <div className="flex items-center justify-center space-x-4 p-2 rounded-lg">
      <HourglassIcon className={`w-8 h-8 ${timeColor}`} />
      <div className={`text-4xl font-bold font-orbitron tracking-widest ${timeColor}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <p className="text-sm text-gray-400 uppercase">Time Remaining</p>
    </div>
  );
};

export default Timer;