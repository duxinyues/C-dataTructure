import React, { useState, useEffect } from 'react';
import { Table, Input, Popconfirm, Form, Typography, message, Select } from 'antd';
import { requestUrl } from "../../../utils/config";
import { day } from "../../../utils/config"
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
                            message: "请输入正确的内容",
                        },
                    ]}
                >
                    {inputType === 'weight' && <Input />}
                    {inputType === 'flawInfo' && <>
                    {}
                    </>}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
const EditBarCode = (props) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [clothData, setclothData] = useState([])
    useEffect(() => {
        if (props.data) {
            setData([...props.data])
        }
        getClothData()
    }, [props])
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
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.id);
            const totalRate = newData.reduce((pre, cur) => {
                return pre + cur.rate
            }, 0)
            if (totalRate > 100) {
                message.warning("纱比总和需要等于100");
                return;
            }
            row.planWeight = props.weight * row.rate * (1 + row.knitWastage / 100) / 100;
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                props.editCode(newData)
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                props.editCode(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
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
                        cell: EditableCell,
                    },
                }}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
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