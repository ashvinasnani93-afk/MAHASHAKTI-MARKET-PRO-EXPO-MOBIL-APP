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
import { colors, spacing, fontSize, borderRadius } from '../theme/colors';
import apiService from '../services/api';

const SYMBOLS = ['NIFTY', 'BANKNIFTY', 'FINNIFTY'];

export default function OptionChain() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState('NIFTY');
  const [optionChainData, setOptionChainData] = useState<any>(null);
  const [expiries, setExpiries] = useState<string[]>([]);
  const [selectedExpiry, setSelectedExpiry] = useState<string | null>(null);

  useEffect(() => {
    loadOptionChain();
  }, [selectedSymbol, selectedExpiry]);

  const loadOptionChain = async () => {
    try {
      setLoading(true);

      const result = await apiService.getOptionChain(
        selectedSymbol,
        selectedExpiry || undefined
      );

      if (result.status) {
        setOptionChainData(result);
        if (result.availableExpiries) {
          setExpiries(result.availableExpiries);
          if (!selectedExpiry && result.availableExpiries.length > 0) {
            setSelectedExpiry(result.availableExpiries[0]);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load option chain:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOptionChain();
    setRefreshing(false);
  };

  const renderStrikeRow = (strike: number, data: any) => {
    const isATM = optionChainData.atmStrike === strike;

    return (
      <View
        key={strike}
        style={[
          styles.strikeRow,
          isATM && { backgroundColor: colors.surfaceLight },
        ]}
      >
        <View style={styles.cellContainer}>
          <Text style={styles.cellText}>
            {data.CE?.ltp ? `₹${data.CE.ltp.toFixed(2)}` : '-'}
          </Text>
        </View>
        <View style={[styles.cellContainer, styles.strikeCell]}>
          <Text style={[styles.cellText, styles.strikeText]}>{strike}</Text>
          {isATM && <Text style={styles.atmBadge}>ATM</Text>}
        </View>
        <View style={styles.cellContainer}>
          <Text style={styles.cellText}>
            {data.PE?.ltp ? `₹${data.PE.ltp.toFixed(2)}` : '-'}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading Option Chain...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Option Chain</Text>
      </View>

      {/* Symbol Selector */}
      <View style={styles.symbolContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {SYMBOLS.map((symbol) => (
            <TouchableOpacity
              key={symbol}
              style={[
                styles.symbolButton,
                selectedSymbol === symbol && styles.symbolButtonActive,
              ]}
              onPress={() => setSelectedSymbol(symbol)}
            >
              <Text
                style={[
                  styles.symbolText,
                  selectedSymbol === symbol && styles.symbolTextActive,
                ]}
              >
                {symbol}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Expiry Selector */}
      {expiries.length > 0 && (
        <View style={styles.expiryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {expiries.map((expiry) => (
              <TouchableOpacity
                key={expiry}
                style={[
                  styles.expiryButton,
                  selectedExpiry === expiry && styles.expiryButtonActive,
                ]}
                onPress={() => setSelectedExpiry(expiry)}
              >
                <Text
                  style={[
                    styles.expiryText,
                    selectedExpiry === expiry && styles.expiryTextActive,
                  ]}
                >
                  {new Date(expiry).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Spot Price */}
      {optionChainData && optionChainData.spot && (
        <View style={styles.spotContainer}>
          <Text style={styles.spotLabel}>Spot:</Text>
          <Text style={styles.spotValue}>₹{optionChainData.spot.toFixed(2)}</Text>
        </View>
      )}

      {/* Option Chain Table */}
      <View style={styles.tableHeader}>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>CALL (CE)</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>STRIKE</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>PUT (PE)</Text>
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
        {optionChainData &&
          optionChainData.chain &&
          Object.keys(optionChainData.chain)
            .map(Number)
            .sort((a, b) => a - b)
            .map((strike) =>
              renderStrikeRow(strike, optionChainData.chain[strike])
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
  symbolContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  symbolButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  symbolButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  symbolText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  symbolTextActive: {
    color: colors.text,
  },
  expiryContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  expiryButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  expiryButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  expiryText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  expiryTextActive: {
    color: colors.text,
  },
  spotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  spotLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  spotValue: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: fontSize.sm,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  strikeRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.sm,
  },
  cellContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strikeCell: {
    backgroundColor: colors.surface,
  },
  cellText: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  strikeText: {
    fontWeight: 'bold',
    fontSize: fontSize.md,
  },
  atmBadge: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: 'bold',
    marginTop: 2,
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