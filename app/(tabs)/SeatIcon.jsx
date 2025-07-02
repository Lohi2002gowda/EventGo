import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SeatIconExample = () => {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      <Icon name="couch" size={30} color="#6A1B9A" style={{ margin: 5 }} />
      {/* Add more icons if needed */}
    </View>
  );
};

export default SeatIconExample;
