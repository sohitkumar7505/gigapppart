import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Voice from '@react-native-voice/voice';
import { Audio } from 'expo-av';

import * as FileSystem from 'expo-file-system';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { encode as base64Encode } from 'base64-arraybuffer'; // Import base64 encoder

// Google Gemini API setup
const GEMINI_API_KEY = 'AIzaSyBqJ56Bt8nbv73qrsEDVzVivYgSwsNRfHk'; // Replace with your key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Eleven Labs API setup
const ELEVEN_LABS_API_BASE_URL = 'https://api.elevenlabs.io/v1/text-to-speech/';
const ELEVEN_LABS_API_KEY = 'sk_7cf347a319162d336acb6e4210fb62bcd3cecd5314a9c2bc'; // Replace if restricted

// Voice IDs (verified from Eleven Labs)
const VOICE_IDS = {
  'en-IN': '21m00Tcm4TlvDq8ikWAM', // "Rachel" - English
  'hi-IN': 'MF3mGyEYCl7XYWbV9V6O', // Hindi voice
  'ta-IN': 'jsCqWAovK2LkecY7zXl4', // Tamil voice
};

const ChatbotAssistant = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  const [userId] = useState('user_' + Math.random().toString(36).substr(2, 9));
  const scrollViewRef = useRef();
  const [sound, setSound] = useState(null);
  const [chat, setChat] = useState(null);

  // Initialize chat with history
  useEffect(() => {
    const initChat = async () => {
      const cachedHistory = await getCachedConversation();
      const history = cachedHistory.map(msg => ({
        role: msg.isBot ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));
      const systemPrompt = {
        role: 'user',
        parts: [{ text: 'You are a helpful AI assistant. Respond concisely and maintain context.' }],
      };
      const newChat = model.startChat({
        history: [systemPrompt, ...history],
        generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
      });
      setChat(newChat);
    };
    initChat();
  }, []);

  // Speech-to-text setup
  useEffect(() => {
    if (Platform.OS === 'web') return; // Skip for web
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = (e) => {
      setInputText(e.value[0]);
      handleUserInput(e.value[0]);
    };
    Voice.onSpeechError = (e) => console.error('Speech error:', e.error);

    return () => Voice.destroy().then(Voice.removeAllListeners);
  }, []);

  // Cleanup audio
  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const getCachedConversation = async () => {
    try {
      const local = await AsyncStorage.getItem(userId);
      return local ? JSON.parse(local) : [];
    } catch (error) {
      console.error('Storage error:', error);
      return [];
    }
  };

  const setCachedConversation = async (messages) => {
    try {
      await AsyncStorage.setItem(userId, JSON.stringify(messages));
    } catch (error) {
      console.error('Storage error:', error);
    }
  };

  const playAudio = async (audioUri) => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );
      setSound(newSound);
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  const handleUserInput = async (text) => {
    if (!text.trim()) return;

    const userMessage = { text, isBot: false, timestamp: new Date().toISOString() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    await setCachedConversation(updatedMessages);

    try {
      if (!chat) throw new Error('Chat not initialized');

      // Get response from Gemini
      const result = await chat.sendMessage(text);
      const botResponse = (await result.response.text()) || 'Sorry, I couldn’t process that.';
      
      // Update messages with Gemini response
      const botMessage = { text: botResponse, isBot: true, timestamp: new Date().toISOString() };
      const newMessages = [...updatedMessages, botMessage];
      setMessages(newMessages);
      await setCachedConversation(newMessages);

      // Trigger Eleven Labs TTS
      const ttsUrl = `${ELEVEN_LABS_API_BASE_URL}${VOICE_IDS[selectedLanguage]}`;
      const ttsResponse = await fetch(ttsUrl, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': ELEVEN_LABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: botResponse,
          model_id: 'eleven_multilingual_v2',
        }),
      });

      if (ttsResponse.ok) {
        const audioData = await ttsResponse.arrayBuffer();
        const audioUri = `${FileSystem.documentDirectory}temp.mp3`;
        // Convert arrayBuffer to base64 without Buffer
        const base64Audio = base64Encode(audioData);
        await FileSystem.writeAsStringAsync(
          audioUri,
          base64Audio,
          { encoding: FileSystem.EncodingType.Base64 }
        );
        await playAudio(audioUri);
      } else {
        const errorText = await ttsResponse.text();
        console.error('Eleven Labs error:', errorText);
        throw new Error('TTS failed: ' + errorText);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { text: 'Sorry, something went wrong.', isBot: true, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const startListening = async () => {
    if (Platform.OS === 'web') {
      alert('Speech recognition is not supported on web.');
      return;
    }
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Microphone permission is required.');
        return;
      }
      await Voice.start(selectedLanguage);
    } catch (error) {
      console.error('Speech recognition error:', error);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.floatingButton} onPress={() => setIsVisible(true)}>
        <Animatable.View animation="pulse" iterationCount="infinite">
          <Ionicons name="chatbubbles" size={28} color="#fff" />
        </Animatable.View>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.chatContainer}>
            <View style={styles.header}>
              <Text style={styles.headerText}>AI Assistant</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.languageBar}>
              {['en-IN', 'hi-IN', 'ta-IN'].map(lang => (
                <TouchableOpacity
                  key={lang}
                  style={[styles.langButton, selectedLanguage === lang && styles.langButtonActive]}
                  onPress={() => setSelectedLanguage(lang)}
                >
                  <Text style={styles.langText}>
                    {lang === 'en-IN' ? 'EN' : lang === 'hi-IN' ? 'हि' : 'த'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView
              style={styles.messagesArea}
              ref={scrollViewRef}
              onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            >
              {messages.map((msg, idx) => (
                <View
                  key={idx}
                  style={[styles.messageBubble, msg.isBot ? styles.botBubble : styles.userBubble]}
                >
                  <Text style={styles.messageText}>{msg.text}</Text>
                  <Text style={styles.timestamp}>{new Date(msg.timestamp).toLocaleTimeString()}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.inputArea}>
              <TouchableOpacity style={styles.micButton} onPress={startListening}>
                <Ionicons
                  name={isListening ? 'mic' : 'mic-outline'}
                  size={24}
                  color={isListening ? '#4CAF50' : '#fff'}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask me anything..."
                placeholderTextColor="#888"
                onSubmitEditing={() => handleUserInput(inputText)}
              />
              <TouchableOpacity style={styles.sendButton} onPress={() => handleUserInput(inputText)}>
                <Ionicons name="send" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    width: '90%',
    height: '85%',
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#4CAF50',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  languageBar: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#2D2D2D',
    justifyContent: 'center',
  },
  langButton: {
    padding: 8,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: '#444',
  },
  langButtonActive: {
    backgroundColor: '#4CAF50',
  },
  langText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  messagesArea: {
    flex: 1,
    padding: 15,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 15,
    marginVertical: 5,
  },
  botBubble: {
    backgroundColor: '#333',
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#4CAF50',
    alignSelf: 'flex-end',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  timestamp: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#2D2D2D',
    alignItems: 'center',
  },
  micButton: {
    padding: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#444',
    color: '#fff',
    padding: 12,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  sendButton: {
    padding: 10,
  },
});

export default ChatbotAssistant;