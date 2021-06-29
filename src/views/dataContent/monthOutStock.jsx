import React, { useState, useEffect } from 'react';
import { Area } from '@ant-design/charts';

const Charts = () => {
    const [data, setData] = useState([{timePeriod:"1",value:"20"},{timePeriod:"2",value:"5"},{timePeriod:"3",value:"15"},{timePeriod:"4",value:"0"},{timePeriod:"5",value:"20"},{timePeriod:"6",value:"3"},{timePeriod:"1",value:"20"},{timePeriod:"1",value:"20"},{timePeriod:"1",value:"20"},{timePeriod:"1",value:"20"}]);
    var config = {
        data: data,
        xField: 'timePeriod',
        yField: 'value',
        xAxis: {},
    };
    return <Area {...config} />;
};

export default Charts;