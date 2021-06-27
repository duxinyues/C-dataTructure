import { useState, useEffect } from "react";
import { PageHeader, Table, Modal, Button, Form, Input, message, Row, Select } from "antd";
import { onlyFormat } from "../../utils/config";
import { getUserList, resetPassword, addAndEditUser, delectUser, disbaleUser, getRoles, getCompanyList } from "../../api/apiModule"
import "./style.css"
const { confirm } = Modal;
const { Option } = Select
const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 20,
    },
};
function UserCenter() {
    document.title = "用户管理";
    const [loading, setloading] = useState(true);
    const [visible, setvisible] = useState(false);
    const [editType, seteditType] = useState(0);
    const [selectRecord, setselectRecord] = useState();
    const [size, setSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [rowId, setRowId] = useState(0);
    const [company, setCompany] = useState([]);
    const [role, setRole] = useState([]);
    const [userList, setUserList] = useState([])
    const [form] = Form.useForm();
    useEffect(() => {
        userListFn({ "page": 1, "size": 10 });
        getCompanyList((res) => {
            setCompany([...res])
        });
        getRoles((res) => {
            setRole([...res])
        })
    }, [])

    const modalClick = async (param, type) => {
        console.log("param==", param)
        setselectRecord(param);
        setvisible(true);
        seteditType(type);
        if (type === 2) {
            await form.setFieldsValue({
                companyId: "",
                mobile: param.mobile,
                nickname: param.nickname,
                password: param.password,
                roleId: "",
                username: param.username,
                oldPassword: param.oldPassword
            });
            return;
        }
        const roles = param.roles.map((item) => {
            return item.id
        })
        const companyName = company.filter((item) => {
            console.log(item)
            return item.id === param.companyId
        })
        console.log(companyName)
        await form.setFieldsValue({
            companyId: param.companyId,
            mobile: param.mobile,
            nickname: param.nickname,
            password: param.password,
            roleId: roles,
            username: param.username,
            oldPassword: param.oldPassword
        });

    };
    const onCancel = () => {
        setselectRecord({});
        setvisible(false)
    }
    /**
     * 新增和编辑
     * @param {*} param 
     */
    const handleOk = async (param) => {
        const value = await form.validateFields();
        let data;
        if (editType == 2) {
            // 新增
            data = {
                "companyId": value.companyId,
                "mobile": value.mobile,
                "nickname": value.nickname,
                "roleId": value.roleId.join(","),
                "username": value.username,
                "password": value.password
            }
        }
        if (editType == 1) {
            data = {
                "companyId": value.companyId,
                "mobile": value.mobile,
                "nickname": value.nickname,
                "roleId": value.roleId.join(","),
                "username": value.username,
                "id": selectRecord.id
            }
        }

        if (editType == 3) {
            data = {
                "newPassword": value.newPassword,
                "oldPassword": value.oldPassword,
                "id": selectRecord.id
            };
            if (value.newPassword == value.oldPassword) {
                message.warning("两次密码不能一致");
                return;
            }
            resetPassword(data, (res) => {
                setvisible(false)
                if (res.code == 200) {
                    message.success(res.msg);
                    userListFn({ page: 1, size: 10 })
                    return;
                }
                message.error(res.msg)
            })
            return;
        }
        addAndEditUser(data, (res) => {
            setvisible(false)
            if (res.code == 200) {
                editType == 2 ? message.success("添加成功！") : message.success("编辑成功！");
                userListFn({ page: 1, size: 10 })
                return;
            }
            editType == 2 ? message.error(res.msg) : message.error(res.msg)
        })
    }
    const delect = (param) => {
        confirm({
            title: "确定要删除该用户？",
            okText: "确定",
            cancelText: "取消",
            onCancel() { },
            onOk() {
                delectUser(param.id, (res) => {
                    if (res.code == 200) {
                        message.success("删除成功！");
                        userListFn({ page: 1, size: 10 })
                        return;
                    }
                    message.error("删除失败！")
                });
            }
        })

    }

    // 禁用
    const disable = (param) => {
        const usedStatus = param.enabled ? false : true;
        disbaleUser(param.id, usedStatus, (res) => {
            if (res.code == 200) {
                userListFn({ page: 1, size: 10 })
                param.enabled ? message.success(res.msg) : message.success(res.msg);
                return;
            }
            param.enabled ? message.error(res.msg) : message.success(res.msg);
        })
    }
    // 获取用户列表
    const userListFn = (params) => {
        getUserList(params, (res) => {
            if (res.code === 200) {
                setloading(false);
                setUserList([...res.data.records]);
                setTotal(res.data.total);
                setCurrent(res.data.current)
            }
        })
    }

    /**
     * 查询用户
     * @param {*} value 
     */
    const searchUser = (value) => {
        value.page = 1;
        value.size = 10;
        console.log("查询的字段==", value)
        userListFn(value)
    }
    // 设置列表选中的class名称
    const setRowClassName = (record) => {
        return record.id === rowId ? 'clickRowStyl' : '';
    }
    // 列表行的点击事件
    const onClickRow = (record) => {
        setRowId(record.id)
    }
    const columns = [
        {
            title: '姓名',
            dataIndex: 'nickname',
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '公司名称',
            dataIndex: 'companyId',
        },
        {
            title: '角色',
            dataIndex: 'roles',
            render: (role) => {
                const roles = role.map((item) => { return item.name })
                return <span>{roles.join(",")}</span>
            }
        },
        {
            title: '手机号',
            dataIndex: 'mobile',
        },

        {
            title: '加入时间',
            dataIndex: 'createTime',
            render: (time) => (<span>{onlyFormat(time, true)}</span>)
        },
        {
            title: '操作',
            dataIndex: 'tags',
            width: 200,
            render: (tags, record) => {
                return <div className="tag-content">
                    <span onClick={() => { modalClick(record, 1) }}>编辑</span>
                    <span onClick={() => { delect(record) }}>删除</span>
                    <span onClick={() => { modalClick(record, 3) }}>重置密码</span>
                    <span onClick={() => { disable(record) }}>{record.enabled ? "禁用" : "启用"} </span>
                </div>
            },
        },
    ]
    const pagination = {
        total: total,
        pageSize: size,
        current: current,
        onChange: (page, pageSize) => {
            setCurrent(page);
            setSize(pageSize);
            userListFn({ page: page, size: pageSize })
        },
        showSizeChanger: false,
        showTotal: () => (`共${total}条`)
    }
    return <div className="right-container user-center">
        <PageHeader
            title="用户管理"
            extra={[
                <Button key="1" type="primary" onClick={() => { modalClick({}, 2) }}>
                    新增
                </Button>,
            ]} />
        <div className="search-content">
            <Form
                form={form}
                onFinish={searchUser}
            >
                <Row gutter={24}>
                    <Form.Item
                        name="username"
                        label="用户名"
                        className="col2"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="companyId"
                        label="公司名称"
                        className="col2"
                    >
                        <Select style={{ width: "175px" }}>
                            {
                                company.map((item) => (<Option value={item.id}>{item.name}</Option>))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="roleId"
                        label="角色"
                        className="col2"
                    >
                        <Select style={{ width: "175px" }} >
                            {
                                role.map((item) => (<Option value={item.id}>{item.name}</Option>))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item style={{ marginLeft: "60px" }}>
                        <Button type="primary" htmlType="submit">
                            搜索
                        </Button>
                        <Button
                            style={{ margin: '0 8px' }}
                            onClick={() => {
                                form.resetFields();
                            }}
                        >
                            清空
                        </Button>
                    </Form.Item>
                </Row>
            </Form>
        </div>
        <Table
            loading={loading}
            columns={columns}
            dataSource={userList}
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
            className="customModal user-center"
            destroyOnClose={true}
            title={editType == 1 ? "编辑用户" : "新增用户"}
            visible={visible}
            footer={[
                <span className="modalFooterBtn">{editType === 1 ? "保存编辑" : "保存并新增"}</span>,
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
                form={form}
                layout="horizontal"
                name="form_in_modal"
                preserve={false}
            >
                {
                    (editType === 2 || editType === 1) && <><Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名!' }]}>
                        <Input />
                    </Form.Item>
                        <Form.Item label="昵称" name="nickname" >
                            <Input />
                        </Form.Item>
                        <Form.Item label="公司" name="companyId" >
                            <Select>
                                {
                                    company.map((item) => (<Option value={item.id}>{item.name}</Option>))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="角色" name="roleId" >
                            <Select mode="multiple">
                                {
                                    role.map((item) => (<Option value={item.id}>{item.name}</Option>))
                                }
                            </Select>
                        </Form.Item></>
                }
                {editType === 2 && <Form.Item label="密码" name="password" >
                    <Input />
                </Form.Item>}
                {(editType === 2 || editType === 1) && <Form.Item label="手机号码" name="mobile" >
                    <Input />
                </Form.Item>}
                {
                    editType === 3 && <>
                        <Form.Item label="旧密码" name="oldPassword" rules={[{ required: true, message: '请输入密码!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="新密码" name="newPassword" rules={[{ required: true, message: '请输入新密码!' }]}>
                            <Input />
                        </Form.Item>
                    </>
                }
            </Form>
        </Modal>
    </div>
}
export default UserCenter