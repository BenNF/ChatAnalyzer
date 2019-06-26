import React from "react";
import MetricBar from "./MetricBar"
export default class TabbedDataView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      activeIndex: 0
    };
  }

  handleTabs = event => {
    const index = event.target.attributes.dataindex.value;
    this.setState({ ...this.state, activeIndex: index });
  };

  renderNavBar = () => {
    return this.state.data.map((chat, index) => {
      return (
        <button
          dataindex={index}
          onClick={this.handleTabs}
          key={"button" + index}
        >
          {chat.title}
        </button>
      );
    });
  };
  renderMetricsBars = () => {
      const currentData = this.state.data[this.state.activeIndex]
      return(currentData.members.map((mem, index)=> {
            return(<MetricBar data={currentData.getMetricsBySender(mem)}/>)
      }))
  };

  render() {
    return (
      <React.Fragment>
        <div className="nav-bar">{this.renderNavBar()}</div>
        <div className="metric-bars">{this.renderMetricsBars()}</div>
      </React.Fragment>
    );
  }
}
