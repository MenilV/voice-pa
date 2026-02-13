import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { NativeModules } from 'react-native';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

NativeModules.RustRecorder = {
  start: jest.fn(() => Promise.resolve()),
  stop: jest.fn(() => Promise.resolve([0.1, 0.2, 0.3])),
  stopAndStore: jest.fn(() =>
    Promise.resolve({ audioFilePath: '/tmp/mock.wav', duration: 0 }),
  ),
  isRecording: jest.fn(() => Promise.resolve(false)),
  duration: jest.fn(() => Promise.resolve(0)),
  transcribe: jest.fn(() => Promise.resolve('')),
  transcribeFile: jest.fn(() =>
    Promise.resolve(
      JSON.stringify({
        text: '',
        language: 'en',
        segments: [],
        speakers: [],
      }),
    ),
  ),
  listRecordings: jest.fn(() => Promise.resolve([])),
  playAudio: jest.fn(() => Promise.resolve()),
  pauseAudio: jest.fn(() => Promise.resolve()),
  stopAudio: jest.fn(() => Promise.resolve()),
  seekAudio: jest.fn(() => Promise.resolve()),
  getPlaybackPosition: jest.fn(() =>
    Promise.resolve({ position: 0, duration: 0, isPlaying: false }),
  ),
};
