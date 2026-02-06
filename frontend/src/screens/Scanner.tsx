import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, borderRadius } from '../theme/colors';
import apiService from '../services/api';
import webSocketService from '../services/websocket';

interface ScannerAlert {
  symbol: string;
  type: string;
  ltp: number;
  change: number;
  changePercent: number;
  volume: number;
  volumeChange: number;
  oi?: number;
  oiChange?: number;
  timestamp: string;
}

export default function Scanner() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<ScannerAlert[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PRICE' | 'VOLUME' | 'OI'>('ALL');

  useEffect(() => {
    loadScanner();
    setupWebSocket();

    return () => {
      webSocketService.unsubscribe('scanner_alert', handleScannerAlert);
    };
  }, []);

  const setupWebSocket = () => {
    // Subscribe to scanner alerts
    webSocketService.subscribe('scanner_alert', handleScannerAlert);
  };

  const handleScannerAlert = (data: any) => {
    setAlerts((prev) => [data, ...prev].slice(0, 50)); // Keep last 50 alerts
  };

  const loadScanner = async () => {
    try {
      setLoading(true);

      // Placeholder - backend scanner API to be implemented
      const result = await apiService.getScanner({ filter }).catch(() => null);

      if (result && result.status) {
        setAlerts(result.alerts || []);
      } else {
        // Mock data for testing
        const mockAlerts: ScannerAlert[] = [
          {
            symbol: 'NIFTY 24500 CE',
            type: 'PRICE_EXPLOSION',
            ltp: 185.5,
            change: 32.5,
            changePercent: 21.28,
            volume: 1250000,
            volumeChange: 5.2,
            oi: 2500000,
            oiChange: 15.6,
            timestamp: new Date().toISOString(),
          },
          {
            symbol: 'BANKNIFTY 52000 PE',
            type: 'VOLUME_SPIKE',
            ltp: 245.75,
            change: 18.25,
            changePercent: 8.02,
            volume: 980000,
            volumeChange: 6.8,
            oi: 1800000,
            oiChange: 12.3,
            timestamp: new Date().toISOString(),
          },
        ];
        setAlerts(mockAlerts);
      }
    } catch (error) {
      console.error('Failed to load scanner:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadScanner();
    setRefreshing(false);
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'PRICE_EXPLOSION':
        return colors.danger;
      case 'VOLUME_SPIKE':
        return colors.warning;
      case 'OI_CHANGE':
        return colors.info;
      default:
        return colors.primary;
    }
  };

  const getAlertTypeText = (type: string) => {
    switch (type) {
      case 'PRICE_EXPLOSION':
        return '🚀 Price Explosion';
      case 'VOLUME_SPIKE':
        return '📈 Volume Spike';
      case 'OI_CHANGE':
        return '📊 OI Surge';
      default:
        return '⚡ Alert';
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'ALL') return true;
    if (filter === 'PRICE') return alert.type === 'PRICE_EXPLOSION';
    if (filter === 'VOLUME') return alert.type === 'VOLUME_SPIKE';
    if (filter === 'OI') return alert.type === 'OI_CHANGE';
    return true;
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading Scanner...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Option Explosion Scanner</Text>
        <Text style={styles.subtitle}>Real-time 15-20% Explosive Moves</Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['ALL', 'PRICE', 'VOLUME', 'OI'].map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterButton,
                filter === f && styles.filterButtonActive,
              ]}
              onPress={() => setFilter(f as any)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Criteria Info */}
      <View style={styles.criteriaContainer}>
        <Text style={styles.criteriaTitle}>Detection Criteria:</Text>
        <Text style={styles.criteriaText}>• Price: 15-20% sudden jumps</Text>
        <Text style={styles.criteriaText}>• Volume: 5x average spike</Text>
        <Text style={styles.criteriaText}>• OI: 15%+ changes</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {filteredAlerts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No alerts yet</Text>
            <Text style={styles.emptySubtext}>
              Waiting for explosive moves in option contracts...
            </Text>
          </View>
        ) : (
          filteredAlerts.map((alert, index) => (
            <View key={index} style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertSymbol}>{alert.symbol}</Text>
                <View
                  style={[
                    styles.alertTypeBadge,
                    { backgroundColor: getAlertTypeColor(alert.type) },
                  ]}
                >
                  <Text style={styles.alertTypeText}>
                    {getAlertTypeText(alert.type)}
                  </Text>
                </View>
              </View>

              <View style={styles.alertStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>LTP</Text>
                  <Text style={styles.statValue}>₹{alert.ltp.toFixed(2)}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Change</Text>
                  <Text
                    style={[
                      styles.statValue,
                      { color: alert.change >= 0 ? colors.bullish : colors.bearish },
                    ]}
                  >
                    {alert.changePercent >= 0 ? '+' : ''}
                    {alert.changePercent.toFixed(2)}%
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Volume</Text>
                  <Text style={styles.statValue}>{alert.volumeChange.toFixed(1)}x</Text>
                </View>
                {alert.oiChange && (
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>OI</Text>
                    <Text style={styles.statValue}>
                      {alert.oiChange >= 0 ? '+' : ''}
                      {alert.oiChange.toFixed(1)}%
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.alertTimestamp}>
                {new Date(alert.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          ))
        )}
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
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  filterContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.text,
  },
  criteriaContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  criteriaTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  criteriaText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
  alertCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  alertSymbol: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  alertTypeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  alertTypeText: {
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    color: colors.text,
  },
  alertStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  alertTimestamp: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
});