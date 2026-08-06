import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, ActivityIndicator } from 'react-native';
import ImagePickerComponent from '../components/ImagePicker';
import { getAuth, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { uploadImage } from '../firebase/storage';

export default function ProfileScreen() {
  const auth = getAuth();
  const user = auth.currentUser as User | null;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) setProfile(snap.data());
    };
    load();
  }, [user]);

  const onPick = async (uri: string) => {
    if (!user) return;
    setLoading(true);
    try {
      const path = `avatars/${user.uid}.jpg`;
      const url = await uploadImage(uri, path);
      await setDoc(doc(db, 'users', user.uid), { avatar: url, updatedAt: new Date(), email: user.email }, { merge: true });
      setProfile((p: any) => ({ ...(p || {}), avatar: url }));
    } catch (e) {
      console.log('Upload error', e);
      alert('Could not upload avatar');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <View style={styles.container}><Text>Please sign in first.</Text></View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {loading ? <ActivityIndicator /> : profile?.avatar ? <Image source={{ uri: profile.avatar }} style={styles.avatar} /> : <Text>No avatar</Text>}
      <ImagePickerComponent onPick={onPick} />
      <Text style={styles.email}>{user.email}</Text>
      <Button title="Sign Out" onPress={() => getAuth().signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 12, alignItems: 'center' }, title: { fontSize: 24, marginBottom: 12 }, avatar: { width: 160, height: 160, borderRadius: 80, marginBottom: 12 }, email: { marginTop: 12 } });
