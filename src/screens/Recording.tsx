import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text} from 'react-native';

function Recording(): JSX.Element {
  console.log('hello');
  return (
    <SafeAreaView>
      <ScrollView style={styles.Container}>
        <Text style={styles.Text}>RECORDING SCREEN</Text>
      </ScrollView>
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
