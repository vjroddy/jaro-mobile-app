import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CreatePostScreen({ navigation }: any) {
  const [text, setText] = useState('');
  const db = getFirestore();

  const submit = async () => {
    try {
      await addDoc(collection(db, 'posts'), { text, createdAt: serverTimestamp() });
      navigation.goBack();
    } catch (e) {
      console.log(e);
      alert('Error creating post');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="What's up?" value={text} onChangeText={setText} style={styles.input} />
      <Button title="Post" onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 12 }, input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, borderRadius: 4 } });
