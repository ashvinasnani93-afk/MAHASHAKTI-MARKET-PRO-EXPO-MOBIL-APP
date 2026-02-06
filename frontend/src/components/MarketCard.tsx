import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../theme/colors';

interface MarketCardProps {
  symbol: string;
  ltp: number;
  change: number;
  changePercent: number;
  onPress?: () => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({
  symbol,
  ltp,
  change,
  changePercent,
  onPress,
}) => {
  const isPositive = change >= 0;

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
            styles.badge,
            { backgroundColor: isPositive ? colors.bullish : colors.bearish },
          ]}
        >
          <Text style={styles.badgeText}>
            {isPositive ? '▲' : '▼'} {Math.abs(changePercent).toFixed(2)}%
          </Text>
        </View>
      </View>
      <Text style={styles.ltp}>₹{ltp.toFixed(2)}</Text>
      <Text
        style={[
          styles.change,
          { color: isPositive ? colors.bullish : colors.bearish },
        ]}
      >
        {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}
        {changePercent.toFixed(2)}%)
      </Text>
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
    marginBottom: spacing.sm,
  },
  symbol: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.text,
  },
  ltp: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  change: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
});