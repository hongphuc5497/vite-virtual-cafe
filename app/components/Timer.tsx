import { useEffect, useState } from "react";
import { FiPause, FiPlay, FiRefreshCw } from "react-icons/fi";

type TimerProps = {
  initialMinutes?: number;
};

export default function Timer({ initialMinutes = 25 }: TimerProps) {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    if (isActive) {
      interval = window.setInterval(() => {
        setSeconds((prev) => {
          if (prev === 0) {
            setMinutes((prevMin) => {
              if (prevMin === 0) {
                setIsActive(false);
                return 0;
              }
              return prevMin - 1;
            });
            return 59;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval !== undefined) {
        window.clearInterval(interval);
      }
    };
  }, [isActive]);

  return (
    <div className="timer-panel">
      <div className="time-display">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
      <div className="timer-controls">
        <button type="button" onClick={() => setIsActive(!isActive)}>
          {isActive ? <FiPause /> : <FiPlay />}
        </button>
        <button
          type="button"
          onClick={() => {
            setMinutes(initialMinutes);
            setSeconds(0);
            setIsActive(false);
          }}
        >
          <FiRefreshCw />
        </button>
      </div>
    </div>
  );
}
