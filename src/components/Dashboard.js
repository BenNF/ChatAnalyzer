import React from "react";
import BaseChart from "./Charts/BaseChart";
import PieChart from "./Charts/PieChart";
import LineChart from "./Charts/LineChart";
import DataCollector from "./DataCollector"
class Dashboard extends React.Component {
  // const messageCountBySender = (data) => {
  //     let results = {}
  //     data.messages.forEach(element => {
  //         if(results[element.sender_name]){
  //           results[element.sender_name] += 1
  //         }
  //         else{
  //           results[element.sender_name] = 1
  //         }
  //     });
  //     return results
  // }

  // const messagesByTimeOfDay = (data) => {
  //     const getHour = (timestamp) => {
  //         const d = new Date(timestamp)
  //         return(d.getHours())
  //     }
  //     const getBlankTimeObject = () =>{
  //         let obj = {}
  //         const temp = [...Array(24).keys()].map((key,i) => {
  //             obj[key] = 0
  //         })
  //         return obj
  //     }

  //     let results = {}
  //     data.messages.forEach(element => {
  //         if (!results[element.sender_name]){
  //           results[element.sender_name] = getBlankTimeObject()
  //         }
  //         results[element.sender_name][getHour(element.timestamp_ms)] += 1
  //     })
  //     return results
  // }
  render() {
    return (
      <div className="dashboard-container">
      <h1>Its a dashboard</h1>
        <DataCollector />
      </div>
    );
  }
}

export default Dashboard;
