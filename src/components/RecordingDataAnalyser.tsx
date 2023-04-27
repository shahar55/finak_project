import React from 'react';
import {View} from 'react-native';

import RealTimeRecorder from './RealTimeRecorder';
import {
  addPitchBendsToNoteEvents,
  BasicPitch,
  noteFramesToTime,
  outputToNotesPoly,
} from '@spotify/basic-pitch';

type RecordingDataAnalyserProps = {
  basicPitch: BasicPitch | undefined;
  basicPitchReady: boolean;
};

function RecordingDataAnalyser(
  properties: RecordingDataAnalyserProps,
): JSX.Element {
  async function basicPitchFloat32ArrayToNotes(array: Float32Array) {
    const frames: number[][] = [];
    const onsets: number[][] = [];
    const contours: number[][] = [];
    let pct: number = 0;

    await properties.basicPitch?.evaluateModel(
      array,
      (f: number[][], o: number[][], c: number[][]) => {
        frames.push(...f);
        onsets.push(...o);
        contours.push(...c);
      },
      (p: number) => {
        pct = p;
        console.log('bp pct:' + pct);
      },
    );

    //console.log(onsets);

    let notes = noteFramesToTime(
      addPitchBendsToNoteEvents(
        contours,
        outputToNotesPoly(frames, onsets, 0.5, 0.5, 5),
      ),
    );

    console.log(notes);
  }

  return (
    <View>
      <RealTimeRecorder
        handleDta={basicPitchFloat32ArrayToNotes}
        isReadyToStart={properties.basicPitchReady}
      />
    </View>
  );
}

export default RecordingDataAnalyser;
