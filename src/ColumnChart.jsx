import React, { Component} from 'react';
import { Chart } from 'react-google-charts';
import './App.css';
import { Alert } from 'react-bootstrap';

class ColumnChart extends Component {

  render() {
    return (
      <div className="columnChart">
        <Alert className="baseAlert" bsStyle="warning">
          <strong>USD is the base currency</strong> 
        </Alert>
        <Chart
          chartType="ColumnChart"
          data={this.props.data}
          options={{}}
          graph_id="ColumnChart"
          width="100%"
          height="600px"
          title="USD base"
        />
      </div>
    );
  }
}

export default ColumnChart;
