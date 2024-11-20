const bridge = '/assets/images/tiles/bridge.png';
const empty = '/assets/images/tiles/empty.png';
const mountain = '/assets/images/tiles/mountain.png';
const oasis = '/assets/images/tiles/oasis.png';
const bridge_rail = '/assets/images/tiles/bridge_rail.png';
const curve_rail = '/assets/images/tiles/curve_rail.png';
const mountain_rail = '/assets/images/tiles/mountain_rail.png';
const straight_rail = '/assets/images/tiles/straight_rail.png';

let bridge_90, bridge_rail_90;
let curve_rail_90, curve_rail_180, curve_rail_270;
let mountain_90, mountain_180, mountain_270;
let mountain_rail_90, mountain_rail_180, mountain_rail_270;
let straight_rail_90;

function generateRotatedImages() {
    const rotationConfigs = [
        {src: bridge, angles: [90], variables: [url => bridge_90 = url]},
        {src: bridge_rail, angles: [90], variables: [url => bridge_rail_90 = url]},
        {
            src: curve_rail,
            angles: [90, 180, 270],
            variables: [url => curve_rail_90 = url, url => curve_rail_180 = url, url => curve_rail_270 = url]
        },
        {
            src: mountain,
            angles: [90, 180, 270],
            variables: [url => mountain_90 = url, url => mountain_180 = url, url => mountain_270 = url]
        },
        {
            src: mountain_rail,
            angles: [90, 180, 270],
            variables: [url => mountain_rail_90 = url, url => mountain_rail_180 = url, url => mountain_rail_270 = url]
        },
        {src: straight_rail, angles: [90], variables: [url => straight_rail_90 = url]}
    ];

    const promises = rotationConfigs.flatMap(({src, angles, variables}) =>
        angles.map((angle, index) => createRotatedImage(src, angle).then(rotatedImageUrl => {
            if (rotatedImageUrl) {
                variables[index](rotatedImageUrl);
            }
        }))
    );

    return Promise.all(promises).then(() => {
        defineGrids();
        defineSolutions();
    });
}

function createRotatedImage(src, angle) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const image = new Image();
        image.src = src;

        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.save();
            context.translate(canvas.width / 2, canvas.height / 2);
            context.rotate((angle * Math.PI) / 180);
            context.translate(-canvas.width / 2, -canvas.height / 2);
            context.drawImage(image, 0, 0);
            context.restore();

            const rotatedImageUrl = canvas.toDataURL();
            resolve(rotatedImageUrl);
        };
    });
}

function defineGrids() {
    easy1 = [
        [empty, mountain_90, empty, empty, oasis],
        [empty, empty, empty, bridge, oasis],
        [bridge, empty, mountain_180, empty, empty],
        [empty, empty, empty, oasis, empty],
        [empty, empty, mountain_270, empty, empty]
    ];
    easy2 = [
        [oasis, empty, bridge_90, empty, empty],
        [empty, mountain_180, empty, empty, mountain_180],
        [bridge, oasis, mountain_270, empty, empty],
        [empty, empty, empty, oasis, empty],
        [empty, empty, empty, empty, empty]
    ];
    easy3 = [
        [empty, empty, bridge_90, empty, empty],
        [empty, empty, empty, empty, bridge],
        [empty, mountain_180, bridge, empty, empty],
        [empty, oasis, empty, empty, empty],
        [empty, bridge_90, empty, empty, mountain_180]
    ];
    easy4 = [
        [empty, empty, empty, bridge_90, empty],
        [empty, empty, empty, empty, empty],
        [bridge, empty, mountain_90, empty, mountain_90],
        [empty, empty, empty, empty, empty],
        [empty, empty, oasis, mountain_270, empty]
    ];
    easy5 = [
        [empty, empty, bridge_90, empty, empty],
        [empty, mountain, empty, empty, empty],
        [bridge, empty, empty, mountain_270, empty],
        [empty, empty, bridge, oasis, empty],
        [empty, mountain_180, empty, empty, empty]
    ];

    hard1 = [[empty, mountain_90, oasis, oasis, empty, bridge_90, empty], [bridge, empty, empty, empty, empty, empty, empty], [empty, empty, bridge, empty, empty, empty, empty], [empty, empty, empty, mountain_270, empty, empty, empty], [mountain_270, empty, mountain_90, empty, bridge_90, empty, oasis], [empty, empty, empty, empty, empty, empty, empty], [empty, empty, empty, bridge_90, empty, empty, empty]];
    hard2 = [[empty, empty, oasis, empty, empty, empty, empty], [bridge, empty, bridge_90, empty, empty, mountain_180, empty], [empty, empty, bridge_90, empty, empty, empty, bridge], [mountain, empty, empty, empty, empty, empty, empty], [empty, oasis, empty, mountain_90, empty, empty, empty], [empty, mountain, empty, empty, empty, empty, empty], [empty, empty, oasis, empty, empty, empty, empty]];
    hard3 = [[empty, empty, bridge_90, empty, empty, empty, empty], [empty, empty, empty, empty, empty, empty, bridge], [oasis, empty, mountain_270, empty, empty, empty, empty], [empty, empty, empty, empty, empty, empty, empty], [empty, oasis, mountain_270, empty, bridge_90, empty, empty], [bridge, empty, empty, empty, empty, mountain_90, empty], [empty, empty, oasis, mountain_270, empty, empty, empty]];
    hard4 = [[empty, empty, empty, empty, empty, empty, empty], [empty, empty, empty, bridge, empty, mountain_180, empty], [empty, empty, mountain_270, empty, empty, empty, empty], [empty, bridge_90, empty, oasis, empty, bridge_90, empty], [empty, empty, mountain_180, empty, mountain_90, empty, empty], [bridge, empty, empty, empty, empty, mountain_270, empty], [empty, empty, empty, empty, empty, empty, empty]];
    hard5 = [[empty, empty, empty, empty, empty, empty, empty], [empty, empty, empty, empty, empty, mountain, empty], [empty, bridge_90, bridge_90, empty, mountain_90, empty, empty], [empty, empty, empty, empty, empty, empty, empty], [empty, empty, mountain, empty, oasis, empty, empty], [empty, mountain_180, empty, bridge, empty, empty, empty], [empty, empty, empty, empty, empty, empty, empty]];

    easy = [easy1, easy2, easy3, easy4, easy5];
    hard = [hard1, hard2, hard3, hard4, hard5];
}

function defineSolutions() {
    eSolution1 = [[curve_rail, mountain_rail_90, curve_rail, curve_rail_90, oasis], [straight_rail, straight_rail, straight_rail, bridge_rail, oasis], [bridge_rail, curve_rail_270, mountain_rail_180, curve_rail_270, curve_rail_90], [straight_rail, curve_rail, curve_rail_90, oasis, straight_rail], [curve_rail_270, curve_rail_180, mountain_rail_270, straight_rail_90, curve_rail_180]]
    eSolution2 = [[oasis, curve_rail, bridge_rail_90, straight_rail_90, curve_rail_90], [curve_rail, mountain_rail_180, curve_rail, straight_rail_90, mountain_rail_180], [bridge_rail, oasis, mountain_rail_270, straight_rail_90, curve_rail_90], [straight_rail, curve_rail, curve_rail_90, oasis, straight_rail], [curve_rail_270, curve_rail_180, curve_rail_270, straight_rail_90, curve_rail_180]]
    eSolution3 = [[curve_rail, straight_rail_90, bridge_rail_90, straight_rail_90, curve_rail_90], [curve_rail_270, curve_rail_90, curve_rail, curve_rail_90, bridge_rail], [curve_rail, mountain_rail_180, bridge_rail, curve_rail_270, curve_rail_180], [straight_rail, oasis, curve_rail_270, straight_rail_90, curve_rail_90], [curve_rail_270, bridge_rail_90, straight_rail_90, straight_rail_90, mountain_rail_180]]
    eSolution4 = [[curve_rail, curve_rail_90, curve_rail, bridge_rail_90, curve_rail_90], [straight_rail, curve_rail_270, curve_rail_180, curve_rail, curve_rail_180], [bridge_rail, curve_rail, mountain_rail_90, curve_rail_270, mountain_rail_90], [straight_rail, straight_rail, curve_rail_270, curve_rail_90, straight_rail], [curve_rail_270, curve_rail_180, oasis, mountain_rail_270, curve_rail_180]]
    eSolution5 = [[curve_rail, straight_rail_90, bridge_rail_90, straight_rail_90, curve_rail_90], [straight_rail, mountain_rail, curve_rail_90, curve_rail, curve_rail_180], [bridge_rail, straight_rail, straight_rail, mountain_rail_270, curve_rail_90], [straight_rail, straight_rail, bridge_rail, oasis, straight_rail], [curve_rail_270, mountain_rail_180, curve_rail_270, straight_rail_90, curve_rail_180]]

    hSolution1 = [
        [curve_rail, mountain_rail_90, oasis, oasis, curve_rail, bridge_rail_90, curve_rail_90],
        [bridge_rail, straight_rail, curve_rail, curve_rail_90, straight_rail, curve_rail, curve_rail_180],
        [straight_rail, straight_rail, bridge_rail, straight_rail, straight_rail, curve_rail_270, curve_rail_90],
        [straight_rail, curve_rail_270, curve_rail_180, mountain_rail_270, curve_rail_180, curve_rail, curve_rail_180],
        [mountain_rail_270, straight_rail_90, mountain_rail_90, curve_rail, bridge_rail_90, curve_rail_180, oasis],
        [curve_rail, straight_rail_90, curve_rail_180, curve_rail_270, straight_rail_90, straight_rail_90, curve_rail_90],
        [curve_rail_270, straight_rail_90, straight_rail_90, bridge_rail_90, straight_rail_90, straight_rail_90, curve_rail_180]
    ];
    hSolution2 = [
        [curve_rail, curve_rail_90, oasis, curve_rail, curve_rail_90, curve_rail, curve_rail_90],
        [bridge_rail, curve_rail_270, bridge_rail_90, curve_rail_180, curve_rail_270, mountain_rail_180, straight_rail],
        [curve_rail_270, straight_rail_90, bridge_rail_90, curve_rail_90, curve_rail, curve_rail_90, bridge_rail],
        [mountain_rail, straight_rail_90, straight_rail_90, curve_rail_180, straight_rail, straight_rail, straight_rail],
        [straight_rail, oasis, curve_rail, mountain_rail_90, straight_rail, straight_rail, straight_rail],
        [straight_rail, mountain_rail, curve_rail_180, straight_rail, straight_rail, straight_rail, straight_rail],
        [curve_rail_270, curve_rail_180, oasis, curve_rail_270, curve_rail_180, curve_rail_270, curve_rail_180]
    ];
    hSolution3 = [
        [curve_rail, straight_rail_90, bridge_rail_90, straight_rail_90, straight_rail_90, straight_rail_90, curve_rail_90],
        [curve_rail_270, curve_rail_90, curve_rail, straight_rail_90, straight_rail_90, curve_rail_90, bridge_rail],
        [oasis, straight_rail, mountain_rail_270, straight_rail_90, curve_rail_90, straight_rail, straight_rail],
        [curve_rail, curve_rail_180, curve_rail, straight_rail_90, curve_rail_180, curve_rail_270, curve_rail_180],
        [straight_rail, oasis, mountain_rail_270, straight_rail_90, bridge_rail_90, straight_rail_90, curve_rail_90],
        [bridge_rail, curve_rail, straight_rail_90, curve_rail_90, curve_rail, mountain_rail_90, straight_rail],
        [curve_rail_270, curve_rail_180, oasis, mountain_rail_270, curve_rail_180, curve_rail_270, curve_rail_180]
    ];
    hSolution4 = [
        [curve_rail, straight_rail_90, curve_rail_90, curve_rail, curve_rail_90, curve_rail, curve_rail_90],
        [curve_rail_270, curve_rail_90, straight_rail, bridge_rail, curve_rail_270, mountain_rail_180, straight_rail],
        [curve_rail, curve_rail_180, mountain_rail_270, curve_rail_180, curve_rail, straight_rail, curve_rail_180],
        [curve_rail_270, bridge_rail_90, curve_rail_90, oasis, curve_rail_270, bridge_rail_90, curve_rail_90],
        [curve_rail, straight_rail_90, mountain_rail_180, curve_rail, mountain_rail_90, curve_rail, curve_rail_180],
        [bridge_rail, curve_rail, curve_rail_90, straight_rail, straight_rail, mountain_rail_270, curve_rail_90],
        [curve_rail_270, curve_rail_180, curve_rail_270, curve_rail_180, curve_rail_270, straight_rail_90, curve_rail_180]
    ];
    hSolution5 = [
        [curve_rail, curve_rail_90, curve_rail, curve_rail_90, curve_rail, straight_rail, curve_rail_90],
        [straight_rail, curve_rail_270, curve_rail_180, curve_rail_270, curve_rail_180, mountain_rail, curve_rail_180],
        [curve_rail_270, bridge_rail_90, bridge_rail_90, straight_rail_90, mountain_rail_90, curve_rail_270, curve_rail_90],
        [curve_rail, straight_rail_90, straight_rail_90, straight_rail_90, curve_rail_180, curve_rail, curve_rail_180],
        [curve_rail_270, curve_rail_90, mountain_rail, curve_rail_90, oasis, curve_rail_270, curve_rail_90],
        [curve_rail, mountain_rail_180, straight_rail, bridge_rail, curve_rail, curve_rail_90, straight_rail],
        [curve_rail_270, straight_rail_90, curve_rail_180, curve_rail_270, curve_rail_180, curve_rail_270, curve_rail_180]
    ];

    eSolutions = [eSolution1, eSolution2, eSolution3, eSolution4, eSolution5];
    hSolutions = [hSolution1, hSolution2, hSolution3, hSolution4, hSolution5];

}

generateRotatedImages();