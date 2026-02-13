import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Meeting, updateMeeting } from '../utils/storage';
import RustRecorder from '../native/RustRecorder';
import {
  formatConversation,
  formatTimestamp,
  parseTranscriptJson,
} from '../utils/transcript';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import AudioPlayerBar from '../components/AudioPlayerBar';

interface MeetingDetailScreenProps {
  meeting: Meeting;
  onBack: () => void;
}

const MeetingDetailScreen = ({ meeting, onBack }: MeetingDetailScreenProps) => {
  const [synced, setSynced] = React.useState(meeting.synced);
  const [segments, setSegments] = React.useState(meeting.segments || []);
  const [speakers, setSpeakers] = React.useState(meeting.speakers || []);
  const [transcriptText, setTranscriptText] = React.useState(
    meeting.transcript,
  );
  const [language, setLanguage] = React.useState(meeting.language || '');
  const [isReuploading, setIsReuploading] = React.useState(false);
  const [reuploadError, setReuploadError] = React.useState<string | null>(null);

  const { play, pause, stop, seek, position, duration, isPlaying, activeSegmentIndex } =
    useAudioPlayer({ segments });

  const scrollViewRef = useRef<ScrollView>(null);
  const segmentLayoutsRef = useRef<Record<number, number>>({});

  useEffect(() => {
    if (activeSegmentIndex >= 0 && scrollViewRef.current) {
      const y = segmentLayoutsRef.current[activeSegmentIndex];
      if (y !== undefined) {
        scrollViewRef.current.scrollTo({ y: y - 80, animated: true });
      }
    }
  }, [activeSegmentIndex]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const getSpeakerLabel = (speakerId?: string | null) => {
    if (!speakerId) {
      return 'Speaker';
    }
    const match = speakers.find(speaker => speaker.id === speakerId);
    if (match?.name) {
      return match.name;
    }
    const suffix = speakerId.replace('speaker_', '').trim();
    return suffix ? `Speaker ${suffix}` : 'Speaker';
  };

  const handleSync = async () => {
    setSynced(true);
    await updateMeeting({ ...meeting, synced: true });
  };

  const handleReupload = async () => {
    if (!meeting.audioFilePath) {
      setReuploadError('No audio file available for reupload');
      return;
    }

    try {
      setIsReuploading(true);
      setReuploadError(null);
      const transcriptJson = await RustRecorder.transcribeFile(
        meeting.audioFilePath,
        language,
      );
      const transcriptResult = parseTranscriptJson(transcriptJson);
      const conversation = formatConversation(
        transcriptResult.segments,
        transcriptResult.speakers,
      );
      const transcript = conversation || transcriptResult.text;

      const updatedMeeting = {
        ...meeting,
        transcript,
        transcriptPreview: transcript.substring(0, 100) + '...',
        language: transcriptResult.language,
        segments: transcriptResult.segments,
        speakers: transcriptResult.speakers,
      };

      await updateMeeting(updatedMeeting);
      setSegments(transcriptResult.segments);
      setSpeakers(transcriptResult.speakers);
      setTranscriptText(transcript);
      setLanguage(transcriptResult.language);
    } catch (error: any) {
      setReuploadError(error?.message || 'Failed to reupload transcript');
    } finally {
      setIsReuploading(false);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (meeting.audioFilePath) {
      play(meeting.audioFilePath);
    }
  };

  const handleSegmentTap = (index: number) => {
    if (!meeting.audioFilePath) return;
    const seg = segments[index];
    if (seg) {
      seek(seg.startTime);
      if (!isPlaying) {
        play(meeting.audioFilePath);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {meeting.title}
        </Text>
      </View>

      <View style={styles.metaCard}>
        <Text style={styles.metaLabel}>Date & Time</Text>
        <Text style={styles.metaValue}>{meeting.date}</Text>

        <View style={styles.metaRow}>
          <View>
            <Text style={styles.metaLabel}>Duration</Text>
            <Text style={styles.metaValue}>{meeting.duration}</Text>
          </View>
          <View>
            <Text style={styles.metaLabel}>Participants</Text>
            <Text style={styles.metaValue}>{meeting.participants}</Text>
          </View>
        </View>
      </View>

      {meeting.audioFilePath && (
        <View style={styles.playerBarWrapper}>
          <AudioPlayerBar
            isPlaying={isPlaying}
            position={position}
            duration={duration}
            onPlayPause={handlePlayPause}
            onSeek={seek}
          />
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Transcript</Text>
          <View style={styles.transcriptCard}>
            {segments.length > 0 ? (
              segments.map((segment, index) => {
                const isActive = index === activeSegmentIndex;
                return (
                  <TouchableOpacity
                    key={segment.id}
                    activeOpacity={0.7}
                    onPress={() => handleSegmentTap(index)}
                    onLayout={e => {
                      segmentLayoutsRef.current[index] =
                        e.nativeEvent.layout.y;
                    }}
                  >
                    <View
                      style={[
                        styles.segmentRow,
                        isActive && styles.segmentRowActive,
                      ]}
                    >
                      <View style={styles.segmentHeader}>
                        <Text
                          style={[
                            styles.segmentSpeaker,
                            isActive
                              ? styles.segmentSpeakerActive
                              : styles.segmentSpeakerDimmed,
                          ]}
                        >
                          {getSpeakerLabel(segment.speakerId)}
                        </Text>
                        <Text style={styles.segmentTime}>
                          {formatTimestamp(segment.startTime)}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.segmentText,
                          isActive
                            ? styles.segmentTextActive
                            : styles.segmentTextDimmed,
                        ]}
                      >
                        {segment.text}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.transcriptText}>
                {transcriptText || 'No transcript available for this session.'}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Insight (Beta)</Text>
          <View style={styles.insightCard}>
            <Text style={styles.insightText}>
              The meeting focused on the initial sync of the Voice PA project.
              Key discussion revolved around the Rust core implementation and
              FFI bridges.
            </Text>
          </View>
        </View>

        {!synced && (
          <TouchableOpacity style={styles.syncButton} onPress={handleSync}>
            <Text style={styles.syncButtonText}>Sync to Cloud</Text>
          </TouchableOpacity>
        )}
        {meeting.audioFilePath && (
          <TouchableOpacity
            style={[
              styles.reuploadButton,
              isReuploading && styles.reuploadButtonDisabled,
            ]}
            onPress={handleReupload}
            disabled={isReuploading}
          >
            <Text style={styles.reuploadButtonText}>
              {isReuploading ? 'Reuploading...' : 'Reupload Transcript'}
            </Text>
          </TouchableOpacity>
        )}
        {reuploadError && (
          <Text style={styles.reuploadError}>{reuploadError}</Text>
        )}
        {synced && (
          <View style={styles.syncedBadge}>
            <Text style={styles.syncedText}>✓ Synced to Dashboard</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  backText: {
    color: '#7c3aed',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  metaCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  metaLabel: {
    color: '#8e8e93',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  metaValue: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 40,
  },
  playerBarWrapper: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  transcriptCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  transcriptText: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 24,
  },
  segmentRow: {
    paddingVertical: 12,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  segmentRowActive: {
    borderLeftColor: '#7c3aed',
    backgroundColor: '#7c3aed11',
  },
  segmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  segmentSpeaker: {
    fontSize: 14,
    fontWeight: '600',
  },
  segmentSpeakerActive: {
    color: '#fff',
  },
  segmentSpeakerDimmed: {
    color: '#8e8e93',
  },
  segmentTime: {
    color: '#8e8e93',
    fontSize: 12,
    fontWeight: '600',
  },
  segmentText: {
    fontSize: 15,
    lineHeight: 22,
  },
  segmentTextActive: {
    color: '#fff',
  },
  segmentTextDimmed: {
    color: '#8e8e93',
  },
  insightCard: {
    backgroundColor: '#7c3aed11',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#7c3aed33',
  },
  insightText: {
    color: '#d8b4fe',
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  syncButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reuploadButton: {
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  reuploadButtonDisabled: {
    opacity: 0.6,
  },
  reuploadButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  reuploadError: {
    color: '#ff3b30',
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },
  syncedBadge: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#32d74b44',
    backgroundColor: '#32d74b11',
  },
  syncedText: {
    color: '#32d74b',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MeetingDetailScreen;
