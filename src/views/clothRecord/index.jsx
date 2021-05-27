import { useState, useEffect } from "react"
import { PageHeader, Table, Button, Form, Modal, Input, message } from "antd";
import { requestUrl, onlyFormat } from "../../utils/config";
const { confirm } = Modal;
function ClothRecord() {
    document.title = "查布记录";
    const [clothData, setclothData] = useState([]);
    const [visible, setvisible] = useState(false);
    const [editType, seteditType] = useState(0);
    const [selectRecord, setselectRecord] = useState();
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);
    const [size, setsize] = useState(10)
    const [form] = Form.useForm();

    useEffect(() => {
        getClothData(1, 10);
    }, [])

    const modalClick = (param, type) => {
        console.log(param)
        setselectRecord(param)
        setvisible(true);
        seteditType(type)
    };
    const onCancel = () => {
        setvisible(false)
    }
    const handleOk = (param) => {
        let data;
        if (editType == 2) {
            data = {
                "companyId": 1,
                "name": param.name,
            }
        } else {
            data = {
                "companyId": 1,
                "id": selectRecord.id,
                "name": param.name,
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
                    editType == 2 ? message.success("添加成功！") : message.success("编辑成功！")
                    return;
                }
                editType == 2 ? message.error(res.msg) : message.error("编辑失败！")
            })
    }
    const delectClothRecord = (param) => {
        confirm({
            title: "确定要删除该记录？",
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
        fetch(requestUrl + `/api-basedata/clothInspection/findAll?companyId=1&page=${page}&size=${size}`, {
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
            render: (time) => (<span>{onlyFormat(time)}</span>)
        },
        {
            title: '操作',
            key: 'tags',
            dataIndex: 'tags',
            render: (tags, record) => {
                return <div className="tag-content">
                    <span onClick={() => { modalClick(record, 1) }}>编辑</span>
                    <span onClick={() => { delectClothRecord(record) }}>删除</span>
                    <span onClick={() => { disableClothRecord(record) }}> {record.usedStatus == 1 ? "禁用" : "启用"} </span>
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
        }
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
        />

        <Modal
            destroyOnClose={true}
            title={editType == 1 ? "编辑" : "新增"}
            visible={visible}
            footer={false}
            onCancel={onCancel}
        >
            <Form
                form={form}
                layout="horizontal"
                name="form_in_modal"
                onFinish={handleOk}
                initialValues={{
                    name: selectRecord ? selectRecord.name : "",
                    code: selectRecord ? selectRecord.code : "",
                }}
                preserve={false}

            >
                <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称!' }]}>
                    <Input placeholder="名称" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginRight: "10px" }}>保存</Button>
                    <Button type="primary" onClick={onCancel}>取消</Button>
                </Form.Item>
            </Form>
        </Modal>
    </div>
}

export default ClothRecord;
