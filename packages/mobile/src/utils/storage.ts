import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@voice_pa_meetings';

export interface Meeting {
    id: string;
    title: string;
    date: string;
    duration: string;
    transcript: string;
    transcriptPreview: string;
    participants: number;
    type: 'Mobile';
    synced: boolean;
}

export const getMeetings = async (): Promise<Meeting[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Failed to fetch meetings', e);
        return [];
    }
};

export const saveMeeting = async (meeting: Meeting): Promise<void> => {
    try {
        const meetings = await getMeetings();
        const newMeetings = [meeting, ...meetings];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newMeetings));
    } catch (e) {
        console.error('Failed to save meeting', e);
    }
};

export const deleteMeeting = async (id: string): Promise<void> => {
    try {
        const meetings = await getMeetings();
        const newMeetings = meetings.filter(m => m.id !== id);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newMeetings));
    } catch (e) {
        console.error('Failed to delete meeting', e);
    }
};

export const updateMeeting = async (updatedMeeting: Meeting): Promise<void> => {
    try {
        const meetings = await getMeetings();
        const newMeetings = meetings.map(m => m.id === updatedMeeting.id ? updatedMeeting : m);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newMeetings));
    } catch (e) {
        console.error('Failed to update meeting', e);
    }
};
