import React from "react";
import FacebookLogin from "react-facebook-login";
import {
  FbProcessor,
  InstaProcessor,
  WhatsAppProcessor,
  TwitterProcessor,
  SMSProcessor
} from "../data/processors/DataProcessors";
import { capitalize } from "../data/structs/Utils";

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
  instagram: InstaProcessor,
  sms: SMSProcessor
};

const formatsByPlatform = {
  facebook: ["auth", "json", "html"],
  instagram: ["auth", "json"],
  whatsapp: ["auth", "json", "csv"],
  twitter: ["auth", "json"],
  sms: ["csv", "json"]
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
    const format = event.target.attributes.dataformat.value;
    if (format === "auth") {
      this.setState({
        ...this.state,
        format: format,
        mode: modes.auth
      });
    } else {
      this.setState({
        ...this.state,
        format: format,
        mode: modes.load
      });
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
      let formatedData = null;
      switch (this.state.format) {
        case "csv":
          formatedData = this.state.dataProcessor.formatCSVData(
            event.target.result
          );
          break;
        case "json":
          formatedData = this.state.dataProcessor.formatJsonData(
            event.target.result
          );
          break;
        case "html":
          formatedData = this.state.dataProcessor.formatHTMLData(
            event.target.result
          );
          break;
        case "auth":
        default:
          formatedData = null;
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
              {formatsByPlatform[this.state.platform].map((format, index) => {
                return (
                  <button
                    onClick={this.formatSelectorHandler}
                    dataformat={format}
                    key={index}
                  >
                    {"Load " + capitalize(format)}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case modes.auth:
        return (
          <div className="data-collector">
            <h1>
              Enter your {capitalize(this.state.platform)} email and password
            </h1>
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
