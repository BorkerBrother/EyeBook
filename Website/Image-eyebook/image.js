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

  createImagePoints();

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
