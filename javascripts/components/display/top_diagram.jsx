import React from 'react';
import {
    toRadians,
    toDegrees,
    getHeading
} from '../util/vector_util';

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
        let boat = this.props.boat;
        let ctx = this.ctx;

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


        this.appHeading = appHeading;
        this.appDir = appDir;
        ctx.beginPath();
        ctx.lineWidth = 6;
        ctx.strokeStyle = 'lightblue';
        //ctx.arc(150, 150, 100, 0, 2 * Math.PI, true);
        ctx.moveTo(
            150 - (100 * Math.sin(relAppHeading)),
            150 + (100 * Math.cos(relAppHeading))
        );
        ctx.moveTo(
            150 - (100 * Math.sin(relAppHeading)),
            150 + (100 * Math.cos(relAppHeading))
        );
        ctx.lineTo(
            150 - ((100 + appSpeed) * Math.sin(relAppHeading)),
            150 + ((100 + appSpeed) * Math.cos(relAppHeading))
        );
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.fillStyle = 'lightblue';
        //arrowheads
        ctx.moveTo(
            150 - (98 * Math.sin(relAppHeading)),
            150 + (98 * Math.cos(relAppHeading))
        );
        ctx.lineTo(
            150 - ((108) * Math.sin(relAppHeading + 0.15)),
            150 + ((108) * Math.cos(relAppHeading + 0.15))
        );
        // ctx.moveTo(
        //     150 - (100 * Math.sin(relAppHeading)),
        //     150 + (100 * Math.cos(relAppHeading))
        // );
        ctx.lineTo(
            150 - ((108) * Math.sin(relAppHeading - 0.15)),
            150 + ((108) * Math.cos(relAppHeading - 0.15))
        );
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

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
                x: {this.appDir[0]}
                <br/>
                y: {this.appDir[1]}
                <br />
                appHeading: {Math.round(toDegrees(this.appHeading))}
                <br />
                app wind speed: {Math.round(this.props.boat.appWindSpeed)}
                <br/>
                diff: {Math.round(toDegrees(this.appHeading) - this.props.boat.heading)}
                <canvas ref="canvas"
                    width="300px"
                    height="300px"
                />
            </div>
        );
    }
}

export default TopDiagram;