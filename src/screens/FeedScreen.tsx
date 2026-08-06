import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import PostCard from '../components/PostCard';
import { getFirestore, collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function FeedScreen({ navigation }: any) {
  const [posts, setPosts] = useState<any[]>([]);
  const db = getFirestore();

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
      setPosts(items);
    });
    return unsub;
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Create" onPress={() => navigation.navigate('Create')} />
      <FlatList data={posts} keyExtractor={(i) => i.id} renderItem={({ item }) => <PostCard post={item} />} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 12 } });
