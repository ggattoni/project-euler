class CustomRandom {

    constructor() {
        this.random = 6563116;
    }

    nextRandom() {
        let result = this.random;
        this.random = (this.random * this.random) % 32745673;
        return result;
    }

}

/*****************TEST CUSTOMRANDOM*****************************************/

// let r = new CustomRandom();
// for (let i = 0; i < 3; i++)
//     console.log(r.nextRandom() > 10000000 ? 'westward' : 'eastward');

/***************************************************************************/

function arrayMin(arr) {
    let result = Infinity,
        index = -1;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== undefined) {
            result = Math.min(result, arr[i]);
            if (result === arr[i]) {
                index = i;
            }
        }
    }
    return {
        result: result,
        index: index
    };
}

let L = 1000000000;
let N = 1000001;
let target = 500001;

let gaps = [];
let eastward = [];
let centers = [0];
let random = new CustomRandom();

// Setup basic variables
for (let i = 1, c = 0; i <= N; i++) {
    let r = random.nextRandom();
    gaps[i] = r % 1000 + 1;
    eastward[i] = (r > 10000000) ? false : true;
    centers[i] = c + gaps[i] + 10;
    c += gaps[i] + 20;
}

// console.log(gaps);
// console.log(centers);
// console.log(eastward);

let distance = 0;

while (true) {
    /** Check if the target marble is the eastmost and
     *  is heading east. If so, compute the distance
     *  between the center of the marble end the exit
     *  of the tube and add it to the distance. Finally,
     *  exit from the loop.                             */
    if (N == target && eastward[target]) {
        distance += L - centers[target];
        break;
    }

    /** Check if the eastmost marble (which can't be the
     *  target marble) is heading eastmost. If so we will
     *  lose his tracks because it is no longer relevant
     *  for the actual problem                          */
    if (eastward[N]) { // TODO : change to pop()
        eastward[N] = undefined;
        gaps[N] = undefined;
        centers[N] = undefined;

        N--;
    }

    let steps = [];

    /** First compute the distance each marble will 
     *  travel before colliding with another marble
     *  or the wall                                  */

    if (!eastward[1]) {
        steps[1] = gaps[1];
    }

    for (let i = 2; i <= N; i++) {
        if (eastward[i - 1] && !eastward[i]) {
            steps[i] = gaps[i] / 2;
        }
    }

    /** Compute the distance between the eastmost
     *  marble and the exit of the tube (only if
     *  the eastmost marble is heading east)     */
    if (eastward[N]) {
        steps[N + 1] = L - centers[N];
    }

    // console.log(steps);

    let minDj = arrayMin(steps);
    let minDistance = minDj.result;
    let minIndex = minDj.index;

    // console.log(minDistance);
    // console.log(minIndex);

    /** Update our model by the distance that
     *  all our marbles travel before a collision
     *  occurs.                                     */
    distance += minDistance;
    console.log("Distance: " + distance);

    /** Update centers */
    for (let i = 1; i <= N; i++) {
        if (eastward[i]) {
            centers[i] += minDistance;
        } else {
            centers[i] -= minDistance;
        }
        gaps[i] = centers[i] - centers[i - 1] - 20;
    }
    gaps[1] += 10;

    /** Update directions */
    if (gaps[1] === 0) {
        eastward[1] = !eastward[1];
    }
    for (let i = 2; i <= N; i++) {
        if (gaps[i] === 0) {
            eastward[i] = !eastward[i];
            eastward[i - 1] = !eastward[i - 1];
        }
    }

    // eastward[minIndex] = !eastward[minIndex];
    // if (minIndex > 1) {
    //     eastward[minIndex - 1] = !eastward[minIndex - 1];
    // }

    // console.log("\n***************************************\n");
    // console.log(eastward);
    // console.log(gaps);
    // console.log(centers);

    //if (distance > 600) break;
}

console.log("\nThe distance is:\n");
console.log(distance);
console.log();
