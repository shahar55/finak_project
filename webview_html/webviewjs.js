/*
import {
  addPitchBendsToNoteEvents,
  BasicPitch,
  noteFramesToTime,
  outputToNotesPoly,
} from '@spotify/basic-pitch';
 */

import {Buffer} from 'buffer';

// TODO: test if working properly (AMEN)
try {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({eventType: 'log', msg: 'getUserMedia supported.'}),
    );

    let stream = null;
    let audioCtx = null;

    /*
    const basicPitch = new BasicPitch('???'); //not working: can't fetch from file:///<...>

    async function basicPitchFloat32ArrayToNotes(array) {
      const frames = [];
      const onsets = [];
      const contours = [];
      let pct = 0;
      alert(111111);
      await basicPitch.evaluateModel(
        array,
        (f, o, c) => {
          frames.push(...f);
          onsets.push(...o);
          contours.push(...c);
        },
        p => {
          pct = p;
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              eventType: 'log',
              msg: 'pct: ' + pct,
            }),
          );
        },
      );
      alert(2222222);

      return noteFramesToTime(
        addPitchBendsToNoteEvents(
          contours,
          outputToNotesPoly(frames, onsets, 0.25, 0.25, 5),
        ),
      );
    }
     */

    function start() {
      navigator.mediaDevices
        .getUserMedia({audio: true})
        .then(_stream => {
          stream = _stream;
          audioCtx = new AudioContext({sampleRate: 22050});
          const source = audioCtx.createMediaStreamSource(stream);
          const scriptNode = audioCtx.createScriptProcessor(4096, 1, 1);
          scriptNode.onaudioprocess = audioProcessingEvent => {
            const inputBuffer = audioProcessingEvent.inputBuffer;

            let data = inputBuffer.getChannelData(0);
            let msgEvent = {
              eventType: 'data-available',
              data: Buffer.from(data.buffer).toString('base64'), //base64 encoding
            };
            window.ReactNativeWebView.postMessage(JSON.stringify(msgEvent));

            /*
            basicPitchFloat32ArrayToNotes(data)
              .then(notes => {
                alert(notes);
                alert(notes[0].startTimeSeconds);

                let msgEvent = {
                  eventType: 'notes-data-available',
                  notesData: notes,
                };
                window.ReactNativeWebView.postMessage(JSON.stringify(msgEvent));
              })
              .catch(err => {
                alert(err);
              });
             */

            audioProcessingEvent.outputBuffer =
              audioProcessingEvent.inputBuffer;
          };

          const zeroGainNode = new GainNode(audioCtx, {gain: 0});

          source.connect(scriptNode);
          scriptNode.connect(zeroGainNode);
          zeroGainNode.connect(audioCtx.destination);

          window.ReactNativeWebView.postMessage(
            JSON.stringify({eventType: 'log', msg: 'started'}),
          );
        })
        .catch(err => {
          alert(err);
        });
    }

    function stop() {
      stream?.getTracks().forEach(t => t.stop());
      stream = null;
      audioCtx?.close();
      audioCtx = null;

      window.ReactNativeWebView.postMessage(
        JSON.stringify({eventType: 'log', msg: 'stopped'}),
      );
    }
    document.addEventListener('start', function () {
      start();
    });
    document.addEventListener('stop', function () {
      stop();
    });
  } else {
    alert('getUserMedia not supported.');
  }
} catch (err) {
  alert(err);
} finally {
  true;
}
