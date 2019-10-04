import {
    vectorMag,
    vectorSum,
    getUnitVector,
    getHeadingDeg,
    toRadians
} from '../util/vector_util';
import Foil from './foil';

class Boat {
    constructor(){
        this.sail = new Foil(0.06, 0.03, 10);
        this.centerBoard = new Foil(0.8, 0.3, 1);
        this.rudderAngle = 0;
        this.position = [400, 100];
        this.sailAngle = 0;
        this.rudderSpeed = 100; //      deg/second
        this.turningSpeed = 2;  //      deg/second/rudder/degree
        this.heading = 0;
        this.speed = 0;
        this.velocity = [0, 0];
        this.mass = 2;
        this.maxSpeed = 40;        //      pixels/second
        this.mainSheetPos = 20; //      max |angle| of sail
        this.trimmingSpeed = 30 //      deg/second
        this.maxSheetAngle = 100;
        //this.sailCd = .03;
        this.minSailDrag = 10;
        //this.sailCl = .08;
        this.appWindDir = [0, 0];
        this.appWindSpeed = 0;
        this.appWindVel = [0, 0];
        this.tack = 'starboard';
    }

    pushRudder(dt, dir) {
        this.moveRudder(-dir * dt * this.rudderSpeed);
    }

    moveRudder(angle) {
        this.rudderAngle += angle;
        if (this.rudderAngle < -80) this.rudderAngle = -80;
        if (this.rudderAngle > 80) this.rudderAngle = 80;
    }

    trimMain(dt, dir) {
        let sheetAngle = dir * dt * this.trimmingSpeed;
        this.mainSheetPos += sheetAngle;
        if (this.mainSheetPos > this.maxSheetAngle){
            this.mainSheetPos = this.maxSheetAngle;
        }
        if (this.mainSheetPos < 0){
            this.mainSheetPos = 0;
        }
    }

    updateHeading(dt) {
        this.heading -= this.turningSpeed * this.rudderAngle * dt;
        if (this.heading > 360) this.heading -= 360;
        if (this.heading < 0) this.heading += 360;
    }

    calculateTotalForceOnBoat() {
        let sailForce = this.calculateForceOnSail();
        let boardForce = this.calculateForceOnCenterBoard();
        return [sailForce[0] + boardForce[0], sailForce[1] + boardForce[1]];
        //return vectorSum(sailForce, boardForce);
    }

    updateVelocity(dt) {
        let totalForce = this.calculateTotalForceOnBoat();
        let acc = [totalForce[0] / this.mass, totalForce[1] / this.mass];
        this.velocity[0] += dt * acc[0];
        this.velocity[1] += dt * acc[1];
    }

    updatePosition(dt) {
        let moveVector = [dt * this.velocity[0], dt * this.velocity[1]];
        this.position[0] += moveVector[0];
        this.position[1] += moveVector[1];

        // let speed = this.calculateSpeed();
        // let radHeading = this.heading * Math.PI / 180;
        // let unitVector = [Math.sin(radHeading), Math.cos(radHeading)];
        // let dist = speed * dt;
        // let moveVector = [dist * unitVector[0], dist * unitVector[1]];
        // this.position[0] += moveVector[0];
        // this.position[1] -= moveVector[1];
        // this.speed = speed;
    }

    calculateSpeed() {
        return 10;
        let maxSpeed = this.maxSpeed;
        let speedAngle = this.heading < 180 ?
        this.heading :
        this.heading - (2*(this.heading - 180));
        if (speedAngle < 22.5){
            maxSpeed = 0;
        }
        else if (speedAngle < 45){
            let range = [0, maxSpeed / 2]
            maxSpeed = range[0] + range[1] * ((speedAngle - 22.5)/(22.5));
        }
        else if (speedAngle < 90){
            let range = [maxSpeed / 2, maxSpeed]
            maxSpeed = range[0] + (range[1] - range[0] ) * ((speedAngle - 45) / (45));
        }
        else if (speedAngle <= 180) {
            let range = [maxSpeed, 0.25 * maxSpeed]
            maxSpeed = range[0] - (range[1] * ((speedAngle - 90) / (90)));
        }
        let idealSailAngle = speedAngle / 2;
        this.idealSailAngle = idealSailAngle;
        this.absSailAngle = speedAngle - Math.abs(this.sailAngle);
        let fractionOfMax = (45 - Math.abs(this.absSailAngle - idealSailAngle))/(45);
        if (fractionOfMax < 0) fractionOfMax = 0;
        return maxSpeed * fractionOfMax;
    }

    updateSailAngle(dt) {
        let windHeading = getHeadingDeg(this.appWindDir);

        this.sailAngle = Math.abs(180 - windHeading + this.heading);
        if (this.sailAngle > 180){
            this.sailAngle = this.sailAngle - 360;
        }

        if (Math.abs(this.sailAngle) > this.mainSheetPos) {
            
            this.sailAngle = this.heading < 180 ? 
            this.mainSheetPos : 
            this.mainSheetPos * -1;
        }
        this.tack = this.sailAngle < 0 ? 'starboard' : 'port';
    }

    calculateAppWind(windHeading, windSpeed) {
        let moveDir = getUnitVector(this.velocity);
        let moveHeading = getHeadingDeg(moveDir);
        let radHeading = this.heading * Math.PI/180;
        //let radHeading = moveHeading * Math.PI / 180;
        let boatDir = [Math.sin(radHeading), -Math.cos(radHeading)];
        let boatVel = [boatDir[0] * this.speed, boatDir[1] * this.speed];
        let radTrueWind = (windHeading - 180) * Math.PI/180;
        let trueDir = [Math.sin(radTrueWind), -Math.cos(radTrueWind)];
        let trueVel = [trueDir[0] * windSpeed, trueDir[1] * windSpeed];

        this.appWindVel = [trueVel[0] - this.velocity[0], trueVel[1] - this.velocity[1]];

        this.appWindDir = getUnitVector(this.appWindVel);
        this.appWindSpeed = vectorMag(this.appWindVel);


        
        return this.appWindVel;
    }

    calculateForceOnSail() {
        let lift = this.calculateLiftOnSail();
        let drag = this.calculateDragOnSail();
        return [lift[0] + drag[0], lift[1] + drag[1]];
    }

    calculateDragOnSail() {
        let absSailAngle = this.heading - this.sailAngle;
        return this.sail.calculateDrag(absSailAngle, this.appWindVel);
    }

    calculateLiftOnSail() {
        let absSailAngle = this.heading - this.sailAngle;
        return this.sail.calculateLift(absSailAngle, this.appWindVel, (this.tack === 'port'));
    }

    calculateDragOnCenterBoard() {
        let absBoardAngle = this.heading - 180;
        let waterVector = [-this.velocity[0], -this.velocity[1]];
        let boardDrag = this.centerBoard.calculateDrag(absBoardAngle, waterVector);
        return boardDrag;
    }

    calculateLiftOnCenterBoard() {
        let absBoardAngle = this.heading - 180;
        let waterVector = [-this.velocity[0], -this.velocity[1]];
        let boardDrag = this.centerBoard.calculateLift(absBoardAngle, waterVector, (this.tack === 'port'));
        return boardDrag;
    }

    calculateForceOnCenterBoard() {
        let lift = this.calculateLiftOnCenterBoard();
        let drag = this.calculateDragOnCenterBoard();
        return [lift[0] + drag[0], lift[1] + drag[1]];
    }

}

export default Boat;