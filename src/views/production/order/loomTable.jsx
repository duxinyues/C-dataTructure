/*
 * @Author: 1638877065@qq.com
 * @Date: 2021-06-24 09:12:13
 * @LastEditTime: 2021-06-28 09:59:58
 * @LastEditors: 1638877065@qq.com
 * @Description: 添加机台信息
 * @FilePath: \cloud-admin\src\views\production\order\loomTable.jsx
 */
import React, { useState } from 'react';
import { Table, Popconfirm, Form, Typography, Space, Select } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { createOrderParams } from "../../../actons/action";
import { connect } from "react-redux";
const { Option } = Select;
const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    props,
    ...restProps
}) => {
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: "请选择机台",
                        },
                    ]}
                >
                    <Select>
                        {
                            record.loom.map((item) => (<Option value={item.code}>{item.code}</Option>))
                        }
                    </Select>
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
const Editloom = (props) => {
    const _createOrderParam = props.createOrderParam
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;
    const addData = () => {
        const _data = [...data]
        _data.push({
            key: new Date().getTime(),
            loomCode: "",
            volQty: 0,
            loom: props.data
        });
        setData(_data);
        _createOrderParam.orderLooms = _data;
        props.createOrderParams(_createOrderParam);
        props.onAddLoom(_data);
    }
    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            props.data.map((item) => {
                if (item.code == row.loomCode) row.loomId = item.id
            })
            row.volQty = 0;
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                _createOrderParam.orderLooms = newData;
                props.createOrderParams(newData);
                props.onAddLoom(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                _createOrderParam.orderLooms = newData;
                props.createOrderParams(newData);
                props.onAddLoom(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const handleDelete = (key) => {
        const _data = [...data];
        const newData = _data.filter((item) => item.key !== key)
        setData(newData)
    }
    const columns = [
        {
            title: '机号',
            dataIndex: 'loomCode',
            editable: true,
            width: "80px"
        },
        {
            title: '卷数',
            dataIndex: 'volQty',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: "100px",
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <React.Fragment>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{ marginRight: 8 }}
                        >
                            保存
                        </Typography.Link>
                        <Popconfirm title="要取消保存吗?" onConfirm={cancel}>
                            <Typography.Link>取消</Typography.Link>
                        </Popconfirm>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            编辑
                        </Typography.Link>
                        <Popconfirm title="确定删除？" onConfirm={() => { handleDelete(record.key) }}>
                            <span style={{ marginLeft: "10px" }} >删除</span>
                        </Popconfirm>
                    </React.Fragment>
                );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return <React.Fragment>
        <Space>
            <span>布票信息</span>
            {/* <PlusCircleOutlined style={{ color: "blue", marginLeft: "10px" }} onClick={addData} /> */}
        </Space>
        <div style={{ display: "flex", width: "100%" }}>
            {/* <div style={{ minWidth: "315px" }}>
                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                        dataSource={data}
                        columns={mergedColumns}
                        rowClassName="editable-row"
                        pagination={false}
                    />
                </Form>
            </div> */}
            <div style={{ width: "100%" }}>
                <Table
                    dataSource={[]}
                    columns={[
                        { title: "条码", width: "10%" },
                        { title: "匹号", width: "5%" },
                        { title: "入库重量", width: "10%" },
                        { title: "入库时间", width: "20%" },
                        { title: "出库时间", width: "20%" },
                        { title: "查布记录", width: "10%" },
                        { title: "查布员", width: "15%" },
                        { title: "值机工", width: "15%" }
                    ]}
                    rowClassName="editable-row"
                    pagination={false}
                />
            </div>
        </div>
    </React.Fragment>
};
const mapStateToProps = (state) => {
    return {
        createOrderParam: state.createOrderParam
    }
}
export default connect(mapStateToProps, { createOrderParams })(Editloom)