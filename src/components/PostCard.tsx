import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PostCard({ post }: any) {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{post.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({ card: { padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 8 }, text: { fontSize: 16 } });
