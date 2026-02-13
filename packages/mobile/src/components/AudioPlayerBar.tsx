import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
  LayoutChangeEvent,
} from 'react-native';

interface AudioPlayerBarProps {
  isPlaying: boolean;
  position: number;
  duration: number;
  onPlayPause: () => void;
  onSeek: (seconds: number) => void;
}

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const AudioPlayerBar = ({
  isPlaying,
  position,
  duration,
  onPlayPause,
  onSeek,
}: AudioPlayerBarProps) => {
  const trackWidthRef = React.useRef(0);
  const progress = duration > 0 ? position / duration : 0;

  const onTrackLayout = useCallback((e: LayoutChangeEvent) => {
    trackWidthRef.current = e.nativeEvent.layout.width;
  }, []);

  const handleTrackPress = useCallback(
    (e: GestureResponderEvent) => {
      if (trackWidthRef.current <= 0 || duration <= 0) return;
      const x = e.nativeEvent.locationX;
      const ratio = Math.max(0, Math.min(1, x / trackWidthRef.current));
      onSeek((ratio * duration) / 1000);
    },
    [duration, onSeek],
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPlayPause} style={styles.playButton}>
        <Text style={styles.playIcon}>{isPlaying ? '❚❚' : '▶'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={1}
        onPress={handleTrackPress}
        onLayout={onTrackLayout}
        style={styles.trackTouchable}
      >
        <View style={styles.trackBg}>
          <View style={[styles.trackFill, { flex: progress }]} />
          <View style={styles.thumb} />
          <View style={{ flex: 1 - progress }} />
        </View>
      </TouchableOpacity>

      <Text style={styles.time}>
        {formatTime(position)}/{formatTime(duration)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: '#fff',
    fontSize: 14,
  },
  trackTouchable: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  trackBg: {
    height: 4,
    backgroundColor: '#3a3a3c',
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackFill: {
    height: 4,
    backgroundColor: '#7c3aed',
    borderRadius: 2,
  },
  thumb: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#7c3aed',
    marginHorizontal: -3,
  },
  time: {
    color: '#8e8e93',
    fontSize: 12,
    fontVariant: ['tabular-nums'],
    minWidth: 75,
    textAlign: 'right',
  },
});

export default AudioPlayerBar;
