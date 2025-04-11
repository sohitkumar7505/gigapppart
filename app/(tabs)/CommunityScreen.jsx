import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import NeoBrutalismCard from '../components/NeoBrutalismCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

export default function CommunityScreen() {
  const [postText, setPostText] = useState('');

  const posts = [
    {
      id: 1,
      author: 'Sarah M.',
      title: 'Tips for New Drivers 🚗',
      content: 'After 6 months of driving, here are my top tips for success...',
      likes: 45,
      comments: 23,
      timeAgo: '2h ago',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500',
    },
    {
      id: 2,
      author: 'Mike R.',
      title: 'Best Areas for Weekend Work 📍',
      content: 'Ive discovered some great spots for maximum earnings...',
      likes: 32,
      comments: 15,
      timeAgo: '4h ago',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=500',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#3A83F4', '#a8c0ff']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.cardRow}>
            <Animatable.View animation="fadeInLeft" delay={300} style={styles.cardWrapper}>
              <TouchableOpacity>
                <NeoBrutalismCard style={styles.actionCard}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=500' }}
                    style={styles.cardImage}
                  />
                  <Text style={styles.cardTitle}>Community Fund</Text>
                  <Text style={styles.cardSubtitle}>Support fellow workers</Text>
                  <Text style={styles.amount}>$5,670 raised</Text>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Donate</Text>
                  </TouchableOpacity>
                </NeoBrutalismCard>
              </TouchableOpacity>
            </Animatable.View>

            <Animatable.View animation="fadeInRight" delay={400} style={styles.cardWrapper}>
              <TouchableOpacity>
                <NeoBrutalismCard style={[styles.actionCard, styles.loanCard]}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500' }}
                    style={styles.cardImage}
                  />
                  <Text style={styles.cardTitle}>Emergency Loan</Text>
                  <Text style={styles.cardSubtitle}>Quick financial help</Text>
                  <Text style={styles.amount}>Up to $3,000</Text>
                  <TouchableOpacity style={[styles.button, styles.loanButton]}>
                    <Text style={styles.buttonText}>Apply Now</Text>
                  </TouchableOpacity>
                </NeoBrutalismCard>
              </TouchableOpacity>
            </Animatable.View>
          </View>

          <Animatable.View animation="fadeInUp" delay={500}>
            <NeoBrutalismCard style={styles.postingCard}>
              <Text style={styles.sectionTitle}>Community Discussion</Text>
              <View style={styles.postInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Share your experience or ask the community..."
                  placeholderTextColor="#666"
                  multiline
                  value={postText}
                  onChangeText={setPostText}
                />
                <TouchableOpacity style={styles.postButton}>
                  <Text style={styles.postButtonText}>Share with Community</Text>
                </TouchableOpacity>
              </View>
            </NeoBrutalismCard>
          </Animatable.View>

          {posts.map((post, index) => (
            <Animatable.View 
              key={post.id} 
              animation="fadeInUp" 
              delay={600 + (index * 100)}
            >
              <NeoBrutalismCard style={styles.postCard}>
                <View style={styles.postHeader}>
                  <Image source={{ uri: post.avatar }} style={styles.avatar} />
                  <View style={styles.postHeaderText}>
                    <Text style={styles.authorName}>{post.author}</Text>
                    <Text style={styles.timeAgo}>{post.timeAgo}</Text>
                  </View>
                </View>
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postContent}>{post.content}</Text>
                <View style={styles.postActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text>❤️ {post.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text>💬 {post.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text>↗️ Share</Text>
                  </TouchableOpacity>
                </View>
              </NeoBrutalismCard>
            </Animatable.View>
          ))}
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
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  cardWrapper: {
    flex: 1,
  },
  actionCard: {
    padding: 15,
    alignItems: 'center',
  },
  loanCard: {
    backgroundColor: '#FFE5E5',
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  amount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2ECC71',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2ECC71',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
  },
  loanButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  postingCard: {
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  postInput: {
    gap: 12,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  postButton: {
    backgroundColor: '#2ECC71',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  postButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  postCard: {
    padding: 16,
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postHeaderText: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeAgo: {
    fontSize: 12,
    color: '#666',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  actionButton: {
    padding: 8,
  },
});