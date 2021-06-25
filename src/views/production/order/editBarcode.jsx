import React, { useState, useEffect } from 'react';
import { Table, Input, Popconfirm, Form, Typography, message, Select } from 'antd';
import { requestUrl } from "../../../utils/config";
import { day } from "../../../utils/config"
import { connect } from "react-redux";
const { Option } = Select;
const EditBarCode = (props) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [clothData, setclothData] = useState([]);
    const [checkClothData, setcheckClothData] = useState([]);
    const [runMachinePerson, setrunMachinePerson] = useState([]);
    useEffect(() => {
        getClothData();
        getPerson();
        if (props.data) {
            props.data.map((item) => {
                item.clothData = clothData;
                item.checkClothData = checkClothData;
                item.runMachinePerson = runMachinePerson;
            })
            setData([...props.data])
        }
    }, [props.data])
    const isEditing = (record) => record.id === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.id);
    };
    const cancel = () => {
        setEditingKey('');
    };
    //  查布记录
    const getClothData = () => {
        fetch(requestUrl + `/api-basedata/clothInspection/findAll?page=1&size=1000`, {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            },
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log(res)
                if (res.code == 200) {
                    setclothData(res.data.records);
                }
            })
    }
    const getPerson = () => {
        fetch(requestUrl + `/api-production/orderBarcode/personDownList`, {
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
            }
        })
            .then((res) => { return res.json() })
            .then((res) => {
                if (res.code == 200) {
                    const _checkClothData = [];
                    const _runMachinePerson = [];
                    res.data.map((item) => {
                        if (item.position === 1) { _checkClothData.push(item) }
                        if (item.position === 2) { _runMachinePerson.push(item) }
                    })
                    setcheckClothData(_checkClothData);
                    setrunMachinePerson(_runMachinePerson);
                }
            })
    }
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            console.log("row", row)
            console.log("newData", newData)
            setData(newData);
            props.editCode(newData)
            setEditingKey('');
        } catch (errInfo) {
            console.log('报错信息:', errInfo);
        }
    };
    const handleDelete = (key) => {
        const _data = [...data];
        const newData = _data.filter((item) => item.id !== key)
        setData(newData);
        props.editCode(newData);
    }
    const columns = [
        { title: "条码", dataIndex: "barcode" },
        { title: "匹号", dataIndex: "seq" },
        { title: "入库重量", dataIndex: "weight", editable: true },
        { title: "入库时间", dataIndex: "inStockTime", render: (time) => (<span>{day(time)}</span>) },
        { title: "出库时间", dataIndex: "outStockTime", render: (time) => (<span>{day(time)}</span>) },
        { title: "查布记录", dataIndex: "flawInfo", editable: true },
        { title: "查布员", dataIndex: "qcId", editable: true },
        { title: "值机工", dataIndex: "weaverId", editable: true },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <React.Fragment>
                        <Typography.Link
                            onClick={() => save(record.id)}
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
                        <Popconfirm title="确定删除？" onConfirm={() => { handleDelete(record.id) }}>
                            <span style={{ marginLeft: "10px" }} >删除</span>
                        </Popconfirm>
                    </React.Fragment>
                );
            },
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
                inputType: col.dataIndex,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <Form form={form} component={false}>
            <Table
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
                            const selectFlawInfo = (value) => {
                                _data.map((item) => {
                                    if (item.id == record.id) {
                                        item.flawInfo = value.join(",")
                                    }
                                });
                            }
                            const changeWeight = ({ target: { value } }) => {
                                _data.map((item) => {
                                    if (item.id == record.id) {
                                        item.weight = value
                                    }
                                });
                            }
                            const selectQc = (value) => {
                                _data.map((item) => {
                                    if (item.id == record.id) {
                                        item.qcId = value
                                    }
                                });
                            }
                            const selectWeaver = (value) => {
                                _data.map((item) => {
                                    if (item.id == record.id) {
                                        item.weaverId = value
                                    }
                                });
                            }
                            return (
                                <td {...restProps}>
                                    {editing ? (
                                        <Form.Item
                                            name={dataIndex}
                                            style={{
                                                margin: 0,
                                            }}
                                        >
                                            {inputType === 'weight' && <Input defaultValue={record.weight} onBlur={changeWeight} />}
                                            {inputType === 'flawInfo' && <Select defaultValue={record.flawInfo} mode="multiple" onChange={selectFlawInfo} >
                                                {record.clothData.map((item) => (<Option value={item.name}>{item.name}</Option>))}
                                            </Select>
                                            }
                                            {
                                                inputType === "qcId" && <Select onChange={selectQc} defaultValue={record.qcId}>
                                                    {record.checkClothData.map((item) => (<Option value={item.id}>{item.name}</Option>))}
                                                </Select>
                                            }
                                            {
                                                inputType === "weaverId" && <Select onChange={selectWeaver} defaultValue={record.weaverId}>
                                                    {record.runMachinePerson.map((item) => (<Option value={item.id}>{item.name}</Option>))}
                                                </Select>
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
                bordered
                dataSource={data}
                columns={mergedColumns}
                pagination={false}
                scroll={{
                    y: 250
                }}
            />
        </Form>
    );
};
const mapStateToProps = (state) => {
    return {
        createOrderParam: state.createOrderParam
    }
}
export default connect(mapStateToProps)(EditBarCode)