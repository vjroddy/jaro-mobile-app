import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerComponent({ onPick }: { onPick: (uri: string) => void }) {
  const [localUri, setLocalUri] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Permission to access media library is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8, allowsEditing: true });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setLocalUri(uri);
        onPick(uri);
      }
    } catch (e) {
      console.log('Image pick error', e);
      Alert.alert('Error', 'Could not pick image');
    }
  };

  return (
    <View style={styles.container}>
      {localUri ? <Image source={{ uri: localUri }} style={styles.preview} /> : null}
      <Button title="Pick image" onPress={pickImage} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { alignItems: 'center', marginBottom: 12 }, preview: { width: 120, height: 120, borderRadius: 60, marginBottom: 8 } });
