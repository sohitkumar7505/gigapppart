import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useRouter } from 'expo-router';
const [date, setDate] = React.useState(new Date());

const EarningDetail = () => {
  const router=useRouter();
  const [earningSource, setEarningSource] = React.useState('Swiggy');
  const [earningAmount, setEarningAmount] = React.useState('');
  const [expenseCategory, setExpenseCategory] = React.useState('Petrol');
  const [expenseAmount, setExpenseAmount] = React.useState('');
  const [date, setDate] = React.useState(new Date());


  const API_BASE_URL = 'https://gigbackpart.onrender.com'; // change this to your actual backend URL

 

  const handleSaveEarning = async () => {
    if (!earningAmount) {
      Alert.alert('Validation', 'Please enter the earning amount');
      return;
    }
  
    const currentDate = new Date();
  
    try {
      const response = await fetch(`${API_BASE_URL}/earning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: earningSource,
          amount: parseFloat(earningAmount),
          date: currentDate.toISOString(),
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Earning saved successfully');
        setEarningAmount(''); // clear earning amount input
      } else {
        Alert.alert('Error', result.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSaveExpense = async () => {
    if (!expenseAmount) {
      Alert.alert('Validation', 'Please enter the expense amount');
      return;
    }
  
    const currentDate = new Date();
  
    try {
      const response = await fetch(`${API_BASE_URL}/expense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: expenseCategory,
          amount: parseFloat(expenseAmount),
          date: currentDate.toISOString(),
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Expense saved successfully');
        setExpenseAmount('');
      } else {
        Alert.alert('Error', result.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  
  const handleGenerateReport = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: date.toISOString().split('T')[0], // YYYY-MM-DD format
        }),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert('Report', JSON.stringify(result, null, 2));
      } else {
        Alert.alert('Error', result.message || 'Unable to fetch report');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
      <Text style={styles.heading}>Add Earning</Text>
      <Text style={styles.label}>Source</Text>
      <View style={styles.dropdown}>
        <Picker selectedValue={earningSource} onValueChange={(itemValue) => setEarningSource(itemValue)}>
          <Picker.Item label="Swiggy" value="Swiggy" />
          <Picker.Item label="Zomato" value="Zomato" />
          <Picker.Item label="zepto" value="zepto" />
          <Picker.Item label="zomato" value="zomato" />
          <Picker.Item label="ola" value="ola" />
        </Picker>
      </View>
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={earningAmount}
        onChangeText={setEarningAmount}
      />
      <TouchableOpacity style={styles.saveButtonGreen} onPress={handleSaveEarning}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <Text style={[styles.heading, { marginTop: 30 }]}>Add Expense</Text>
      <Text style={styles.label}>Category</Text>
      <View style={styles.dropdown}>
        <Picker selectedValue={expenseCategory} onValueChange={(itemValue) => setExpenseCategory(itemValue)}>
          <Picker.Item label="Petrol" value="Petrol" />
          <Picker.Item label="Food" value="Food" />
          <Picker.Item label="toll" value="toll" />
        </Picker>
      </View>
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={expenseAmount}
        onChangeText={setExpenseAmount}
      />
      <TouchableOpacity style={styles.saveButtonRed} onPress={handleSaveExpense}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
{/* 
      <Text style={[styles.heading, { marginTop: 30 }]}>Generate Report</Text>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
          <Text>{date.toLocaleDateString('en-GB')}</Text>
        </TouchableOpacity>
        <Text style={{ marginLeft: 10 }}>Target</Text>
      </View> */}

      {/* {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || date;
            setShowDatePicker(false);
            setDate(currentDate);
          }}
        />
      )} */}

      <TouchableOpacity style={styles.reportButton} onPress={handleGenerateReport}>
        <Text style={styles.reportButtonText}>submmit today detail</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// ... keep styles unchanged ...



const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f9f9f9',
    flex: 1,
  },

  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    marginBottom: 16,
  },

  label: {
    fontSize: 16,
    color: '#555',
    marginVertical: 6,
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  saveButtonGreen: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },

  saveButtonRed: {
    backgroundColor: '#dc3545',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },

  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.5,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,
  },

  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    flex: 1,
    fontSize: 16,
  },

  reportButton: {
    backgroundColor: '#222',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    margin:10
  },

  reportButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.5,
  },
});


export default EarningDetail;
