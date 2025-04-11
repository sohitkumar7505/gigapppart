import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NeoBrutalismCard from './components/NeoBrutalismCard';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Update this to your actual backend URL
const API_BASE_URL = 'https://gigbackpart.onrender.com'; // For physical devices: 'http://YOUR_LOCAL_IP:3000'

export default function RaiseConcern() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('fraud');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || !address || !description) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      console.log('Submitting form data:', { name, address, category, description });
  
      const response = await fetch(`${API_BASE_URL}/submit-mail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          address,
          category,
          description
        }),
      });
  
      console.log('Response status:', response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit concern');
      }
  
      const result = await response.json();
      console.log('Success:', result);
  
      // Alert and then go back
      Alert.alert('Success', 'Concern submitted successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
  
      // Optionally reset form fields
      setName('');
      setAddress('');
      setCategory('fraud');
      setDescription('');
  
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 229, 229, 0.4)', 'rgba(255, 255, 255, 0.8)']}
        style={styles.background}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Animatable.View animation="fadeInDown" duration={800}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            
            <NeoBrutalismCard style={styles.card}>
              <View style={styles.headerContainer}>
                <Text style={styles.title}>Raise a Concern</Text>
                <Text style={styles.subtitle}>We're here to help you</Text>
              </View>
              
              <Animatable.View animation="fadeInUp" delay={300}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your full name"
                    placeholderTextColor="#999"
                  />
                </View>
              </Animatable.View>

              <Animatable.View animation="fadeInUp" delay={400}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Address</Text>
                  <TextInput
                    style={[styles.input, styles.addressInput]}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Enter your current address"
                    placeholderTextColor="#999"
                    multiline
                  />
                </View>
              </Animatable.View>

              <Animatable.View animation="fadeInUp" delay={500}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Complaint Category</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={category}
                      onValueChange={(itemValue) => setCategory(itemValue)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Fraud" value="fraud" />
                      <Picker.Item label="Exploitation" value="exploitation" />
                      <Picker.Item label="Payment Issue" value="payment" />
                      <Picker.Item label="Safety Concern" value="safety" />
                      <Picker.Item label="Other" value="other" />
                    </Picker>
                  </View>
                </View>
              </Animatable.View>

              <Animatable.View animation="fadeInUp" delay={600}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Please provide detailed information about your concern"
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </Animatable.View>

              <Animatable.View animation="fadeInUp" delay={800}>
                <TouchableOpacity 
                  style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  <Text style={styles.submitButtonText}>
                    {isSubmitting ? 'Submitting...' : 'Submit Concern'}
                  </Text>
                </TouchableOpacity>
                
                <Text style={styles.disclaimer}>
                  Your concern will be reviewed within 24 hours
                </Text>
              </Animatable.View>
            </NeoBrutalismCard>
          </Animatable.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollView: {
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  card: {
    padding: 25,
    borderRadius: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#1a1a1a',
  },
  addressInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  attachButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  attachButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  attachSubtext: {
    fontSize: 14,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#2ECC71',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginTop: 15,
  },
});