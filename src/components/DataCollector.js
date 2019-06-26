import React from "react";
import FacebookLogin from "react-facebook-login";
import {
  FbProcessor,
  InstaProcessor,
  WhatsAppProcessor,
  CSVProcessor,
  JSONProcessor
} from "../data/processors/DataProcessors";
import { watchFile } from "fs";

const modes = {
  select: "select",
  auth: "auth",
  load: "load",
  export: "export"
};
const platforms = {
  whatsapp: WhatsAppProcessor,
  csv: CSVProcessor,
  json: JSONProcessor
};

class DataCollector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: modes.select,
      platform: null,
      data: [],
      dataProcessor: null,
      callback: props.callback
    };
  }

  selectorHandler = event => {
    const key = event.target.attributes.dataplatform.value;
    const dataProcessor = new platforms[key]();
    let mode = "";
    if (key === "csv" || key === "json") {
      mode = modes.load;
    } else {
      mode = modes.reduce;
    }
    this.setState({
      ...this.state,
      dataProcessor: dataProcessor,
      mode: mode
    });
  };

  authHandler = event => {};

  loadHandler = event => {
    event.preventDefault();
    const file = event.target.file.files[0];
    event.target.file.value = "";
    let reader = new FileReader();
    reader.onload = event => {
      let data = this.state.data;
      data.push(this.state.dataProcessor.formatData(event.target.result));
      this.setState({
        ...this.state,
        data: data
      });
    };
    reader.readAsText(file);
  };

  removeHandler = event => {
    const index = event.target.attributes.dataindex.value;
    let data = [
      ...this.state.data.slice(0, index),
      ...this.state.data.slice(index + 1)
    ];
    this.setState({ ...this.state, data: data });
  };

  exportHandler = event => {
    this.state.callback(this.state.data);
  };

  render() {
    switch (this.state.mode) {
      case modes.select:
        return (
          <div className="data-collector">
            <h1>Select your data Source</h1>
            <div className="buttons-box">
              {Object.keys(platforms).map((key, i) => {
                return (
                  <button
                    key={i}
                    onClick={this.selectorHandler}
                    dataplatform={key}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          </div>
        );
      case modes.auth:
        return (
          <div className="data-collector">
            <form ref="authform" onSubmit={this.authHandler}>
              <input type="email" ref="email" placeholder="Email" />
              <input type="passowrd" ref="password" placeholder="Password" />
              <button type="submit">Authorize</button>
            </form>
          </div>
        );
      case modes.load:
        return (
          <div className="data-collector">
            <h1>Add as many chat sesssions as you want</h1>
            <form ref="inputform" onSubmit={this.loadHandler}>
              <input type="file" name="file" />
              <button type="submit">Submit</button>
            </form>
            <ul>
              {this.state.data.map((chat, index) => {
                return (
                  <li key={index}>
                    {index}: {chat.title} {chat.getTotalMessages()} messages
                    loaded.{" "}
                    <button onClick={this.removeHandler} dataindex={index}>
                      Remove!
                    </button>
                  </li>
                );
              })}
            </ul>
            <button onClick={this.exportHandler}>Analyze!</button>
          </div>
        );
      case modes.export:
        return "export";
      default:
        return "Something went wrong";
    }
  }
}

export default DataCollector;
