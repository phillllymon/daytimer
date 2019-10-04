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

class TopDiagram extends React.Component {
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

        //apparentWindArrow
        let appDir = boat.appWindDir;
        let appSpeed = boat.appWindSpeed;
        let appHeading = getHeading(appDir);
        let relAppHeading = toRadians(toDegrees(appHeading) - boat.heading);
        makeInArrow(ctx, 150, 150, relAppHeading, 100, appSpeed, 6, 'lightblue');

        //windDragArrow
        // let dragAmt = vectorMag(model.dragOnSail);
        // let relDragHeading = relAppHeading; //should be same as apparent wind
        // makeOutArrow(ctx, 150, 150, relDragHeading, 50, dragAmt, 6, 'red');

        //windLiftArrow
        // let liftVec = model.liftOnSail;
        // let liftAmt = vectorMag(liftVec);
        // let liftHeading = getHeading(liftVec);
        // let relLiftHeading = toRadians(toDegrees(liftHeading) - boat.heading);
        // makeOutArrow(ctx, 150, 150, relLiftHeading, 50, liftAmt, 6, 'green');

        //windForceArrow
        let forceVec = model.forceOnSail;
        let forceAmt = vectorMag(forceVec);
        let forceHeading = getHeading(forceVec);
        let relForceHeading = toRadians(toDegrees(forceHeading) - boat.heading);
        makeOutArrow(ctx, 150, 150, relForceHeading, 50, forceAmt, 6, 'green');

        //boardDragArrow
        // let boardDragVec = model.dragOnBoard;
        // let boardDragAmt = vectorMag(boardDragVec);
        // let boardDragHeading = getHeading(boardDragVec);
        // let relBoardDragHeading = toRadians(toDegrees(boardDragHeading) - boat.heading);
        // makeOutArrow(ctx, 150, 150, relBoardDragHeading, 70, boardDragAmt, 6, 'red');

        //boardLiftArrow
        // let boardLiftVec = model.liftOnBoard;
        // let boardLiftAmt = vectorMag(boardLiftVec);
        // let boardLiftHeading = getHeading(boardLiftVec);
        // let relBoardLiftHeading = toRadians(toDegrees(boardLiftHeading) - boat.heading);
        // makeOutArrow(ctx, 150, 150, relBoardLiftHeading, 50, boardLiftAmt, 6, 'green');

        //boardForceArrow
        let boardForceVec = model.forceOnBoard;
        let boardForceAmt = vectorMag(boardForceVec);
        let boardForceHeading = getHeading(boardForceVec);
        let relBoardForceHeading = toRadians(toDegrees(boardForceHeading) - boat.heading);
        makeOutArrow(ctx, 150, 150, relBoardForceHeading, 50, boardForceAmt, 6, 'red');

        //totalForceArrow
        let totalForceVec = model.totalForce;
        let totalForceAmt = vectorMag(totalForceVec);
        let totalForceHeading = getHeading(totalForceVec);
        let reltotalForceHeading = toRadians(toDegrees(totalForceHeading) - boat.heading);
        makeOutArrow(ctx, 150, 150, reltotalForceHeading, 50, totalForceAmt, 6, 'black');

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
        return (
            <div>
                x: {this.props.model.liftOnSail[0]}
                <br/>
                y: {this.props.model.liftOnSail[1]}
                <br />
                appHeading: {Math.round(toDegrees(this.appHeading))}
                <br />
                app wind speed: {Math.round(this.props.model.boat.appWindSpeed)}
                <br/>
                tack: {this.props.model.boat.tack}
                <canvas ref="canvas"
                    width="300px"
                    height="300px"
                />
            </div>
        );
    }
}

export default TopDiagram;