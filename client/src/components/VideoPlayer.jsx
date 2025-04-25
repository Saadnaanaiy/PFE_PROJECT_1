import { useState, useRef, useEffect } from 'react';
import {
  FiPlay,
  FiPause,
  FiMaximize,
  FiVolume2,
  FiVolumeX,
  FiSettings,
} from 'react-icons/fi';
import zelijBackground from '../assets/zelijBack.png';

const VideoPlayer = ({
  videoUrl,
  title,
  thumbnail,
  previewOnly,
  onComplete,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  // Auto-hide controls after inactivity
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, showControls]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);

      // Check if video completed
      if (currentProgress >= 99.5 && onComplete) {
        onComplete();
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      const newMuteState = !isMuted;
      setIsMuted(newMuteState);
      videoRef.current.muted = newMuteState;
    }
  };

  const handleProgressClick = (e) => {
    if (videoRef.current) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / progressBar.offsetWidth;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  // Zelij background style
  const zelijStyle = {
    backgroundImage: `url(${zelijBackground})`,
    backgroundSize: '100px',
    backgroundRepeat: 'repeat',
    opacity: 0.05,
  };

  return (
    <div
      className="relative group rounded-lg overflow-hidden bg-black"
      onMouseMove={() => setShowControls(true)}
    >
      {/* Zelij background pattern */}
      <div className="absolute inset-0 z-0" style={zelijStyle}></div>

      {/* Video */}
      <video
        ref={videoRef}
        className="w-full aspect-video object-cover z-10"
        src={videoUrl}
        poster={thumbnail}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onClick={handlePlayPause}
      />

      {/* Preview overlay */}
      {previewOnly && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
          <div className="text-white text-center">
            <div className="bg-primary/90 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
              <FiLock className="text-2xl" />
            </div>
            <p className="font-medium mb-2">This video is a preview</p>
            <p className="text-white/80 text-sm">
              Enroll in the course to access all content
            </p>
          </div>
        </div>
      )}

      {/* Video controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 transition-opacity z-30 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress bar */}
        <div
          className="w-full h-1 bg-white/30 rounded-full mb-3 cursor-pointer relative"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-primary rounded-full absolute top-0 left-0"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Play/Pause button */}
            <button
              onClick={handlePlayPause}
              className="text-white hover:text-primary transition-colors"
            >
              {isPlaying ? <FiPause /> : <FiPlay />}
            </button>

            {/* Volume controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMuteToggle}
                className="text-white hover:text-primary transition-colors"
              >
                {isMuted ? <FiVolumeX /> : <FiVolume2 />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 accent-primary"
              />
            </div>

            {/* Time display */}
            <div className="text-white text-xs">
              {formatTime(videoRef.current?.currentTime || 0)} /{' '}
              {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Settings button */}
            <button className="text-white hover:text-primary transition-colors">
              <FiSettings />
            </button>

            {/* Fullscreen button */}
            <button
              onClick={handleFullscreen}
              className="text-white hover:text-primary transition-colors"
            >
              <FiMaximize />
            </button>
          </div>
        </div>
      </div>

      {/* Play button overlay when paused */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-20"
          onClick={handlePlayPause}
        >
          <div className="bg-primary/90 rounded-full p-6 flex items-center justify-center transform transition-transform hover:scale-110">
            <FiPlay className="text-white text-2xl" />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
