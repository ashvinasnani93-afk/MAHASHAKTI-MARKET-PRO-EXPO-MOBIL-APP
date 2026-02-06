import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../theme/colors';

interface SignalCardProps {
  symbol: string;
  signal: 'STRONG_BUY' | 'BUY' | 'WAIT' | 'SELL' | 'STRONG_SELL';
  trend: string;
  ltp: number;
  rsi?: number;
  volume?: string;
  onPress?: () => void;
}

export const SignalCard: React.FC<SignalCardProps> = ({
  symbol,
  signal,
  trend,
  ltp,
  rsi,
  volume,
  onPress,
}) => {
  const getSignalColor = () => {
    switch (signal) {
      case 'STRONG_BUY':
        return colors.strongBuy;
      case 'BUY':
        return colors.buy;
      case 'WAIT':
        return colors.wait;
      case 'SELL':
        return colors.sell;
      case 'STRONG_SELL':
        return colors.strongSell;
      default:
        return colors.neutral;
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.symbol}>{symbol}</Text>
        <View
          style={[
            styles.signalBadge,
            { backgroundColor: getSignalColor() },
          ]}
        >
          <Text style={styles.signalText}>{signal}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>LTP</Text>
          <Text style={styles.value}>₹{ltp.toFixed(2)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Trend</Text>
          <Text style={styles.value}>{trend}</Text>
        </View>
        {rsi && (
          <View style={styles.infoItem}>
            <Text style={styles.label}>RSI</Text>
            <Text style={styles.value}>{rsi.toFixed(1)}</Text>
          </View>
        )}
      </View>

      {volume && (
        <Text style={styles.volumeText}>Volume: {volume}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  symbol: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  signalBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  signalText: {
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  volumeText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});