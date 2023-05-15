const angleStep = 15;
const betaCeiling = 180;

const betaTop = 120;
const betaMiddle = 90;
const bettaBottom = 50;
const betaFloor = 0;

export const guideColor = "#34D980";
export const squareColor = "rgba(255, 255, 255, 0.35)";
export const rangeColor = "deepskyblue";

export const waitCapturingTime = 700; //milliseconds

export const deltaAngle = 360 / angleStep;

export const needCountPhoto = angleStep * 3+2;


export let stateForGradientImages = [];

stateForGradientImages.push({
    id: stateForGradientImages.length,
    name: "floor",
    alpha: 0,
    beta: betaFloor,
    readyToPhotographed: false,
    photographed: false,
    forCircles: !(0),
});

for (let i = 0; i < angleStep; i++) {
    stateForGradientImages.push({
        id: stateForGradientImages.length,
        name: "bottom",
        alpha: ((i + 0.5) * deltaAngle).toFixed(0) - 180,
        beta: bettaBottom,
        readyToPhotographed: false,
        photographed: false,
        forCircles: !((i + 1) % angleStep),
    });
}

for (let i = 0; i < angleStep; i++) {
    stateForGradientImages.push({
        id: stateForGradientImages.length,
        name: "middle",
        alpha: ((i + 0.5) * deltaAngle).toFixed(0) - 180,
        beta: betaMiddle,
        readyToPhotographed: false,
        photographed: false,
        forCircles: !((i + 1) % angleStep),
    });
}

for (let i = 0; i < angleStep; i++) {
    stateForGradientImages.push({
        id: stateForGradientImages.length,
        name: "top",
        alpha: ((i + 0.5) * deltaAngle).toFixed(0) - 180,
        beta: betaTop,
        readyToPhotographed: false,
        photographed: false,
        forCircles: !((i + 1) % angleStep),
    });
}

stateForGradientImages.push({
    id: stateForGradientImages.length,
    name: "ceiling",
    alpha: 0,
    beta: betaCeiling,
    readyToPhotographed: false,
    photographed: false,
    forCircles: !(0),
});


stateForGradientImages = [...stateForGradientImages.sort((a, b) => b.id - a.id)];
