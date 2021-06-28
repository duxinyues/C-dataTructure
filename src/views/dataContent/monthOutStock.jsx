import React, { useState, useEffect } from 'react';
import { Area } from '@ant-design/charts';

const Charts = () => {
    const [data, setData] = useState([{timePeriod:"1",value:"20"}]);
    var config = {
        data: data,
        xField: 'timePeriod',
        yField: 'value',
        xAxis: {
            range: [0, 1],
        },
    };
    return <Area {...config} />;
};

export default Charts;