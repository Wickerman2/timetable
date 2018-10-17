import React, { Component } from 'react';
import '../scss/application.css';
import { Table } from 'react-bootstrap';
import dateFormat from 'dateformat';
import { ClipLoader } from 'react-spinners';
import { css } from 'react-emotion';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

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

    createTableRows() {
        let table = this.props.currentDB;
        let data = '';

        for (let i = 0; i < table.length; i++) { // Adding calculated time left to for each JSON object.  
            let calcTimeLeft = this.calculateTimeLeft(table[i].rtTime, table[i].time, table[i].date);
            table[i].calcTimeLeft = calcTimeLeft;
        }

        table.sort(function(a, b) {
            return a.calcTimeLeft - b.calcTimeLeft || a.track - b.track;
        });
        
        try {
        data = table.map(journey => {
            if (journey.calcTimeLeft === 0) {
                journey.calcTimeLeft = 'Nu';
            }
            return (
                <tr>
                    <td>{journey.name}</td> 
                    <td>{journey.direction}</td>
                    <td>{journey.calcTimeLeft}</td> 
                    <td>{journey.track}</td>
                </tr>   
            )      
        })
        } catch (error) {
            console.log(error);
            console.log('Could not createTableRows!');
        }
        
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

        return roundedMinutes;
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
                    {this.createTableRows()};
                </tbody>

                </Table>;
            </div>
        );
    }
}

export default Timeboard;
/*
{this.props.isDBLoaded ? this.createTableRows() : 
    <div className='sweet-loading'>
        <ClipLoader
        className={override}
        sizeUnit={"px"}
        size={100}
        color={'#3C4650'}
        loading={true}
        />
    </div>}
*/