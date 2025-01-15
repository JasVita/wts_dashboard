import React, { useState, useEffect, useRef } from "react";
import { MessageContent } from "./MessageContent";
import { MessageTime } from "./MessageTime";
import { MessageType } from "./types";
import { Play, Pause, FileText } from "lucide-react";

interface MessageBubbleProps {
  content: string;
  type: MessageType;
  timestamp: Date;
  inputType: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  type,
  timestamp,
  inputType,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcriptionVisible, setTranscriptionVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressInterval = useRef<number>();
  const totalDuration = 30; // Mock total duration in seconds

  const isAudio = inputType === "audio" && type === "user";
  const isImage = inputType === "image" && content.startsWith("https:");

  const mockTranscription =
    "This is a mock transcription of the audio message This is a mock transcription of the audio message This is a mock transcription of the audio message";

  useEffect(() => {
    if (isPlaying && !isDragging) {
      progressInterval.current = window.setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime >= totalDuration) {
            setIsPlaying(false);
            clearInterval(progressInterval.current);
            return 0;
          }
          return prevTime + 1;
        });
        setProgress((prevProgress) => {
          const newProgress = (currentTime / totalDuration) * 100;
          return newProgress >= 100 ? 0 : newProgress;
        });
      }, 1000);
    } else {
      clearInterval(progressInterval.current);
    }

    return () => {
      clearInterval(progressInterval.current);
    };
  }, [isPlaying, currentTime, isDragging]);

  const handlePlayPause = () => {
    if (!isPlaying && currentTime >= totalDuration) {
      setCurrentTime(0);
      setProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleTranscribe = () => {
    setTranscriptionVisible(!transcriptionVisible);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateProgress = (clientX: number) => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const position = clientX - rect.left;
      const percentage = (position / rect.width) * 100;
      return Math.min(Math.max(percentage, 0), 100);
    }
    return 0;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const newProgress = calculateProgress(e.clientX);
    const newTime = (newProgress / 100) * totalDuration;
    setProgress(newProgress);
    setCurrentTime(newTime);
  };

  const handleProgressBarMouseDown = () => {
    setIsDragging(true);
    setIsPlaying(false);
  };

  const handleProgressBarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const newProgress = calculateProgress(e.clientX);
      const newTime = (newProgress / 100) * totalDuration;
      setProgress(newProgress);
      setCurrentTime(newTime);
    }
  };

  const handleProgressBarMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    document.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      document.addEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging]);

  const renderAudioMessage = () => (
    <div className="flex flex-col gap-2">
      <div
        className={`flex items-center gap-3 p-3 rounded-lg w-80 ${
          type === "user" ? "bg-white" : "bg-blue-500 text-white"
        }`}
      >
        <button
          onClick={handlePlayPause}
          className={`p-2 rounded-full ${type === "user" ? "bg-green-500" : "bg-white"}`}
        >
          {isPlaying ? (
            <Pause className={`w-4 h-4 ${type === "user" ? "text-white" : "text-blue-500"}`} />
          ) : (
            <Play className={`w-4 h-4 ${type === "user" ? "text-white" : "text-blue-500"}`} />
          )}
        </button>

        {/* Progress bar container */}
        <div
          ref={progressBarRef}
          className="relative flex-1 cursor-pointer"
          onClick={handleProgressBarClick}
          onMouseDown={handleProgressBarMouseDown}
          onMouseMove={handleProgressBarMouseMove}
          onMouseUp={handleProgressBarMouseUp}
        >
          <div
            className={`w-full h-1 rounded-full ${type === "user" ? "bg-gray-200" : "bg-blue-400"}`}
          />
          <div
            className={`absolute top-0 left-0 h-1 rounded-full transition-all ${
              isDragging ? "duration-0" : "duration-300"
            } ${type === "user" ? "bg-green-500" : "bg-white"}`}
            style={{ width: `${progress}%` }}
          />
          {/* Draggable handle */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${
              type === "user" ? "bg-green-600" : "bg-white"
            } shadow-md transform -translate-x-1/2 hover:scale-110 transition-transform`}
            style={{ left: `${progress}%` }}
          />
        </div>

        <span className="text-sm min-w-[48px] text-right">
          {formatTime(currentTime)}/{formatTime(totalDuration)}
        </span>

        <button
          onClick={handleTranscribe}
          className={`ml-2 p-1.5 rounded-full ${
            type === "user" ? "bg-gray-100 hover:bg-gray-200" : "bg-blue-400 hover:bg-blue-300"
          }`}
          title="Transcribe to text"
        >
          <FileText className="w-4 h-4" />
        </button>
      </div>
      {transcriptionVisible && (
        <div
          className={`text-sm p-2 rounded-lg w-80 ${
            type === "user" ? "bg-gray-100" : "bg-blue-400"
          }`}
        >
          {mockTranscription}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative mb-10">
      {isImage ? (
        <img src={content} className="max-w-full max-h-64 rounded-lg shadow-md" />
      ) : isAudio ? (
        renderAudioMessage()
      ) : (
        <MessageContent content={content} type={type} />
      )}
      <MessageTime type={type} timestamp={timestamp} />
    </div>
  );
};
