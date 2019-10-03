import React from 'react';
import TopDiagram from './display/top_diagram';
import MainDisplay from './display/main_display';
import InputManager from './util/input_manager';
import Model from './physics/model';
import Boat from './physics/boat';
import WindMap from './physics/wind_map';

class Simulation extends React.Component {
    constructor(props) {
        super(props);
        this.inputManager = new InputManager();
        this.windMap = new WindMap(800, 600);
        this.model = new Model(new Boat, this.windMap);
        this.state = {
            model: this.model
        }
        this.startSimulation = this.startSimulation.bind(this);
        this.mainLoop = this.mainLoop.bind(this);
    }

    componentDidMount() {
        this.inputManager.startListening();
        this.startSimulation();
    }

    componentWillUnmount() {
        this.inputManager.stopListening();
    }

    startSimulation() {
        this.lastTime = Date.now();
        this.mainLoop();
    }

    mainLoop() {
        const dt = (Date.now() - this.lastTime) / 1000;

        this.model.update(this.inputManager.inputs, dt);
        this.setState({
            model: this.model
        });

        this.lastTime = Date.now();
        window.requestAnimationFrame(this.mainLoop);
    }

    render () {
        return (
            <div style={{'display' : 'flex'}}>
                <TopDiagram   
                    boat={this.state.model.boat}
                />
                <MainDisplay
                    model={this.state.model}
                    boat={this.state.model.boat}
                    windMap={this.state.model.windMap}
                />
                heading: {Math.round(this.state.model.boat.heading)}
                <br/>
                speed: {Math.round(this.state.model.boat.speed)}
                <br />
                windspeed: {Math.round(this.state.model.windMap.windSpeed)}
                <br />
                dragOnSail: x: {Math.round(this.state.model.dragOnSail[0]) + 
                    ' y: ' + Math.round(this.state.model.dragOnSail[1])}
                <br />
                angle of attack: {Math.round(this.state.model.boat.angleOfAttack)}
                <br />
                sailAngle: {Math.round(this.state.model.boat.sailAngle)}
            </div>
        );
    }
}

export default Simulation;