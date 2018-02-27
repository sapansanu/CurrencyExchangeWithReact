import React, { Component} from 'react';
import { DateRange } from 'react-date-range';
import './App.css';
import { SplitButton, MenuItem, Button, Alert, Glyphicon } from 'react-bootstrap';
import { Chart } from 'react-google-charts';
import moment from 'moment'



class Comparison extends Component {
  constructor (props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null,
      currency1: "GBP",
      currency2: "EUR",
      rows: [['Date', 'Currency 1', 'Currency 2']],
      alertVisible: false
  }
  this.handleChangeForDropdown1 = this.handleChangeForDropdown1.bind(this);
  this.handleChangeForDropdown2 = this.handleChangeForDropdown2.bind(this);
  this.handleDateChange = this.handleDateChange.bind(this);
  this.updateChart = this.updateChart.bind(this);
  this.updateDate = this.updateDate.bind(this);
  this.handleClick = this.handleClick.bind(this);
}

  componentWillMount() {
    let dates = this.calculateInitialDate();
    this.updateChart(dates);
  }

  calculateInitialDate() {
    let dates=[];
    let last = new Date();
    for(let i=0;i<10;i++) {
        let newLast = last-(24*60*60*1000)*i;
        let date = new Date(newLast);
        date = moment(date).format("YYYY-MM-DD");
        dates.push(date);
    }
    dates = dates.reverse();
    this.setState({dates});
    return dates;
  }

  updateDate(startDate= null, endDate=null) {
    let start = new Date(startDate);
    let end = new Date(endDate);
    let diffDays = Math.round(Math.abs((start.getTime() - end.getTime())/(24*60*60*1000)));
    let dates = [];
    for(let i=-1;i<diffDays;i++) {
      let newEnd = end-(24*60*60*1000)*i;
      let date = new Date(newEnd);
      //console.log(date, newEnd);
      date = moment(date).format("YYYY-MM-DD");
      dates.push(date);
    }
    dates = dates.reverse();
    this.setState({dates});
    return dates;
  }

  updateChart(dates) {
    let BASE_URLS = [], responses = [];
    //contructing base urls
    for(let i=0;i<dates.length;i++) {
        BASE_URLS.push('https://api.fixer.io/'+dates[i]+'?base=USD');
      } 
    //constructing full urls with desired currencies
    for(let i=0;i<dates.length;i++) {
      const FULL_URL = BASE_URLS[i] + "&symbols=" + this.state.currency1 +","+ this.state.currency2;
      fetch(FULL_URL, {
        method: 'GET'
      })
      .then(resp => resp.json())
      .then(json => {
        const response = json.rates;
        for(let key in response) {
          let row = [];
          row[0] = key;
          row[1] = response[key];
          responses.push(row);
          if(responses.length === 2*dates.length) {
            let rows = [['Date', this.state.currency1, this.state.currency2]], j=0;
            for(let i =0;i<responses.length;i=i+2) {
              let row = [];
              row[0] = dates[j];
              row[1] = responses[i][1];
              row[2] = responses[i+1][1];
              rows.push(row);
              j++;
            }
            this.setState({rows}); 
          }
        }
        
      })
      .catch(function(error) {
        console.log(error);
      });
    }
  }

  handleChangeForDropdown1(eventKey, alertComponent) {
    this.setState({currency1: eventKey});
  }

  handleChangeForDropdown2(eventKey, alertComponent) {
    this.setState({currency2: eventKey});  
  }

  handleDateChange(range) {
    if(range.startDate !== range.endDate) {
      const startDate = range.startDate.format("YYYY-MM-DD");
      const endDate = range.endDate.format("YYYY-MM-DD");
      let start = new Date(startDate);
      let end = new Date(endDate);
      let diffDays = Math.round(Math.abs((start.getTime() - end.getTime())/(24*60*60*1000)));
      //allowing a date range of 10 days
      if(diffDays > 10 || diffDays < 1) {
        this.setState({alertVisible: true});
      } else {
        this.setState({alertVisible: false});
        this.setState({startDate}); 
        this.setState({endDate}); 
      }
    }
  }

  handleClick() {
    let dates;
    if(this.state.startDate=== null && this.state.endDate === null) {
      dates = this.calculateInitialDate();
    } else {
    dates = this.updateDate(this.state.startDate, this.state.endDate);      
    }
    this.updateChart(dates);
  }

  render() {
    let alertComponent = null, menuItem1 = [], menuItem2 = [];
    if(this.state.alertVisible) {
      alertComponent = <Alert bsStyle="warning">
                        <strong style={{color: "red"}}>Please select a date range of 10 days or less</strong><br/>* USD is the base currency
                      </Alert>;
    } else if(this.state.currency1 === this.state.currency2) {
      alertComponent = <Alert bsStyle="warning" >
                        <strong style={{color: "red"}}>Please select two different currencies</strong><br/>* USD is the base currency
                      </Alert>;
    } else {
      alertComponent = <Alert bsStyle="warning"><strong>Displaying rates from last 10 days by default</strong><br/>* USD is the base currency
                      </Alert>;
    }
    for(let i=1;i<this.props.data.length;i++) {
      menuItem1.push(<MenuItem eventKey={this.props.data[i][0]} key ={this.props.data[i][0]} onSelect={() => this.handleChangeForDropdown1(this.props.data[i][0], alertComponent)}>{this.props.data[i][0]}</MenuItem>);
      menuItem2.push(<MenuItem eventKey={this.props.data[i][0]} key ={this.props.data[i][0]} onSelect={() => this.handleChangeForDropdown2(this.props.data[i][0], alertComponent)}>{this.props.data[i][0]}</MenuItem>);
    }
    return (
      <div className="comparison">
        <div className="dropdown">
          <SplitButton
            title={this.state.currency1}
            key="1"
            id={this.state.currency1}
          >
          {menuItem1}
          </SplitButton>   
          <SplitButton
            title={this.state.currency2}
            key="2"
            id={this.state.currency2}
          >
          {menuItem2}
          </SplitButton>
          <Button className="compare" bsStyle="success" bsSize="large" onClick={this.handleClick}>Compare<Glyphicon glyph="chevron-right"/></Button>
        </div>
        {alertComponent}
        <div className="dateRange">           
            <DateRange
              //onInit={this.handleSelect}
              onChange={this.handleDateChange}
            />
        </div>
        <Chart
          chartType="ColumnChart"
          data={this.state.rows}
          options={{}}
          graph_id="LineChart"
          width="100%"
          height="400px"
        />
      </div>
    );
  }
}

export default Comparison;
