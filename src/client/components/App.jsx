import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import _ from 'lodash';
import Timeboard from './Timeboard.jsx';

class App extends Component {
  constructor(props) {
    super(props);
      this.state = { 
        value: 'Sök hållplats', 
        selectedStopID: '',
        autocompleteData: [],
        currentDB: [],
        curTime: '',
        isDBLoaded: true
      }
    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.getItemValue = this.getItemValue.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.searchStopData = this.searchStopData.bind(this);
    this.debounceAutocomplete = _.debounce(this.searchStopData,350);
    }

  componentDidMount() {
    this.generateAccessToken();
    setInterval(this.generateAccessToken, 1000 * 60 * 60);
  }

  generateAccessToken() {
    try {
      fetch('/generateAT');
    } catch (err) {
      console.log(err);
      console.log('Could not generate accesstoken!')
    }
    console.log('generateAccessToken()');
  }
     
  async searchStopData(searchText){
        console.log('searchText inte null');
      try {
        const res = await fetch(`/searchStop/${searchText}`); 
        const result = await res.json();
        console.log('json fetchad');
        this.setState({autocompleteData: result});
        console.log('autocompletedata set');
        } catch (err) {
          console.log(err);
      }
  }

  async getDepartureBoard(stopID){
    this.setState({
      isDBLoaded: false
    });

    if (stopID != '') {
      try {
        const res = await fetch(`/getDB/${stopID}`) 
        const result = await res.json();
        this.setState({
          currentDB: result,
          isDBLoaded: true
        });
        } catch (err) {
          console.log(err);
      }
    }
    this.setState({
      value: this.state.currentDB[0].stop
    });
  }

  renderItem(item, isHighlighted){
    return (
        <div style={{ background: isHighlighted ? '#EEEEEE' : 'white' }}>
            {item.name}
        </div>   
    ); 
  }

  getItemValue(item){
    return item.id;
  }

  onChange(e){
    this.setState({
        value: e.target.value,
        autocompleteData: []

    });
    e.persist()
    this.debounceAutocomplete(this.state.value);  
  }

  onSelect(val){ 
    this.setState({
        selectedStopID: val,
    });
    this.getDepartureBoard(val); 
  }

  render() {
    return (
      <div>
        <div className='searchBar'>
          <Autocomplete
              getItemValue={this.getItemValue}
              items={this.state.autocompleteData}
              renderItem={this.renderItem}
              value={this.state.value}
              onChange={this.onChange}
              onSelect={this.onSelect}
              inputProps={{ style: { width: '100%', height: '50%', margin: '2% auto 0%', 'font-size': '16px' , 'border': '1px solid #c4c4c4'} }}  
              wrapperStyle={{ width: '50%', height: '100%', margin: 'auto'}}

            menuStyle={
              { borderRadius: '3px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)', background: 'rgba(255, 255, 255, 0.9)',
              padding: '2px 0', fontSize: '115%', position: 'fixed', overflow: 'auto', maxHeight: '50%' }         
            }
          />
        </div>
      <div>
        <Timeboard currentDB={this.state.currentDB} isDBLoaded={this.state.isDBLoaded} /> 
      </div>
      </div>
    );
  }
}

export default App;
