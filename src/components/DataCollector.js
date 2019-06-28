import React from "react";
import FacebookLogin from "react-facebook-login";
import {
  FbProcessor,
  InstaProcessor,
  WhatsAppProcessor,
  TwitterProcessor
} from "../data/processors/DataProcessors";
import { watchFile } from "fs";

const modes = {
  platoformSelect: "platoformSelect",
  formatSelect: "formatSelect",
  auth: "auth",
  load: "load",
  export: "export"
};
const platforms = {
  whatsapp: WhatsAppProcessor,
  facebook: FbProcessor,
  twitter: TwitterProcessor,
  instagram: InstaProcessor
};

class DataCollector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: modes.platoformSelect,
      format: null,
      platform: null,
      data: [],
      dataProcessor: null,
      callback: props.callback
    };
  }

  platformSelectorHandler = event => {
    const key = event.target.attributes.dataplatform.value;
    const dataProcessor = new platforms[key]();

    this.setState({
      ...this.state,
      dataProcessor: dataProcessor,
      mode: modes.formatSelect,
      platform: key
    });
  };

  formatSelectorHandler = event => {
    const format = event.target.attributes.dataformat.value
    if (format === "auth"){
      this.setState({
        ...this.state,
        format: format,
        mode: modes.auth
      })
    }
    else{
      this.setState({
        ...this.state,
        format: format,
        mode: modes.load
      })
    }
  };
  authHandler = event => {};

  loadHandler = event => {
    event.preventDefault();
    const file = event.target.file.files[0];
    event.target.file.value = "";
    let reader = new FileReader();
    reader.onload = event => {
      let data = this.state.data;
      let formatedData = null
      if(this.state.format === "csv"){
        formatedData = this.state.dataProcessor.formatCSVData(event.target.result)
      }
      else if(this.state.format === "json"){
        formatedData = this.state.dataProcessor.formatJsonData(event.target.result)
      }

      data.push(formatedData);
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
      case modes.platoformSelect:
        return (
          <div className="data-collector">
            <h1>Select your data Source</h1>
            <div className="buttons-box">
              {Object.keys(platforms).map((key, i) => {
                return (
                  <button
                    key={i}
                    onClick={this.platformSelectorHandler}
                    dataplatform={key}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          </div>
        );
      case modes.formatSelect:
        return (
          <div className="data-collector">
            <h1>Select Your Data Format</h1>
            <div className="buttons-box">
              <button dataformat="json" onClick={this.formatSelectorHandler}>
                Load JSON
              </button>
              <button dataformat="auth" onClick={this.formatSelectorHandler}>
                Load by Login
              </button>
              <button dataformat="csv" onClick={this.formatSelectorHandler}>
                Load CSV
              </button>
            </div>
          </div>
        );

      case modes.auth:
        return (
          <div className="data-collector">
            <h1>Enter your {this.state.platform.charAt(0).toUpperCase() +this.state.platform.slice(1)} email and password</h1>
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
