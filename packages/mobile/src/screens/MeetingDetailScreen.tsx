import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Meeting, updateMeeting } from '../utils/storage';

interface MeetingDetailScreenProps {
    meeting: Meeting;
    onBack: () => void;
}

const MeetingDetailScreen = ({ meeting, onBack }: MeetingDetailScreenProps) => {
    const [synced, setSynced] = React.useState(meeting.synced);

    const handleSync = async () => {
        // Simulate cloud sync
        setSynced(true);
        await updateMeeting({ ...meeting, synced: true });
        // In a real app, this would call the backend API
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title} numberOfLines={1}>{meeting.title}</Text>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
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

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Live Transcript</Text>
                    <View style={styles.transcriptCard}>
                        <Text style={styles.transcriptText}>{meeting.transcript || "No transcript available for this session."}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>AI Insight (Beta)</Text>
                    <View style={styles.insightCard}>
                        <Text style={styles.insightText}>
                            The meeting focused on the initial sync of the Voice PA project.
                            Key discussion revolved around the Rust core implementation and FFI bridges.
                        </Text>
                    </View>
                </View>

                {!synced && (
                    <TouchableOpacity style={styles.syncButton} onPress={handleSync}>
                        <Text style={styles.syncButtonText}>Sync to Cloud</Text>
                    </TouchableOpacity>
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
        marginBottom: 20,
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
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    metaCard: {
        backgroundColor: '#1c1c1e',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
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
