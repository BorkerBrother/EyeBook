
const LOOK_DELAY = 1000;
let startLookTime = Number.POSITIVE_INFINITY;
let lookDirection = null;

webgazer.setRegression('ridge') /* setzt die Art der Regression auf Ridge */
    .setTracker('clmtrackr') /* setzt den Tracker auf clmtrackr */
    .setGazeListener(function (data, timestamp) {
        if (data == null || lookDirection === "STOP") return;                // If No data   
        //console.log(data,timestamp);           // Print data
        let x = data.x;
        const y = data.y;
        //console.log(timestamp);

        const prevButtonRect = prevButton.getBoundingClientRect();           // get Bounds Prev button
        const nextButtonRect = nextButton.getBoundingClientRect();           // get Bounds Next Button

        if (x > prevButtonRect.left && x < prevButtonRect.right && y > prevButtonRect.top && y < prevButtonRect.bottom && lookDirection !== "LEFT" && lookDirection !== "RESET") {          // If x,y is in prev button 
            startLookTime = timestamp;
            lookDirection = "LEFT";

            //var prevLocation = currentLocation.start.index - 1;
            //rendition.display(prevLocation);
            console.log("left");

        }

        else if (x > nextButtonRect.left && x < nextButtonRect.right && y > nextButtonRect.top && y < nextButtonRect.bottom && lookDirection !== "RIGHT" && lookDirection !== "RESET") {    // If x,y is in next button 

            startLookTime = timestamp;
            lookDirection = "RIGHT";

            //var nextLocation = currentLocation.start.index + 1;
            //rendition.display(nextLocation);
            console.log("right");

        }

        else

            lookDirection = null;

        if (startLookTime + LOOK_DELAY < timestamp) {
            if (lookDirection === "LEFT") {
                let currentLocation = rendition.currentLocation();
                const prevLocation = currentLocation.start.index - 1;
                rendition.display(prevLocation);
            }
            else {
                let currentLocation = rendition.currentLocation();
                const nextLocation = currentLocation.start.index + 1;
                rendition.display(nextLocation);
            }

            startLookTime = Number.POSITIVE_INFINITY;
            lookDirection = "STOP";
            console.log("newtime");
            setTimeout(() => {
                lookDirection = "RESET";
            }, 200)
        }

    })
    .begin() /* startet die Verfolgung */
//.showPredictionPoints(true); /* zeigt die Vorhersagepunkte an */


function nextPage(next = false) {

}

