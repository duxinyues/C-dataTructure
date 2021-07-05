/*
 * @Author: 1638877065@qq.com
 * @Date: 2021-05-27 13:49:51
 * @LastEditTime: 2021-06-29 09:34:04
 * @LastEditors: 1638877065@qq.com
 * @Description: 机台信息
 * @FilePath: \cloud-admin\src\views\basicData\machine\index.jsx
 * 
 */
import { withRouter } from "react-router-dom";
import { Table, PageHeader, Button, Modal, Form, Input, message, Select } from "antd";
import { useState, useEffect } from "react"
import { onlyFormat } from "../../../utils/config"
import { addAndEditLoom, disableLoom, delectLoom, getLoomList } from "../../../api/apiModule"
import { machineConfigData } from "../../../utils/mahineData";
import "./index.css"
const { confirm } = Modal;
const { Option } = Select;
function MachineData(props) {
    document.title = "机台资料";
    const [machineData, setmachineData] = useState([]);
    const [visible, setvisible] = useState(false);
    const [editType, seteditType] = useState(0);
    const [selectmachine, setselectmachine] = useState({});
    const [size, setSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [rowId, setRowId] = useState("");
    const [form] = Form.useForm();
    useEffect(() => {
        getMachineData(1, 10);
        form.resetFields();
    }, []);

    const modalClick = (param, type) => {
        form.setFieldsValue({
            brand: param.brand,
            code: param.code,
            type: machineConfigData[param.type],
            inches: param.inches,
        })
        setselectmachine({})
        setvisible(true);
        seteditType(type);
        setselectmachine(param)
    }
    // 新增、修改
    const handleOk = async (param) => {
        const value = await form.validateFields();
        let data;
        if (editType == 2) {
            data = {
                "brand": value.brand,
                "code": value.code,
                "inches": value.inches,
                "type": value.type
            }
        } else {
            var index = machineConfigData.findIndex(function (item) {
                return item == value.type;
            });
            data = {
                "brand": value.brand,
                "code": value.code,
                "id": selectmachine.id,
                "inches": value.inches,
                "type": index
            }
        }
        addAndEditLoom(data, (res) => {
            setvisible(false)
            if (res.code == 200) {
                message.success("保存成功")
                getMachineData(1, 10)
                return;
            }
            message.error("保存失败")
        })
    }
    const saveAdd = async (param) => {
        const value = await form.validateFields();
        addAndEditLoom({
            "brand": value.brand,
            "code": value.code,
            "inches": value.inches,
            "type": value.type
        }, (res) => {
            form.resetFields();
            if (res.code == 200) {
                message.success("保存成功")
                getMachineData(1, 10)
                return;
            }
            message.error("保存失败")
        })
    }
    const onCancel = () => {
        setvisible(false);
        setselectmachine({})
    }
    const disableMachine = (param) => {
        const userStatus = param.usedStatus == 1 ? 2 : 1;
        disableLoom(param.id, userStatus, (res) => {
            if (res.code == 200) {
                getMachineData(1, 10)
                param.usedStatus == 1 ? message.success("禁用成功") : message.success("启用成功")
                return;
            }
            param.usedStatus == 1 ? message.error("禁用失败") : message.error("启用失败")
        })
    }
    const delectMachine = (param) => {
        confirm({
            title: "确认删除？",
            okText: "确定",
            cancelText: "取消",
            onOk() {
                delectLoom(param.id, (res) => {
                    if (res.code == 200) {
                        message.success("删除成功！");
                        getMachineData(1, 10)
                        return;
                    }
                    message.error("删除失败！")
                })
            },
            onCancel() { },
        })
    }
    const getMachineData = (page, size) => {
        getLoomList(page, size, (res) => {
            if (res.code == 200) {
                setTotal(res.data.total);
                setSize(res.data.size);
                setCurrent(res.data.current);
                setmachineData(res.data.records)
            }
        })
    }
    const onGenderChange = (value) => {
        console.log("选中的机种", value)
    }
    const setRowClassName = (record) => {
        return record.id === rowId ? 'clickRowStyl' : '';
    }
    const onClickRow = (record) => {
        setRowId(record.id)
    }
    const columns = [
        {
            title: '机号',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '品牌',
            dataIndex: 'brand',
            key: 'brand',
        },
        {
            title: '种类',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (<span>{machineConfigData[type]}</span>)
        },
        {
            title: '寸数',
            dataIndex: 'inches',
            key: 'inches',
        },

        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render: (time) => (<span>{onlyFormat(time, true)}</span>)
        },
        {
            title: '操作',
            key: 'tags',
            dataIndex: 'tags',
            render: (tags, record) => {
                return <div className="tag-content">
                    <span onClick={() => { modalClick(record, 1) }}>编辑</span>
                    <span onClick={() => { delectMachine(record) }}>删除</span>
                    <span onClick={() => { disableMachine(record) }}>{record.usedStatus == 1 ? "禁用" : "启用"} </span>
                </div>
            },
        },
    ];
    const pagination = {
        total: total,
        pageSize: size,
        current: current,
        onChange: (page, pageSize) => {
            setCurrent(page);
            setSize(pageSize);
            getMachineData(page, pageSize)
        },
        showSizeChanger: true,
        showTotal: () => (`共${total}条`)
    }
    return <div className="right-container">
        <PageHeader
            title="机台"
            extra={[
                <Button key="1" type="primary" onClick={() => { modalClick({}, 2) }}>
                    新增
                </Button>,
            ]} />
        <Table
            columns={columns}
            dataSource={machineData}
            rowKey={record => record.id}
            pagination={pagination}
            rowClassName={(record) => {
                return setRowClassName(record)
            }}
            onRow={record => {
                return {
                    onClick: event => { onClickRow(record) },
                };
            }}
        />
        <Modal
            className="customModal loom"
            destroyOnClose={true}
            title={editType == 1 ? "编辑机台" : "新建机台"}
            visible={visible}
            footer={[
                <span className="modalFooterBtn" onClick={saveAdd}>保存并新增</span>,
                <Button key="submit" type="primary" onClick={handleOk} >
                    保存
                </Button>,
                <Button onClick={onCancel}>
                    取消
                </Button>
            ]}
            onCancel={onCancel}
        >
            <Form
                form={form}
                layout="horizontal"
                name="form_in_modal"
                onFinish={handleOk}
                preserve={false}

            >
                <Form.Item label="机号" name="code" rules={[{ required: true, message: '请输入机号!' }]}>
                    <Input placeholder="机号" />
                </Form.Item>
                <Form.Item label="种类" name="type" rules={[{ required: true, message: '请选择机种!' }]}>
                    <Select
                        placeholder="请选择种类"
                        onChange={onGenderChange}
                        allowClear
                    >
                        {
                            machineConfigData.map((item, key) => {
                                return <Option value={key}>{item}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="品牌" name="brand" rules={[{ required: true, message: '请输入品牌!' }]}>
                    <Input placeholder="品牌" />
                </Form.Item>
                <Form.Item label="寸数" name="inches" rules={[{ required: true, message: '请输入寸数!' }]}>
                    <Input placeholder="寸数" type="number" />
                </Form.Item>
            </Form>
        </Modal>
    </div>
}
export default withRouter(MachineData)