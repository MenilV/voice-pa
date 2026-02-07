import { NativeModules, Platform } from 'react-native';

const { RustRecorder: NativeRustRecorder } = NativeModules;

if (!NativeRustRecorder) {
    console.warn('RustRecorder native module is not available. Ensure native projects are linked.');
}

/**
 * Interface for the Rust-powered Mobile Recorder.
 * Provides high-performance audio recording and processing.
 */
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
     * Checks if the recorder is currently active.
     */
    isRecording(): Promise<boolean>;

    /**
     * Returns the current duration of the recording in seconds.
     */
    duration(): Promise<number>;
}

const RustRecorder: IRustRecorder = {
    start: () => NativeRustRecorder.start(),
    stop: () => NativeRustRecorder.stop(),
    isRecording: () => NativeRustRecorder.isRecording(),
    duration: () => NativeRustRecorder.duration(),
};

export default RustRecorder;
