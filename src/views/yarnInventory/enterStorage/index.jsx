import { useState, useEffect, useRef } from "react"
import { Table, PageHeader, Button, Modal, message } from "antd";
import { onlyFormat, requestUrl, getNowFormatDate } from "../../../utils/config";
import { yarnStockIn, yarnStockDetail, addYarnStock, deleteYarn, changeYarnOutStockStatus } from "../../../api/apiModule"
import { withRouter } from "react-router-dom";
import OrderDetail from "./orderDetail";
import CreateOrder from "./createOrder";
import "../style.css"

document.title = "收纱入库";
const { confirm } = Modal;
function EnterStorage(props) {
    const [leftData, setleftData] = useState([]);
    const [leftTotal, setleftTotal] = useState(0);
    const [yarn_stock_detail, setyarn_stock_detail] = useState({});
    const [selectId, setSelectId] = useState(0);
    const [detailType, setdetailType] = useState("detail"); // 用户操作类型
    const [orderData, setorderData] = useState(); // 编辑入库单的字段
    const [loading, setloading] = useState(true);
    const [size, setSize] = useState(10);
    const [current, setcurrent] = useState(1);
    const data = {
        page: 1,
        size: 10,
    }
    useEffect(() => {
        getData(data)
    }, [])

    //  收纱入库
    const getData = (param) => {
        yarnStockIn(param, (res) => {
            setloading(false);
            if (res.code == 200) {
                if (res.data.records.length === 0) {
                    setleftData([]);
                    setSelectId()
                    return;
                }
                setleftData(res.data.records);
                setleftTotal(res.data.total);
                setSize(res.data.size);
                setcurrent(res.data.current);
                setSelectId(res.data.records[0].id)
                getYarnStockDetail(res.data.records[0].id)
            }
        })
    }
    // 入库单详情
    const getYarnStockDetail = (id) => {
        yarnStockDetail(id, (res) => {
            if (res.code == 200) {
                setyarn_stock_detail(res.data)
            }
        })
    }
    // 新增
    const add = () => {
        setdetailType("add")
    }
    const edit = () => {
        setdetailType("edit")
    }
    const cancel = () => {
        setdetailType("detail")
    }
    // 保存收纱入库
    const onSave = () => {
        if (!orderData) {
            // 数据没有更新，则直接关闭编辑组件
            if (detailType === "edit" && detailType === "add") {
                setdetailType("detail")
            }
            return
        };
        // 添加入库单
        if (!orderData.customerId) {
            message.error("请选择客户！");
            return;
        }
        console.log("收纱入库单==", orderData)
        if (!orderData.inDtls) {
            message.warning("请完善纱线信息！");
            return;
        }
        const yarnNameIsEmpty = orderData.inDtls.every((item) => {
            return item.yarnName !== ""
        })
        if (!yarnNameIsEmpty) {
            message.warning("纱支不能为空！");
            return;
        }
        const netWeightIsEmpty = orderData.inDtls.every((item) => {
            console.log(item.netWeight)
            return Number(item.netWeight) > 0
        })
        if (!netWeightIsEmpty) {
            message.warning("请设置来纱净重！");
            return;
        }
        setloading(true)
        if (detailType == "add") { }
        if (detailType == "edit") {
            orderData.id = yarn_stock_detail.id;
        }

        if (orderData.bizDate == "") orderData.bizDate = getNowFormatDate();
        console.log("新增或者编辑的表单字段==", orderData)
        addYarnStock(orderData, (res) => {
            console.log(res)
            if (res.code == 200) {
                getData(data);
                message.success("保存成功！")
                setdetailType("detail");
                return;
            }
            message.error("保存失败！")
        })
    }
    //  获取子组件参数
    const save = (value) => {
        setorderData(value)
    }
    // 删除
    const delect = () => {
        confirm({
            content: '确定要删除该条数据',
            onOk() {
                deleteYarn(yarn_stock_detail.id, (res) => {
                    if (res.code == 200) {
                        getData(data)
                    }
                });
            },
            onCancel() { },
        });
    }
    // 审核
    const onAudit = () => {
        const status = yarn_stock_detail.billStatus === 1 ? 0 : 1
        changeYarnOutStockStatus(yarn_stock_detail.id, status, (res) => {
            if (res.code === 200) {
                yarn_stock_detail.billStatus === 1 ? message.success("反审核成功！") : message.success("审核成功！")

                getData(data)
            }
        })
    }
    const columns = [
        {
            title: '入库单号',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '客户',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: '日期',
            dataIndex: "bizDate",
            key: "bizDate",
            render: (beginTime) => (<span>{onlyFormat(beginTime, false)}</span>)
        },
        {
            title: '状态',
            dataIndex: 'billStatus',
            key: 'billStatus',
            render: (billStatus) => (<div>{billStatus == 1 ? <span color="green">已审核</span> : <span color="magenta">未审核</span>}</div>)
        }
    ];
    const pagination = {
        total: leftTotal,
        pageSize: size,
        current: current,
        onChange: (page, pageSize) => {
            getData({
                page: page,
                size: pageSize,
            })
        },
        showSizeChanger: false,
        showTotal: () => (`共${leftTotal}条`)
    }
    return <div className="right-container">
        {detailType === "detail" && <div className="custom">
            <div className="title">
                收纱入库
            </div>
            <div className="custom-right">
                <Button type="primary" onClick={add}>
                    +新增
                </Button>
                <Button onClick={edit}>
                    编辑
                </Button>
                <Button onClick={delect}>
                    删除
                </Button>
                <Button >
                    订单
                </Button>
                <Button disabled >
                    抽磅
                </Button>
            </div>
        </div>}
        {
            (detailType === "add" || detailType === "edit") && <div className="custom">
                <div className="title">
                    收纱入库
                </div>
                <div className="custom-right">
                    <Button type="primary" onClick={onSave}>
                        保存
                    </Button>
                    <Button onClick={cancel}>
                        取消
                    </Button>
                </div>
            </div>
        }
        <div className="inventory-container">
            <div className="left">
                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={leftData}
                    pagination={pagination}
                    rowKey={(record, index) => record.id}
                    onRow={record => {
                        return {
                            onClick: () => {
                                getYarnStockDetail(record.id)
                            },
                        };
                    }}
                />
            </div>
            <div className="right">
                {detailType === "detail" && <OrderDetail data={yarn_stock_detail} onAudit={onAudit} />}
                {detailType === "add" && <CreateOrder save={save} />}
                {detailType === "edit" && <CreateOrder data={yarn_stock_detail} save={save} />}
            </div>
        </div>
    </div>
}

export default withRouter(EnterStorage)