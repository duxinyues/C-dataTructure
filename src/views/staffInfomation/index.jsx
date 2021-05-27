import { withRouter } from "react-router-dom";
import { Table, PageHeader, Button, Modal, Form, Input, message, Select } from "antd";
import { requestUrl, onlyFormat } from "../../utils/config";
import { useEffect, useState } from "react";
import "./index.css"
const { confirm } = Modal;
const { Option } = Select;
function StaffInfo() {
    document.title = "员工信息";
    const [visible, setvisible] = useState(false);
    const [data, setdata] = useState([]);
    const [selectuser, setSelectuser] = useState({})
    const [editType, seteditType] = useState(1); // 1编辑，2,新增
    const [size, setSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [form] = Form.useForm();
    const positionArr = ["查布员", "值机员", "其他"]
    useEffect(() => {
        getPerson(1, 10);
        form.resetFields();
    }, [])
    const getPerson = (page, size) => {
        fetch(requestUrl + `/api-basedata/person/findAll?companyId=1&page=${page}&size=${size}`, {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
            }
        })
            .then((res) => { return res.json() })
            .then((res) => {
                setSize(res.data.size);
                setCurrent(res.data.current);
                setTotal(res.data.total)
                setdata(res.data.records);
            })
    }
    const handleOk = (param) => {
        let data;
        // 新增
        if (editType == 2) {
            data = {
                "code": param.code,
                "companyId": 1,
                "mobilePhoneNo": param.mobilePhoneNo,
                "name": param.name,
                "position": param.position
            }
        } else {
            // 编辑
            data = {
                "code": param.code,
                "companyId": 1,
                "id": selectuser.id,
                "mobilePhoneNo": param.mobilePhoneNo,
                "name": param.name,
                "position": param.position
            }
        }

        fetch(requestUrl + "/api-basedata/person/saveOrModify", {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then((res) => { return res.json() })
            .then(res => {
                setvisible(false)
                if (res.code == 200) {
                    editType == 1 ? message.success("修改成功！") : message.success("添加成功！");
                    getPerson(1, 10);
                    return;
                }
                editType == 1 ? message.success("修改失败！") : message.success(res.msg);
            })
    }
    const onCancel = () => {
        setvisible(false);
        seteditType(1)
    }
    const edit = (param, type) => {
        setvisible(true);
        seteditType(type);
        setSelectuser(param);
    }
    // 删除员工
    const delect = (param) => {
        confirm({
            title: '确定删除该员工信息吗？',
            okText: "确定",
            cancelText: "取消",
            onOk() {
                delectRequst(param.id)
            },
            onCancel() { },
        });
    }
    const delectRequst = (id) => {
        fetch(requestUrl + "/api-basedata/person/delete?id=" + id, {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            },
        })
            .then((res) => { return res.json() })
            .then((res) => {
                if (res.code == 200) {
                    message.success("删除成功！");
                    getPerson(1, 10);
                    return;
                }
                message.error("删除失败！")
            })
    }

    const disable = (param) => {
        const userStatus = param.usedStatus == 1 ? 2 : 1
        fetch(requestUrl + "/api-basedata/person/modifyEnabled?id=" + param.id + "&enabled=" + userStatus, {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            },
        })
            .then((res) => { return res.json() })
            .then((res) => {
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
            title: '考勤ID',
            dataIndex: 'companyId',
            key: 'companyId',
        },
        {
            title: '手机号',
            dataIndex: 'mobilePhoneNo',
            key: 'mobilePhoneNo',
        }, {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render: (time) => (<span>{onlyFormat(time)}</span>)
        },
        {
            title: '操作',
            key: 'tags',
            dataIndex: 'tags',
            render: (tags, record) => {
                return <div className="tag-content">
                    <span onClick={() => { edit(record, 1) }}>编辑</span>
                    <span onClick={() => { delect(record) }}>删除</span>
                    <span onClick={() => { disable(record) }}> {record.usedStatus == 1 ? '禁用' : '启用'}</span>
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
            getPerson(page, pageSize);
        }
    }
    return <div className="right-container">
        <PageHeader
            title="员工资料"
            extra={[
                <Button key="1" type="primary" onClick={() => { edit({}, 2) }}>
                    新建
                </Button>,
            ]} />
        <Table columns={columns} dataSource={data} rowKey={record => record.id} pagination={pagination} />
        <Modal
            destroyOnClose
            title={editType == 1 ? "编辑" : "新增"}
            visible={visible}
            footer={false}
            onCancel={onCancel}
        >
            <Form
                preserve={false}
                form={form}
                layout="horizontal"
                name="form_in_modal"
                onFinish={handleOk}
                initialValues={{
                    name: editType == 1 ? selectuser.name : "",
                    code: editType == 1 ? selectuser.code : "",
                    position: editType == 1 ? positionArr[selectuser.position] : "",
                    mobilePhoneNo: editType == 1 ? selectuser.mobilePhoneNo : "",
                }}
            >
                <Form.Item label="姓名" name="name">
                    <Input placeholder="姓名" />
                </Form.Item>
                <Form.Item label="工号" name="code">
                    <Input placeholder="工号" />
                </Form.Item>
                <Form.Item label="职位" name="position">
                    <Select
                        placeholder="选择职位"
                        onChange={onGenderChange}
                        allowClear
                    >
                        <Option value="1">查布员</Option>
                        <Option value="2">值机员</Option>
                        <Option value="3">其他</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="手机号码" rules={[{ required: true, message: '请输入手机号码!' }]} name='mobilePhoneNo'>
                    <Input placeholder="手机号码" type="number" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginRight: "10px" }}>保存</Button>

                    <Button type="primary" onClick={onCancel}>取消</Button>
                </Form.Item>
            </Form>
        </Modal>
    </div>
}


export default withRouter(StaffInfo)