import { useMessageBoxStore } from '@/context/messageBoxStore';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/theme/colors';
import { semanticSpacing } from '@/theme/spacing';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Easing, Modal, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const MessageBox: React.FC = () => {
  const { isVisible, title, message, actions, hide } = useMessageBoxStore();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const slide = useRef(new Animated.Value(0)).current; // 0 hidden, 1 shown
  const { t } = useTranslation();

  useEffect(() => {
    Animated.timing(slide, {
      toValue: isVisible ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const translateY = slide.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });
  const backdropOpacity = slide.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Modal visible={isVisible} animationType="none" transparent statusBarTranslucent>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={'rgba(0,0,0,0.5)'} />
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
      <View style={styles.center} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.box,
            {
              transform: [{ translateY }],
              backgroundColor: isDark ? colors.background.dark : colors.background.light,
            },
          ]}
        >
          {title ? (
            <Text style={[styles.title, { color: isDark ? colors.text.primary : colors.text.primary }]}>{title}</Text>
          ) : null}
          {message ? (
            <Text style={[styles.message, { color: isDark ? colors.text.secondary : colors.text.secondary }]}>{message}</Text>
          ) : null}

          <View style={styles.actionsRow}>
            {(actions && actions.length ? actions : [{ label: t('common.back'), onPress: hide }]).map((action, idx) => {
              const variant = action.variant || 'primary';
              const backgroundColor =
                variant === 'danger'
                  ? colors.error[500]
                  : variant === 'secondary'
                  ? (isDark ? colors.gray[700] : colors.gray[200])
                  : colors.primary[500];
              const textColor = variant === 'secondary' ? (isDark ? colors.text.primary : colors.text.primary) : colors.background.light;
              return (
                <TouchableOpacity
                  key={`${action.label}-${idx}`}
                  onPress={() => {
                    try { action.onPress?.(); } finally { hide(); }
                  }}
                  style={[styles.actionBtn, { backgroundColor }]}
                >
                  <Text style={[styles.actionText, { color: textColor }]}>{action.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: semanticSpacing.md,
  },
  box: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    padding: semanticSpacing.lg,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: semanticSpacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: semanticSpacing.lg,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  actionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default MessageBox;



