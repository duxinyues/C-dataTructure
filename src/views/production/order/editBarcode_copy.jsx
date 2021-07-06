import React, { useState, useEffect } from 'react';
import { Table, Input, Popconfirm, Form, Typography, message, Select, AutoComplete } from 'antd';
import { getClothList, getPerson } from "../../../api/apiModule"
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
        getPerson((res) => {
            if (res.code == 200) {
                const _checkClothData = [];
                const _runMachinePerson = [];
                res.data.map((item) => {
                    if (item.position === 1) { _checkClothData.push(item) }
                    if (item.position === 2) { _runMachinePerson.push(item) }
                })
                setcheckClothData([..._checkClothData]);
                setrunMachinePerson([..._runMachinePerson]);
            }
        });
        if (props.data) {
            props.data.map((item) => {
                // item.clothData = clothData;
                // item.checkClothData = checkClothData;
                // item.runMachinePerson = runMachinePerson;
            })
            setData([...props.data])
        }
    }, [props.data])

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
        getClothList(1, 1000, (res) => {
            if (res.code == 200) {
                setclothData(res.data.records);
            }
        })
    }
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
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
    const getQcName = (id) => {
        return checkClothData.map((item) => {
            if (item.id === id) return item.name
        })
    }
    const getWeaverName = (id) => {
        return runMachinePerson.map((item) => {
            if (item.id === id) return item.name
        })
    }
    const columns = [
        { title: "条码", dataIndex: "barcode" },
        { title: "匹号", dataIndex: "seq" },
        { title: "入库重量", dataIndex: "weight", editable: true },
        { title: "入库时间", dataIndex: "inStockTime", render: (time) => (<span>{day(time)}</span>) },
        { title: "出库时间", dataIndex: "outStockTime", render: (time) => (<span>{day(time)}</span>) },
        { title: "查布记录", dataIndex: "flawInfo", editable: true },
        { title: "查布员", dataIndex: "qcId", editable: true, render: (id) => (<span>{getQcName(id)}</span>) },
        { title: "值机工", dataIndex: "weaverId", editable: true, render: (id) => (<span>{getWeaverName(id)}</span>) },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_, record) => {
                return <Popconfirm title="确定删除？" onConfirm={() => { handleDelete(record.id) }}>
                    <span style={{ marginLeft: "10px" }} >删除</span>
                </Popconfirm>
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
                editing: true
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
                            console.log("record====", record)
                            const _data = data;
                            // 修改查布记录
                            const selectFlawInfo = (value) => {
                                _data.map((item) => {
                                    if (item.id == record.id) {
                                        item.flawInfo = value.join(",")
                                    }
                                });
                                setData([..._data]);
                                props.editCode(_data)
                            }
                            // 修改重量
                            const changeWeight = ({ target: { value } }) => {
                                _data.map((item) => {
                                    if (item.id == record.id) {
                                        item.weight = value
                                    }
                                });
                                setData([..._data]);
                                props.editCode(_data)
                            }
                            // 修改查布员
                            const selectQc = (value) => {
                                _data.map((item) => {
                                    if (item.id == record.id) {
                                        item.qcId = value
                                    }
                                });
                                setData([..._data]);
                                props.editCode(_data)
                            }
                            // 修改值机工
                            const selectWeaver = (value) => {
                                _data.map((item) => {
                                    if (item.id == record.id) {
                                        item.weaverId = value
                                    }
                                });
                                setData([..._data]);
                                props.editCode(_data)
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
                                            {inputType === 'weight' && <Input defaultValue={record.weight} onBlur={changeWeight} />}
                                            {inputType === 'flawInfo' && <Select defaultValue={record.flawInfo ? record.flawInfo : []} mode="multiple" onChange={selectFlawInfo} >
                                                {clothData.map((item) => (<Option value={item.name}>{item.name}</Option>))}
                                            </Select>
                                            }
                                            {
                                                inputType === "qcId" && <Select onChange={selectQc} defaultValue={record.qcId}>
                                                    {checkClothData.map((item) => (<Option value={item.id}>{item.name}</Option>))}
                                                </Select>
                                            }
                                            {
                                                inputType === "weaverId" && <Select onChange={selectWeaver} defaultValue={record.weaverId}>
                                                    {runMachinePerson.map((item) => (<Option value={item.id}>{item.name}</Option>))}
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