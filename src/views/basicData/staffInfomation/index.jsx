import { withRouter } from "react-router-dom";
import { Table, PageHeader, Button, Modal, Form, Input, message, Select, Tag } from "antd";
import {  onlyFormat, checkPhone, positionValue } from "../../../utils/config";
import { addEditParson, delectParson, disablePerson, getPersonList } from "../../../api/apiModule"
import { useEffect, useState } from "react";
import "./index.css"
const { confirm } = Modal;
const { Option } = Select;
const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 20,
    },
};
function StaffInfo() {
    document.title = "员工信息";
    const [visible, setvisible] = useState(false);
    const [data, setdata] = useState([]);
    const [selectuser, setSelectuser] = useState({})
    const [editType, seteditType] = useState(1); // 1编辑，2,新增
    const [size, setSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setloading] = useState(true);
    const [rowId, setRowId] = useState("");
    const [form] = Form.useForm();
    const positionArr = ["查布员", "值机员", "其他"]
    useEffect(() => {
        getPerson(1, 10);
    }, [])
    const getPerson = (page, size) => {
        getPersonList(page, size, (res) => {
            setloading(false);
            if (res.code == 200) {
                setSize(res.data.size);
                setCurrent(res.data.current);
                setTotal(res.data.total)
                setdata(res.data.records);
                return;
            }
            message.error("请求错误！")
        })
    }
    const handleOk = async (param) => {
        const value = await form.validateFields();
        let data;
        if (value.mobilePhoneNo && !checkPhone(value.mobilePhoneNo)) {
            message.error("请输入正确的手机号码！");
            return;
        }
        if (editType === 2) {
            data = {
                "code": value.code,
                "mobilePhoneNo": value.mobilePhoneNo,
                "name": value.name,
                "position": positionValue(value.position) 
            }
        } else {
            // 编辑
            data = {
                "code": value.code,
                "id": selectuser.id,
                "mobilePhoneNo": value.mobilePhoneNo,
                "name": value.name,
                "position": positionValue(value.position)
            }
        }
        addEditParson(data, (res) => {
            setvisible(false)
            if (res.code === 200) {
                message.success("保存成功")
                getPerson(1, 10);
                return;
            }
            message.success("保存失败")
        })
    }
    const saveAdd = async () => {
        const value = await form.validateFields();
        let data;
        if (value.mobilePhoneNo && !checkPhone(value.mobilePhoneNo)) {
            message.error("请输入正确的手机号码！");
            return;
        }
        addEditParson({
            "code": value.code,
            "mobilePhoneNo": value.mobilePhoneNo,
            "name": value.name,
            "position": positionValue(value.position)
        }, (res) => {
            if (res.code === 200) {
                form.resetFields();
                message.success("保存成功")
                getPerson(1, 10);
                return;
            }
            message.success("保存失败")
        })
    }
    const onCancel = () => {
        setvisible(false);
        seteditType(1)
    }
    const edit = (param, type) => {
        form.setFieldsValue({
            name: param.name,
            code: param.code,
            position: positionArr[param.position - 1],
            mobilePhoneNo: param.mobilePhoneNo,
        })
        setvisible(true);
        seteditType(type);
        setSelectuser(param);
    }
    // 删除员工
    const delect = (param) => {
        confirm({
            title: '确认删除？',
            okText: "确定",
            cancelText: "取消",
            onOk() {
                delectParson(param.id, (res) => {
                    if (res.code == 200) {
                        message.success("删除成功！");
                        getPerson(1, 10);
                        return;
                    }
                    message.error("删除失败！")
                })
            },
            onCancel() { },
        });
    }

    const disable = (param) => {
        const userStatus = param.usedStatus == 1 ? 2 : 1
        disablePerson(param.id, userStatus, (res) => {
            if (res.code == 200) {
                param.usedStatus == 1 ? message.success("禁用成功！") : message.success("启用成功！")
                getPerson(1, 10);
                return;
            }
            param.usedStatus == 1 ? message.error("禁用失败！") : message.error("启用失败！")
        })
    }
    const onGenderChange = (param) => {
    }
    const setRowClassName = (record) => {
        return record.id === rowId ? 'clickRowStyl' : '';
    }
    const onClickRow = (record) => {
        setRowId(record.id)
    }
    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '工号',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '职位',
            dataIndex: 'position',
            key: 'position',
            render: (index) => (<span>{positionArr[index - 1]}</span>)
        },
        {
            title: '手机号',
            dataIndex: 'mobilePhoneNo',
            key: 'mobilePhoneNo',
        }, {
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
                    <span onClick={() => { edit(record, 1) }}>编辑</span>
                    <span onClick={() => { delect(record) }}>删除</span>
                    <span onClick={() => { disable(record) }}>{record.usedStatus == 1 ? "禁用" : "启用"} </span>
                </div>
            },
        },
    ];
    const pagination = {
        total: total,
        pageSize: size,
        current: current,
        onChange: (page, pageSize) => {
            setloading(false);
            setCurrent(page);
            setSize(pageSize);
            getPerson(page, pageSize);
        },
        showSizeChanger: true,
        showTotal: () => (`共${total}条`)
    }
    return <div className="right-container">
        <PageHeader
            title="员工"
            extra={[
                <Button key="1" type="primary" onClick={() => { edit({}, 2) }}>
                    新建
                </Button>,
            ]} />
        <Table
            loading={loading}
            columns={columns}
            dataSource={data}
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
            className="addStaffInfo"
            destroyOnClose
            title={editType == 1 ? "编辑员工" : "新建员工"}
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
                {...layout}
                preserve={false}
                form={form}
                layout="horizontal"
                name="form_in_modal"
                onFinish={handleOk}
            >
                <Form.Item label="姓名" name="name" rules={[{ required: true, message: "请输入姓名" }]}>
                    <Input placeholder="姓名" />
                </Form.Item>
                <Form.Item label="工号" name="code" rules={[{ required: true, message: "请输入工号" }]}>
                    <Input placeholder="工号" />
                </Form.Item>
                <Form.Item label="职位" name="position" rules={[{ required: true, message: "请选择职位" }]}>
                    <Select
                        placeholder="选择职位"
                        onChange={onGenderChange}
                        allowClear
                    >
                        <Option value="查布员">查布员</Option>
                        <Option value="值机员">值机员</Option>
                        <Option value="其他">其他</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="手机号码" name='mobilePhoneNo'>
                    <Input placeholder="手机号码" type="number" maxLength="11" />
                </Form.Item>
            </Form>
        </Modal>
    </div>
}


export default withRouter(StaffInfo)