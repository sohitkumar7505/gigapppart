import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Modal } from 'react-native';
import NeoBrutalismCard from '../components/NeoBrutalismCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Animatable from 'react-native-animatable';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import EarningsDetail from '../components/EarningsDetail';

const { width } = Dimensions.get('window');

export default function EarningsScreen() {
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [showEarningsDetail, setShowEarningsDetail] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['rgba(58, 131, 244, 0.4)', 'rgba(255, 255, 255, 0.8)']}
        style={styles.background}
      >
        <View style={styles.header}>
          <View>
            <Animatable.Text
              animation="fadeInDown"
              style={styles.greeting}
            >
              Hello Praveen 👋
            </Animatable.Text>
            <Animatable.Text
              animation="fadeInDown"
              delay={300}
              style={styles.subGreeting}
            >
              Let's check your earnings
            </Animatable.Text>
          </View>
          <TouchableOpacity onPress={pickImage} style={styles.profileContainer}>
            <Image
              source={{
                uri: image || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
              }}
              style={styles.profileImage}
            />
            <View style={styles.statusBadge} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardRow}>
            <Animatable.View
              animation="fadeInLeft"
              delay={500}
              style={styles.cardWrapper}
            >
              <TouchableOpacity onPress={() => setShowEarningsDetail(true)}>
                <NeoBrutalismCard style={styles.earningsCard}>
                  <View>
                    <Text style={styles.cardTitle}>Total Earnings</Text>
                    <Text style={styles.amount}>$2,450.00</Text>
                    <Text style={styles.subtitle}>This Week</Text>
                    <View style={styles.trendContainer}>
                      <Text style={styles.trendUp}>↑ 12%</Text>
                      <Text style={styles.trendText}>vs last week</Text>
                    </View>
                  </View>
                </NeoBrutalismCard>
              </TouchableOpacity>
            </Animatable.View>

            <Animatable.View
              animation="fadeInRight"
              delay={700}
              style={styles.cardWrapper}
            >
              <TouchableOpacity onPress={() => router.push("/RaiseConcern")}>
                <NeoBrutalismCard style={[styles.earningsCard, styles.concernCard]}>
                  <View>
                    <Text style={styles.cardTitle}>Raise a Concern</Text>
                    <Text style={styles.subtitle}>Need help?</Text>
                    <Text style={styles.emoji}>⚠</Text>
                  </View>
                </NeoBrutalismCard>
              </TouchableOpacity>
            </Animatable.View>
          </View>

          <Animatable.View animation="fadeInUp" delay={900}>
            <NeoBrutalismCard style={styles.plannerCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Financial Goals</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.goalItem}>
                <View>
                  <Text style={styles.goalText}>Emergency Fund</Text>
                  <Text style={styles.goalAmount}>$5,000 / $10,000</Text>
                </View>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progress, { width: '50%' }]} />
                  </View>
                  <Text style={styles.progressText}>50%</Text>
                </View>
              </View>
            </NeoBrutalismCard>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={1100}>
            <NeoBrutalismCard style={styles.statsCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Quick Stats</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAll}>This Week</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>32</Text>
                  <Text style={styles.statLabel}>Gigs</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>4.9</Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>28h</Text>
                  <Text style={styles.statLabel}>Hours</Text>
                </View>
              </View>
            </NeoBrutalismCard>
          </Animatable.View>
          <Animatable.View style={{ marginTop: 20, justifyContent: "flex-end", alignItems: "flex-end" }}

            animation="pulse"
            duration={800}
            iterationCount={'infinite'}


          >
            <TouchableOpacity onPress={() => router.push("/chatbotAssistant")} style={styles.profileContainer}>
              <Image
                source={{
                  uri: "https://www.kindpng.com/picc/m/179-1798038_chatbots-builder-pricing-crozdesk-free-chatbot-hd-png.png"
                }}
                style={styles.profileImage}
              />
              <View style={styles.statusBadge} />
            </TouchableOpacity>
          </Animatable.View>
        </ScrollView>

        <Modal
          visible={showEarningsDetail}
          animationType="slide"
          onRequestClose={() => setShowEarningsDetail(false)}
        >
          <EarningsDetail onClose={() => setShowEarningsDetail(false)} />
        </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  profileContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  statusBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2ECC71',
    borderWidth: 2,
    borderColor: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cardRow: {
    flexDirection: 'row',
    marginVertical: 10,
    gap: 10,
  },
  cardWrapper: {
    flex: 1,
  },
  earningsCard: {
    padding: 15,
    height: 160,
  },
  concernCard: {
    backgroundColor: '#FFE5E5',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  seeAll: {
    fontSize: 14,
    color: '#2ECC71',
    fontWeight: '600',
  },
  amount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2ECC71',
    marginVertical: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  trendUp: {
    color: '#2ECC71',
    fontWeight: '600',
    marginRight: 4,
  },
  trendText: {
    fontSize: 12,
    color: '#666',
  },
  emoji: {
    fontSize: 32,
    marginTop: 15,
    textAlign: 'center',
  },
  plannerCard: {
    marginVertical: 10,
    padding: 20,
  },
  goalItem: {
    marginTop: 10,
  },
  goalText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  goalAmount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#2ECC71',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2ECC71',
  },
  statsCard: {
    marginVertical: 10,
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
});