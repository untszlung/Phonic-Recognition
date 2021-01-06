"use strict";

let model, predictionCallback;

import { updateBarGraph, setupBarGraph } from "./bar-graph.js";

import { initSpectrogram } from "./new-spectrogram.js";

let URL = `${window.location.href}/activities-model/`;

setupBarGraph(URL);

const labels = [
  "Brushing teeth",
  "Coughing",
  "Phone ringing",
  "Speaking",
  "Typing",
  "_background_noise_"
];




const lang = navigator.language || navigator.userLanguage;



const predictionDiv = document.getElementsByClassName("prediction")[0];

let currentPrediction, previousPrediction;

currentPrediction = previousPrediction;

const startButton = document.getElementsByTagName("button")[0];
const introSection = document.getElementsByClassName("intro")[0];

startButton.onclick = () => {
  introSection.style.display = "none";
  setupModel(URL, data => {
    let maximum = Math.max(...data);
    if (maximum > 0.7) {
      switch (maximum) {
        case data[0]:
          currentPrediction =  labels[0];
          break;
        case data[1]:
          currentPrediction =  labels[1];
          break;
        case data[2]:
          currentPrediction =  labels[2];
          break;
        case data[3]:
          currentPrediction =  labels[3];
          break;
        case data[4]:
          currentPrediction =  labels[4];
          break;
        default:
          currentPrediction = "";
          break;
      }
    }

    if (currentPrediction !== previousPrediction) {
      predictionDiv.innerHTML = currentPrediction;
      previousPrediction = currentPrediction;
    }
    updateBarGraph(data);
  });

  initSpectrogram();
};

async function setupModel(URL, predictionCB) {
  //store the prediction and audio callback functions
  predictionCallback = predictionCB;
  // the model.json file stores a reference to the trained model
  const modelURL = `${URL}model.json`;

  // the metatadata.json file contains the text labels of your model and additional information
  const metadataURL = `${URL}metadata.json`;

  // Load the model using the speechCommands library
  model = window.speechCommands.create(
    "BROWSER_FFT",
    undefined,
    modelURL,
    metadataURL
  );

  await model.ensureModelLoaded();

  // this tells the model how to run when listening for audio
  const modelParameters = {
    invokeCallbackOnNoiseAndUnknown: true, // run even when only background noise is detected
    includeSpectrogram: true, // give us access to numerical audio data
    overlapFactor: 0.5 // how often per second to sample audio, 0.5 means twice per second
  };

  model.listen(
    //This callback function is invoked each time the model has a prediction.
    prediction => {
      // prediction.scores contains the probability scores that correspond to model.wordLabels().
      predictionCallback(prediction.scores);
    },
    modelParameters
  );
}
