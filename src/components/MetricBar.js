import React from "react";

const MetricBar = props => {
  return (
    <div className="metrics-bar">
      <h1>{props.data.title}: </h1>
      <div className="metrics-container">
        <div className="metrics-totals">
          <div className="metric">
            <span className="label">Total Messages: </span>
            <span className="value">{props.data.total.messages}</span>
          </div>
          <div className="metric">
            <span className="label">Total Days: </span>
            <span className="value">{props.data.total.days}</span>
          </div>
          <div className="metric">
            <span className="label">Total Words: </span>
            <span className="value">{props.data.total.words}</span>
          </div>
          <div className="metric">
            <span className="label">Total Characters: </span>
            <span className="value">{props.data.total.chars}</span>
          </div>
        </div>
        <div className="most-common">
          <h2 className="title"> Most Common Words</h2>
          <div className='most-common-metric'>
          {Object.keys(props.data.common.words).map(key => {
            return (
              <div className="metric">
              <span className="label">{key}: </span>
              <span className="value">{props.data.common.words[key]} times</span>
              </div>)
          })}
          </div>
          <div className='most-common-metric'>
          </div>
        </div>
        <div className="averages">
          <div className="metric">
            <span className="label">Average Messages per Day: </span>
            <span className="value">{props.data.average.messages}</span>
          </div>
          <div className="metric">
            <span className="label">Average Word Length: </span>
            <span className="value">{props.data.average.words}</span>
          </div>
          <div className="metric">
            <span className="label">Average Characters Length: </span>
            <span className="value">{props.data.average.chars}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricBar;
