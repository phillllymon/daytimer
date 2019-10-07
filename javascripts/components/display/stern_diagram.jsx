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

        //heeling forces
        let sailHealForce = model.sailHeelingForce;
        makeInArrow(ctx, -30, -200, -Math.PI / 2, 60, sailHealForce, 8, 'red');

        //hull
        ctx.beginPath();
        ctx.fillStyle = 'brown';
        ctx.arc(-20, -20, 40, Math.PI / 2, Math.PI, false);
        ctx.lineTo(20, -20);
        ctx.arc(20, -20, 40, 0, Math.PI / 2);
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