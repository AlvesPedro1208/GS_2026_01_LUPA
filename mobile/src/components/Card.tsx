import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../styles/colors';

interface CardProps {
  title: string;
  value: string | number;
  icon?: string;
  color?: string;
  style?: ViewStyle;
}

// Reusable metric card for dashboard statistics
const Card: React.FC<CardProps> = ({ title, value, color = Colors.primaryDark, style }) => {
  return (
    <View style={[styles.card, style]}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 90,
  },
  value: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default Card;
