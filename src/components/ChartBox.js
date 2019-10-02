import React from "react";
// import BaseChart from "./Charts/BaseChart";
// import PieChart from "./Charts/PieChart";
// import LineChart from "./Charts/LineChart";
import { ResponsivePie } from '@nivo/pie'
import RadarChart from "./Charts/RadarChart"

const ChartBox = props => {
  const PieChartData = () => {
    let pieData = [];
    const data = props.data;
    data.members.map((mem, i) => {
      pieData.push({"id": mem, "label": mem, "value": data.getTotalMessages(data.getMessagesBySender(mem)) })
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
      <ResponsivePie
        data = {PieChartData()}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ scheme: 'nivo' }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
        radialLabelsSkipAngle={10}
        radialLabelsTextXOffset={6}
        radialLabelsTextColor="#333333"
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={16}
        radialLabelsLinkHorizontalLength={24}
        radialLabelsLinkStrokeWidth={1}
        radialLabelsLinkColor={{ from: 'color' }}
        slicesLabelsSkipAngle={10}
        slicesLabelsTextColor="#333333"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      ></ResponsivePie>

      {/* <PieChart
        data={PieChartData()}
        title="Messages by Sender"
        height={600}
        width={600}
        margin={50}
      /> */}
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
