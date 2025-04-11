import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert ,Linking} from 'react-native';
import NeoBrutalismCard from '../components/NeoBrutalismCard';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { sendEmergencySMS, fetchSafetyStatus } from '../../src/services/api.js';


export default function SafetyScreen() {
  const openArticle = async () => {
      const url = 'https://gigwebpart.vercel.app';
      const supported = await Linking.canOpenURL(url);
    
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`Can't open this URL: ${url}`);
      }
    };
  
  const [safetyStatus, setSafetyStatus] = useState({
    locationSharing: false,
    trustedContacts: 0
  });
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch initial safety status
    const loadData = async () => {
      try {
        const status = await fetchSafetyStatus();
        setSafetyStatus(status);
        
        // Get current location
        const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
        if (locStatus !== 'granted') {
          Alert.alert('Permission denied', 'Location permission is needed for safety features');
          return;
        }
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);
      } catch (error) {
        Alert.alert('Error', 'Failed to load safety data');
      }
    };
    
    loadData();
  }, []);

  const handleEmergencySOS = async () => {
    setIsLoading(true);
    try {
      if (!location) {
        throw new Error('Location not available');
      }
      
      // Replace with actual emergency contact numbers
       const emergencyContacts = ['+916239522534', '+918877959674'];
      
      // Send to all emergency contacts
      await Promise.all(emergencyContacts.map(number => 
        sendEmergencySMS(
          number,
          location.latitude,
          location.longitude,
          'I need emergency assistance!'
        )
      ));
      
      Alert.alert('Success', 'Emergency alerts sent to your contacts');
    } catch (error) {
      Alert.alert('Error', 'Failed to send emergency alerts');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareLocation = async () => {
    try {
      // First check if we have permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is needed to share your location');
        return;
      }
  
      // Get current location
      setIsLoading(true);
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      
      // Replace with actual emergency contact numbers
      const emergencyContacts = ['+916239522534', '+918877959674'];
      
      // Send to all emergency contacts
      await Promise.all(emergencyContacts.map(number => 
        sendEmergencySMS(
          number,
          currentLocation.coords.latitude,
          currentLocation.coords.longitude,
          'I am sharing my current location with you for safety purposes.'
        )
      ));
      
      Alert.alert('Success', 'Location shared with your emergency contacts');
    } catch (error) {
      Alert.alert('Error', 'Failed to share location: ' + error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#808080', '#9f6060']}
      style={styles.container}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <NeoBrutalismCard style={[styles.card, styles.emergencyCard]}>
          <TouchableOpacity 
            style={styles.emergencyButton}
            onPress={handleEmergencySOS}
            disabled={isLoading}
          >
            <Text style={styles.emergencyButtonText}>
              {isLoading ? 'SENDING...' : '🚨 EMERGENCY SOS'}
            </Text>
          </TouchableOpacity>
        </NeoBrutalismCard>

        <NeoBrutalismCard style={styles.card}>
          <Text style={styles.title}>Safety Status</Text>
          <Animatable.View style={styles.statusItem} animation="bounceIn" duration={800}>
            <Text style={styles.statusLabel}>Location Sharing</Text>
            <Text style={styles.statusValue}>
              {safetyStatus.locationSharing ? 'Active ✅' : 'Inactive ❌'}
            </Text>
          </Animatable.View>
          <Animatable.View style={styles.statusItem} animation="bounceIn" duration={800}>
            <Text style={styles.statusLabel}>Trusted Contacts</Text>
            <Text style={styles.statusValue}>
              {safetyStatus.trustedContacts} {safetyStatus.trustedContacts > 0 ? 'Set ✅' : 'Not Set ❌'}
            </Text>
          </Animatable.View>
        </NeoBrutalismCard>

        <NeoBrutalismCard style={styles.card}>
          <Text style={styles.title}>Quick Actions</Text>
          <Animatable.View style={styles.actionsList} animation="bounceIn" duration={700}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleShareLocation}
            >
              <Text style={styles.actionButtonText}>Share Location 📍</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}
            onPress={openArticle}


           
            >
              <Text style={styles.actionButtonText}>Danger Zone</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Report Issue ⚠️</Text>
            </TouchableOpacity>
          </Animatable.View>
        </NeoBrutalismCard>

        {/* Rest of your component remains the same */}
      </ScrollView>
    </LinearGradient>
  );
}

// Keep your existing styles...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    padding: 20,
  },
  emergencyCard: {
    backgroundColor: '#FFE5E5',
  },
  emergencyButton: {
    backgroundColor: '#FF4444',
    padding: 20,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#000',
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 16,
  },
  actionsList: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#E5FFE5',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    backgroundColor: '#E5E5FF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tipContent: {
    fontSize: 14,
    color: 'green',
  },
});