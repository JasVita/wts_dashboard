import React, { useState, useRef } from "react";
import { MessageContent } from "./MessageContent";
import { MessageTime } from "./MessageTime";
import { Play, Pause, FileText } from "lucide-react";

type MessageType = "user" | "ai" | "human";

interface MessageBubbleProps {
  content: string;
  type: MessageType;
  timestamp: Date;
  inputType: string;
  inputImgId?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  type,
  timestamp,
  inputType,
  inputImgId,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcriptionVisible, setTranscriptionVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const isAudio = inputType === "audio" && content.startsWith("https:");
  const isImage = inputType === "image" && content.startsWith("https:");

  const mockTranscription = inputImgId;

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setTotalDuration(audioRef.current.duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTranscribe = () => {
    setTranscriptionVisible(!transcriptionVisible);
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
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

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
        >
          <div
            className={`w-full h-1 rounded-full ${type === "user" ? "bg-gray-200" : "bg-blue-400"}`}
          />
          <div
            className={`absolute top-0 left-0 h-1 rounded-full ${
              type === "user" ? "bg-green-500" : "bg-white"
            }`}
            style={{ width: `${(currentTime / totalDuration) * 100}%` }}
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

      {/* Actual Audio Element */}
      <audio
        ref={audioRef}
        src={content} // Load the actual audio file from the content variable
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
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
