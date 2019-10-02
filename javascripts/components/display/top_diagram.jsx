import React from 'react';

class TopDiagram extends React.Component {
    constructor(props) {
        super(props);
    }

    render (){
        return (
            <div className="top_diagram">
                <div className="boat">
                    <div className="view_port">
                        <div className="boat_port">
                        </div>
                    </div>
                    <div className="view_starboard">
                        <div className="boat_starboard">
                        </div>
                    </div>
                    <div className="view_astern">
                        <div style={{
                            'transform' : `rotate(${this.props.boat.rudderAngle}deg)`
                        }} className="rudder">
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TopDiagram;