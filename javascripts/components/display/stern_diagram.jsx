import React from 'react';
import {
    toRadians,
    toDegrees,
    getHeading,
    vectorMag
} from '../util/vector_util';
import {
    makeInArrow,
    makeOutArrow,
    makeStreamRipple
} from './canvas_helper';

class SternDiagram extends React.Component {
    constructor(props) {
        super(props);
        this.appDir = [0, 0];
        this.appHeading = 0;
    }

    componentDidMount() {
        this.ctx = this.refs.canvas.getContext('2d');
        this.drawDiagram();
    }

    componentDidUpdate() {
        this.drawDiagram();
    }

    clearDisplay() {
        this.ctx.fillStyle = 'lightblue';
        this.ctx.fillRect(0, 0, 300, 310);
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(0, 310, 300, 300);
    }

    drawDiagram() {
        this.clearDisplay();
        this.drawBoat();
    }

    drawBoat() {
        let model = this.props.model;
        let boat = model.boat;
        let ctx = this.ctx;      

        ctx.translate(150, 300);
        
        let heelAngle = toRadians(boat.heelAngle);
        let floatAmt = 25 * Math.sin(Math.abs(heelAngle));
        ctx.translate(0, -1 * floatAmt);
        ctx.rotate(heelAngle);

        //hull
        ctx.beginPath();
        ctx.fillStyle = 'brown';
        ctx.arc(-20, -20, 40, Math.PI / 2, Math.PI, false);
        ctx.lineTo(20, -20);
        ctx.arc(20, -20, 40, 0, Math.PI / 2);
        ctx.fill();

        /////////ROTATION POINT!
        ctx.beginPath();
        ctx.fillStyle = 'orange';
        ctx.arc(0, 0, 10, 2 * Math.PI, 0, false);
        ctx.fill();

        //centerboard
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.moveTo(-2, 20);
        ctx.fillRect(-2, 20, 4, 60);
        ctx.fill();

        //mast
        ctx.beginPath();
        ctx.moveTo(-2, -290);
        ctx.fillRect(-2, -290, 4, 270);
        ctx.fill();

        let boomDist = Math.sin(toRadians(boat.sailAngle)) * 140;
        //sail
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(0, -290);
        ctx.lineTo(boomDist, -50);
        ctx.lineTo(0, -50);
        ctx.fill();

        //boom
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'black';
        ctx.moveTo(0, -50);
        ctx.lineTo(boomDist, -50);
        ctx.stroke();

        //sailor
        // ctx.beginPath();
        // ctx.fillStyle = 'orange';
        // ctx.arc(boat.sailorPosition, -40, 10, 2 * Math.PI, 0, false);
        // ctx.fill();
        
        ctx.rotate(-1 * heelAngle);
        ctx.translate(0, floatAmt);
        
        //heeling forces
        if (boat.tack === 'starboard') {
            let sailHeelForce = model.sailHeelForce;
            makeInArrow(ctx, -30, (-1 * boat.sailOffset), -Math.PI / 2, 60, sailHeelForce, 8, 'red');
            let boardHeelForce = model.boardHeelForce;
            makeInArrow(ctx, 30, boat.boardOffset, Math.PI / 2, 60, boardHeelForce, 8, 'red');
        }
        else {
            let sailHeelForce = model.sailHeelForce;
            makeInArrow(ctx, 30, (-1 * boat.sailOffset), Math.PI / 2, 60, sailHeelForce, 8, 'red');
            let boardHeelForce = model.boardHeelForce;
            makeInArrow(ctx, -30, boat.boardOffset, -Math.PI / 2, 60, boardHeelForce, 8, 'red');
        }

        //righting forces
        let buoyancyForce = model.buoyancyForce;
        makeInArrow(ctx, (-1 * boat.buoyancyOffset), -30, 0, 70, buoyancyForce, 8, 'green');
        makeInArrow(ctx, 0, 30, Math.PI, 70 + floatAmt, boat.boatWeight / 4, 8, 'black');   //eventually won't show this one, only sailor weight


        //translate back
        ctx.translate(-150, -300);
    }

    render (){
        return (
            <div>
                <canvas ref="canvas"
                    width="300px"
                    height="400px"
                />
            </div>
        );
    }
}

export default SternDiagram;