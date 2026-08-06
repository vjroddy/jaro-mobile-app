import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function AuthScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const auth = getAuth();

  const submit = async () => {
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigation.replace('Feed');
    } catch (e) {
      console.log(e);
      alert('Auth error: ' + (e as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>JARO</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title={isRegister ? 'Register' : 'Sign in'} onPress={submit} />
      <Button title={isRegister ? 'Have an account? Sign in' : "Don't have an account? Register"} onPress={() => setIsRegister(!isRegister)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 32, textAlign: 'center', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, borderRadius: 4 }
});
