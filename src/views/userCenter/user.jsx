import { useState, useEffect } from "react";
import { PageHeader, Table, Modal, Button, Form, Input, message, Cascader, Row, Select } from "antd";
import { requestUrl, onlyFormat } from "../../utils/config";
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
    const [data, setdata] = useState([]);
    const [loading, setloading] = useState(false);
    const [visible, setvisible] = useState(false);
    const [editType, seteditType] = useState(0);
    const [selectRecord, setselectRecord] = useState();
    const [addressData, setaddressData] = useState([]);
    const [size, setSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [rowId, setRowId] = useState(0);
    const [company, setCompany] = useState([]);
    const [role, setRole] = useState([])
    const [form] = Form.useForm();
    const selectId = []
    useEffect(() => {
        getClothData({ "page": 1, "size": 10 });
    }, [])

    const modalClick = async (param, type) => {
        getData()
        await form.setFieldsValue({
            name: param.name,
            abbr: param.abbr,
            contactPhone: param.contactPhone,
            address: param.address ? param.address.split(" ") : "",
            detailAddress: param.detailAddress,
            tareWeight: param.tareWeight,
            weightDecimal: param.weightDecimal
        });
        setselectRecord(param);
        setvisible(true);
        seteditType(type);
    };
    const onCancel = () => {
        setselectRecord(false);
        setvisible(false)
    }
    const handleOk = async (param) => {
        console.log("表单数据")
        const value = await form.validateFields();
        let data;
        if (editType == 2) {
            // 新增
            data = {
                "abbr": value.abbr,
                "address": selectId.join(","),
                "companyId": 1,
                "contactPhone": value.contactPhone,
                "detailAddress": value.detailAddress,
                "name": value.name,
                "tareWeight": value.tareWeight,
                "weightDecimal": value.weightDecimal
            }
        } else {
            edit(value.address, addressData)
            data = {
                "abbr": value.abbr,
                "address": selectId.join(","),
                "companyId": 1,
                "contactPhone": value.contactPhone,
                "detailAddress": value.detailAddress,
                "name": value.name,
                "tareWeight": value.tareWeight,
                "weightDecimal": value.weightDecimal,
                "id": selectRecord.id
            }
        }

        fetch(requestUrl + `/api-basedata/customer/saveOrModify`, {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then((res) => { return res.json() })
            .then((res) => {
                setvisible(false)
                if (res.code == 200) {
                    getClothData(1, 10);
                    editType == 2 ? message.success("添加成功！") : message.success("编辑成功！")
                    return;
                }
                editType == 2 ? message.error("添加失败！") : message.error("编辑失败！")
            })
    }
    const delect = (param) => {
        confirm({
            title: "确定要删除该用户？",
            okText: "确定",
            cancelText: "取消",
            onCancel() { },
            onOk() { delectRequest(param.id); }
        })

    }
    // 删除
    const delectRequest = (id) => {
        fetch(requestUrl + `/api-basedata/customer/delete?id=${id}`, {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            },
        })
            .then(res => { return res.json() })
            .then(res => {
                if (res.code == 200) {
                    message.success("删除成功！");
                    getClothData(1, 10)
                    return;
                }
                message.error("删除失败！")
            })
    }

    // 禁用
    const disable = (param) => {
        const usedStatus = param.usedStatus == 1 ? 2 : 1;
        fetch(requestUrl + `/api-basedata/customer/modifyEnabled?id=${param.id}&enabled=${usedStatus}`, {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            },
        })
            .then(res => { return res.json() })
            .then((res) => {
                if (res.code == 200) {
                    getClothData(1, 10)
                    param.usedStatus == 1 ? message.success("禁用成功！") : message.success("启用成功！");
                    return;
                }
                param.usedStatus == 1 ? message.error("禁用失败！") : message.success("启用失败！");
            })
    }
    // 获取用户列表
    const getClothData = (params) => {
        fetch(requestUrl + `/api-user/user/findAll`, {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(params)
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log("用户列表==", res)
            })
    }
    // 选择地址
    const onChange = (value) => {
        edit(value, addressData)
    }
    // 获取地址
    const getData = () => {
        fetch(requestUrl + "/api-basedata/address/findAll", {
            method: "GET",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            },
        })
            .then((res) => { return res.json() })
            .then((res) => {
                addressMap(res.data)
                setaddressData(res.data)
            })
    }
    // 整理地址信息
    const addressMap = (data) => {
        data.map((item) => {
            item.value = item.name;
            item.label = item.name;
            if (item.subAddress) {
                item.children = item.subAddress;
                addressMap(item.children)
            }
        })
        return data
    }
    // 编辑选中的地址信息
    const edit = (selectAddr, addressData) => {
        addressData.map((item) => {
            if (selectAddr.indexOf(item.name) > -1) {
                selectId.push(item.id);
                if (item.children) {
                    edit(selectAddr, item.children)
                }
            }
        })
    }
    /**
     * 获取公司数据
     */
    const getCompany = () => {
        fetch(requestUrl + "/api-user/user/findCompanyDown", {
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
            }
        })
            .then(res => { return res.json() })
            .then(res => {
                if (res.code === 200) {
                    setCompany([...res.data])
                }
            })
    }
    const getRole = () => {
        fetch(requestUrl + "/api-user/role/findAll", {
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            }
        })
            .then(res => { return res.json() })
            .then(res => {
                if (res.code === 200) {
                    setRole([...res.data])
                }
            })
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
            title: '用户名',
            dataIndex: 'nickname',
        },
        {
            title: '姓名',
            dataIndex: 'username',
        },
        {
            title: '公司名称',
            dataIndex: 'companyId',
        },
        {
            title: '角色',
            dataIndex: 'roleId',
        },
        {
            title: '手机号',
            dataIndex: 'mobile',
        },
        {
            title: '最后登录',
            dataIndex: 'weightDecimal',
        },
        {
            title: '访问次数',
            dataIndex: 'address',
        },
        {
            title: '加入时间',
            dataIndex: 'detailAddress',
        },
        {
            title: '操作',
            dataIndex: 'tags',
            width: 200,
            render: (tags, record) => {
                return <div className="tag-content">
                    <span onClick={() => { modalClick(record, 1) }}>编辑</span>
                    <span onClick={() => { delect(record) }}>删除</span>
                    <span onClick={() => { disable(record) }}>{record.usedStatus == 1 ? "禁用" : "启用"} </span>
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
            getClothData(page, pageSize);
        },
        showSizeChanger: true,
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
                // onFinish={onFinish}
                initialValues={{
                    // type: type
                }}
            >
                <Row gutter={24}>
                    <Form.Item
                        name="type"
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
                        <Select style={{ width: "175px" }} onFocus={getCompany}>
                            {
                                company.map((item) => (<Option value={item.name}>{item.name}</Option>))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="roleId"
                        label="角色"
                        className="col2"
                    >
                        <Select style={{ width: "175px" }} onFocus={getRole}>
                            {
                                role.map((item) => (<Option value={item.roleId}>{item.name}</Option>))
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
                onFinish={handleOk}
                preserve={false}
            >
                <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称!' }]}>
                    <Input placeholder="名称" />
                </Form.Item>
                <Form.Item label="简称" name="abbr" rules={[{ required: true, message: '请输入简称!' }]}>
                    <Input placeholder="简称" />
                </Form.Item>
                <Form.Item label="电话" name="contactPhone" rules={[{ required: true, message: '请输入电话!' }]}>
                    <Input placeholder="电话" />
                </Form.Item>
                <Form.Item label="地址" name="address" rules={[{ required: true, message: '请输入地址!' }]}>

                    <Cascader
                        options={addressData}
                        onChange={onChange}
                        placeholder="公司地址"
                    />
                </Form.Item>
                <Form.Item label="详细地址" name="detailAddress" rules={[{ required: true, message: '请输入详细地址!' }]}>
                    <Input placeholder="详细地址" />
                </Form.Item>
                <Form.Item label="重量" name="tareWeight" rules={[{ required: true, message: '请输入重量!' }]}>
                    <Input placeholder="重量" />
                </Form.Item>
                <Form.Item label="小数位" name="weightDecimal" rules={[{ required: true, message: '请输入小数位!' }]}>
                    <Input placeholder="小数位" />
                </Form.Item>
            </Form>
        </Modal>
    </div>
}
export default UserCenter