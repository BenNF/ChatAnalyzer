import React from "react";
import BaseChart from "./Charts/BaseChart";
import PieChart from "./Charts/PieChart";
import LineChart from "./Charts/LineChart";

const chartBox = props => {
  const PieChartData = () => {
    let pieData = {};
    const data = props.data;
    data.members.map((mem, i) => {
      pieData[mem] = data.getTotalMessages(data.getMessagesBySender(mem));
    });
    return pieData;
  };

  return (
    <div className="charts">
      <PieChart
        data={PieChartData()}
        title="Messages by Sender"
        height={500}
        width={500}
        margin={50}
      />
    </div>
  );
};

export default chartBox;
