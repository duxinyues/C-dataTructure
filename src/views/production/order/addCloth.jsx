/*
 * @FileName: 
 * @Author: 1638877065@qq.com
 * @Date: 2021-06-29 23:50:37
 * @LastEditors: 1638877065@qq.com
 * @LastEditTime: 2021-07-06 17:38:10
 * @FilePath: \cloud-admin\src\views\production\order\addCloth.jsx
 * @Description: 编辑表格
 */
import React, { useState, useEffect } from 'react';
import { Table, Input, Form, Space, message } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { createOrderParams } from "../../../actons/action";
import { connect } from "react-redux"
const originData = [];
document.title = "编辑表格"
const EditableTable = (props) => {
  console.log("props===", props)
  const _createOrderParam = props.createOrderParam
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const formss = form.validateFields()
  useEffect(() => {
    if (props.data) {
      const _data = data
      setData([...props.data, ..._data]);
      props.data.map((item) => {
        formss["knitWastage" + item.id] = item.knitWastage;
        formss["planWeight" + item.id] = item.planWeight;
        formss["rate" + item.id] = item.rate;
        formss["yarnName" + item.id] = item.yarnName;
        formss["yarnBrandBatch" + item.id] = item.yarnBrandBatch;
      });
      form.setFieldsValue({ ...formss })
    }
    return () => { }
  }, [])

  const columns = [
    {
      title: () => (<span><em>*</em>纱支</span>),
      dataIndex: 'yarnName',
      editable: true,
    },
    {
      title: '批次',
      dataIndex: 'yarnBrandBatch',
      editable: true,
    },
    {
      title: '比例',
      dataIndex: 'rate',
      editable: true,
    }, {
      title: '损耗',
      dataIndex: 'knitWastage',
      editable: true,
    }, {
      title: '计划用量',
      dataIndex: 'planWeight',
      width: "15%",
    }, {
      title: '',
      dataIndex: 'planWeight',
      render: (params, index) => (<span onClick={() => { deletedYarnInfo(index) }} className="custom-btn">删除</span>)
    }
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: (col.dataIndex === 'rate' || col.dataIndex === 'knitWastage') ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: true,
      }),
    };
  });
  const addData = () => {
    const _data = [...data]
    _data.push({
      id: new Date().getTime(),
      yarnName: "",
      yarnBrandBatch: "",
      rate: "",
      knitWastage: "",
      planWeight: ""
    });
    setData([..._data]);
    _createOrderParam.orderYarnInfos = _data;
    props.createOrderParams(_createOrderParam);
    props.onAddCloth(_data)
  }
  const deletedYarnInfo = (params) => {
    const _data = [...data];
    const newData = _data.filter((item) => item.id !== params.id)
    setData([...newData]);
    _createOrderParam.orderYarnInfos = newData;
    props.createOrderParams(_createOrderParam);
    props.onAddCloth(_data)
  }
  return (<>
    <Form form={form} component={false}>
      <Space style={{ marginBottom: "9px", display: "flex", alignItems: "center" }}>
        <span style={{ fontSize: "16px", color: "#1890FF" }}>用料要求</span>
        <PlusCircleOutlined style={{ color: "#1890FF", marginLeft: "10px" }} onClick={addData} />
      </Space>
      <Table
        bordered={false}
        pagination={false}
        components={{
          body: {
            cell: ({
              editing,
              dataIndex,
              title,
              inputType,
              record,
              index,
              children,
              ...restProps
            }) => {
              const _data = data;
              const changeRow = ({ target: { value, id } }) => {
                var totalRate = 0;
                _data.map((item) => {
                  console.log("item.rate==", item.rate)
                  totalRate += Number(item.rate)
                  if (item.id === record.id) {
                    if (id.includes("yarnName")) {
                      item.yarnName = value
                    }
                    if (id.includes("yarnBrandBatch")) {
                      item.yarnBrandBatch = value
                    }
                    if (id.includes("rate")) {
                      item.rate = value;
                      console.log("totalRate + value==", totalRate + Number(value))
                      console.log("totalRate ==", totalRate)
                      if (totalRate + Number(value) > 100 || value > 100) {
                        message.warning("纱比总和需要等于100%");
                      }
                      item.planWeight = (props.weight * value * (1 + Number(item.knitWastage) / 100) / 100).toFixed(2);
                      console.log("planWeight==", item.planWeight)
                      formss["planWeight" + record.id] = item.planWeight;
                      form.setFieldsValue({ ...formss })
                      setData([..._data])
                    }
                    if (id.includes("knitWastage")) {
                      item.knitWastage = value;
                      item.planWeight = (props.weight * Number(item.rate) * (1 + value / 100) / 100).toFixed(2);
                      formss["planWeight" + record.id] = item.planWeight;
                      form.setFieldsValue({ ...formss })
                    }
                    if (id.includes("planWeight")) {
                      item.planWeight = value
                    }
                  }
                });
                console.log("元数据==", _data);
                console.log("总纱比totalRate==", totalRate)
                if (totalRate > 100) {
                  return;
                }
                _createOrderParam.orderYarnInfos = _data;
                // props.createOrderParams(_createOrderParam);
                props.onAddCloth(_data)
              }
              return (
                <td {...restProps}>
                  {editing ? (
                    <Form.Item
                      name={dataIndex + record.id}
                      style={{
                        margin: 0,
                      }}
                    >
                      {
                        (dataIndex.includes("yarnName") || dataIndex.includes("yarnBrandBatch")) ? <Input onPressEnter={changeRow} /> : <Input onPressEnter={changeRow} />
                      }
                    </Form.Item>
                  ) : (
                    children
                  )}
                </td>
              );
            }
          },
        }}
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
      />
    </Form>
  </>
  );
};

const mapStateToProps = (state) => {
  return {
    createOrderParam: state.createOrderParam
  }
}
export default connect(mapStateToProps, { createOrderParams })(EditableTable)