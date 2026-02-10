import { useState, useCallback, useEffect, useRef } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import RustRecorder from '../native/RustRecorder';
import { saveMeeting } from '../utils/storage';

export interface RecorderState {
    isRecording: boolean;
    duration: number;
    audioData: number[] | null;
    error: string | null;
    transcript: string;
    isTranscribing: boolean;
}

export const useRecorder = () => {
    const [state, setState] = useState<RecorderState>({
        isRecording: false,
        duration: 0,
        audioData: null,
        error: null,
        transcript: '',
        isTranscribing: false,
    });

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const updateDuration = useCallback(async () => {
        try {
            const duration = await RustRecorder.duration();
            setState(prev => ({ ...prev, duration }));
        } catch (err) {
            console.error('Failed to get duration:', err);
        }
    }, []);

    const startRecording = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, error: null, transcript: '' }));

            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    setState(prev => ({ ...prev, error: 'Microphone permission denied' }));
                    return;
                }
            }

            await RustRecorder.start();
            setState(prev => ({ ...prev, isRecording: true }));

            // Start duration timer
            timerRef.current = setInterval(updateDuration, 100);
        } catch (err: any) {
            setState(prev => ({ ...prev, error: err.message || 'Failed to start recording' }));
        }
    }, [updateDuration]);

    const stopRecording = useCallback(async () => {
        try {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

            const audioData = await RustRecorder.stop();
            setState(prev => ({ ...prev, isRecording: false, isTranscribing: true, audioData }));

            // Transcribe via Whisper API (runs in Rust core)
            const transcript = await RustRecorder.transcribe();

            const duration = await RustRecorder.duration();
            const formatTime = (seconds: number) => {
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            };

            setState(prev => ({ ...prev, isTranscribing: false, transcript }));

            const newMeeting = {
                id: Date.now().toString(),
                title: `Meeting ${new Date().toLocaleDateString()}`,
                date: new Date().toLocaleString(),
                duration: formatTime(duration),
                transcript,
                transcriptPreview: transcript.substring(0, 100) + '...',
                participants: 1,
                type: 'Mobile' as const,
                synced: false,
            };

            await saveMeeting(newMeeting);
        } catch (err: any) {
            setState(prev => ({
                ...prev,
                isRecording: false,
                isTranscribing: false,
                error: err.message || 'Failed to stop recording',
            }));
        }
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    return {
        ...state,
        startRecording,
        stopRecording,
    };
};
