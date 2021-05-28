import { useState, useEffect } from "react";
import { PageHeader, Table, Modal, Button, Form, Input, message, Cascader, Tag } from "antd";
import { requestUrl, onlyFormat } from "../../../utils/config";
const { confirm } = Modal;
const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 20,
    },
};
function Supplier() {
    document.title = "供应商";
    const [data, setdata] = useState([]);
    const [visible, setvisible] = useState(false);
    const [editType, seteditType] = useState(0);
    const [selectRecord, setselectRecord] = useState();
    const [addressData, setaddressData] = useState([]);
    const [size, setSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [rowId, setRowId] = useState(0);
    const [form] = Form.useForm();
    const selectId = []
    useEffect(() => {
        getClothData(1, 10);
        getData()
    }, [])

    const modalClick = (param, type) => {
        console.log("选中的数据==", param);
        form.setFieldsValue({
            name: param.name,
            abbr: param.abbr,
            contactPhone: param.contactPhone,
            address: param.address ? param.address.split(" ") : "",
            detailAddress: param.detailAddress
        })
        setselectRecord(param);
        setvisible(true);
        seteditType(type)
    };
    const onCancel = () => {
        setvisible(false)
    }
    const handleOk = async (param) => {
        const value = await form.validateFields();
        let data;
        if (editType == 2) {
            // 新增
            data = {
                "abbr": value.abbr,
                "address": selectId.join(","),
                "companyId": 1,
                "name": value.name,
                "contactPhone": value.contactPhone,
                "detailAddress": value.detailAddress,
            }
        } else {
            edit(value.address, addressData)
            data = {
                "abbr": value.abbr,
                "address": selectId.join(","),
                "companyId": 1,
                "name": value.name,
                "contactPhone": value.contactPhone,
                "detailAddress": value.detailAddress,
                "id": selectRecord.id
            }
        }
        console.log("选中数据", data)
        fetch(requestUrl + `/api-basedata/supplier/saveOrModify`, {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then((res) => { return res.json() })
            .then((res) => {
                console.log(res)
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
            title: "确定要删除该供应商吗？",
            okText: "确定",
            cancelText: "取消",
            onCancel() { },
            onOk() { delectRequest(param.id); }
        })
    }
    // 删除记录
    const delectRequest = (id) => {
        fetch(requestUrl + `/api-basedata/supplier/delete?id=${id}`, {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
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
        fetch(requestUrl + `/api-basedata/supplier/modifyEnabled?id=${param.id}&enabled=${usedStatus}`, {
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
    const getClothData = (page, size) => {
        fetch(requestUrl + `/api-basedata/supplier/findAll?companyId=1&page=${page}&size=${size}`, {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            },
        })
            .then(res => { return res.json() })
            .then(res => {
                if (res.code == 200) {
                    setTotal(res.data.total);
                    setSize(res.data.size);
                    setCurrent(res.data.current);
                    setdata(res.data.records);
                }
            })
    }
    const onChange = (value) => {
        edit(value, addressData)
    }
    const getData = () => {
        fetch(requestUrl + "/api-basedata/address/findAll", {
            method: "GET",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            },
        })
            .then((res) => { return res.json() })
            .then((res) => {
                console.log(res)
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
    const setRowClassName = (record) => {
        return record.id === rowId ? 'clickRowStyl' : '';
    }
    const onClickRow = (record) => {
        setRowId(record.id)
    }
    const columns = [
        {
            title: '编码',
            dataIndex: 'code',
            key: 'code',
            width: 100
        },
        {
            title: '公司名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '简称',
            dataIndex: 'abbr',
            key: 'abbr',
        },
        {
            title: '联系号码',
            dataIndex: 'contactPhone',
            key: 'contactPhone',
            width:200
        },
        {
            title: '省市区',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '详细地址',
            dataIndex: 'detailAddress',
            key: 'detailAddress',
        },
        {
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
                    <span onClick={() => { modalClick(record, 1) }}>编辑</span>
                    <span onClick={() => { delect(record) }}>删除</span>
                    <span onClick={() => { disable(record) }}>{record.usedStatus == 1 ? "禁用" : "启用"} </span>
                </div>
            },
        },
    ]
    const pagination = {
        showSizeChanger: true,
        total: total,
        pageSize: size,
        current: current,
        onChange: (page, pageSize) => {
            setCurrent(page);
            setSize(pageSize);
            getClothData(page, pageSize);
        },
        showTotal: () => (`共${total}条`)
    }
    return <div className="right-container">
        <PageHeader
            title="供应商"
            extra={[
                <Button key="1" type="primary" onClick={() => { modalClick({}, 2) }}>
                    新增
                </Button>,
            ]} />
        <Table
            columns={columns}
            dataSource={data}
            rowKey={record => record.id}
            pagination={pagination}
            scroll={{
                scrollToFirstRowOnChange: true,
                x: 1200,
                y: 600
            }}
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
            destroyOnClose={true}
            title={editType == 1 ? "编辑供应商" : "新建供应商"}
            visible={visible}
            footer={[
                <span className="modalFooterBtn">{editType == 1 ? "保存编辑" : "保存并新增"}</span>,
                <Button key="submit" type="primary" onClick={handleOk} >
                    保存
                </Button>,
                <Button onClick={onCancel}>
                    取消
                </Button>
            ]}
            onCancel={onCancel}
            className="customModal"
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
                {/* <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginRight: "10px" }}>保存</Button>
                    <Button type="primary" onClick={onCancel}>取消</Button>
                </Form.Item> */}
            </Form>
        </Modal>
    </div>
}
export default Supplier