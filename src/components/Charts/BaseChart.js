import React from "react";
import * as d3 from "d3/";

class BaseChart extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      title: this.props.title,
      data: this.props.data,
      dimensions: {
        height: this.props.height,
        width: this.props.width,
        margin: this.props.margin ? this.props.margin : 50
      },
      chartConfig: {
        type: "base"
      }
    };
  }
  componentWillUpdate() {
    this.updateChart();
  }

  componentDidMount() {
    this.updateChart();
  }

  resetSvg = () => {
    d3.select(this.ref.current)
      .selectAll("*")
      .remove();
    d3.select(this.ref.current)
      .attr("width", this.state.dimensions.width + this.state.dimensions.margin)
      .attr(
        "height",
        this.state.dimensions.height + this.state.dimensions.margin
      )
      .attr(
        "transform",
        "translate(" +
          this.state.dimensions.margin +
          "," +
          -this.state.dimensions.margin +
          ")"
      );
  };
  updateChart = () => {
    this.resetSvg();
  };
  renderControls = () => {
    return <div className="chart-controls" />;
  };

  render() {
    return (
      <div className={this.state.chartConfig.type + "-chart"}>
        <h1>{this.state.title}</h1>
        <svg ref={this.ref} />
        {this.renderControls()}
      </div>
    );
  }
}

export default BaseChart;
