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
      const t = date.split(/[- :]/);
      const d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
      const now = new Date(d);
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

  calculateTimeLeft(journeyrtTime, journeyTableTime, journeyDate) {
    let JRT = journeyrtTime;
    let JTT = journeyTableTime;
    let JD = `${journeyDate  } `;
    let roundedMinutes = '';

    if (typeof JRT !== 'undefined') {
      var timestamp = JD.concat(JRT);
      var diffMs = Math.abs(new Date() - new Date(timestamp));
      var diffSeconds = (diffMs / 1000);
      var diffMinutes = (diffSeconds / 60);
      roundedMinutes = Math.round(diffMinutes);
    } else if (typeof JRT === 'undefined') {
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
