import React, { Component } from 'react';
import '../scss/application.css';
import { Table } from 'react-bootstrap';
import dateFormat from 'dateformat';


class Timeboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curTime: '' 
        }
    }
    componentDidMount() {
        setInterval( () => {
        var now = new Date();
          this.setState({
            curTime : dateFormat(now, "HH:MM")
          })
        },1000)
    }

    createTableRows () {
        let table = this.props.currentDB;
        let data = '';
        data = table.map(journey => {
            return (
                <tr>
                    <td>{journey.name}</td> 
                    <td>{journey.direction}</td>
                    <td>{this.calculateTimeLeft(journey.rtTime, journey.time, journey.date)}</td> 
                    <td>{journey.track}</td>
                </tr>   
            )      
        })

        return data;
    }

    calculateTimeLeft(journeyrtTime, journeyTableTime, journeyDate) { 
        var JRT = journeyrtTime;
        var JTT = journeyTableTime; 
        var JD = journeyDate + ' ';
        var roundedMinutes = '';

        if (typeof JRT !== "undefined") {
            var timestamp = JD.concat(JRT);         
            var diffMs = Math.abs(new Date() - new Date(timestamp));
            var diffSeconds = (diffMs / 1000);
            var diffMinutes = (diffSeconds / 60);
            roundedMinutes = Math.round(diffMinutes);

        } else if (typeof JRT === "undefined") {
            var timestamp = JD.concat(JTT);         
            var diffMs = Math.abs(new Date() - new Date(timestamp));
            var diffSeconds = (diffMs / 1000);
            var diffMinutes = (diffSeconds / 60);
            roundedMinutes = Math.round(diffMinutes);
        }

        if (roundedMinutes === 0) {
            return 'Nu';
        }
        else {
            return roundedMinutes;
        } 
    }

    render() {
        return (
            <div className="timeBoard">          
                <Table responsive>
                <thead>
                    <tr>
                    <th>Linje</th>
                    <th>Destination</th>
                    <th>Avgår</th>
                    <th>Läge</th>
                    </tr>
                </thead>

                <tbody>
                    { this.createTableRows() }
                </tbody>
                </Table>;
            </div>
        );
    }
}

export default Timeboard;