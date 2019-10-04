import {
    vectorMag,
    getUnitVector,
    getHeadingDeg,
    toRadians,
    toDegrees
} from '../util/vector_util';

class Foil {
    constructor(cLift, cDrag, minDrag = 10) {
        this.cLift = cLift;
        this.cDrag = cDrag;
        this.minDrag = minDrag;

        this.angle = 0;
    }

    //both params absolute
    calculateDrag(foilAngle, fluidVelocity) {
        this.angle = foilAngle;

        let fluidDir = getUnitVector(fluidVelocity);
        let fluidHeading = getHeadingDeg(fluidDir);
        let fluidSpeed = vectorMag(fluidVelocity);
        //let angleOfAttack = foilAngle - fluidHeading;
        let angleOfAttack = Math.abs(foilAngle - fluidHeading);
        let radAttack = -(toRadians(angleOfAttack) - Math.PI);
        let dragMag = Math.abs(this.minDrag + this.cDrag * (fluidSpeed * fluidSpeed) * Math.sin(radAttack));
        return [dragMag * fluidDir[0], dragMag * fluidDir[1]];
    }

    calculateLift(foilAngle, fluidVelocity, invert) {
        let fluidDir = getUnitVector(fluidVelocity);
        let fluidHeading = getHeadingDeg(fluidDir);
        let fluidSpeed = vectorMag(fluidVelocity);
        let angleOfAttack = foilAngle - fluidHeading;
        let radAttack = -(toRadians(angleOfAttack) - Math.PI);
        let liftMag = this.cLift * (fluidSpeed * fluidSpeed) * Math.sin(radAttack) * Math.cos(radAttack);
        let liftDir = [-fluidDir[1], fluidDir[0]];

        //does not seem to be needed
        // if (invert) {
        //     liftDir = [fluidDir[1], -fluidDir[0]];
        //     console.log('here');
        // }
        return [liftMag * liftDir[0], liftMag * liftDir[1]];
    }

}

export default Foil;