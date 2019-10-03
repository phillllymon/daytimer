import {
    vectorMag,
    getUnitVector,
    getHeadingDeg,
    toRadians
} from '../util/vector_util';

class Boat {
    constructor(){
        this.rudderAngle = 0;
        this.position = [400, 300];
        this.sailAngle = 0;
        this.rudderSpeed = 100; //      deg/second
        this.turningSpeed = 2;  //      deg/second/rudder/degree
        this.heading = 0;
        this.speed = 0;
        this.maxSpeed = 40;        //      pixels/second
        this.mainSheetPos = 20; //      max |angle| of sail
        this.trimmingSpeed = 30 //      deg/second
        this.maxSheetAngle = 100;
        this.sailCd = 5;
        this.sailCl = 9;
        this.appWindDir = [0, 0];
        this.appWindSpeed = 0;
        this.appWindVel = [0, 0];
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

    updatePosition(dt) {
        let speed = this.calculateSpeed();
        let radHeading = this.heading * Math.PI / 180;
        let unitVector = [Math.sin(radHeading), Math.cos(radHeading)];
        let dist = speed * dt;
        let moveVector = [dist * unitVector[0], dist * unitVector[1]];
        this.position[0] += moveVector[0];
        this.position[1] -= moveVector[1];
        this.speed = speed;
    }

    calculateSpeed() {
        return 20;
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
    }

    calculateAppWind(windHeading, windSpeed) {
        let radHeading = this.heading * Math.PI/180;
        let boatDir = [Math.sin(radHeading), -Math.cos(radHeading)];
        let boatVel = [boatDir[0] * this.speed, boatDir[1] * this.speed];
        let radTrueWind = (windHeading - 180) * Math.PI/180;
        let trueDir = [Math.sin(radTrueWind), -Math.cos(radTrueWind)];
        let trueVel = [trueDir[0] * windSpeed, trueDir[1] * windSpeed];
        this.appWindVel = [trueVel[0] - boatVel[0], trueVel[1] - boatVel[1]];
        this.appWindDir = getUnitVector(this.appWindVel);
        this.appWindSpeed = vectorMag(this.appWindVel);
        
        return this.appWindVel;
    }

    calculateForceOnSail(appWindVel) {
        
    }

    calculateDragOnSail() {
        let absSailAngle = this.heading - this.sailAngle;
        let radAbsSailAngle = absSailAngle * Math.PI / 180;
        let absSailDir = [-Math.sin(radAbsSailAngle), Math.cos(radAbsSailAngle)];

        let absAppDir = getUnitVector(this.appWindVel);
        let appWindHeading = getHeadingDeg(absAppDir);
        let sailHeading = getHeadingDeg(absSailDir);
        let angleOfAttack = Math.abs(appWindHeading - sailHeading);
        let attackRad = toRadians(angleOfAttack);
        let sailDragMag = this.sailCd * (this.appWindSpeed * this.appWindSpeed) * Math.sin(attackRad);
        let dragVector = [sailDragMag * absAppDir[0], sailDragMag * absAppDir[1]];

        this.angleOfAttack = angleOfAttack;
        return dragVector;
    }

    calculateLiftOnSail() {

    }

}

export default Boat;