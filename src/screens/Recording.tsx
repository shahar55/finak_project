import React from 'react';
import {SafeAreaView, View, StyleSheet, Text, Button} from 'react-native';

import {Audio} from 'expo-av';

function Recording(): JSX.Element {
  const [recording, setRecording] = React.useState<Audio.Recording>();
  const [uri, setUri] = React.useState<string | null>();
  const [sound, setSound] = React.useState<Audio.Sound>();

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const {recording: _recording} = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecording(_recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const _uri = recording?.getURI();
    console.log('Recording stopped and stored at', _uri);
    setUri(_uri);
  }

  async function playSound() {
    if (uri) {
      console.log('Loading Sound');
      console.log(uri);
      const {sound: _sound} = await Audio.Sound.createAsync({uri: uri});
      setSound(_sound);
      console.log(_sound);
      console.log('Playing Sound');
      await _sound?.playAsync();
    }
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <SafeAreaView>
      <View style={styles.Container}>
        <Text style={styles.Text}>RECORDING SCREEN</Text>
      </View>
      <View style={styles.Container}>
        <Button title="Start" onPress={startRecording} />
      </View>
      <View style={styles.Container}>
        <Button title="Stop" onPress={stopRecording} />
      </View>
      <View style={styles.Container}>
        <Button title="Play" onPress={playSound} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  Text: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Recording;
