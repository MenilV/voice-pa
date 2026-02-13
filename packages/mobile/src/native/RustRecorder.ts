import { NativeModules } from 'react-native';

const { RustRecorder: NativeRustRecorder } = NativeModules;

if (!NativeRustRecorder) {
  console.warn(
    'RustRecorder native module is not available. Ensure native projects are linked.',
  );
}

/**
 * Interface for the Rust-powered Mobile Recorder.
 * Provides high-performance audio recording and processing.
 */
export interface TranscriptSpeaker {
  id: string;
  name?: string | null;
}

export interface TranscriptSegment {
  id: number;
  speakerId?: string | null;
  text: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

export interface TranscriptResult {
  text: string;
  language: string;
  segments: TranscriptSegment[];
  speakers: TranscriptSpeaker[];
}

export interface StoredRecordingResult {
  audioFilePath: string;
  duration: number;
}

export interface RecordingFileInfo {
  audioFilePath: string;
  fileName: string;
  lastModified: number;
  sizeBytes: number;
}

export interface PlaybackState {
  position: number;
  duration: number;
  isPlaying: boolean;
}

export interface IRustRecorder {
  /**
   * Starts the audio recording process.
   * @throws Error if recording fails to start.
   */
  start(): Promise<void>;

  /**
   * Stops the recording and returns the raw audio data as a float array.
   * @returns Promise<number[]> Raw PCM float samples.
   */
  stop(): Promise<number[]>;

  /**
   * Stops recording, saves WAV audio locally, and returns file path + duration.
   */
  stopAndStore(): Promise<StoredRecordingResult>;

  /**
   * Checks if the recorder is currently active.
   */
  isRecording(): Promise<boolean>;

  /**
   * Returns the current duration of the recording in seconds.
   */
  duration(): Promise<number>;

  /**
   * Transcribes the last recorded audio using Whisper API.
   * @returns Promise<string> The transcription text.
   */
  transcribe(): Promise<string>;

  /**
   * Transcribe a stored WAV file. Language can be empty for auto-detect.
   */
  transcribeFile(audioFilePath: string, language?: string): Promise<string>;

  listRecordings(): Promise<RecordingFileInfo[]>;

  playAudio(filePath: string): Promise<void>;
  pauseAudio(): Promise<void>;
  stopAudio(): Promise<void>;
  seekAudio(positionMs: number): Promise<void>;
  getPlaybackPosition(): Promise<PlaybackState>;
}

const RustRecorder: IRustRecorder = {
  start: () => NativeRustRecorder.start(),
  stop: () => NativeRustRecorder.stop(),
  isRecording: () => NativeRustRecorder.isRecording(),
  duration: () => NativeRustRecorder.duration(),
  transcribe: () => NativeRustRecorder.transcribe(),
  stopAndStore: () => NativeRustRecorder.stopAndStore(),
  transcribeFile: (audioFilePath: string, language?: string) =>
    NativeRustRecorder.transcribeFile(audioFilePath, language ?? ''),
  listRecordings: () => NativeRustRecorder.listRecordings(),
  playAudio: (filePath: string) => NativeRustRecorder.playAudio(filePath),
  pauseAudio: () => NativeRustRecorder.pauseAudio(),
  stopAudio: () => NativeRustRecorder.stopAudio(),
  seekAudio: (positionMs: number) => NativeRustRecorder.seekAudio(positionMs),
  getPlaybackPosition: () => NativeRustRecorder.getPlaybackPosition(),
};

export default RustRecorder;
