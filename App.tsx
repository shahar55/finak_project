/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {
  addPitchBendsToNoteEvents,
  BasicPitch,
  noteFramesToTime,
  outputToNotesPoly,
} from '@spotify/basic-pitch';

import * as tf from '@tensorflow/tfjs';
import {initTF} from './src/utils/tf_platform_react_native';
import {bundleResourceIO} from './src/utils/tf_bundle_resource_io';
const modelJson = require('./basic-pitch/model/model.json');
const modelWeights = require('./basic-pitch/model/group1-shard1of1.bin');

import {RealTimeRecorder} from './src/components';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  useEffect(() => {
    initTF().then(() => {
      console.log(tf.getBackend());
      let aa = tf.zeros([2]);
      let bb = tf.zeros([3]);
      console.log(aa.concat(bb));
      let cc = tf.zeros([10, 2]);
      let dd = tf.zeros([10, 2]);
      tf.print(dd.add(tf.add(cc, 2)).mul(tf.add(cc, 3)));
      let bp = new BasicPitch(
        tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights)),
      );
      const input = new Float32Array(2048);
      const frames: number[][] = [];
      const onsets: number[][] = [];
      const contours: number[][] = [];
      let pct: number = 0;
      //todo: the first evaluateModel takes long time because the model needs to get loaded
      bp.evaluateModel(
        input,
        (f: number[][], o: number[][], c: number[][]) => {
          frames.push(...f);
          onsets.push(...o);
          contours.push(...c);
        },
        (p: number) => {
          pct = p;
          console.log(pct);
        },
      ).then(() => {
        let notes = noteFramesToTime(
          addPitchBendsToNoteEvents(
            contours,
            outputToNotesPoly(frames, onsets, 0.5, 0.5, 5),
          ),
        );
        console.log(notes);

        const input1 = new Float32Array(4096);
        const frames1: number[][] = [];
        const onsets1: number[][] = [];
        const contours1: number[][] = [];
        let pct1: number = 0;
        bp.evaluateModel(
          input1,
          (f: number[][], o: number[][], c: number[][]) => {
            frames1.push(...f);
            onsets1.push(...o);
            contours1.push(...c);
          },
          (p: number) => {
            pct1 = p;
            console.log(pct1);
          },
        ).then(() => {
          let notes1 = noteFramesToTime(
            addPitchBendsToNoteEvents(
              contours1,
              outputToNotesPoly(frames1, onsets1, 0.5, 0.5, 5),
            ),
          );
          console.log(notes1);
        });
      });
    });
  }, []);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <RealTimeRecorder handleDta={() => {}} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
