/*
 * @FileName: 
 * @Author: duxinyue
 * @Date: 2021-04-27 09:31:03
 * @LastEditors: duxinyue
 * @LastEditTime: 2021-05-19 12:57:30
 * @FilePath: \app1\src\index.js
 * @Description: 
 */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import  store from "./store";
import {Provider}  from "react-redux"
import Page from './Page';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <Provider store={store}>
      <Page />
    </Provider>
,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
