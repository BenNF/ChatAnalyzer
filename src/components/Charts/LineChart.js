import React from "react";
import BaseChart from "./BaseChart";
import * as d3 from "d3";

class LineChart extends BaseChart {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      activeData: { ...this.state.data },
      chartConfig: {
        type: "line",
        controlsChecked: new Array(Object.keys(this.state.data).length).fill(
          true
        )
      }
    };
  }

  updateChart = () => {
    this.resetSvg();
    const svg = d3
      .select(this.ref.current)
      .append("g")
      .attr(
        "transform",
        "translate(" +
          this.state.dimensions.margin +
          "," +
          this.state.dimensions.margin +
          ")"
      );
    let yMax = -1;
    const data = Object.keys(this.state.activeData).map((upperKey, upperIndex) => {
      return Object.keys(this.state.activeData[upperKey]).map(
        (lowerkey, lowerIndex) => {
          yMax = Math.max(this.state.activeData[upperKey][lowerkey], yMax);
          return this.state.activeData[upperKey][lowerkey];
        }
      );
    });

    const xScale = d3
      .scaleLinear()
      .domain([0, 24])
      .range([0, this.state.dimensions.width + this.state.dimensions.margin]);

    const yScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([this.state.dimensions.height - this.state.dimensions.margin, 0]);

    const lineGen = d3
      .line()
      .x((d, i) => {
        return xScale(i);
      })
      .y(d => {
        return yScale(d);
      });
    svg
      .append("g")
      .attr("class", "x axis")
      .attr(
        "transform",
        "translate(0," +
          (this.state.dimensions.height - this.state.dimensions.margin) +
          ")"
      )
      .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    svg
      .append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale));

    const drawLine = (dataInstance, index) => {
      const cname = "line" + index;
      svg
        .append("path")
        .datum(dataInstance)
        .attr("class", cname)
        .attr("d", lineGen);
      svg
        .selectAll(".dot")
        .data(dataInstance)
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d, i) {
          return xScale(i);
        })
        .attr("cy", function(d) {
          return yScale(d);
        })
        .attr("r", 5);
    };
    data.forEach((data, i) => {
      drawLine(data, i);
    });
  };

  renderControls = () => {
    return (
      <div className="chart-controls">
        {Object.keys(this.state.data).map((key, index) => {
          return (
            <div className="control-box" key={index}>
              <input
                type="checkbox"
                checked={this.state.chartConfig.controlsChecked[index]}
                datakey={key}
                dataindex={index}
                onChange={this.handleControls}
              />
              <span className="control-label">{key}</span>
            </div>
          );
        })}
      </div>
    );
  };
  handleControls = event => {
    const key = event.target.attributes.datakey.value;
    const index = event.target.attributes.dataindex.value;
    const checked = event.target.checked;

    let controls = this.state.chartConfig.controlsChecked;
    controls[index] = checked;

    let data = this.state.activeData;

    if (checked) {
      data[key] = this.state.data[key];
    } else {
      delete data[key];
    }

    this.setState({
      ...this.state,
      activeData: data,
      chartConfig: {
        ...this.state.chartConfig,
        controlsChecked: controls
      }
    });
  };
}

export default LineChart;
