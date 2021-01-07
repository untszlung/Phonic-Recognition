"use strict";

let model, predictionCallback;

import { updateBarGraph, setupBarGraph } from "./bar-graph.js";

import { initSpectrogram } from "./new-spectrogram.js";

let URL = `${window.location.href}/activities-model/`;

setupBarGraph(URL);

const labels = [
  "Background Noise",
  "OO",
  "a",
  "ai",
  "ar",
  "b",
  "c_k",
  "ch",
  "d",
  "e",
  "ee",
  "er",
  "f",
  "g",
  "h",
  "i",
  "ie",
  "j",
  "l",
  "m",
  "n",
  "ng",
  "o",
  "oa",
  "oi",
  "oo",
  "or",
  "ou",
  "p",
  "qu",
  "r",
  "s",
  "sh",
  "t",
  "th_voiced",
  "th_voiceless",
  "u",
  "ue",
  "v",
  "w",
  "x",
  "y",
  "z",
  "zh_(as_in_vision)"
];


const lang = navigator.language || navigator.userLanguage;



const predictionDiv = document.getElementsByClassName("prediction")[0];

let currentPrediction, previousPrediction, maximum_probability;

currentPrediction = previousPrediction;

const startButton = document.getElementsByTagName("button")[0];
const introSection = document.getElementsByClassName("intro")[0];

startButton.onclick = () => {
  introSection.style.display = "none";
  setupModel(URL, data => {
    maximum_probability = 0;

    data.forEach((probability, index) => {

      if( probability > maximum_probability){
        maximum_probability = probability;
        currentPrediction = labels[index];
      }

    });

    maximum_probability = 0;

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
