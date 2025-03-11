// app/routes/session.tsx
import { LoaderFunction } from "@remix-run/node";
import { useState, useEffect, useRef } from "react";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const cookies = new Map(request.headers.get('Cookie')?.split('; ').map(c => c.split('=')) || []);
  const durationStr = cookies.get("duration");
  const sound = cookies.get("sound") || "cafe";
  const duration = durationStr ? parseInt(durationStr) : 25 * 60; // Default 25 minutes in seconds

  return { duration, sound };
};

export default function Session() {
  const data = useLoaderData<typeof loader>();
  const [timeLeft, setTimeLeft] = useState(data.duration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio(`/sounds/${data.sound}.mp3`);
      audioRef.current.loop = true;
    } else {
      // Update source if audio element exists but sound changed
      audioRef.current.src = `/sounds/${data.sound}.mp3`;
    }

    // Handle play with promise catch
    const playAudio = async () => {
      try {
        if (audioRef.current) {
          await audioRef.current.play();
        }
      } catch (error) {
        console.error("Audio playback failed:", error);
      }
    };
    
    playAudio();

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [data.sound]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
        setTimeLeft((prev: number) => {
        setTimeLeft((prev) => {
          if (prev > 0) return prev - 1;
          setIsRunning(false);
          return 0;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setTimeLeft(data.duration);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="bg-gray-700 rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-teal-400">Focus Time</h1>
        
        <div className="flex justify-center mb-8">
          <div className="text-6xl font-mono font-bold bg-gray-800 rounded-xl px-8 py-6">
            {formatTime(timeLeft)}
          </div>
        </div>
        
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
              isRunning 
                ? "bg-amber-500 hover:bg-amber-600" 
                : "bg-teal-500 hover:bg-teal-600"
            }`}
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-lg font-semibold text-white bg-gray-600 hover:bg-gray-500 transition-colors"
          >
            Reset
          </button>
        </div>
        
        <p className="text-center mt-6 text-gray-400 text-sm">
          Sound: {data.sound}
        </p>
      </div>
    </div>
  );
}
