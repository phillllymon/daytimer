import {
    vectorMag,
    getUnitVector
} from '../util/vector_util';

class WindMap {
    constructor(width, height) {
        this.windSpeed = 40;
        this.windHeading = 0;
        this.width = width;
        this.height = height;
        this.waves = this.generateWaves();
    }

    generateWaves() {
        let numCols = this.width/15;
        let numRows = this.height/15;
        let waves = [];
        for (let i = 0; i < numRows; i++) {
            let row = [];
            for (let j = 0; j < numCols; j++) {
                let xCoord = 15 * j + ((Math.random() - 0.5) * 10);
                let yCoord = 15 * i + ((Math.random() - 0.5) * 10);
                row.push([xCoord, yCoord]);
            }
            waves.push(row);
        }
        return waves;
    }

    updateWaves(dt) {
        let height = this.height;
        this.waves.forEach( (row) => {
            row.forEach( (wave) => {
                wave[1] += dt * this.windSpeed/2;
                if (wave[1] > height) {
                    wave[1] = 0;
                }
            });
        });
    }

    getWindDir() {
        let radHeading = (this.windHeading + 180) * Math.PI / 180;
        return [Math.sin(radHeading), -Math.cos(radHeading)];
    }

    getWindVector() {
        let windDir = this.getWindDir();
        return [windDir[0] * this.windSpeed, windDir[1] * this.windSpeed];
    }
}

export default WindMap;