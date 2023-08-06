let recentPredictionsX = localStorage.getItem('recentPredictionsX') ?
  JSON.parse(localStorage.getItem('recentPredictionsX')) : [];
let recentPredictionsY = localStorage.getItem('recentPredictionsY') ?
  JSON.parse(localStorage.getItem('recentPredictionsY')) : [];
const N = 10; // Die Anzahl der letzten Vorhersagen, die gespeichert werden sollen
var clickedPoints = 0; // Hinzufügen einer neuen Variable, um zu verfolgen, wie viele Punkte geklickt wurden.



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

  }).begin();


  webgazer.showVideoPreview(false); // Schaltet das WebGazer Video-Feed aus

  createCalibrationPoints();

  // Wenn der Benutzer auf den "Weiter"-Button klickt, navigiere zur neuen Seite
  continueButton.onclick = function() {
    window.location.href = "/Website/image-eyebook/image.html"; // Ersetzen Sie dies durch die URL Ihrer neuen Seite
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

  // Eventlistener für 'unload' hinzufügen, um Daten im Local Storage zu speichern, wenn die Seite entladen wird
  window.addEventListener('unload', function() {
    localStorage.setItem('recentPredictionsX', JSON.stringify(recentPredictionsX));
    localStorage.setItem('recentPredictionsY', JSON.stringify(recentPredictionsY));
  });
};



function getSmoothedPrediction() {
  let sumX = recentPredictionsX.reduce((a, b) => a + b, 0);
  let averageX = sumX / recentPredictionsX.length;

  let sumY = recentPredictionsY.reduce((a, b) => a + b, 0);
  let averageY = sumY / recentPredictionsY.length;

  return {x: averageX, y: averageY};
}



//// Calibration 
function createCalibrationPoints() {
  var points = [
    //{x: 0, y: 0}, // Oben links
    //{x: window.innerWidth / 2 - 25, y: 0}, // Oben Mitte
    //{x: window.innerWidth - 50, y: 0}, // Oben rechts

    //{x: 0, y: window.innerHeight / 2 - 25}, // Mitte links
    {x: window.innerWidth / 2 - 25, y: window.innerHeight / 2 - 25}, // Zentrum
    //{x: window.innerWidth - 50, y: window.innerHeight / 2 - 25}, // Mitte rechts

    //{x: 0, y: window.innerHeight - 50}, // Unten links
    //{x: window.innerWidth / 2 - 25, y: window.innerHeight - 50}, // Unten Mitte
    //{x: window.innerWidth - 50, y: window.innerHeight - 50}, // Unten rechts
  ];

  // Erstelle einen Punkt für jede Position
  for (var i = 0; i < points.length; i++) {
    createCalibrationPoint(points[i].x, points[i].y);
  }
}



function createCalibrationPoint(x, y) {
  var point = document.createElement('div');
  point.classList.add('training-point');
  point.style.left = `${x}px`;
  point.style.top = `${y}px`;

  // Initialisiere den Zähler für den Punkt
  point.counter = 0;

  // Wenn der Punkt angeklickt wird, erhöhe den Zähler
  point.addEventListener('click', function() {
    point.counter++;
    // Wenn der Punkt dreimal angeklickt wurde, entferne ihn
    if (point.counter >= 3) {
      point.remove();
      clickedPoints++;
      // Wenn alle Punkte angeklickt wurden, öffne das Modal-Popup
      if (clickedPoints >= 1) {
        modal.style.display = "block";
      }
    }
  });

  document.body.appendChild(point);
}
