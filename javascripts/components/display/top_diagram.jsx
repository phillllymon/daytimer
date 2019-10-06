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
    makeStreamRipple,
    drawForceArrows
} from './canvas_helper';

class TopDiagram extends React.Component {
    constructor(props) {
        super(props);
        this.appDir = [0, 0];
        this.appHeading = 0;

        this.arrows = {
            appWind: true,
            sailLift: false,
            dragOnSail: false,
            sailForce: false,
            boardLift: false,
            boardDrag: true,
            boardForce: false,
            totalForce: false
        };

        this.toggleArrow = this.toggleArrow.bind(this);
    }

    toggleArrow(e) {
        let val = this.arrows[e.target.id];
        this.arrows[e.target.id] = val ? false : true;
    }

    componentDidMount() {
        this.ctx = this.refs.canvas.getContext('2d');
        this.drawDiagram();
    }

    componentDidUpdate() {
        this.drawDiagram();
    }

    clearDisplay() {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(0, 0, 300, 300);
    }

    drawDiagram() {
        this.clearDisplay();
        this.drawBoat();
    }

    drawBoat() {
        let model = this.props.model;
        let boat = model.boat;
        let ctx = this.ctx;

        //streamRipples
        makeStreamRipple(ctx, 150, 80, boat.velocity, boat.heading);
        makeStreamRipple(ctx, 183, 210, boat.velocity, boat.heading);
        makeStreamRipple(ctx, 117, 210, boat.velocity, boat.heading);

        //boat
        ctx.beginPath();
        ctx.fillStyle = 'brown';
        ctx.beginPath();
        ctx.arc(230, 170, 120, 2.8, 3.99, false);
        ctx.arc(70, 170, 120, -0.85, 3.14 - 2.8, false);
        ctx.closePath();
        ctx.fill();

        //mast
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(150, 115, 3, 0, 2 * Math.PI, true);
        ctx.fill();
        
        drawForceArrows(ctx, 150, 150, this.arrows, model, boat);

        //sheetAngleIndicator
        let sheetAngle = toRadians(boat.mainSheetPos);
        let indicatorLength = 60;
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(150, 111);
        ctx.lineTo(
            150 + indicatorLength * Math.sin(sheetAngle),
            111 + indicatorLength * Math.cos(sheetAngle)
        );
        ctx.moveTo(150, 111);
        ctx.lineTo(
            150 - indicatorLength * Math.sin(sheetAngle),
            111 + indicatorLength * Math.cos(sheetAngle)
        );
        ctx.stroke();

        //boom
        let boomAngle = toRadians(boat.sailAngle);
        let boomLength = 80;
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'black'
        ctx.beginPath();
        ctx.moveTo(150, 115);
        ctx.lineTo(
            150 + boomLength * Math.sin(boomAngle),
            115 + boomLength * Math.cos(boomAngle)
        );
        ctx.stroke();

        //center point
        ctx.beginPath();
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(150, 150, 2, 0, 2 * Math.PI, true);
        ctx.fill();

        //rudder
        let angle = toRadians(boat.rudderAngle);
        let rudderLength = 20;
        ctx.beginPath();
        ctx.arc(150, 210, 2, 0, 2 * Math.PI, true);
        ctx.moveTo(150, 210);
        ctx.lineWidth = 3;
        ctx.lineTo(
            150 - rudderLength * Math.sin(angle), 
            210 + rudderLength * Math.cos(angle)
            );
        ctx.stroke();
        //tiller
        let tillerLength = 30;
        ctx.beginPath();
        ctx.moveTo(150, 210);
        ctx.lineWidth = 1;
        ctx.lineTo(
            150 + tillerLength * Math.sin(angle),
            210 - tillerLength * Math.cos(angle)
        );
        ctx.stroke();
        

    }

    render (){
        let that = this;
        return (
            <div>
                {
                    Object.keys(this.arrows).map( (key, idx) => {
                        return (
                            <div key={idx}>   
                                <button id={key} onClick={that.toggleArrow}>
                                    {key} 
                                </button>
                                    {that.arrows[key] ? 'true' : 'false'}
                            </div>
                        );
                    })
                }
                <canvas ref="canvas"
                    width="300px"
                    height="300px"
                />
            </div>
        );
    }
}

export default TopDiagram;