import { useState, useEffect } from "react"
import { PageHeader, Table, Button, Form, Modal, Input, message, Tag } from "antd";
import { requestUrl, onlyFormat } from "../../../utils/config";
const { confirm } = Modal;
function ClothRecord() {
    document.title = "查布记录";
    const [clothData, setclothData] = useState([]);
    const [visible, setvisible] = useState(false);
    const [editType, seteditType] = useState(0);
    const [selectRecord, setselectRecord] = useState();
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);
    const [size, setsize] = useState(10);
    const [rowId, setRowId] = useState(0);
    const [form] = Form.useForm();

    useEffect(() => {
        getClothData(1, 10);
    }, [])

    const modalClick = async (param, type) => {
        await form.setFieldsValue({
            name: param.name
        })
        console.log("选中的数据=", param)
        setselectRecord(param);
        setvisible(true);
        seteditType(type)
    };
    const onCancel = () => {
        setvisible(false)
    }
    const handleOk = async (param) => {
        const value = await form.validateFields()
        let data;
        if (editType == 2) {
            data = {
                "companyId": 1,
                "name": value.name,
            }
        } else {
            data = {
                "companyId": 1,
                "id": selectRecord.id,
                "name": value.name,
            }
        }
        fetch(requestUrl + `/api-basedata/clothInspection/saveOrModify`, {
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
                    message.success("保存成功！")
                    return;
                }
                message.success("保存失败")
            })
    }
    const delectClothRecord = (param) => {
        confirm({
            title: "确认删除？",
            okText: "确定",
            cancelText: "取消",
            onCancel() { },
            onOk() { delectRequest(param.id); }
        })

    }
    // 删除记录
    const delectRequest = (id) => {
        fetch(requestUrl + `/api-basedata/clothInspection/delete?id=${id}`, {
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
    const disableClothRecord = (param) => {
        const usedStatus = param.usedStatus == 1 ? 2 : 1;
        fetch(requestUrl + `/api-basedata/clothInspection/modifyEnabled?id=${param.id}&enabled=${usedStatus}`, {
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
        fetch(requestUrl + `/api-basedata/clothInspection/findAll?page=${page}&size=${size}`, {
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
                    setTotal(res.data.total);
                    setsize(res.data.size);
                    setCurrent(res.data.current);
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
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
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
                    <span onClick={() => { delectClothRecord(record) }}>删除</span>
                    <span onClick={() => { disableClothRecord(record) }}>{record.usedStatus == 1 ? "禁用" : "启用"} </span>
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
            setsize(pageSize);
            getClothData(page, pageSize);
        },
        showSizeChanger: true,
        showTotal: () => (`共${total}条`)
    }
    return <div className="right-container">
        <PageHeader
            title="查布记录"
            extra={[
                <Button key="1" type="primary" onClick={() => { modalClick({}, 2) }}>
                    新增
                </Button>,
            ]} />
        <Table
            columns={columns}
            dataSource={clothData}
            rowKey={record => record.id}
            pagination={pagination}
            rowClassName={(record) => {
                return setRowClassName(record)
            }}
            onRow={record => {
                return {
                    onClick: () => { onClickRow(record) },
                };
            }}
        />

        <Modal
            className="customModal loom"
            destroyOnClose
            title={editType == 1 ? "编辑查布记录" : "新建查布记录"}
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
        >
            <Form
                form={form}
                layout="horizontal"
                name="form_in_modal"
                onFinish={handleOk}
                preserve={false}
            >
                <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称!' }]}>
                    <Input placeholder="名称" />
                </Form.Item>
            </Form>
        </Modal>
    </div>
}

export default ClothRecord;
