/*
 * @Author: duxinyue
 * @Date: 2021-04-27 15:13:38
 * @LastEditors: yongyuan at <yongyuan253015@gmail.com>
 * @LastEditTime: 2021-07-17 21:52:01
 * @FilePath: \works_space\src\components\notFound.js
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
            <div className="notFound">657768gfb</div>
        );
    }
}

export default NotFound;