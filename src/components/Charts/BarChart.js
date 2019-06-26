import React from 'react';


class BarChart extends BaseChart {
    constructor(props){
        super(props)
        this.state = {
            ...this.state,
            chartConfig: {
                type: "bar"
            }
        }
    }

    renderChartControls() {
        
    }
    updateChart() {

    }
}