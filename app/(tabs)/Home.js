import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import EventModal from './EventModal';
import EventList from './EventList';

// const BASE_URL = 'http://10.0.2.2:5000';
const BASE_URL = 'http://192.168.230.109:5000';
const exampleEventImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [events, setEvents] = useState([]);
  const [viewEvents, setViewEvents] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (viewEvents) {
      fetchEvents();
    }
  }, [viewEvents]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/events`);
      setEvents(response.data);
      console.log('Events fetched successfully:', response.data);
    } catch (error) {
      console.error('Error fetching events:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Perform logout actions (e.g., clear user session)
    navigation.navigate('Login'); // Navigate back to the login screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome to EventGo!</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.featuredEvent}>
          <Image source={{ uri: exampleEventImage }} style={styles.eventImage} />
          <Text style={styles.featuredEventText}>Featured Event: Big Concert</Text>
        </View>

        {!viewEvents && (
          <>
            <TouchableOpacity style={styles.actionButton} onPress={() => setViewEvents(true)}>
              <Text style={styles.actionButtonText}>View My Events</Text>
            </TouchableOpacity>
          </>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#6A1B9A" />
        ) : (
          viewEvents && (
            <EventList
              events={events}
              onDelete={(id) => console.log(`Delete event with ID: ${id}`)}
              onBook={(eventId, seats) => console.log(`Book ${seats} seats for event ${eventId}`)}
              onBack={() => setViewEvents(false)}
            />
          )
        )}
      </ScrollView>

      {modalVisible && (
        <EventModal visible={modalVisible} onClose={() => setModalVisible(false)} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    backgroundColor: '#6A1B9A',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 5,
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  contentContainer: { padding: 15 },
  featuredEvent: { marginBottom: 20, alignItems: 'center' },
  eventImage: { width: '100%', height: 200, borderRadius: 8 },
  featuredEventText: { marginTop: 10, fontSize: 18, color: '#fff', fontWeight: 'bold' },
  actionButton: {
    backgroundColor: '#6A1B9A',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  actionButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

