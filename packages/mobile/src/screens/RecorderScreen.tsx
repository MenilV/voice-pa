import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Animated,
    ScrollView,
} from 'react-native';
import { useRecorder } from '../hooks/useRecorder';

const { width } = Dimensions.get('window');

const RecorderScreen = () => {
    const { isRecording, duration, error, transcript, startRecording, stopRecording } = useRecorder();
    const pulseAnim = React.useRef(new Animated.Value(1)).current;
    const scrollViewRef = React.useRef<ScrollView>(null);

    React.useEffect(() => {
        let animation: Animated.CompositeAnimation | null = null;
        if (isRecording) {
            animation = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            );
            animation.start();
        } else {
            pulseAnim.setValue(1);
        }
        return () => animation?.stop();
    }, [isRecording, pulseAnim]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 10);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Voice PA</Text>
                <Text style={styles.subtitle}>Native Rust Recording</Text>
            </View>

            <View style={styles.timerContainer}>
                <Text style={[styles.timer, isRecording && styles.activeTimer]}>
                    {formatTime(duration)}
                </Text>
                {isRecording && (
                    <View style={styles.liveBadge}>
                        <View style={styles.dot} />
                        <Text style={styles.liveText}>REC</Text>
                    </View>
                )}
            </View>

            {/* Live Transcription Area */}
            <View style={styles.transcriptContainer}>
                <ScrollView
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    style={styles.transcriptScroll}
                    contentContainerStyle={styles.transcriptContent}
                >
                    <Text style={styles.transcriptText}>
                        {transcript || (isRecording ? "Listening..." : "Your transcript will appear here...")}
                    </Text>
                </ScrollView>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={isRecording ? stopRecording : startRecording}
                    style={styles.recordButtonContainer}
                >
                    <Animated.View
                        style={[
                            styles.recordButtonPulse,
                            { transform: [{ scale: pulseAnim }] },
                            isRecording && styles.activePulse,
                        ]}
                    />
                    <View style={[styles.recordButton, isRecording && styles.activeButton]}>
                        <View style={isRecording ? styles.square : styles.circle} />
                    </View>
                </TouchableOpacity>

                <Text style={styles.statusText}>
                    {isRecording ? 'Recording in progress...' : 'Tap to start recording'}
                </Text>
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 60,
    },
    header: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    timerContainer: {
        alignItems: 'center',
    },
    timer: {
        fontSize: 72,
        fontWeight: '200',
        color: '#444',
        fontVariant: ['tabular-nums'],
    },
    activeTimer: {
        color: '#fff',
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff3b3022',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginTop: 12,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ff3b30',
        marginRight: 6,
    },
    liveText: {
        color: '#ff3b30',
        fontSize: 12,
        fontWeight: 'bold',
    },
    transcriptContainer: {
        width: width * 0.9,
        height: 150,
        backgroundColor: '#1c1c1e',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#2c2c2e',
    },
    transcriptScroll: {
        flex: 1,
    },
    transcriptContent: {
        paddingBottom: 20,
    },
    transcriptText: {
        color: '#ccc',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
    },
    controls: {
        alignItems: 'center',
        width: '100%',
    },
    recordButtonContainer: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    recordButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    activeButton: {
        backgroundColor: '#ff3b30',
    },
    recordButtonPulse: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ffffff22',
        zIndex: 1,
    },
    activePulse: {
        backgroundColor: '#ff3b3033',
    },
    circle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#ff3b30',
    },
    square: {
        width: 24,
        height: 24,
        borderRadius: 4,
        backgroundColor: '#fff',
    },
    statusText: {
        color: '#888',
        fontSize: 16,
    },
    errorContainer: {
        backgroundColor: '#ff3b3022',
        padding: 16,
        borderRadius: 12,
        marginHorizontal: 20,
        position: 'absolute',
        bottom: 40,
    },
    errorText: {
        color: '#ff3b30',
        textAlign: 'center',
    },
});

export default RecorderScreen;
