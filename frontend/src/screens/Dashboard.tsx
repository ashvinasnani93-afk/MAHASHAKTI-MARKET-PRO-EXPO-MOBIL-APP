import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MarketCard } from '../components/MarketCard';
import { colors, spacing, fontSize, borderRadius } from '../theme/colors';
import { useAppStore } from '../store/useAppStore';
import apiService from '../services/api';
import webSocketService from '../services/websocket';

const INDICES = ['NIFTY', 'BANKNIFTY', 'FINNIFTY'];

export default function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [indexData, setIndexData] = useState<any>({});
  const [systemStatus, setSystemStatus] = useState<any>(null);

  const { backendConnected, wsConnected, setBackendConnected, setWsConnected } =
    useAppStore();

  useEffect(() => {
    loadData();
    connectWebSocket();

    return () => {
      webSocketService.disconnect();
    };
  }, []);

  const connectWebSocket = () => {
    webSocketService.connect();
    
    // Subscribe to LTP updates
    webSocketService.subscribe('ltp_update', (data) => {
      if (data.symbol && INDICES.includes(data.symbol)) {
        setIndexData((prev: any) => ({
          ...prev,
          [data.symbol]: {
            ...prev[data.symbol],
            ltp: data.ltp,
            change: data.change,
            changePercent: data.changePercent,
          },
        }));
      }
    });

    setWsConnected(webSocketService.getConnectionStatus());
  };

  const loadData = async () => {
    try {
      setLoading(true);

      // Check backend status
      const status = await apiService.getStatus();
      setSystemStatus(status);
      setBackendConnected(status.status);

      // Load LTP for each index
      const promises = INDICES.map((symbol) =>
        apiService.getLTP(symbol).catch(() => null)
      );
      const results = await Promise.all(promises);

      const data: any = {};
      results.forEach((result, index) => {
        if (result && result.status) {
          const symbol = INDICES[index];
          data[symbol] = {
            symbol,
            ltp: result.data?.ltp || 0,
            change: result.data?.change || 0,
            changePercent: result.data?.changePercent || 0,
          };
        } else {
          // Placeholder data
          const symbol = INDICES[index];
          data[symbol] = {
            symbol,
            ltp: 0,
            change: 0,
            changePercent: 0,
          };
        }
      });

      setIndexData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setBackendConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading Dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mahashakti Market Pro</Text>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: backendConnected ? colors.bullish : colors.bearish },
            ]}
          />
          <Text style={styles.statusText}>
            {backendConnected ? 'Live' : 'Offline'}
          </Text>
        </View>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Indices</Text>
          {INDICES.map((symbol) => {
            const data = indexData[symbol];
            if (!data) return null;

            return (
              <MarketCard
                key={symbol}
                symbol={symbol}
                ltp={data.ltp}
                change={data.change}
                changePercent={data.changePercent}
                onPress={() => console.log(`Clicked ${symbol}`)}
              />
            );
          })}
        </View>

        {systemStatus && (
          <View style={styles.systemInfo}>
            <Text style={styles.systemTitle}>System Status</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Angel Login:</Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: systemStatus.angelLogin ? colors.bullish : colors.bearish },
                ]}
              >
                {systemStatus.angelLogin ? 'Connected' : 'Disconnected'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>WebSocket:</Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: systemStatus.wsConnected ? colors.bullish : colors.bearish },
                ]}
              >
                {systemStatus.wsConnected ? 'Connected' : 'Disconnected'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>LTP Count:</Text>
              <Text style={styles.infoValue}>{systemStatus.ltpCount || 0}</Text>
            </View>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  statusText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  section: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
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
  systemInfo: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  systemTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
});