import { withRouter } from "react-router-dom";
import { Table, PageHeader, Button, Modal, Form, Input, message, Select ,Tag} from "antd";
import { useState, useEffect } from "react"
import { requestUrl, onlyFormat } from "../../../utils/config"
import { machineConfigData } from "../../../utils/mahineData";
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
    const [rowId,setRowId] = useState("");
    const [form] = Form.useForm();
    useEffect(() => {
        getMachineData(1, 10);
        form.resetFields();
    }, []);

    const modalClick =  (param, type) => {
        console.log("选中的数据",param)
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
      const value=  await form.validateFields();
      console.log("表单数据，",value);
      console.log(editType)
        let data;
        if (editType == 2) {
            data = {
                "brand": value.brand,
                "code": value.code,
                "companyId": 1,
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
                "companyId": 1,
                "id": selectmachine.id,
                "inches": value.inches,
                "type": index
            }
        }
        fetch(requestUrl + "/api-basedata/loom/saveOrModify", {
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
                    editType == 2 ? message.success("添加成功！") : message.success("修改成功！");
                    getMachineData(1, 10)
                    return;
                }
                editType == 2 ? message.success(res.msg) : message.success(res.msg)
            })
    }
    const onCancel = () => {
        setvisible(false);
        setselectmachine({})
    }
    const disableMachine = (param) => {
        const userStatus = param.usedStatus == 1 ? 2 : 1
        fetch(requestUrl + `/api-basedata/loom/modifyEnabled?id=${param.id}&enabled=${userStatus}`, {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            },
        })
            .then(res => { return res.json() })
            .then(res => {
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
            title: "确定要删除这台设备吗？",
            okText: "确定",
            cancelText: "取消",
            onOk() {
                delectRequst(param.id)
            },
            onCancel() { },
        })
    }
    const delectRequst = (id) => {
        fetch(requestUrl + "/api-basedata/loom/delete?id=" + id, {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            },
        })
            .then(res => { return res.json() })
            .then(res => {
                if (res.code == 200) {
                    message.success("删除成功！");
                    getMachineData(1, 10)
                    return;
                }
                message.error("删除失败！")
            })
    }
    const getMachineData = (page, size) => {
        fetch(requestUrl + `/api-basedata/loom/findAll?companyId=1&page=${page}&size=${size}`, {
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
                    setmachineData(res.data.records)
                }
            })
    }
    const onGenderChange = (value) => {
        console.log("选中的机种", value)
    }
    const setRowClassName = (record)=>{
        return record.id === rowId ? 'clickRowStyl' : '';
    }
    const onClickRow = (record)=>{
        setRowId(record.id)
    }
    const columns = [
        {
            title: '品牌',
            dataIndex: 'brand',
            key: 'brand',
        },
        {
            title: '机台编号',
            dataIndex: 'code',
            key: 'code',
        },

        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (time) => (<span>{onlyFormat(time,true)}</span>)
        },

        {
            title: '寸数',
            dataIndex: 'inches',
            key: 'inches',
        },
        {
            title: '织机种类',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (<span>{machineConfigData[type]}</span>)
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render: (time) => (<span>{onlyFormat(time,true)}</span>)
        },
        {
            title: '操作',
            key: 'tags',
            dataIndex: 'tags',
            render: (tags, record) => {
                return <div className="tag-content">
                   <span onClick={() => { modalClick(record, 1) }}>编辑</span>
                    <span onClick={() => { delectMachine(record) }}>删除</span>
                    <span onClick={() => { disableMachine(record) }}>{record.usedStatus == 1 ? "禁用" :"启用"} </span>
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
            title="机台资料"
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
            scroll={{
                scrollToFirstRowOnChange: true,
                x: 1200,
                y: 600
            }}
            rowClassName={(record)=>{
                return setRowClassName(record)
             }}
             onRow={record => {
                 return {
                   onClick: event => {onClickRow(record)},
                 };
               }}
        />
        <Modal
         className="customModal"
            destroyOnClose={true}
            title={editType == 1 ? "编辑机台" : "新建机台"}
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
                <Form.Item label="品牌" name="brand" rules={[{ required: true, message: '请输入品牌!' }]}>
                    <Input placeholder="品牌" />
                </Form.Item>
                <Form.Item label="机号" name="code" rules={[{ required: true, message: '请输入机号!' }]}>
                    <Input placeholder="机号" />
                </Form.Item>
                <Form.Item label="机种" name="type" rules={[{ required: true, message: '请选择机种!' }]}>
                    <Select
                        placeholder="请选择机种"
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
                <Form.Item label="寸数" name="inches" rules={[{ required: true, message: '请输入寸数!' }]}>
                    <Input placeholder="寸数" type="number" />
                </Form.Item>
                {/* <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginRight: "10px" }}>保存</Button>
                    <Button type="primary" onClick={onCancel}>取消</Button>
                </Form.Item> */}
            </Form>
        </Modal>
    </div>
}
export default withRouter(MachineData)