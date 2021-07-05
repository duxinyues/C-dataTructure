/*
 * @FileName: 
 * @Author: 1638877065@qq.com
 * @Date: 2021-06-29 23:50:37
 * @LastEditors: 1638877065@qq.com
 * @LastEditTime: 2021-07-05 19:14:24
 * @FilePath: \cloud-admin\src\views\production\order\addCloth.jsx
 * @Description: 编辑表格
 */
import React, { useState } from 'react';
import { Table, Input,AutoComplete  } from 'antd';

const EditableTable = () => {
  const [data, setData] = useState([{ title1: "", title2: "", key: 0 }]);
  const [records, setRecords] = useState({})
  const changeInput = (name, value, inputName) => {
    console.log(name, value)
    const _data = data;
    const str = { title1: "", title2: "", key: new Date().getTime() }
    str[name] = value
    console.log(str)
    if (records.key === 0 && inputName === "title1") {
      _data.unshift(str);
      console.log("_data", _data)
      setData([..._data])
    }
    console.log(_data)
  }

  const columns = [
    {
      title: "标题1",
      dataIndex: "title1",
      render: (index, record) => (<Input defaultValue={record.title1} name="title1" onPressEnter={({ target: { value, name } }) => {
        console.log("6789-", record)
        changeInput("title1", value, name)
      }} allowClear />)
    }, {
      title: "标题2",
      dataIndex: "title2",
      render: (index, record) => (<Input defaultValue={record.title2} onPressEnter={({ target: { value } }) => {
        changeInput("title2", value)
      }} allowClear />)
    }
  ]
  return <React.Fragment>
    <div style={{ width: "500px" }}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record, index) => record.key}
        pagination={false}
        onRow={record => {
          return {
            onClick: event => {
              setRecords(record)
            }, // 点击行
          };
        }}
      />
    </div>

  </React.Fragment>
};
export default EditableTable