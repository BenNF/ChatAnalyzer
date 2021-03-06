import React from "react"
import DataCollector from "./DataCollector";
import TabbedDataview from "./TabbedDataView";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gatherData: true,
      data: null
    };
  }

  dataCallback = data => {
    this.setState({
      gatherData: false,
      data: data
    });
  };

  render() {
    if (this.state.gatherData) {
      return (
        <div className="dashboard-container">
          <DataCollector callback={this.dataCallback}/>
        </div>
      );
    } else {
      return (
        <div className="dashboard-container">
          <TabbedDataview data={this.state.data}/>
        </div>
      );
    }
  }
}

export default Dashboard;
