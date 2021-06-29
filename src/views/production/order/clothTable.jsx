import React, { useState, useEffect } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Space, message, } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { createOrderParams } from "../../../actons/action";
import { connect } from "react-redux";
const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
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
                            message: "请输入正确的内容",
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
const EditCloth = (props) => {
    console.log(props)
    const _createOrderParam = props.createOrderParam
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    useEffect(() => {
        if (props.data) {
            props.data.map((item) => {
                item.key = item.id
            })
            setData([...props.data])
        }
    }, [])
    const isEditing = (record) => record.key === editingKey;
    const addData = () => {
        const _data = [...data]
        _data.push({
            key: new Date().getTime(),
            yarnName: "",
            yarnBrandBatch: 0,
            rate: 0,
            knitWastage: 0,
            planWeight: 0
        });
        setData(_data);
        _createOrderParam.orderYarnInfos = _data;
        props.createOrderParams(_createOrderParam);
        props.onAddCloth(_data)
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
            row.planWeight = (props.weight * row.rate * (1 + row.knitWastage / 100) / 100).toFixed(2);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                const totalRate = newData.reduce((pre, cur) => {
                    return pre + cur.rate
                }, 0);
                if (totalRate > 100) {
                    message.warning("纱比总和需要等于100");
                    return;
                }
                setData(newData);
                _createOrderParam.orderYarnInfos = newData;
                props.createOrderParams(newData);
                props.onAddCloth(newData)
                setEditingKey('');
            } else {
                if (row.rate > 100) {
                    message.warning("纱比总和需要等于100");
                    return;
                }
                newData.push(row);
                setData(newData);
                _createOrderParam.orderYarnInfos = newData;
                props.createOrderParams(newData);
                props.onAddCloth(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const handleDelete = (key) => {
        const _data = [...data];
        const newData = _data.filter((item) => item.key !== key)
        setData(newData);
        _createOrderParam.orderYarnInfos = newData;
        props.createOrderParams(_createOrderParam);
        props.onAddCloth(_data)
    }
    const columns = [
        {
            title: '纱支',
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
        },
        {
            title: '损耗',
            dataIndex: 'knitWastage',
            editable: true,
        },
        {
            title: '计划用量',
            dataIndex: 'planWeight',
            editable: false,
        },
        {
            title: '操作',
            dataIndex: 'operation',
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
                inputType: (col.dataIndex === 'rate' || col.dataIndex === 'knitWastage') ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <Form form={form} component={false}>
            <Space style={{ marginBottom: "9px", display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: "16px", color: "#1890FF" }}>用料要求</span>
                <PlusCircleOutlined style={{ color: "#1890FF", marginLeft: "10px" }} onClick={addData} />
            </Space>
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
    );
};
const mapStateToProps = (state) => {
    return {
        createOrderParam: state.createOrderParam
    }
}
export default connect(mapStateToProps, { createOrderParams })(EditCloth)