import React from "react";
import BaseChart from "./Charts/BaseChart";
import PieChart from "./Charts/PieChart";
import LineChart from "./Charts/LineChart";
import RadarChart from "./Charts/RadarChart"

const ChartBox = props => {
  const PieChartData = () => {
    let pieData = {};
    const data = props.data;
    data.members.map((mem, i) => {
      pieData[mem] = data.getTotalMessages(data.getMessagesBySender(mem));
    });
    return pieData;
  };

  const RadarTimeData = () => {

    const fullData = props.data
    const keys = [...Array(48).keys()].map((val, i) => {
      return Math.round(i / 2) + ":" + (i % 2 == 1 ? "00" : "30");
    });
    

    //populate hash of messages by time by sender
    let radarData = {}

    fullData.members.forEach((mem,index)=> {
        radarData[mem] = {}
        keys.forEach(key=> {
            radarData[mem][key] = 0
        })
        let msgs = fullData.getMessagesBySender(mem)
        msgs.forEach(msg => {
            radarData[mem][keys[msg.getHourIndex()]] += 1
        })
    })

    //create combined bucket and populate date
    radarData['Combined']={}
    keys.forEach(key=> {
        radarData['Combined'][key] = 0
    })
    fullData.messages.forEach(msg => [
        radarData['Combined'][keys[msg.getHourIndex()]] += 1
    ])
    return radarData
  };

  return (
    <div className="charts">
      <PieChart
        data={PieChartData()}
        title="Messages by Sender"
        height={600}
        width={600}
        margin={50}
      />
      <RadarChart
        data={RadarTimeData()}
        width={600}
        height={600}
        margin={40}
        title="Messages By Time of Day"
      />
    </div>
  );
};

export default ChartBox;
