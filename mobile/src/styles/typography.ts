import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const Typography = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  h2: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  caption: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
});
