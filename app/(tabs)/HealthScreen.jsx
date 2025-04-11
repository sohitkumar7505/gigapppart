import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Platform } from 'react-native';
import NeoBrutalismCard from '../components/NeoBrutalismCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function HealthScreen() {
  const [waterIntake, setWaterIntake] = useState(0);
  const [lastWaterTime, setLastWaterTime] = useState(null);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [nextRestTime, setNextRestTime] = useState(null);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [insuranceForm, setInsuranceForm] = useState({
    name: '',
    age: '',
    phone: '',
    vehicleType: 'bike',
    insuranceType: 'health',
  });

  // Water intake goal (in glasses)
  const dailyWaterGoal = 8;
  
  // Rest interval in minutes
  const restInterval = 120; // 2 hours

  useEffect(() => {
    if (!nextRestTime) {
      const next = new Date();
      next.setMinutes(next.getMinutes() + restInterval);
      setNextRestTime(next);
    }

    const timer = setInterval(() => {
      if (nextRestTime && new Date() >= nextRestTime) {
        if (Platform.OS !== 'web') {
          console.log('Time to take a rest!');
        }
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [nextRestTime]);

  const addWater = () => {
    const newIntake = waterIntake + 1;
    setWaterIntake(newIntake);
    setLastWaterTime(new Date());
  };

  const startRest = () => {
    setIsResting(true);
    const next = new Date();
    next.setMinutes(next.getMinutes() + restInterval);
    setNextRestTime(next);
  };

  const endRest = () => {
    setIsResting(false);
  };

  const formatTimeUntilRest = () => {
    if (!nextRestTime) return 'Not set';
    const now = new Date();
    const diff = nextRestTime - now;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const handleInsuranceSubmit = () => {
    // Here you would typically send the form data to your backend
    console.log('Insurance form submitted:', insuranceForm);
    setShowInsuranceModal(false);
    // Reset form
    setInsuranceForm({
      name: '',
      age: '',
      phone: '',
      vehicleType: 'bike',
      insuranceType: 'health',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#43cea2', '#185a9d']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Animatable.View animation="fadeInDown" delay={300}>
            <NeoBrutalismCard style={styles.insuranceCard}>
              <View style={styles.insuranceHeader}>
                <Ionicons name="shield-checkmark" size={32} color="#3498db" />
                <Text style={styles.insuranceTitle}>Insurance Coverage</Text>
              </View>
              <Text style={styles.insuranceDescription}>
                Protect yourself and your vehicle with our comprehensive insurance plans
              </Text>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={() => setShowInsuranceModal(true)}
              >
                <Text style={styles.applyButtonText}>Apply for Insurance</Text>
              </TouchableOpacity>
            </NeoBrutalismCard>
          </Animatable.View>

          <Animatable.View animation="fadeInDown" delay={400}>
            <NeoBrutalismCard style={styles.waterCard}>
              <View style={styles.waterHeader}>
                <Ionicons name="water" size={32} color="#3498db" />
                <Text style={styles.waterTitle}>Water Intake</Text>
              </View>
              <View style={styles.waterProgress}>
                <Text style={styles.waterCount}>{waterIntake} / {dailyWaterGoal}</Text>
                <Text style={styles.waterSubtext}>glasses today</Text>
              </View>
              <View style={styles.waterGlasses}>
                {[...Array(dailyWaterGoal)].map((_, index) => (
                  <Ionicons 
                    key={index}
                    name={index < waterIntake ? "water" : "water-outline"}
                    size={24}
                    color={index < waterIntake ? "#3498db" : "#bdc3c7"}
                  />
                ))}
              </View>
              <TouchableOpacity style={styles.addWaterButton} onPress={addWater}>
                <Text style={styles.buttonText}>Add Water Glass</Text>
              </TouchableOpacity>
              {lastWaterTime && (
                <Text style={styles.lastDrink}>
                  Last drink: {lastWaterTime.toLocaleTimeString()}
                </Text>
              )}
            </NeoBrutalismCard>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={500}>
            <NeoBrutalismCard style={styles.restCard}>
              <View style={styles.restHeader}>
                <Ionicons name="timer" size={32} color="#e74c3c" />
                <Text style={styles.restTitle}>Rest Timer</Text>
              </View>
              <View style={styles.restContent}>
                {isResting ? (
                  <>
                    <Text style={styles.restingText}>Taking a break... 🌟</Text>
                    <TouchableOpacity style={[styles.restButton, styles.endRestButton]} onPress={endRest}>
                      <Text style={styles.buttonText}>End Rest</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.nextRestText}>
                      Next rest in: {formatTimeUntilRest()}
                    </Text>
                    <TouchableOpacity style={styles.restButton} onPress={startRest}>
                      <Text style={styles.buttonText}>Start Rest</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </NeoBrutalismCard>
          </Animatable.View>

          <Modal
            visible={showInsuranceModal}
            transparent
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <NeoBrutalismCard style={styles.modalContent}>
                <Text style={styles.modalTitle}>Insurance Application</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={insuranceForm.name}
                    onChangeText={(text) => setInsuranceForm({...insuranceForm, name: text})}
                    placeholder="Enter your full name"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Age</Text>
                  <TextInput
                    style={styles.input}
                    value={insuranceForm.age}
                    onChangeText={(text) => setInsuranceForm({...insuranceForm, age: text})}
                    placeholder="Enter your age"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    value={insuranceForm.phone}
                    onChangeText={(text) => setInsuranceForm({...insuranceForm, phone: text})}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Vehicle Type</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={insuranceForm.vehicleType}
                      onValueChange={(value) => setInsuranceForm({...insuranceForm, vehicleType: value})}
                      style={styles.picker}
                    >
                      <Picker.Item label="Bike" value="bike" />
                      <Picker.Item label="Scooter" value="scooter" />
                      <Picker.Item label="Car" value="car" />
                    </Picker>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Insurance Type</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={insuranceForm.insuranceType}
                      onValueChange={(value) => setInsuranceForm({...insuranceForm, insuranceType: value})}
                      style={styles.picker}
                    >
                      <Picker.Item label="Health Insurance" value="health" />
                      <Picker.Item label="Vehicle Insurance" value="vehicle" />
                      <Picker.Item label="Both" value="both" />
                    </Picker>
                  </View>
                </View>

                <View style={styles.buttonGroup}>
                  <TouchableOpacity 
                    style={styles.submitButton}
                    onPress={handleInsuranceSubmit}
                  >
                    <Text style={styles.buttonText}>Submit Application</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setShowInsuranceModal(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </NeoBrutalismCard>
            </View>
          </Modal>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    padding: 16,
  },
  insuranceCard: {
    padding: 20,
    marginBottom: 16,
  },
  insuranceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  insuranceTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginLeft: 12,
  },
  insuranceDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  applyButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  waterCard: {
    padding: 20,
    marginBottom: 16,
  },
  waterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  waterTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginLeft: 12,
  },
  waterProgress: {
    alignItems: 'center',
    marginBottom: 20,
  },
  waterCount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#3498db',
  },
  waterSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  waterGlasses: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  addWaterButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  lastDrink: {
    textAlign: 'center',
    marginTop: 12,
    color: '#666',
  },
  restCard: {
    padding: 20,
    marginBottom: 16,
  },
  restHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  restTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginLeft: 12,
  },
  restContent: {
    alignItems: 'center',
  },
  restingText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e74c3c',
    marginBottom: 20,
  },
  nextRestText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  restButton: {
    backgroundColor: '#e74c3c',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    borderWidth: 2,
    borderColor: '#000',
  },
  endRestButton: {
    backgroundColor: '#2ecc71',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  buttonGroup: {
    gap: 12,
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
});