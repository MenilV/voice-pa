import { useState, useEffect, useRef, useCallback } from 'react';
import RustRecorder from '../native/RustRecorder';
import { TranscriptSegment } from '../native/RustRecorder';

interface UseAudioPlayerOptions {
  segments?: TranscriptSegment[];
}

export const useAudioPlayer = ({ segments = [] }: UseAudioPlayerOptions) => {
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(-1);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const filePathRef = useRef<string | null>(null);

  const startPolling = useCallback(() => {
    if (pollingRef.current) return;
    pollingRef.current = setInterval(async () => {
      try {
        const state = await RustRecorder.getPlaybackPosition();
        const posMs = state.position;
        const durMs = state.duration;
        setPosition(posMs);
        setDuration(durMs);
        setIsPlaying(state.isPlaying);

        if (!state.isPlaying && posMs > 0 && posMs >= durMs - 100) {
          stopPolling();
          setIsPlaying(false);
        }
      } catch {
        // ignore polling errors
      }
    }, 200);
  }, []);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (segments.length === 0 || duration === 0) {
      setActiveSegmentIndex(-1);
      return;
    }
    const posSeconds = position / 1000;
    const idx = segments.findIndex(
      seg => posSeconds >= seg.startTime && posSeconds < seg.endTime,
    );
    setActiveSegmentIndex(idx);
  }, [position, segments, duration]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  const play = useCallback(
    async (filePath: string) => {
      if (filePathRef.current === filePath && !isPlaying) {
        // Resume: seek to current position and play again
        await RustRecorder.playAudio(filePath);
        await RustRecorder.seekAudio(position);
      } else {
        filePathRef.current = filePath;
        await RustRecorder.playAudio(filePath);
      }
      setIsPlaying(true);
      startPolling();
    },
    [isPlaying, position, startPolling],
  );

  const pause = useCallback(async () => {
    await RustRecorder.pauseAudio();
    setIsPlaying(false);
    stopPolling();
  }, [stopPolling]);

  const stop = useCallback(async () => {
    await RustRecorder.stopAudio();
    setIsPlaying(false);
    setPosition(0);
    stopPolling();
    filePathRef.current = null;
  }, [stopPolling]);

  const seek = useCallback(
    async (seconds: number) => {
      const ms = seconds * 1000;
      await RustRecorder.seekAudio(ms);
      setPosition(ms);
    },
    [],
  );

  return {
    play,
    pause,
    stop,
    seek,
    position,
    duration,
    isPlaying,
    activeSegmentIndex,
  };
};
