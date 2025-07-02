import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Slider } from '@miblanchard/react-native-slider';
import { Picker } from '@react-native-picker/picker';

export default function EventModal({ visible, onClose, onCreate }) {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [eventTime, setEventTime] = useState(new Date());
  const [eventDuration, setEventDuration] = useState(1);
  const [totalSeats, setTotalSeats] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('Music');
  const [price, setPrice] = useState(0);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const validateDateTime = () => {
    const now = new Date(); 
    const selectedDateTime = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
      eventTime.getHours(),
      eventTime.getMinutes()
    );

   
    if (selectedDateTime < now) {
      Alert.alert('Invalid Date/Time', 'Please select a date and time in the future.');
      return false;
    }
    return true;
  };

  const handleCreate = () => {
    // Validate price
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price');
      return;
    }

    // Validate totalSeats
    if (isNaN(totalSeats) || totalSeats <= 0) {
      alert('Please enter a valid number of seats');
      return;
    }

    // Validate date and time
    if (!validateDateTime()) {
      return;
    }

    // Proceed with event creation
    const newEvent = {
      name: eventName,
      date: eventDate.toISOString().split('T')[0],
      time: `${eventTime.getHours()}:${eventTime.getMinutes()}`,
      duration: eventDuration,
      totalSeats,
      category: selectedCategory,
      price: price,
    };

    onCreate(newEvent);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Create New Event</Text>

          {/* Event Name Input */}
          <TextInput
            style={styles.input}
            placeholder="Event Name"
            placeholderTextColor="#888"
            value={eventName}
            onChangeText={setEventName}
          />

          {/* Category Picker */}
          <Text style={styles.label}>Category</Text>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Music" value="Music" />
            <Picker.Item label="Sports" value="Sports" />
            <Picker.Item label="Tech" value="Tech" />
            <Picker.Item label="Education" value="Education" />
            <Picker.Item label="Business" value="Business" />
          </Picker>

          {/* Date Picker */}
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.pickerButtonText}>
              Select Date: {eventDate.toDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={eventDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setEventDate(selectedDate);
              }}
              minimumDate={new Date()} 
            />
          )}

          {/* Time Picker */}
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.pickerButtonText}>
              Select Time: {`${eventTime.getHours()}:${eventTime.getMinutes()}`}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={eventTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  const now = new Date();
                  const selectedDateTime = new Date(
                    eventDate.getFullYear(),
                    eventDate.getMonth(),
                    eventDate.getDate(),
                    selectedTime.getHours(),
                    selectedTime.getMinutes()
                  );

                  if (selectedDateTime < now) {
                    Alert.alert('Invalid Time', 'Please select a time in the future.');
                    return;
                  }
                  setEventTime(selectedTime);
                }
              }}
            />
          )}

          {/* Duration Slider */}
          <Text style={styles.label}>Duration: {eventDuration} hours</Text>
          <Slider
            value={eventDuration}
            onValueChange={(value) => setEventDuration(Math.round(value))}
            minimumValue={1}
            maximumValue={12}
            step={1}
            thumbTintColor="#6A1B9A"
            minimumTrackTintColor="#6A1B9A"
          />

          {/* Total Seats Input */}
          <Text style={styles.label}>Total Number of Seats</Text>
          <View style={styles.seatInputContainer}>
            <TouchableOpacity
              onPress={() => setTotalSeats(totalSeats > 1 ? totalSeats - 1 : 1)}
              style={styles.incrementDecrementButton}
            >
              <Text style={styles.incrementDecrementText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.seatCount}>{totalSeats}</Text>
            <TouchableOpacity
              onPress={() => setTotalSeats(totalSeats + 1)}
              style={styles.incrementDecrementButton}
            >
              <Text style={styles.incrementDecrementText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Price per Seat Input */}
          <Text style={styles.label}>Price per Seat</Text>
          <TextInput
            style={styles.input}
            placeholder="Price per Seat"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={price.toString()}
            onChangeText={(value) => setPrice(Number(value))}
          />

          {/* Create and Cancel Buttons */}
          <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
            <Text style={styles.createButtonText}>Create Event</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
  },
  picker: {
    width: '100%',
    height: 50,
    marginVertical: 10,
  },
  pickerButton: {
    width: '100%',
    padding: 12,
    marginVertical: 10,
    backgroundColor: '#6A1B9A',
    borderRadius: 8,
    alignItems: 'center',
  },
  pickerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  createButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#6A1B9A',
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f44336',
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  seatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  incrementDecrementButton: {
    backgroundColor: '#6A1B9A',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  incrementDecrementText: {
    color: '#fff',
    fontSize: 18,
  },
  seatCount: {
    fontSize: 18,
    color: '#333',
  },
});