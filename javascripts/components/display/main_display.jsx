import React from 'react';
import {
    getUnitVector,
    vectorMag
} from '../util/vector_util';

class MainDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.ctx = this.refs.canvas.getContext('2d');
        this.drawModel();
    }

    componentDidUpdate() {
        this.drawModel();
    }

    clearDisplay() {
        this.ctx.fillStyle = 'darkblue';
        this.ctx.fillRect(0, 0, 800, 600);
    }

    drawModel() {
        this.clearDisplay();
        this.drawBoat();
    }

    drawBoat() {
        let model = this.props.model;
        let boat = this.props.boat;
        let pos = boat.position;
        let dir = boat.heading * Math.PI / 180;
        let windMap = this.props.windMap;
        let ctx = this.ctx;

        //display waves
        windMap.waves.forEach( (row) => {
            row.forEach( (wave) => {
                ctx.strokeStyle = 'blue';
                // if (wave.stage > 8){
                //     ctx.strokeStyle = 'lightblue';
                // }
                // else {
                //     ctx.strokeStyle = 'blue';
                // }
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(wave.pos[0], wave.pos[1]);
                let widthFactor = wave.stage < 12 ? wave.stage : 17 - (2*wave.stage);
                //let widthFactor = wave.stage;
                ctx.lineTo(wave.pos[0] + (1 * widthFactor + 2), wave.pos[1]);
                ctx.moveTo(wave.pos[0], wave.pos[1]);
                ctx.lineTo(wave.pos[0] - (1 * widthFactor + 2), wave.pos[1]);
                ctx.stroke();
            });
        });

        ctx.fillStyle = 'red';
        ctx.translate(pos[0], pos[1]);
        ctx.rotate(dir);
        ctx.beginPath();
        ctx.arc(35, 10, 55, 2.8, 4.0, false);
        ctx.arc(-35, 10, 55, 4.0 + (3.14 - (2 * (4.0 - 3.14))), 3.14 - 2.8, false);
        //ctx.arc(-35, 10, 55, 9.42 - 4, false);   //slow brain not seeing why this is not equivalent...
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.beginPath();
        let mastPos = [0, -15];
        ctx.arc(mastPos[0], mastPos[1], 2, 0, 2 * Math.PI, true);
        ctx.fill();

        let sailAngle = boat.sailAngle * Math.PI / 180;
        let unitDir = [Math.sin(sailAngle), Math.cos(sailAngle)];
        let boomEndpoint = [
            mastPos[0] + unitDir[0] * 45, 
            mastPos[1] + unitDir[1] * 45
        ];
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.moveTo(0, -15);
        ctx.lineTo(boomEndpoint[0], boomEndpoint[1]);
        ctx.stroke();

        ctx.rotate(-dir);

        //display app wind arrow
        // let appDir = boat.appWindDir;
        // let appSpeed = boat.appWindSpeed;
        // ctx.beginPath();
        // ctx.lineWidth = 3;
        // ctx.moveTo(40*appDir[0], 40*appDir[1]);
        // ctx.lineTo((40 + appSpeed)*appDir[0], (40 + appSpeed)*appDir[1]);
        // ctx.stroke();

        //display wind drag arrow
        // let dragDir = appDir;
        // let dragSpeed = 20;
        // ctx.beginPath();
        // ctx.strokeStyle = 'blue';
        // ctx.moveTo(60*appDir[0], 60*appDir[1]);
        // ctx.lineTo((60 + dragSpeed) * dragDir[0], (60 + dragSpeed) * dragDir[1]);
        // ctx.stroke();

        //display wind lift arrow
        // let liftDir = [-dragDir[1], dragDir[0]];
        // if (dragDir[0] < 0) {
        //     liftDir = [dragDir[1], -dragDir[0]];
        // }
        // let liftSpeed = 20;
        // ctx.beginPath();
        // ctx.strokeStyle = 'green';
        // ctx.moveTo(60 * liftDir[0], 60 * liftDir[1]);
        // ctx.lineTo((60 + liftSpeed) * liftDir[0], (60 + liftSpeed) * liftDir[1]);
        // ctx.stroke();

        //display sailDrag arrow
        let dragVec = model.dragOnSail;
        let dragDir = getUnitVector(dragVec);
        let dragMag = vectorMag(dragVec)/500;
        ctx.beginPath();
        ctx.strokeStyle = 'orange';
        ctx.moveTo(80 * dragDir[0], 80 * dragDir[1]);
        ctx.lineTo((80 + dragMag) * dragDir[0], (80 + dragMag) * dragDir[1]);
        ctx.stroke();               //no worky

        ctx.translate(-(pos[0]), -(pos[1]));

        //display true wind
        let trueVec = windMap.getWindVector();
        ctx.beginPath();
        ctx.arc(40, 40, 2, 0, 2 * Math.PI, true);
        ctx.moveTo(40, 40);
        ctx.lineTo(40 + trueVec[0], 40 + trueVec[1]);
        ctx.stroke();
    }

    render() {
        return (
            <div>
                <canvas ref="canvas"
                    width="800px"
                    height="600px"
                />
            </div>
        );
    }
}

export default MainDisplay;