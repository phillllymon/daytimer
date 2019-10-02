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
            boat: this.model.boat,
            windMap: this.windMap
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
            boat: this.model.boat
        });

        this.lastTime = Date.now();
        window.requestAnimationFrame(this.mainLoop);
    }

    render () {
        return (
            <div style={{'display' : 'flex'}}>
                <TopDiagram   
                    boat={this.state.boat}
                />
                <MainDisplay
                    boat={this.state.boat}
                    windMap={this.state.windMap}
                />
                heading: {Math.round(this.state.boat.heading)}
                <br/>
                speed: {Math.round(this.state.boat.speed)}
                <br />
                windspeed: {Math.round(this.state.windMap.windSpeed)}
            </div>
        );
    }
}

export default Simulation;