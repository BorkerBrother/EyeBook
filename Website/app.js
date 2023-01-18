
const LOOK_DELAY = 100;
let startLookTime = Number.POSITIVE_INFINITY;

webgazer.setRegression('ridge') /* setzt die Art der Regression auf Ridge */
    .setTracker('clmtrackr') /* setzt den Tracker auf clmtrackr */
    .setGazeListener(function (data, timestamp) {
        if (data == null) return
        console.log(data, timestamp);
        var x = data.x;
        var y = data.y;
        var prevButtonRect = prevButton.getBoundingClientRect();
        var nextButtonRect = nextButton.getBoundingClientRect();


        if (x > prevButtonRect.left && x < prevButtonRect.right && y > prevButtonRect.top && y < prevButtonRect.bottom) {
            var currentLocation = rendition.currentLocation();
            startLookTime = timestamp;
            if (startLookTime + LOOK_DELAY < timestamp) {
                console.log("time");
            }
            if (currentLocation.start.index > 0) {
                var prevLocation = currentLocation.start.index - 1;
                //rendition.display(prevLocation);
                console.log("left");
            }
        }

        else if (x > nextButtonRect.left && x < nextButtonRect.right && y > nextButtonRect.top && y < nextButtonRect.bottom) {
            var currentLocation = rendition.currentLocation();
            startLookTime = timestamp;
            if (startLookTime + LOOK_DELAY < timestamp) {
                console.log("time");
            }
            if (currentLocation.start.index < book.spine.length - 1) {
                var nextLocation = currentLocation.start.index + 1;
                //rendition.display(nextLocation);
                console.log("right");
            }
        }


        else
            startLookTime = Number.POSITIVE_INFINITY;


        if (startLookTime + LOOK_DELAY < timestamp) {
            console.log("time");
        }
    })
    .begin() /* startet die Verfolgung */
    .showPredictionPoints(true); /* zeigt die Vorhersagepunkte an */

function nextPage(next = false) {

}

