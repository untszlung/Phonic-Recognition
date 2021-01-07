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
          currentPrediction = labels[0];
          break;
        case data[1]:
          currentPrediction = labels[1];
          break;
        case data[2]:
          currentPrediction = labels[2];
          break;
        case data[3]:
          currentPrediction = labels[3];
          break;
        case data[4]:
          currentPrediction = labels[4];
          break;
        case data[5]:
          currentPrediction = labels[5];
          break;
        case data[6]:
          currentPrediction = labels[6];
          break;
        case data[7]:
          currentPrediction = labels[7];
          break;
        case data[8]:
          currentPrediction = labels[8];
          break;
        case data[9]:
          currentPrediction = labels[9];
          break;
        case data[10]:
          currentPrediction = labels[10];
          break;
        case data[11]:
          currentPrediction = labels[11];
          break;
        case data[12]:
          currentPrediction = labels[12];
          break;
        case data[13]:
          currentPrediction = labels[13];
          break;
        case data[14]:
          currentPrediction = labels[14];
          break;
        case data[15]:
          currentPrediction = labels[15];
          break;
        case data[16]:
          currentPrediction = labels[16];
          break;
        case data[17]:
          currentPrediction = labels[17];
          break;
        case data[18]:
          currentPrediction = labels[18];
          break;
        case data[19]:
          currentPrediction = labels[19];
          break;
        case data[20]:
          currentPrediction = labels[20];
          break;
        case data[21]:
          currentPrediction = labels[21];
          break;
        case data[22]:
          currentPrediction = labels[22];
          break;
        case data[23]:
          currentPrediction = labels[23];
          break;
        case data[24]:
          currentPrediction = labels[24];
          break;
        case data[25]:
          currentPrediction = labels[25];
          break;
        case data[26]:
          currentPrediction = labels[26];
          break;
        case data[27]:
          currentPrediction = labels[27];
          break;
        case data[28]:
          currentPrediction = labels[27];
          break;
        case data[29]:
          currentPrediction = labels[29];
          break;
        case data[30]:
          currentPrediction = labels[30];
          break;
        case data[31]:
          currentPrediction = labels[31];
          break;
        case data[32]:
          currentPrediction = labels[32];
          break;
        case data[33]:
          currentPrediction = labels[33];
          break;
        case data[34]:
          currentPrediction = labels[34];
          break;
        case data[35]:
          currentPrediction = labels[35];
          break;
        case data[36]:
          currentPrediction = labels[36];
          break;
        case data[37]:
          currentPrediction = labels[37];
          break;
        case data[38]:
          currentPrediction = labels[38];
          break;
        case data[39]:
          currentPrediction = labels[39];
          break;
        case data[40]:
          currentPrediction = labels[40];
          break;
        case data[41]:
          currentPrediction = labels[41];
          break;
        case data[42]:
          currentPrediction = labels[42];
          break;
        case data[43]:
          currentPrediction = labels[43];
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
