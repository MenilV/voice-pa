import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { getMeetings, Meeting } from '../utils/storage';

interface HistoryScreenProps {
    onSelectMeeting: (meeting: Meeting) => void;
}

const HistoryScreen = ({ onSelectMeeting }: HistoryScreenProps) => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadMeetings = useCallback(async () => {
        const data = await getMeetings();
        setMeetings(data);
    }, []);

    useEffect(() => {
        loadMeetings();
    }, [loadMeetings]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadMeetings();
        setRefreshing(false);
    }, [loadMeetings]);

    const renderItem = ({ item }: { item: Meeting }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => onSelectMeeting(item)}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDuration}>{item.duration}</Text>
            </View>
            <Text style={styles.cardDate}>{item.date}</Text>
            <Text style={styles.cardPreview} numberOfLines={2}>
                {item.transcriptPreview || item.transcript.substring(0, 100) + '...'}
            </Text>
            <View style={styles.tagContainer}>
                <View style={[styles.tag, item.synced ? styles.tagSynced : styles.tagLocal]}>
                    <Text style={[styles.tagText, item.synced ? styles.tagTextSynced : styles.tagTextLocal]}>
                        {item.synced ? 'Synced' : 'Local Only'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>History</Text>
            </View>

            <FlatList
                data={meetings}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No recordings yet.</Text>
                    </View>
                }
            />
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
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#fff',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#2c2c2e',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        flex: 1,
        marginRight: 8,
    },
    cardDuration: {
        fontSize: 14,
        color: '#8e8e93',
        fontWeight: '500',
    },
    cardDate: {
        fontSize: 14,
        color: '#8e8e93',
        marginBottom: 12,
    },
    cardPreview: {
        fontSize: 15,
        color: '#c7c7cc',
        lineHeight: 20,
        marginBottom: 16,
    },
    tagContainer: {
        flexDirection: 'row',
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
    },
    tagLocal: {
        backgroundColor: '#ff950022',
        borderColor: '#ff950044',
    },
    tagSynced: {
        backgroundColor: '#32d74b22',
        borderColor: '#32d74b44',
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
    },
    tagTextLocal: {
        color: '#ff9500',
    },
    tagTextSynced: {
        color: '#32d74b',
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
    },
    emptyText: {
        color: '#8e8e93',
        fontSize: 16,
    },
});

export default HistoryScreen;
