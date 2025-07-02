import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Alert
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import Svg, { Path } from 'react-native-svg';

export default function EventList({ events, onBack, onDelete, onBook }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userName, setUserName] = useState('');
  const [multiInviteNames, setMultiInviteNames] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmBookingModalVisible, setConfirmBookingModalVisible] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [isPrivateInvite, setIsPrivateInvite] = useState(false);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);

  const qrCodeRef = useRef();

  const categories = [
    { name: 'All', defaultPrice: 0 },
    { name: 'Music', defaultPrice: 50 },
    { name: 'Sports', defaultPrice: 75 },
    { name: 'Tech', defaultPrice: 100 },
    { name: 'Art', defaultPrice: 40 },
  ];

  const handleBookClick = (event) => {
    setSelectedEvent(event);
    setSelectedSeats([]);
    setModalVisible(true);
    setUserName('');
    setMultiInviteNames('');
    setIsPrivateInvite(false);
  };

  const handleSelectSeat = (seatIndex) => {
    setSelectedSeats((prev) =>
      prev.includes(seatIndex)
        ? prev.filter(i => i !== seatIndex)
        : [...prev, seatIndex]
    );
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0 || selectedSeats.length > (selectedEvent.totalSeats - selectedEvent.reservedSeats)) {
      Alert.alert('Error', 'Please select a valid number of seats.');
      return;
    }

    const price = selectedEvent.price ?? categories.find(cat => cat.name === selectedEvent.category)?.defaultPrice ?? 0;
    setTotalPrice(price * selectedSeats.length);
    setConfirmBookingModalVisible(true);
  };

  const handleConfirmBooking = () => {
    setConfirmBookingModalVisible(false);
    const baseName = isPrivateInvite ? multiInviteNames : userName;
    const qr = `${baseName}-${selectedEvent.name}-${selectedSeats.length}`;
    setQrValue(qr);
    setQrModalVisible(true);
    setBookingTime(new Date().toLocaleString());
  
    // Show "Booking confirmed" popup
    setShowConfirmationMessage(true);
    setTimeout(() => {
      setShowConfirmationMessage(false);
    }, 2000);
  };
  

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const downloadQRCode = async () => {
    const permissionGranted = await requestPermission();
    if (permissionGranted) {
      qrCodeRef.current.capture().then(uri => {
        Alert.alert('Download Successful', `QR code saved to: ${uri}`);
      });
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter((event) => event.category === selectedCategory);

  const seatCount = selectedEvent?.totalSeats || 0;
  const reservedCount = selectedEvent?.reservedSeats || 0;

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      {showConfirmationMessage && (
        
  <View style={styles.confirmationPopup}>
    <Text style={styles.confirmationText}>Your booking is confirmed</Text>
  </View>
)}

      <Text style={styles.title}>My Events</Text>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Back to Create Events</Text>
      </TouchableOpacity>

      <ScrollView horizontal style={styles.categoryList}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.categoryButton, selectedCategory === category.name && styles.selectedCategory]}
            onPress={() => setSelectedCategory(category.name)}
          >
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredEvents.map((event, index) => (
        <View key={index} style={styles.eventCard}>
          <Text style={styles.eventName}>{event.name}</Text>
          <Text style={styles.eventDetails}>{event.date} - {event.time} | Duration: {event.duration} hours</Text>
          <Text style={styles.eventDetails}>{event.reservedSeats}/{event.totalSeats} seats reserved</Text>
          <Text style={styles.eventDetails}>Price: ${event.price}</Text>
          <TouchableOpacity style={styles.button} onPress={() => handleBookClick(event)}>
            <Text style={styles.buttonText}>Book a Seat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => onDelete(event._id)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Booking Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Book a Seat</Text>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setIsPrivateInvite(!isPrivateInvite)}
            >
              <View style={[styles.checkbox, isPrivateInvite && styles.checkboxChecked]} />
              <Text style={styles.checkboxLabel}>Private Invite</Text>
            </TouchableOpacity>

            {!isPrivateInvite ? (
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={userName}
                onChangeText={setUserName}
              />
            ) : (
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Enter multiple names, separated by commas"
                multiline
                value={multiInviteNames}
                onChangeText={setMultiInviteNames}
              />
            )}

            <Text style={styles.modalText}>Select Seats</Text>
            <View style={styles.seatGrid}>
              {Array.from({ length: seatCount }).map((_, index) => {
                const isReserved = index < reservedCount;
                const isSelected = selectedSeats.includes(index);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.seatButton, isReserved && styles.reservedSeat]}
                    disabled={isReserved}
                    onPress={() => handleSelectSeat(index)}
                  >
                    <Svg 
  height="40px" 
  width="40px" 
  viewBox="0 0 510.396 510.396" 
  xmlns="http://www.w3.org/2000/svg" 
  xmlnsXlink="http://www.w3.org/1999/xlink"
>
  <Path 
    d="M460.344,159.26c-27.564,0-52.568,22.424-52.568,49.988v78.836v4.924v33.736c0,11.516-4.204,24.452-15.724,24.452H122.264c-11.52,0-26.488-12.936-26.488-24.452v-33.736v-4.924v-78.836c0-27.564-19.624-49.988-47.184-49.988C21.024,159.26,0,181.684,0,209.248c0,19.06,8.424,36.2,25.564,44.728c2.712,1.348,2.212,4.124,2.212,7.16v90.768c0,18.468,12,34.252,28,40.568v33.984c0,11.536,15.076,24.744,26.612,24.744H432.6c11.54,0,15.176-13.204,15.176-24.744v-34.228c16-6.488,28-22.104,28-40.324v-90.768c0-3.036,4.18-5.812,6.896-7.164c17.136-8.528,27.724-25.668,27.724-44.728C510.396,181.684,487.912,159.26,460.344,159.26z" 
    fill={isReserved ? '#999' : isSelected ? '#4CAF50' : '#2196F3'} 
  />
  
  <Path 
    d="M381.472,59.196H133.344c-39.7,0-77.568,28.3-77.568,68v16.9c32,4.824,56,32.16,56,65.152v58.584c0,4.176,5.388,3.428,11.812,3.364h266.936c1.692,0,1.252-3.744,1.252-3.364v-58.584c0-33.164,24-60.616,56-65.228v-16.824C447.776,87.496,421.172,59.196,381.472,59.196z" 
    fill={isReserved ? '#999' : isSelected ? '#4CAF50' : '#2196F3'} 
  />

  <Path 
    d="M386.276,287.196H122.264c-2.648,0-10.488-0.46-10.488,2.188v3.624v33.736c0,8.452,0,8.452,10.488,8.452h265.512c4,0,4,0,4-8.452v-33.736v-4.376C391.712,287.172,388.924,287.196,386.276,287.196z" 
    fill={isReserved ? '#999' : isSelected ? '#4CAF50' : '#2196F3'} 
  />
</Svg>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.selectedSeatsText}>Selected Seats: {selectedSeats.length}</Text>
            <TouchableOpacity style={styles.createButton} onPress={handleBooking}>
              <Text style={styles.createButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <Modal visible={confirmBookingModalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Confirm Booking</Text>
            <Text style={styles.priceText}>Total Price: ${totalPrice}</Text>
            <TouchableOpacity style={styles.createButton} onPress={handleConfirmBooking}>
              <Text style={styles.createButtonText}>Confirm Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setConfirmBookingModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* QR Modal */}
      <Modal visible={qrModalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Booking Ticket</Text>
            <Text style={styles.ticketInfo}>Name: {isPrivateInvite ? multiInviteNames : userName}</Text>
            <Text style={styles.ticketInfo}>Event: {selectedEvent?.name}</Text>
            <Text style={styles.ticketInfo}>Date: {selectedEvent?.date}</Text>
            <Text style={styles.ticketInfo}>Time: {getCurrentTime()}</Text>
            <Text style={styles.ticketInfo}>Tickets: {selectedSeats.length}</Text>

            {qrValue ? (
              <ViewShot ref={qrCodeRef} options={{ format: 'png', quality: 0.9 }}>
                <QRCode value={qrValue} size={200} />
              </ViewShot>
            ) : null}

            <TouchableOpacity style={styles.createButton} onPress={() => setQrModalVisible(false)}>
              <Text style={styles.createButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.createButton} onPress={downloadQRCode}>
              <Text style={styles.createButtonText}>Download QR Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { margin: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  noEvents: { fontSize: 16, fontStyle: 'italic', color: '#aaa' },
  eventCard: { marginBottom: 10, padding: 10, backgroundColor: '#6A1B9A', borderRadius: 5 },
  eventName: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  eventDetails: { fontSize: 14, color: '#fff' },
  button: { marginTop: 15, padding: 10, backgroundColor: '#6A1B9A', borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  backButton: { marginBottom: 10 },
  backButtonText: { color: '#6A1B9A', fontWeight: 'bold' },
  categoryList: { flexDirection: 'row', marginBottom: 15 },
  categoryButton: { padding: 10, backgroundColor: '#ccc', borderRadius: 8, marginRight: 10 },
  selectedCategory: { backgroundColor: '#6A1B9A' },
  categoryText: { color: '#fff', fontWeight: 'bold' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modal: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },
  modalText: { fontWeight: 'bold', marginBottom: 5 },
  seatGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  seatButton: { padding: 5, margin: 4, borderRadius: 5 },
  reservedSeat: { opacity: 0.4 },
  selectedSeatsText: { marginTop: 10 },
  createButton: { marginTop: 15, backgroundColor: '#6A1B9A', padding: 10, borderRadius: 5 },
  createButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  cancelButton: { marginTop: 10, backgroundColor: '#aaa', padding: 10, borderRadius: 5 },
  cancelButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  priceText: { fontSize: 16, marginBottom: 15 },
  ticketInfo: { marginBottom: 5 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#000', marginRight: 10 },
  checkboxChecked: { backgroundColor: '#6A1B9A' },
  checkboxLabel: { fontSize: 14 },
  confirmationPopup: {
    position: 'relative',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10000,
    elevation: 20,
    backgroundColor: '#4CAF50',
    padding: 12,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  confirmationText: {
    color: 'white',
    fontWeight: 'bold',
  }  
});
