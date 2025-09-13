import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/theme/colors';
import { semanticSpacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { BackendTestResult, runBackendTests } from '@/utils/backendTest';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BackendStatusProps {
  showDetails?: boolean;
  onStatusChange?: (isConnected: boolean) => void;
}

export const BackendStatus: React.FC<BackendStatusProps> = ({ 
  showDetails = false, 
  onStatusChange 
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<{
    health: BackendTestResult;
    otp: BackendTestResult;
    overall: boolean;
  } | null>(null);

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const results = await runBackendTests();
      setTestResults(results);
      setIsConnected(results.overall);
      onStatusChange?.(results.overall);
    } catch (error) {
      console.error('Backend test failed:', error);
      setIsConnected(false);
      onStatusChange?.(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const getStatusColor = () => {
    if (isConnected === null) return colors.gray[500];
    return isConnected ? colors.success[500] : colors.error[500];
  };

  const getStatusIcon = () => {
    if (isLoading) return 'refresh';
    if (isConnected === null) return 'help-circle';
    return isConnected ? 'checkmark-circle' : 'close-circle';
  };

  const getStatusText = () => {
    if (isLoading) return 'Testing...';
    if (isConnected === null) return 'Unknown';
    return isConnected ? 'Connected' : 'Disconnected';
  };

  const showDetailedResults = () => {
    if (!testResults) return;
    
    const message = `
Backend Status: ${testResults.overall ? 'Connected' : 'Disconnected'}

Health Check:
- Status: ${testResults.health.isConnected ? 'OK' : 'Failed'}
- Response Time: ${testResults.health.responseTime}ms
- Error: ${testResults.health.error || 'None'}

OTP Endpoint:
- Status: ${testResults.otp.isConnected ? 'OK' : 'Failed'}
- Response Time: ${testResults.otp.responseTime}ms
- Error: ${testResults.otp.error || 'None'}

Backend URL: ${testResults.health.backendUrl}
    `;
    
    Alert.alert('Backend Connection Details', message.trim());
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: semanticSpacing.sm,
      paddingVertical: semanticSpacing.xs,
      backgroundColor: isDark ? colors.gray[800] : colors.gray[100],
      borderRadius: semanticSpacing.radius.md,
      marginHorizontal: semanticSpacing.sm,
      marginVertical: semanticSpacing.xs,
    },
    statusIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: getStatusColor(),
      marginRight: semanticSpacing.sm,
    },
    statusText: {
      fontSize: typography.caption.fontSize,
      color: isDark ? colors.text.secondary : colors.text.secondary,
      flex: 1,
    },
    retryButton: {
      padding: semanticSpacing.xs,
    },
    detailsButton: {
      padding: semanticSpacing.xs,
      marginLeft: semanticSpacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.statusIndicator} />
      <Text style={styles.statusText}>
        Backend: {getStatusText()}
      </Text>
      
      <TouchableOpacity
        style={styles.retryButton}
        onPress={testConnection}
        disabled={isLoading}
      >
        <Ionicons
          name={getStatusIcon()}
          size={16}
          color={isLoading ? colors.gray[400] : getStatusColor()}
        />
      </TouchableOpacity>
      
      {showDetails && testResults && (
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={showDetailedResults}
        >
          <Ionicons
            name="information-circle"
            size={16}
            color={isDark ? colors.gray[400] : colors.gray[500]}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
