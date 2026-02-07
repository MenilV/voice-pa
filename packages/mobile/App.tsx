/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import RecorderScreen from './src/screens/RecorderScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import MeetingDetailScreen from './src/screens/MeetingDetailScreen';
import { Meeting } from './src/utils/storage';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<'REC' | 'HISTORY'>('REC');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  if (selectedMeeting) {
    return (
      <MeetingDetailScreen
        meeting={selectedMeeting}
        onBack={() => setSelectedMeeting(null)}
      />
    );
  }

  return (
    <View style={styles.container}>
      {activeTab === 'REC' ? (
        <RecorderScreen />
      ) : (
        <HistoryScreen onSelectMeeting={(m) => setSelectedMeeting(m)} />
      )}

      {/* Simple Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('REC')}
        >
          <Text style={[styles.tabText, activeTab === 'REC' && styles.tabTextActive]}>Recorder</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('HISTORY')}
        >
          <Text style={[styles.tabText, activeTab === 'HISTORY' && styles.tabTextActive]}>History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  tabBar: {
    flexDirection: 'row',
    height: 90,
    backgroundColor: '#1c1c1e',
    borderTopWidth: 1,
    borderTopColor: '#2c2c2e',
    paddingBottom: 30,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: '#8e8e93',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
});

export default App;
