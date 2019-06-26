import React from "react";
import BaseChart from "./Charts/BaseChart";
import PieChart from "./Charts/PieChart";
import LineChart from "./Charts/LineChart"

const Dashboard = props => {

  const messageCountBySender = (data) => {
      let results = {}
      data.messages.forEach(element => {
          if(results[element.sender_name]){
            results[element.sender_name] += 1
          }
          else{
            results[element.sender_name] = 1
          }
      });
      return results
  }
  
  const messagesByTimeOfDay = (data) => {
      const getHour = (timestamp) => {
          const d = new Date(timestamp)
          return(d.getHours())
      }
      const getBlankTimeObject = () =>{
          let obj = {}
          const temp = [...Array(24).keys()].map((key,i) => {
              obj[key] = 0
          })
          return obj
      }

      let results = {}
      data.messages.forEach(element => {
          if (!results[element.sender_name]){
            results[element.sender_name] = getBlankTimeObject()
          }
          results[element.sender_name][getHour(element.timestamp_ms)] += 1            
      }) 
      return results
  }

  return (
    <div className="dashboard-container">
      <BaseChart />
      <PieChart title="Messages sent by Person" data={messageCountBySender(props.data)} width={500} height={500} margin={50}/>
      <LineChart title="Messages by Hour" data={messagesByTimeOfDay(props.data)} width={500} height={500} margin={50}/>
    </div>
  );
};

export default Dashboard;
