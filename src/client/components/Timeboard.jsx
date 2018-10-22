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
      curTime: '',
    };
    
  }

  componentDidMount() {
    setInterval(() => {
      const now = new Date();
      this.setState({
        curTime: dateFormat(now, 'HH:MM'),
      });
    }, 1000);
  }

  createTableRows() {
    const table = this.props.currentDB;
    let data = '';

    for (let i = 0; i < table.length; i += 1) { // Adding calculated time left to for each JSON object.
      const calcTimeLeft = this.calculateTimeLeft(table[i].rtTime, table[i].time, table[i].date);
      table[i].calcTimeLeft = calcTimeLeft;
    }

    table.sort((a, b) => a.calcTimeLeft - b.calcTimeLeft || a.track - b.track);

    try {
      data = table.map((journey) => {
        if (journey.calcTimeLeft === 0) {
          journey.calcTimeLeft = 'Nu';
        }
        return (
          <tbody>
            <tr>
              <td><div className="journeyIcon" style={{ backgroundColor: journey.fgColor, color: journey.bgColor }}>{journey.sname}</div></td>
              <td><div className="tableText">{journey.direction}</div></td>
              <td>{journey.calcTimeLeft}</td>
              <td>{journey.track}</td>
            </tr>
          </tbody>
        );
      });
    } catch (error) {
      console.log(error);
      console.log('Could not createTableRows!');
    }

    return data;
  }

  // Takes the realtime or the tabletime from the API and converts it to minutes.
  calculateTimeLeft(journeyrtTime, journeyTableTime, journeyDate) {
    const JRT = journeyrtTime;
    const JTT = journeyTableTime;
    const JD = `${journeyDate} `;
    let roundedMinutes = '';
  
    if (typeof JRT !== 'undefined') {
      const timestamp = JD.concat(JRT);
      const diffMs = Math.abs(new Date() - new Date(timestamp));
      const diffSeconds = (diffMs / 1000);
      const diffMinutes = (diffSeconds / 60);
      roundedMinutes = Math.round(diffMinutes);
    } else if (typeof JRT === 'undefined') {
      const timestamp = JD.concat(JTT);
      const diffMs = Math.abs(new Date() - new Date(timestamp));
      const diffSeconds = (diffMs / 1000);
      const diffMinutes = (diffSeconds / 60);
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
              <th className="lineTableHeader">Linje</th>
              <th>Destination</th>
              <th>Avgår</th>
              <th>Läge</th>
            </tr>
          </thead>

          {this.props.isDBLoaded ? this.createTableRows() : (
            <div>
              <ClipLoader
                className={override}
                sizeUnit="px"
                size={100}
                color="#3C4650"
                loading
              />
            </div>
          )}
        </Table>
      </div>
    );
  }
}

export default Timeboard;
