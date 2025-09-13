import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { colors } from '@/theme/colors';
import { semanticSpacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  isRead: boolean;
}

export default function ChatDetailScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { id } = useLocalSearchParams<{ id: string }>();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m interested in your Industrial Steel Pipes. Can you provide more details?',
      senderId: 'user',
      timestamp: '10:30 AM',
      type: 'text',
      isRead: true,
    },
    {
      id: '2',
      text: 'Of course! Our steel pipes are made from premium grade carbon steel with excellent durability. What specific diameter and length are you looking for?',
      senderId: 'seller',
      timestamp: '10:32 AM',
      type: 'text',
      isRead: true,
    },
    {
      id: '3',
      text: 'I need 6-inch diameter pipes, 12 meters long. What\'s the price per unit?',
      senderId: 'user',
      timestamp: '10:35 AM',
      type: 'text',
      isRead: true,
    },
    {
      id: '4',
      text: 'For 6-inch diameter, 12-meter pipes, the price is 1,500,000 Toman per unit. We can offer a 5% discount for orders above 10 units.',
      senderId: 'seller',
      timestamp: '10:37 AM',
      type: 'text',
      isRead: false,
    },
  ]);

  const conversation = {
    id: id || '1',
    name: 'Steel Supplier Co.',
    avatar: 'https://via.placeholder.com/50',
    isOnline: true,
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      senderId: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      isRead: false,
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const handleSendImage = () => {
    Alert.alert(
      'Send Image',
      'Choose an image to send',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: () => console.log('Open camera') },
        { text: 'Gallery', onPress: () => console.log('Open gallery') },
      ]
    );
  };

  const handleSendFile = () => {
    Alert.alert(
      'Send File',
      'Choose a file to send',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Document', onPress: () => console.log('Send document') },
        { text: 'PDF', onPress: () => console.log('Send PDF') },
      ]
    );
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.senderId === 'user';
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessage : styles.sellerMessage
      ]}>
        {!isUser && (
          <Image source={{ uri: conversation.avatar }} style={styles.avatar} />
        )}
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.sellerBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.sellerMessageText
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.timestamp,
            isUser ? styles.userTimestamp : styles.sellerTimestamp
          ]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? colors.background.dark : colors.background.light,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: semanticSpacing.md,
      paddingVertical: semanticSpacing.sm,
      backgroundColor: isDark ? colors.background.dark : colors.background.light,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? colors.border.light : colors.border.light,
    },
    backButton: {
      padding: semanticSpacing.sm,
      marginRight: semanticSpacing.sm,
    },
    headerInfo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: semanticSpacing.sm,
    },
    headerText: {
      flex: 1,
    },
    headerName: {
      fontSize: typography.bodyLarge.fontSize,
      fontWeight: typography.fontWeights.semibold,
      color: isDark ? colors.text.primary : colors.text.primary,
    },
    onlineStatus: {
      fontSize: typography.caption.fontSize,
      color: colors.success[500],
    },
    headerActions: {
      flexDirection: 'row',
    },
    headerButton: {
      padding: semanticSpacing.sm,
      marginLeft: semanticSpacing.sm,
    },
    messagesContainer: {
      flex: 1,
      paddingHorizontal: semanticSpacing.md,
    },
    messageContainer: {
      flexDirection: 'row',
      marginVertical: semanticSpacing.xs,
      alignItems: 'flex-end',
    },
    userMessage: {
      justifyContent: 'flex-end',
    },
    sellerMessage: {
      justifyContent: 'flex-start',
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: semanticSpacing.sm,
    },
    messageBubble: {
      maxWidth: '80%',
      paddingHorizontal: semanticSpacing.md,
      paddingVertical: semanticSpacing.sm,
      borderRadius: semanticSpacing.radius.lg,
    },
    userBubble: {
      backgroundColor: colors.primary[500],
      borderBottomRightRadius: semanticSpacing.radius.sm,
    },
    sellerBubble: {
      backgroundColor: isDark ? colors.gray[800] : colors.gray[100],
      borderBottomLeftRadius: semanticSpacing.radius.sm,
    },
    messageText: {
      fontSize: typography.body.fontSize,
      lineHeight: typography.body.fontSize * typography.lineHeights.normal,
    },
    userMessageText: {
      color: colors.background.light,
    },
    sellerMessageText: {
      color: isDark ? colors.text.primary : colors.text.primary,
    },
    timestamp: {
      fontSize: typography.caption.fontSize,
      marginTop: semanticSpacing.xs,
    },
    userTimestamp: {
      color: colors.background.light,
      opacity: 0.8,
    },
    sellerTimestamp: {
      color: isDark ? colors.text.secondary : colors.text.secondary,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: semanticSpacing.md,
      paddingVertical: semanticSpacing.sm,
      backgroundColor: isDark ? colors.background.dark : colors.background.light,
      borderTopWidth: 1,
      borderTopColor: isDark ? colors.border.light : colors.border.light,
    },
    inputWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? colors.gray[800] : colors.gray[100],
      borderRadius: semanticSpacing.radius.lg,
      paddingHorizontal: semanticSpacing.md,
      marginRight: semanticSpacing.sm,
    },
    textInput: {
      flex: 1,
      paddingVertical: semanticSpacing.sm,
      fontSize: typography.body.fontSize,
      color: isDark ? colors.text.primary : colors.text.primary,
      maxHeight: 100,
    },
    attachmentButton: {
      padding: semanticSpacing.sm,
      marginRight: semanticSpacing.sm,
    },
    sendButton: {
      backgroundColor: colors.primary[500],
      borderRadius: semanticSpacing.radius.lg,
      padding: semanticSpacing.sm,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDark ? colors.gray[400] : colors.gray[600]} 
          />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Image source={{ uri: conversation.avatar }} style={styles.headerAvatar} />
          <View style={styles.headerText}>
            <Text style={styles.headerName}>{conversation.name}</Text>
            <Text style={styles.onlineStatus}>
              {conversation.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons 
              name="call-outline" 
              size={24} 
              color={isDark ? colors.gray[400] : colors.gray[600]} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons 
              name="videocam-outline" 
              size={24} 
              color={isDark ? colors.gray[400] : colors.gray[600]} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          style={styles.messagesContainer}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: semanticSpacing.sm }}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor={isDark ? colors.gray[400] : colors.gray[500]}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity style={styles.attachmentButton} onPress={handleSendImage}>
              <Ionicons 
                name="image-outline" 
                size={20} 
                color={isDark ? colors.gray[400] : colors.gray[500]} 
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachmentButton} onPress={handleSendFile}>
              <Ionicons 
                name="attach-outline" 
                size={20} 
                color={isDark ? colors.gray[400] : colors.gray[500]} 
              />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.sendButton} 
            onPress={handleSendMessage}
            disabled={!message.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={colors.background.light} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
