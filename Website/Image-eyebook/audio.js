let recentPredictionsX = localStorage.getItem('recentPredictionsX') ?
  JSON.parse(localStorage.getItem('recentPredictionsX')) : [];
let recentPredictionsY = localStorage.getItem('recentPredictionsY') ?
  JSON.parse(localStorage.getItem('recentPredictionsY')) : [];
const N = 10; // Die Anzahl der letzten Vorhersagen, die gespeichert werden sollen

createImagePoints();
let isMyAudio5Started = false;
let isMyAudio4Started = false;
let isMyAudio3Started = false;
let isMyAudio2Started = false;
let isMyAudio1Started = false;
var gainNode1, gainNode2, gainNode3, gainNode4, gainNode5;
var audioCtx;
var myAudio1, myAudio2, myAudio3, myAudio4, myAudio5;
initAudio();


window.onload = function() {
  // Modal Popup-Referenzen
  var modal = document.getElementById("myModal");
  var span = document.getElementsByClassName("close")[0];

  webgazer.setGazeListener((data, elapsedTime) => {
    if (data == null) {
      return;
    }

    // Fügen Sie die neuesten Vorhersagen zu den Listen hinzu
    recentPredictionsX.push(data.x);
    recentPredictionsY.push(data.y);

    // Entfernen Sie die älteste Vorhersage, wenn die Liste zu groß wird
    if (recentPredictionsX.length > N) {
      recentPredictionsX.shift();
    }

    if (recentPredictionsY.length > N) {
      recentPredictionsY.shift();
    }

    var xprediction = getSmoothedPrediction().x; //die geglättete Vorhersage der x-Koordinate (in Pixeln)
    var yprediction = getSmoothedPrediction().y; //die geglättete Vorhersage der y-Koordinate (in Pixeln)

    // Funktion zum Berechnen des Durchschnitts eines Arrays


    updateAudio();

    }).begin();


    

  webgazer.showVideoPreview(false); // Schaltet das WebGazer Video-Feed aus


  // Wenn der Benutzer auf den "Weiter"-Button klickt, navigiere zur neuen Seite
  continueButton.onclick = function() {
    window.location.href = href = "/"; // Ersetzen Sie dies durch die URL Ihrer neuen Seite
  }

  // Wenn der Benutzer auf (x) klickt, das Popup schließen
  span.onclick = function() {
    modal.style.display = "none";
  }

  // Wenn der Benutzer irgendwo außerhalb des Popup klickt, das Popup schließen
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  initAudio();

  // Eventlistener für 'unload' hinzufügen, um Daten im Local Storage zu speichern, wenn die Seite entladen wird
  window.addEventListener('unload', function() {
    localStorage.setItem('recentPredictionsX', JSON.stringify(recentPredictionsX));
    localStorage.setItem('recentPredictionsY', JSON.stringify(recentPredictionsY));
  });


};


function initAudio(){
  // Erstellen Sie einen neuen AudioContext
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  myAudio1 = audioCtx.createBufferSource();
  loadAudioFile("audio/angry-tiger.mp3", myAudio1,audioCtx);

  myAudio2 = audioCtx.createBufferSource();
  loadAudioFile('audio/elefant.mp3', myAudio2,audioCtx);

  myAudio3 = audioCtx.createBufferSource();
  loadAudioFile('audio/flugzeug.mp3', myAudio3,audioCtx);

  myAudio4 = audioCtx.createBufferSource();
  loadAudioFile('audio/rotkehlchen.mp3', myAudio4,audioCtx);

  myAudio5 = audioCtx.createBufferSource();
  loadAudioFile('audio/boot.mp3', myAudio5, audioCtx);

  gainNode1 = audioCtx.createGain();
  myAudio1.connect(gainNode1);
  gainNode1.connect(audioCtx.destination);

  gainNode2 = audioCtx.createGain();
  myAudio2.connect(gainNode2);
  gainNode2.connect(audioCtx.destination);

  gainNode3 = audioCtx.createGain();
  myAudio3.connect(gainNode3);
  gainNode3.connect(audioCtx.destination);

  gainNode4 = audioCtx.createGain();
  myAudio4.connect(gainNode4);
  gainNode4.connect(audioCtx.destination);

  gainNode5 = audioCtx.createGain();
  myAudio5.connect(gainNode5);  // Fixed this connection
  gainNode5.connect(audioCtx.destination);
}


function updateAudio() {


  // Berechnen Sie die durchschnittlichen x- und y-Koordinaten
  function getAverage(arr) {
    var sum = arr.reduce((a, b) => a + b, 0);
    return sum / arr.length;
  }
  
  var averageX = getAverage(recentPredictionsX);
  var averageY = getAverage(recentPredictionsY);
   
  // Funktion zum Berechnen der Entfernung zwischen zwei Punkten
  function getDistance(x1, y1, x2, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  }


  var image1 = document.getElementById('image1');
  var image1Rect = image1.getBoundingClientRect();
  var image1CenterX = image1Rect.left + image1Rect.width / 2;
  var image1CenterY = image1Rect.top + image1Rect.height / 2;
  var distanceToImage1 = getDistance(averageX, averageY, image1CenterX, image1CenterY);                                             // Vertauscht! 
  gainNode1.gain.value = 1 - Math.min(distanceToImage1 /500, 1); // Ändern Sie die '500' entsprechend Ihren Bedürfnissen
  //überprüfen Sie es
  if (distanceToImage1 < 300) {
    // Berechnen Sie den Gain-Wert
    gainNode1.gain.value = 1 - Math.min(distanceToImage1 / 300, 1);
    
      if (!isMyAudio1Started) {
        myAudio1.start(0);
        isMyAudio1Started = true;
      }
    console.log(gainNode1.gain.value);
  }

  var image2 = document.getElementById('image2');
  var image2Rect = image2.getBoundingClientRect();
  var image2CenterX = image2Rect.left + image2Rect.width / 2;
  var image2CenterY = image2Rect.top + image2Rect.height / 2;
  var distanceToImage2 = getDistance(averageX, averageY, image2CenterX, image2CenterY);
  gainNode2.gain.value = 1 - Math.min(distanceToImage2 / 500, 1); // Ändern Sie die '500' entsprechend Ihren Bedürfnissen

    //überprüfen Sie es
    if (distanceToImage2 < 300) {
      // Berechnen Sie den Gain-Wert
      gainNode2.gain.value = 1 - Math.min(distanceToImage2 / 300, 1);
      
        if (!isMyAudio2Started) {
          myAudio2.start(0);
          isMyAudio2Started = true;
        }
      console.log(gainNode2.gain.value);
    }

  var image3 = document.getElementById('image3');
  var image3Rect = image3.getBoundingClientRect();
  var image3CenterX = image3Rect.left + image3Rect.width / 2;
  var image3CenterY = image3Rect.top + image3Rect.height / 2;
  var distanceToImage3 = getDistance(averageX, averageY, image3CenterX, image3CenterY);
  gainNode3.gain.value = 1 - Math.min(distanceToImage3 / 500, 1); // Ändern Sie die '500' entsprechend Ihren Bedürfnissen

    //überprüfen Sie es
    if (distanceToImage3 < 300) {
      // Berechnen Sie den Gain-Wert
      gainNode3.gain.value = 1 - Math.min(distanceToImage3 / 300, 1);
      
        if (!isMyAudio3Started) {
          myAudio3.start(0);
          isMyAudio3Started = true;
        }
      console.log(gainNode3.gain.value);
    }

  var image4 = document.getElementById('image4');
  var image4Rect = image4.getBoundingClientRect();
  var image4CenterX = image4Rect.left + image4Rect.width / 2;
  var image4CenterY = image4Rect.top + image4Rect.height / 2;
  var distanceToImage4 = getDistance(averageX, averageY, image4CenterX, image4CenterY);

  //überprüfen Sie es
  if (distanceToImage4 < 300) {
    // Berechnen Sie den Gain-Wert
    gainNode4.gain.value = 1 - Math.min(distanceToImage4 / 300, 1);
    
      if (!isMyAudio4Started) {
        myAudio4.start(0);
        isMyAudio4Started = true;
      }
    console.log(gainNode4.gain.value);
  }


// Hier sollten Sie den Mittelpunkt von image5 und die Distanz berechnen
var image5 = document.getElementById('image5');
var image5Rect = image5.getBoundingClientRect();
var image5CenterX = image5Rect.left + image5Rect.width / 2;
var image5CenterY = image5Rect.top + image5Rect.height / 2;
var distanceToImage5 = getDistance(averageX, averageY, image5CenterX, image5CenterY);

//überprüfen Sie es
  if (distanceToImage5 < 300) {
    // Berechnen Sie den Gain-Wert
    gainNode5.gain.value = 1 - Math.min(distanceToImage5 / 300, 1);
    
      if (!isMyAudio5Started) {
        myAudio5.start(0);
        isMyAudio5Started = true;
      }
  
  }
}


// Funktion zum Laden einer Audiodatei
function loadAudioFile(url, audioNode, audioCtx) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    audioCtx.decodeAudioData(request.response, function(buffer) {
      audioNode.buffer = buffer;
      audioNode.loop = true; // Audio will keep looping
      //audioNode.start(0); // Audio starts playing immediately
    });
  }
  request.send();
}



function getSmoothedPrediction() {
  let sumX = recentPredictionsX.reduce((a, b) => a + b, 0);
  let averageX = sumX / recentPredictionsX.length;

  let sumY = recentPredictionsY.reduce((a, b) => a + b, 0);
  let averageY = sumY / recentPredictionsY.length;

  return {x: averageX, y: averageY};
}



//// Calibration 
function createImagePoints() {
  var points = [
    {x: 0, y: 0}, // Oben links
    {x: window.innerWidth - 50, y: 0}, // Oben rechts
    {x: window.innerWidth / 2 - 25, y: window.innerHeight / 2 - 25}, // Zentrum
    {x: 0, y: window.innerHeight - 50}, // Unten links
    {x: window.innerWidth - 50, y: window.innerHeight - 50}, // Unten rechts
  ];

  // Erstelle einen Punkt für jede Position
  for (var i = 0; i < points.length; i++) {
    createImagePoint(points[i].x, points[i].y);
  }
}



function createImagePoint(x, y) {
  var point = document.createElement('div');
  point.classList.add('training-point');
  point.style.left = `${x}px`;
  point.style.top = `${y}px`;

  document.body.appendChild(point);
}
