import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FlatList,
    Image,
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

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar?: string;
  isOnline: boolean;
}

export default function ChatScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [searchQuery, setSearchQuery] = useState('');

  // Mock conversations data
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Steel Supplier Co.',
      lastMessage: 'Thank you for your interest in our products',
      timestamp: '2 min ago',
      unreadCount: 2,
      avatar: 'https://via.placeholder.com/50',
      isOnline: true,
    },
    {
      id: '2',
      name: 'Construction Materials Ltd.',
      lastMessage: 'We can provide the materials you requested',
      timestamp: '1 hour ago',
      unreadCount: 0,
      avatar: 'https://via.placeholder.com/50',
      isOnline: false,
    },
    {
      id: '3',
      name: 'Electrical Components Inc.',
      lastMessage: 'Please check the updated quote',
      timestamp: '3 hours ago',
      unreadCount: 1,
      avatar: 'https://via.placeholder.com/50',
      isOnline: true,
    },
  ]);

  const handleConversationPress = (conversation: Conversation) => {
    router.push(`/chat/${conversation.id}`);
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => handleConversationPress(item)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{item.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        
        <View style={styles.messageContainer}>
          <Text 
            style={[
              styles.lastMessage,
              item.unreadCount > 0 && styles.unreadMessage
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

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
    headerTitle: {
      fontSize: typography.h3.fontSize,
      fontWeight: typography.h3.fontWeight,
      color: isDark ? colors.text.primary : colors.text.primary,
      flex: 1,
    },
    newMessageButton: {
      padding: semanticSpacing.sm,
      backgroundColor: colors.primary[500],
      borderRadius: semanticSpacing.radius.md,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? colors.gray[800] : colors.gray[100],
      borderRadius: semanticSpacing.radius.lg,
      paddingHorizontal: semanticSpacing.md,
      marginHorizontal: semanticSpacing.md,
      marginVertical: semanticSpacing.sm,
    },
    searchInput: {
      flex: 1,
      paddingVertical: semanticSpacing.sm,
      fontSize: typography.body.fontSize,
      color: isDark ? colors.text.primary : colors.text.primary,
    },
    conversationsList: {
      flex: 1,
    },
    conversationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: semanticSpacing.md,
      paddingVertical: semanticSpacing.md,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? colors.border.light : colors.border.light,
    },
    avatarContainer: {
      position: 'relative',
      marginRight: semanticSpacing.md,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.success[500],
      borderWidth: 2,
      borderColor: isDark ? colors.background.dark : colors.background.light,
    },
    conversationContent: {
      flex: 1,
    },
    conversationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: semanticSpacing.xs,
    },
    conversationName: {
      fontSize: typography.bodyLarge.fontSize,
      fontWeight: typography.fontWeights.semibold,
      color: isDark ? colors.text.primary : colors.text.primary,
    },
    timestamp: {
      fontSize: typography.caption.fontSize,
      color: isDark ? colors.text.tertiary : colors.text.tertiary,
    },
    messageContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    lastMessage: {
      fontSize: typography.body.fontSize,
      color: isDark ? colors.text.secondary : colors.text.secondary,
      flex: 1,
    },
    unreadMessage: {
      fontWeight: typography.fontWeights.medium,
      color: isDark ? colors.text.primary : colors.text.primary,
    },
    unreadBadge: {
      backgroundColor: colors.primary[500],
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: semanticSpacing.sm,
    },
    unreadCount: {
      fontSize: typography.caption.fontSize,
      fontWeight: typography.fontWeights.medium,
      color: colors.background.light,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: semanticSpacing.xl,
    },
    emptyStateText: {
      fontSize: typography.bodyLarge.fontSize,
      color: isDark ? colors.text.secondary : colors.text.secondary,
      textAlign: 'center',
      marginTop: semanticSpacing.md,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('chat.title')}</Text>
        <TouchableOpacity style={styles.newMessageButton}>
          <Ionicons name="add" size={20} color={colors.background.light} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons 
          name="search" 
          size={20} 
          color={isDark ? colors.gray[400] : colors.gray[500]} 
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor={isDark ? colors.gray[400] : colors.gray[500]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Conversations List */}
      {conversations.length > 0 ? (
        <FlatList
          style={styles.conversationsList}
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons 
            name="chatbubbles-outline" 
            size={64} 
            color={isDark ? colors.gray[400] : colors.gray[500]} 
          />
          <Text style={styles.emptyStateText}>{t('chat.noMessages')}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
