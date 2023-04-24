import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Button,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';

import {Buffer} from 'buffer';

type RealTimeRecorderProps = {
  handleDta: (data: Float32Array) => void;
};

const requestRecordingPermission = async () => {
  let granted;
  try {
    granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Audio Recording Permission',
        message: 'PlayFix needs to record audio',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('recording permission accepted');
    } else {
      console.log('recording permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
  return granted;
};

function RealTimeRecorder(properties: RealTimeRecorderProps): JSX.Element {
  const isAndroid = Platform.OS === 'android'; //ios and android have different path to the app assets folder
  const webViewRef = React.useRef<WebView>(null);

  async function triggerStartEvent() {
    const granted = await requestRecordingPermission();
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      webViewRef.current?.injectJavaScript(
        'document.dispatchEvent(new CustomEvent("start"))',
      );
    }
  }

  function triggerStopEvent() {
    webViewRef.current?.injectJavaScript(
      'document.dispatchEvent(new CustomEvent("stop"))',
    );
  }

  function onWebViewMsg(event: WebViewMessageEvent) {
    const msg = JSON.parse(event.nativeEvent.data);
    if (msg.eventType === 'log') {
      console.log(msg.msg);
    } else if (msg.eventType === 'data-available') {
      let data = new Float32Array(Buffer.from(msg.data, 'base64').buffer); //decode from base64
      console.log('RT Recorder data: ' + data[0] + ', ' + data[1] + ',...');
      properties.handleDta(data as Float32Array);
    }
  }

  return (
    <SafeAreaView>
      <View style={styles.Container}>
        <Text style={styles.Text}>RECORDING SCREEN</Text>
      </View>
      <View style={styles.Container}>
        <Button title="Start WebView" onPress={triggerStartEvent} />
      </View>
      <View style={styles.Container}>
        <Button title="Stop WebView" onPress={triggerStopEvent} />
      </View>
      <View style={{height: 100}}>
        <Text>webview</Text>
        {isAndroid ? (
          <WebView
            ref={webViewRef}
            source={{uri: 'file:///android_asset/html/foo.html'}}
            onMessage={event => onWebViewMsg(event)}
          />
        ) : (
          <WebView
            // TODO: check if working properly on ios
            ref={webViewRef}
            source={require('../../resources/html/foo.html')}
            onMessage={event => onWebViewMsg(event)}
            mediaCapturePermissionGrantType="grantIfSameHostElsePrompt"
          />
        )}
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

export default RealTimeRecorder;