import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, fontSize, borderRadius } from '../theme/colors';
import { useAppStore } from '../store/useAppStore';
import apiService from '../services/api';

export default function Settings() {
  const { backendUrl, setBackendUrl, backendConnected, wsConnected, user, logout } =
    useAppStore();

  const [editingUrl, setEditingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState(backendUrl);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const handleSaveUrl = async () => {
    if (!urlInput.trim()) {
      Alert.alert('Error', 'Backend URL cannot be empty');
      return;
    }

    setBackendUrl(urlInput);
    await AsyncStorage.setItem('backend_url', urlInput);
    setEditingUrl(false);
    Alert.alert('Success', 'Backend URL updated. Restart app to apply changes.');
  };

  const handleTestConnection = async () => {
    try {
      const status = await apiService.getStatus();
      if (status.status) {
        Alert.alert(
          'Connection Successful',
          `Backend is online\n\nAngel Login: ${status.angelLogin ? 'Connected' : 'Disconnected'}\nWebSocket: ${status.wsConnected ? 'Connected' : 'Disconnected'}`
        );
      } else {
        Alert.alert('Connection Failed', 'Backend is offline');
      }
    } catch (error) {
      Alert.alert('Connection Failed', 'Unable to reach backend server');
    }
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear all cached data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            // Clear cache logic here
            Alert.alert('Success', 'Cache cleared');
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await apiService.logout();
          logout();
          Alert.alert('Success', 'Logged out successfully');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Backend Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Backend Configuration</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Backend URL</Text>
            {editingUrl ? (
              <View style={styles.urlInputContainer}>
                <TextInput
                  style={styles.urlInput}
                  value={urlInput}
                  onChangeText={setUrlInput}
                  placeholder="https://your-backend-url.com"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <View style={styles.urlButtons}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonSecondary]}
                    onPress={() => {
                      setUrlInput(backendUrl);
                      setEditingUrl(false);
                    }}
                  >
                    <Text style={styles.buttonSecondaryText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonPrimary]}
                    onPress={handleSaveUrl}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View>
                <Text style={styles.settingValue}>{backendUrl}</Text>
                <TouchableOpacity onPress={() => setEditingUrl(true)}>
                  <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleTestConnection}
          >
            <Text style={styles.buttonText}>Test Connection</Text>
          </TouchableOpacity>
        </View>

        {/* System Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Status</Text>

          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Backend</Text>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: backendConnected ? colors.bullish : colors.bearish },
              ]}
            >
              <Text style={styles.statusText}>
                {backendConnected ? 'Connected' : 'Disconnected'}
              </Text>
            </View>
          </View>

          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>WebSocket</Text>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: wsConnected ? colors.bullish : colors.bearish },
              ]}
            >
              <Text style={styles.statusText}>
                {wsConnected ? 'Connected' : 'Disconnected'}
              </Text>
            </View>
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Auto Refresh</Text>
            <Switch
              value={autoRefresh}
              onValueChange={setAutoRefresh}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleClearCache}
          >
            <Text style={styles.buttonSecondaryText}>Clear Cache</Text>
          </TouchableOpacity>

          {user && (
            <TouchableOpacity
              style={[styles.button, styles.buttonDanger]}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Info</Text>
          <Text style={styles.infoText}>Version: 1.0.0</Text>
          <Text style={styles.infoText}>Built with Expo</Text>
          <Text style={styles.infoText}>© 2025 Mahashakti Market Pro</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  settingItem: {
    marginBottom: spacing.md,
  },
  settingLabel: {
    fontSize: fontSize.md,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  settingValue: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  editButton: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  urlInputContainer: {
    marginTop: spacing.sm,
  },
  urlInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  urlButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  buttonSecondaryText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusLabel: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  statusIndicator: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
});