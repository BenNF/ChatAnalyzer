import React from "react";
import Basechart from "./BaseChart";
import * as d3 from "d3";

class PieChart extends Basechart {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      activeData: { ...this.state.data },
      chartConfig: {
        type: "pie",
        radius:
          Math.min(this.state.dimensions.width, this.state.dimensions.height) /
            2 -
          this.state.dimensions.margin,
        controlsChecked: new Array(Object.keys(this.state.data).length).fill(
          true
        )
      }
    };
  }

  updateChart = () => {
    this.resetSvg();
    let svg = d3
      .select(this.ref.current)
      .append("g")
      .attr(
        "transform",
        "translate(" +
          this.state.dimensions.width / 2 +
          "," +
          this.state.dimensions.height / 2 +
          ")"
      );

    const color = d3
      .scaleOrdinal()
      .domain(this.state.activeData)
      .range(d3.schemeSet2);
    const pie = d3.pie().value(d => d.value);
    const data = pie(d3.entries(this.state.activeData));
    const arcGen = d3
      .arc()
      .innerRadius(0)
      .outerRadius(this.state.chartConfig.radius);

    //create chart
    svg
      .selectAll("mySlices")
      .data(data)
      .enter()
      .append("path")
      .attr("d", arcGen)
      .attr("fill", function(d) {
        return color(d.data.key);
      })
      .attr("stroke", "black")
      .attr("class", "pie-path")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);
    //add labels
    svg
      .selectAll("mySlices")
      .data(data)
      .enter()
      .append("text")
      .text(function(d) {
        return (d.data.key+": " +d.data.value);
      })
      .attr("transform", function(d) {
        return "translate(" + arcGen.centroid(d) + ")";
      })
      .style("text-anchor", "middle")
      .style("font-size", 17);
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

export default PieChart;
