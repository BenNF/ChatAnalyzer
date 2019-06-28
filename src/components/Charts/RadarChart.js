import React from "react";
import BaseChart from "./BaseChart";
import * as d3 from "d3";

class RadarChart extends BaseChart {
  constructor(props) {
    super(props);
    const {
      levels = 3,
      maxValue = 0,
      labelFactor = 1.25,
      wrapWidth = 60,
      opacityArea = 0.35,
      dotRadius = 4,
      opacityCircles = 0.1,
      strokeWdith = 2,
      roundStrokes = false,
      color = d3.scaleOrdinal(d3.schemeCategory10)
    } = props;

    this.state = {
      ...this.state,
      activeKey: "Combined",
      chartConfig: {
        type: "radar",
        levels,
        maxValue,
        labelFactor,
        wrapWidth,
        opacityArea,
        dotRadius,
        opacityCircles,
        strokeWdith,
        roundStrokes,
        color
      }
    };
  }

  renderControls = () => {
    return (
      <div className="chart-controls">
        {Object.keys(this.state.data).map((key, index) => {
          return (
            <div className="control-box" key={index}>
              <input
                type="radio"
                checked={key === this.state.activeKey}
                datakey={key}
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
    this.setState({
      ...this.state,
      activeKey: key
    });
  };

  updateChart = () => {
    // gather data

    const config = this.state.chartConfig;
    const dimensions = this.state.dimensions;
    const data = this.state.data[this.state.activeKey];
    //compute chart values
    const maxValue = Math.max(
      config.maxValue,
      Math.max(...Object.keys(data).map(key => data[key]))
    );
    const allAxis = Object.keys(data),
      total = allAxis.length,
      radius = Math.min(dimensions.width / 2, dimensions.height / 2) - 75,
      angleSlice = (Math.PI * 2) / total;

    const rScale = d3
      .scaleLinear()
      .range([0, radius])
      .domain([0, maxValue]);

    //start creating chart
    this.resetSvg();
    let svg = d3.select(this.ref.current).attr("class", "radar");

    let g = svg
      .append("g")
      .attr(
        "transform",
        "translate(" +
          (this.state.dimensions.width / 2 + this.state.dimensions.margin) +
          "," +
          (this.state.dimensions.height / 2 + this.state.dimensions.margin) +
          ")"
      );

    //Filter for the outside glow
    let filter = g
        .append("defs")
        .append("filter")
        .attr("id", "glow"),
      feGaussianBlur = filter
        .append("feGaussianBlur")
        .attr("stdDeviation", "2.5")
        .attr("result", "coloredBlur"),
      feMerge = filter.append("feMerge"),
      feMergeNode_1 = feMerge.append("feMergeNode").attr("in", "coloredBlur"),
      feMergeNode_2 = feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    //Wrapper for the grid & axes
    let axisGrid = g.append("g").attr("class", "axisWrapper");

    //draw background circles
    axisGrid
      .selectAll(".levels")
      .data(d3.range(1, config.levels + 1).reverse())
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", function(d, i) {
        return (radius / config.levels) * d;
      })
      .style("fill", "#CDCDCD")
      .style("stroke", "#CDCDCD")
      .style("fill-opacity", config.opacityCircles)
      .style("filter", "url(#glow)");
    //Text indicating at what % each level is
    axisGrid
      .selectAll(".axisLabel")
      .data(d3.range(1, config.levels + 1).reverse())
      .enter()
      .append("text")
      .attr("class", "axisLabel")
      .attr("x", 4)
      .attr("y", function(d) {
        return (-d * radius) / config.levels;
      })
      .attr("dy", "0.4em")
      .style("font-size", "10px")
      .attr("fill", "#737373")
      .text(function(d, i) {
        return d;
      });

    //Create the straight lines radiating outward from the center
    var axis = axisGrid
      .selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");
    //add the lines
    axis
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", function(d, i) {
        return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2);
      })
      .attr("y2", function(d, i) {
        return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2);
      })
      .attr("class", "line")
      .style("stroke", "white")
      .style("stroke-width", "2px");

    //add lables
    axis
      .append("text")
      .attr("class", "legend")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", function(d, i) {
        return (
          rScale(maxValue * config.labelFactor) *
          Math.cos(angleSlice * i - Math.PI / 2)
        );
      })
      .attr("y", function(d, i) {
        return (
          rScale(maxValue * config.labelFactor) *
          Math.sin(angleSlice * i - Math.PI / 2)
        );
      })
      .text(function(d) {
        return d;
      })
      .call(this.wrap, config.wrapWidth);

    //The radial line function
    let radarLine = d3
      .lineRadial()
      .angle(function(d, i) {
        return i * angleSlice;
      })
      .radius(function(d) {
        return rScale(d);
      });

    if (config.roundStrokes) {
      radarLine.interpolate("cardinal-closed");
    }

    const flatData = Object.keys(data).map(key => data[key]);
    //Create a wrapper for the blobs
    var blobWrapper = g
      .selectAll(".radarWrapper")
      .data(flatData)
      .enter()
      .append("g")
      .attr("class", "radarWrapper")
  

    //Append the backgrounds
    blobWrapper
      .append("path")
      .attr("class", "radarArea")
      .style("fill", function(d, i) {
        return config.color(i);
      })
      .style("fill-opacity", config.opacityArea)
      .on("mouseover", function(d, i) {
        //Dim all blobs
        d3.selectAll(".radarArea")
          .transition()
          .duration(200)
          .style("fill-opacity", 0.1);
        //Bring back the hovered over blob
        d3.select(this)
          .transition()
          .duration(200)
          .style("fill-opacity", 0.7);
      })
      .on("mouseout", function() {
        //Bring back all blobs
        d3.selectAll(".radarArea")
          .transition()
          .duration(200)
          .style("fill-opacity", config.opacityArea);
      });

    // //Create the outlines
    blobWrapper
      .append("path")
      .datum(flatData)
      .attr("class", "radarStroke")
      .attr("d", radarLine)
      .style("stroke-width", config.strokeWidth + "px")
      .style("stroke", (d, i) => {
        return config.color(i);
      })
      .style("fill", "none")
      .style("filter", "url(#glow)");

    //Append the circles
    blobWrapper
      .selectAll(".radarCircle")
      .data((d, i) => {
        return d;
      })
      .enter()
      .append("circle")
      .attr("class", "radarCircle")
      .attr("r", config.dotRadius)
      .attr("cx", function(d, i) {
        return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
      })
      .attr("cy", function(d, i) {
        return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
      })
      .style("fill", function(d, i, j) {
        return config.color(j);
      })
      .style("fill-opacity", 0.8);

    /////////////////////////////////////////////////////////
    //////// Append invisible circles for tooltip ///////////
    /////////////////////////////////////////////////////////

    //Wrapper for the invisible circles on top
    var blobCircleWrapper = g
      .selectAll(".radarCircleWrapper")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "radarCircleWrapper");

    //Append a set of invisible circles on top for the mouseover pop-up
    blobCircleWrapper
      .selectAll(".radarInvisibleCircle")
      .data(function(d, i) {
        return d;
      })
      .enter()
      .append("circle")
      .attr("class", "radarInvisibleCircle")
      .attr("r", config.dotRadius * 1.5)
      .attr("cx", function(d, i) {
        return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
      })
      .attr("cy", function(d, i) {
        return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
      })
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function(d, i) {
        const newX = parseFloat(d3.select(this).attr("cx")) - 10;
        const newY = parseFloat(d3.select(this).attr("cy")) - 10;

        tooltip
          .attr("x", newX)
          .attr("y", newY)
          .text(d.value)
          .transition()
          .duration(200)
          .style("opacity", 1);
      })
      .on("mouseout", function() {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0);
      });

    //Set up the small tooltip for when you hover over a circle
    var tooltip = g
      .append("text")
      .attr("class", "tooltip")
      .style("opacity", 0);
  };

  wrap = (text, width) => {
    text.each(function() {
      var text = d3.select(this),
        words = text
          .text()
          .split(/\s+/)
          .reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.4, // ems
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text
          .text(null)
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", dy + "em");

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }
    });
  }; //wrap
}

export default RadarChart;
