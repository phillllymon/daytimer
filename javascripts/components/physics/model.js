class Model {
    constructor(boat, windMap){
        this.boat = boat;
        this.windMap = windMap;
    }

    update(inputs, dt) {
        
        if (inputs.right && !inputs.left){
            this.boat.pushRudder(dt, 1);
        }
        if (inputs.left && !inputs.right){
            this.boat.pushRudder(dt, -1);
        }
        if (inputs.up && !inputs.down){
            this.boat.trimMain(dt, 1);
        }
        if (inputs.down && !inputs.up) {
            this.boat.trimMain(dt, -1);
        }

        this.windMap.updateWaves(dt);
        this.boat.updatePosition(dt);
        this.boat.updateHeading(dt);
        this.boat.updateSailAngle(dt);
        let appWind = this.boat.calculateAppWind(
            this.windMap.windHeading, 
            this.windMap.windSpeed
            );
        this.boat.calculateForceOnSail(appWind);
    };
}

export default Model;