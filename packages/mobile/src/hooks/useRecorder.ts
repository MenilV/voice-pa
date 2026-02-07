import { useState, useCallback, useEffect, useRef } from 'react';
import RustRecorder from '../native/RustRecorder';
import { saveMeeting } from '../utils/storage';

export interface RecorderState {
    isRecording: boolean;
    duration: number;
    audioData: number[] | null;
    error: string | null;
    transcript: string;
}

export const useRecorder = () => {
    const [state, setState] = useState<RecorderState>({
        isRecording: false,
        duration: 0,
        audioData: null,
        error: null,
        transcript: '',
    });

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const transcriptTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const MOCK_PHRASES = [
        "Welcome to the sync. ",
        "Let's discuss the Rust core. ",
        "The bridge is now functional. ",
        "We need to test on Android. ",
        "Offline sync is the next step. ",
        "Design looks premium. ",
        "Finalizing Phase 4 now. ",
    ];

    const updateDuration = useCallback(async () => {
        try {
            const duration = await RustRecorder.duration();
            setState(prev => ({ ...prev, duration }));
        } catch (err) {
            console.error('Failed to get duration:', err);
        }
    }, []);

    const simulateTranscription = useCallback(() => {
        const randomPhrase = MOCK_PHRASES[Math.floor(Math.random() * MOCK_PHRASES.length)];
        setState(prev => ({
            ...prev,
            transcript: prev.transcript + randomPhrase,
        }));
    }, []);

    const startRecording = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, error: null, transcript: '' }));
            await RustRecorder.start();
            setState(prev => ({ ...prev, isRecording: true }));

            // Start duration timer
            timerRef.current = setInterval(updateDuration, 100);
            // Start transcription simulation
            transcriptTimerRef.current = setInterval(simulateTranscription, 3000);
        } catch (err: any) {
            setState(prev => ({ ...prev, error: err.message || 'Failed to start recording' }));
        }
    }, [updateDuration, simulateTranscription]);

    const stopRecording = useCallback(async () => {
        try {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            if (transcriptTimerRef.current) {
                clearInterval(transcriptTimerRef.current);
                transcriptTimerRef.current = null;
            }

            const audioData = await RustRecorder.stop();

            // Save the meeting to local storage
            const duration = await RustRecorder.duration();
            const formatTime = (seconds: number) => {
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            };

            const newMeeting = {
                id: Date.now().toString(),
                title: `Meeting ${new Date().toLocaleDateString()}`,
                date: new Date().toLocaleString(),
                duration: formatTime(duration),
                transcript: state.transcript,
                transcriptPreview: state.transcript.substring(0, 100) + '...',
                participants: 1,
                type: 'Mobile' as const,
                synced: false,
            };

            await saveMeeting(newMeeting);

            setState(prev => ({
                ...prev,
                isRecording: false,
                audioData,
            }));
        } catch (err: any) {
            setState(prev => ({ ...prev, error: err.message || 'Failed to stop recording' }));
        }
    }, [state.transcript]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (transcriptTimerRef.current) clearInterval(transcriptTimerRef.current);
        };
    }, []);

    return {
        ...state,
        startRecording,
        stopRecording,
    };
};
