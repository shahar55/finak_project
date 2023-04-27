import React from 'react';
import {View} from 'react-native';

import RealTimeRecorder from './RealTimeRecorder';
import {BasicPitch, outputToNotesPoly} from '@spotify/basic-pitch';
import {NoteEvent} from '@spotify/basic-pitch/types/toMidi';

type RecordingDataAnalyserProps = {
  basicPitch: BasicPitch | undefined;
  basicPitchReady: boolean;
  setCurrentNotes: React.Dispatch<React.SetStateAction<NoteEvent[]>>;
};

function RecordingDataAnalyser(
  properties: RecordingDataAnalyserProps,
): JSX.Element {
  async function basicPitchFloat32ArrayToNotes(array: Float32Array) {
    console.log('rec data: ' + array[0] + ', ' + array[1] + ',...');
    const frames: number[][] = [];
    const onsets: number[][] = [];
    const contours: number[][] = [];
    let pct: number = 0;

    let t1 = Date.now();

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

    let t2 = Date.now();
    console.log('time diff: ' + (t2 - t1));

    let notes = outputToNotesPoly(frames, onsets, 0.5, 0.5, 5);
    // let notesTime = noteFramesToTime(notes);

    /*
    let notes = noteFramesToTime(
      addPitchBendsToNoteEvents(
        contours,
        outputToNotesPoly(frames, onsets, 0.5, 0.5, 5),
      ),
    );
     */

    console.log(notes);
    properties.setCurrentNotes(notes);
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
