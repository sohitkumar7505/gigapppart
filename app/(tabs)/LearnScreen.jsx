import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal,Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NeoBrutalismCard from '../components/NeoBrutalismCard';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
];

const COURSES = [
  {
    id: 1,
    title: 'Financial Management',
    description: 'Learn to manage your earnings effectively',
    duration: '2 hours',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500',
    progress: 60,
  },
  {
    id: 2,
    title: 'Safety First',
    description: 'Essential safety protocols for delivery partners',
    duration: '1.5 hours',
    image: 'https://images.unsplash.com/photo-1507919909716-c8262e491cde?w=500',
    progress: 30,
  },
  {
    id: 3,
    title: 'Customer Service Excellence',
    description: 'Enhance your customer service skills',
    duration: '2.5 hours',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=500',
    progress: 0,
  },
];

const LEGAL_RESOURCES = [
  {
    id: 1,
    title: 'Workers Rights',
    description: 'Understanding your basic rights as a gig worker',
    icon: 'shield-checkmark',
    color: '#FF6B6B',
  },
  {
    id: 2,
    title: 'Working Hours',
    description: 'Legal guidelines on working hours and breaks',
    icon: 'time',
    color: '#4ECDC4',
  },
  {
    id: 3,
    title: 'Compensation Laws',
    description: 'Understanding minimum wage and compensation',
    icon: 'cash',
    color: '#45B7D1',
  },
  {
    id: 4,
    title: 'Dispute Resolution',
    description: 'Legal process for resolving workplace disputes',
    icon: 'hammer',
    color: '#96CEB4',
  },
  {
    id: 5,
    title: 'Insurance Coverage',
    description: 'Understanding your insurance benefits and coverage',
    icon: 'medical',
    color: '#FFB6C1',
  },
  {
    id: 6,
    title: 'Safety Regulations',
    description: 'Essential safety guidelines and regulations',
    icon: 'warning',
    color: '#FFA07A',
  },
  {
    id: 7,
    title: 'Tax Guidelines',
    description: 'Understanding tax obligations and benefits',
    icon: 'document-text',
    color: '#87CEEB',
  },
  {
    id: 8,
    title: 'Vehicle Regulations',
    description: 'Legal requirements for delivery vehicles',
    icon: 'car',
    color: '#98FB98',
  }
];

export default function LearnScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [completedCourses, setCompletedCourses] = useState([]);

  const changeLanguage = async (langCode) => {
    setSelectedLanguage(langCode);
    await AsyncStorage.setItem('userLanguage', langCode);
    setShowLanguageModal(false);
  };
  const openArticle = async () => {
    const url = 'https://globalnaps.org/issue/workers-rights/';
    const supported = await Linking.canOpenURL(url);
  
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Can't open this URL: ${url}`);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#2193b0', '#6dd5ed']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Learning Hub</Text>
          <TouchableOpacity 
            style={styles.languageButton}
            onPress={() => setShowLanguageModal(true)}
          >
            <Ionicons name="language" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Animatable.View animation="fadeInDown" delay={300}>
            <NeoBrutalismCard style={styles.progressCard}>
              <Text style={styles.sectionTitle}>Your Learning Progress</Text>
              <View style={styles.progressStats}>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>3</Text>
                  <Text style={styles.statLabel}>Courses{'\n'}In Progress</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>12</Text>
                  <Text style={styles.statLabel}>Hours{'\n'}Completed</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>5</Text>
                  <Text style={styles.statLabel}>Certificates{'\n'}Earned</Text>
                </View>
              </View>
            </NeoBrutalismCard>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={400}>
            <Text style={styles.sectionHeader}>Featured Courses</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.coursesScroll}
            >
              {COURSES.map((course, index) => (
                <TouchableOpacity key={course.id}>
                  <NeoBrutalismCard style={styles.courseCard}>
                    <Image source={{ uri: course.image }} style={styles.courseImage} />
                    <View style={styles.courseContent}>
                      <Text style={styles.courseTitle}>{course.title}</Text>
                      <Text style={styles.courseDescription}>{course.description}</Text>
                      <View style={styles.courseFooter}>
                        <Text style={styles.courseDuration}>
                          <Ionicons name="time-outline" size={14} /> {course.duration}
                        </Text>
                        {course.progress > 0 && (
                          <View style={styles.progressContainer}>
                            <View style={[styles.progressBar, { width: `${course.progress}%` }]} />
                          </View>
                        )}
                      </View>
                    </View>
                  </NeoBrutalismCard>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={500}>
            <Text style={styles.sectionHeader}>Legal Knowledge Hub</Text>
            <View style={styles.legalGrid}>
              {LEGAL_RESOURCES.map((resource, index) => (
                <TouchableOpacity onPress={openArticle}
                
                  key={resource.id}
                  style={styles.legalCard}
                >
                  <NeoBrutalismCard style={styles.legalCardContent}>
                    <View style={[styles.legalIcon, { backgroundColor: resource.color }]}>
                      <Ionicons name={resource.icon} size={32} color="#fff" />
                    </View>
                    <Text style={styles.legalTitle}>{resource.title}</Text>
                    <Text style={styles.legalDescription}>{resource.description}</Text>
                  </NeoBrutalismCard>
                </TouchableOpacity>
              ))}
            </View>
          </Animatable.View>
        </ScrollView>

        <Modal
          visible={showLanguageModal}
          transparent
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <NeoBrutalismCard style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Language</Text>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    selectedLanguage === lang.code && styles.selectedLanguage
                  ]}
                  onPress={() => changeLanguage(lang.code)}
                >
                  <Text style={[
                    styles.languageText,
                    selectedLanguage === lang.code && styles.selectedLanguageText
                  ]}>
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowLanguageModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </NeoBrutalismCard>
          </View>
        </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  languageButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  progressCard: {
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    color: '#2c3e50',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2193b0',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#ddd',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 15,
  },
  coursesScroll: {
    marginBottom: 20,
  },
  courseCard: {
    width: 280,
    marginRight: 15,
  },
  courseImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  courseContent: {
    padding: 15,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseDuration: {
    fontSize: 12,
    color: '#666',
  },
  progressContainer: {
    width: 100,
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2ecc71',
  },
  legalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 4,
  },
  legalCard: {
    width: '48%',
    marginBottom: 8,
  },
  legalCardContent: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  legalIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  legalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 8,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  legalDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageOption: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#000',
  },
  selectedLanguage: {
    backgroundColor: '#2193b0',
  },
  languageText: {
    fontSize: 16,
    textAlign: 'center',
  },
  selectedLanguageText: {
    color: '#fff',
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});