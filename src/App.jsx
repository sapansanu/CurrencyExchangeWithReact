import React, { Component } from 'react';
import './App.css';
import ColumnChart from './ColumnChart';
import Comparison from './Comparison';
//import GoogleChart from './GoogleChart';
import { Button, Grid, Row, Col, PageHeader } from 'react-bootstrap';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supportedCurrencies: null,
      currentTab: 'currencyTable'
    }
    this.goToCurrencyTable = this.goToCurrencyTable.bind(this);
    this.goToComparisonTable = this.goToComparisonTable.bind(this);
  }

  componentWillMount() {
    this.search();
  }

  search() {
    const URL = 'https://api.fixer.io/latest?base=USD';

    fetch(URL, {
      method: 'GET'
    })
      .then(resp => resp.json())
      .then(json => {
        const response = json.rates;
        let rates = [['Currency', 'USD rates']];
        let supportedCurrencies = [];
        for(let key in response) {
          let row = [];
          row[0] = key;
          row[1] = response[key];
          rates.push(row);
        }
        rates.sort(function(a, b){return a[1] - b[1]});
        supportedCurrencies = rates.slice(0, 11);
        this.setState({supportedCurrencies});
      })
      .catch(function(error) {
        console.log(error);
      });
    }

  goToCurrencyTable() {
      this.setState({currentTab: 'currencyTable'});
  }

  goToComparisonTable() {
      this.setState({currentTab: 'comparisonTable'});
  }

  render() {
    let responseElement = null;
    if(this.state.currentTab === 'currencyTable') {
      responseElement = <ColumnChart data={this.state.supportedCurrencies}/>;
    } else {
      responseElement = <Comparison data={this.state.supportedCurrencies}/>;
    }
    return (
      <div className="App">
      <Grid>
        <Row>
          <Col xs={12} md={12}>
            <PageHeader>
              Welcome to Currency Exchange
            </PageHeader>
          </Col>
        </Row>
        <Row className="App-button-container">
          <Col xs={6} md={6} lg={6}>
            <Button bsStyle="primary" bsSize="large" active onClick={this.goToCurrencyTable}>Currency Chart</Button>
          </Col>
          <Col xs={6} md={6} lg={6}>
            <Button bsStyle="primary" bsSize="large" active onClick={this.goToComparisonTable}>Comparison Chart</Button>
          </Col>
        </Row>
        <div className="tabContainer">
          {responseElement}
        </div>
      </Grid>
      </div>
    );
  }
}

export default App;
