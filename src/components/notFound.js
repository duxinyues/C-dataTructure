/*
 * @Author: duxinyue
 * @Date: 2021-04-27 15:13:38
 * @LastEditors: duxinyue
 * @LastEditTime: 2021-04-28 10:18:10
 * @FilePath: \app1\src\components\notFound.js
 */

import React from 'react';
import "../style/css/style.css"
class NotFound extends React.Component {
    state = {
        animated: '',
    };
    enter = () => {
        this.setState({ animated: 'hinge' });
    };
    render() {
        return (
            <div className="notFound"></div>
        );
    }
}

export default NotFound;