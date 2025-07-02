import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import axios from 'axios';
import EventModal from './EventModal';
import EventList from './EventList';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from "react-native-svg";
// const BASE_URL = 'http://10.0.2.2:5000';
const BASE_URL = 'http://192.168.230.109:5000';
const exampleEventImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';





export default function Admin() {
  const [modalVisible, setModalVisible] = useState(false);
  const [events, setEvents] = useState([]);
  const [viewEvents, setViewEvents] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]); // To store selected seat IDs
  const navigation = useNavigation();

  useEffect(() => {
    if (viewEvents) {
      fetchEvents();
    }
  }, [viewEvents]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/events`);
      setEvents(response.data);
      console.log('Events fetched successfully:', response.data);
    } catch (error) {
      console.error('Error fetching events:', error.message);
    }
  };

  const handleCreateEvent = async (newEvent) => {
    const { _id, createdAt, updatedAt, __v, ...eventData } = newEvent;
  
    console.log('Sending event data:', eventData); // Log the sanitized data
  
    try {
      const response = await axios.post(`${BASE_URL}/events`, eventData);
      setEvents((prevEvents) => [...prevEvents, response.data]);
      setModalVisible(false);
      console.log('Event created successfully:', response.data);
    } catch (error) {
      console.error('Error creating event:', error.response ? error.response.data : error.message);
    }
  };
  

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/events/${id}`);
      setEvents(events.filter(event => event._id !== id));
      console.log(`Event with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting event with ID ${id}:`, error.message);
    }
  };

  const handleBookSeat = async (eventId, seatsToBook) => {
    try {
      const response = await axios.post(`${BASE_URL}/events/book/${eventId}`, { seatsToBook });
      setEvents(events.map(event => (event._id === eventId ? response.data : event)));
      console.log(`Seats booked successfully for event ID ${eventId}:`, response.data);
    } catch (error) {
      console.error(`Error booking seats for event ID ${eventId}:`, error.message);
    }
  };

  const handleLogout = () => {
    // Perform logout actions (e.g., clear user session)
    navigation.navigate('Login'); // Navigate back to the login screen
  };

  const handleCheckboxChange = (seatId) => {
    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.includes(seatId)) {
        return prevSelectedSeats.filter((id) => id !== seatId); // Unselect seat
      } else {
        return [...prevSelectedSeats, seatId]; // Select seat
      }
    });
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
            <TouchableOpacity style={styles.actionButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.actionButtonText}>Create Event</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => setViewEvents(true)}>
              <Text style={styles.actionButtonText}>View My Events</Text>
            </TouchableOpacity>
          </>
        )}

        {viewEvents && (
          <EventList
            events={events}
            onDelete={handleDeleteEvent}
            onBook={handleBookSeat}
            onBack={() => setViewEvents(false)}
          />
        )}

      </ScrollView>

      {modalVisible && (
        <EventModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onCreate={handleCreateEvent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  header: {
    // backgroundColor: '#6A1B9A',
    backgroundColor: "#6F00FF",
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    position: 'relative', 
  },

  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  logoutButton: {
    position: 'absolute',
    right: 15, // Keeps logout button aligned to the right
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 5,
  },

  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  contentContainer: { padding: 15 },

  featuredEvent: {
    marginBottom: 20,
    alignItems: 'center',
  },

  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },

  featuredEventText: {
    marginTop: 10,
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },

  actionButton: {
    // backgroundColor: '#6A1B9A',
    backgroundColor: '#6F00FF',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },

  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },

  checkboxText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});
