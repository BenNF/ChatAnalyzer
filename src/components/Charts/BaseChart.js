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
  componentDidUpdate() {
    this.updateChart();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props != nextProps) {
      this.setState({
        ...this.state,
        title: nextProps.title,
        data: nextProps.data,
        dimensions: {
          height: nextProps.height,
          width: nextProps.width,
          margin: nextProps.margin ? nextProps.margin : 50
        }
      });
    }
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
        <div className="chart-container">
          <svg ref={this.ref} />
          <div className="chart-controls">{this.renderControls()}</div>
        </div>
      </div>
    );
  }
}

export default BaseChart;
