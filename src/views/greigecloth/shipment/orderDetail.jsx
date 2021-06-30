import { useState } from "react"
import { Table, Input, Tag, Modal } from "antd";
import { onlyFormat, requestUrl, day } from "../../../utils/config";
import { getOutStockOrderBarCode } from "../../../actons/action"
import { withRouter } from "react-router-dom";
import { connect } from "react-redux"
import "../../yarnInventory/style.css"
const { TextArea } = Input;
function OrderDetail(props) {
    document.title = "坯布出货";
    const [visible, setvisible] = useState(false);
    const enter_yarn_colums = [
        {
            title: '#',
            dataIndex: 'id',
        },
        {
            title: '生产单号',
            dataIndex: 'orderDto',
            render: (item) => (<span>{item.code ? item.code : ""}</span>),
        },
        {
            title: '合同号',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.customerBillCode ? item.customerBillCode : ""}</span>),
        },
        {
            title: '坯布编码',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.greyFabricCode ? item.greyFabricCode : ""}</span>),
            // width: 100
        },
        {
            title: '布类',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.fabricType ? item.fabricType : ""}</span>),
            // width: 200
        },
        {
            title: '纱支',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.yarnName ? item.yarnName : ""}</span>),
            // width: 160
        }, {
            title: '批次',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.yarnBatch ? item.yarnBatch : ""}</span>),
            // width: 100
        },
        {
            title: '针寸',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.inches ? item.inches : ""}-{item.needles ? item.needles : ""}</span>),
            // width: 70
        },
        {
            title: '颜色',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.customerColor ? item.customerColor : ""}</span>),
            // width: 70
        },
        {
            title: '出库条数',
            dataIndex: 'volQty',
            key: 'volQty',
            // width: 70,
            render: (item, index) => (<span onClick={() => { props.getOutStockOrderBarCode(props.data.id, index.knitOrderId); setvisible(true); }} style={{ color: "blue", cursor: "pointer" }}>{item}</span>)
        },
        {
            title: '出货重量',
            dataIndex: 'weight',
            // width: 70
        },
        {
            title: '单位',
            // width: 40,
            render: () => (<span>kg</span>)
        },
        {
            title: '加工单价',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.productPrice}</span>),
            // width: 70
        },
        {
            title: '金额',
            dataIndex: 'totalMoney',
            // width: 100,
            render: (item) => (<span>{Number(item).toFixed(2)}</span>)
        }
    ];
    const audit = () => {
        console.log(props);
        const status = props.data.billStatus === 0 ? 1 : 0
        fetch(requestUrl + "/api-stock/fabricStockIo/updateStatus?id=" + props.data.id + "&status=" + status, {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
            }
        })
            .then(res => { return res.json() })
            .then(res => {
                if (res.code === 200) {
                    props.update()
                }
            })
    }
    const onCancel = () => {
        setvisible(false)
    }
    return <div className="right">
        <div className="detail-title">
            {props.data.billStatus === 0 && <span style={{ marginRight: "10px" }}>未审核</span>}
            {props.data.billStatus === 1 && <span style={{ marginRight: "10px" }}>已审核</span>}
            <Tag onClick={audit}>{props.data.billStatus === 1 ? "反审核" : "审核"}</Tag>
        </div>
        <div className="detail-basicData">
            <div className="row">
                <div className="col">
                    <div className="label">出库单号</div>
                    <Input disabled value={props.data.code} />
                </div>
                <div className="col">
                    <div className="label">客户</div>
                    <Input disabled value={props.data.customerName} />
                </div>
                <div className="col">
                    <div className="label">收货方</div>
                    <Input disabled value={props.data.address} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="label">出库时间</div>
                    <Input disabled value={onlyFormat(props.data.bizDate, false)} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="label1">备注</div>
                    <TextArea disabled autoSize={{ minRows: 2, maxRows: 6 }} value={props.data.remark} />
                </div>
            </div>
        </div>
        <div className="enter-yarn-table">
            <Table
                columns={enter_yarn_colums}
                dataSource={props.data.fabricStockIoDtls}
                pagination={false}
                rowKey={(record, index) => record.id}
            />
        </div>
        <Modal
            title="条码明细"
            visible={visible}
            footer={false}
            onCancel={onCancel}
        >
            <Table
                columns={[{
                    title: "#",
                    dataIndex: "id"
                }, {
                    title: "条码",
                    dataIndex: "barcode"
                }, {
                    title: "匹号",
                    dataIndex: "seq"
                }, {
                    title: "重量",
                    dataIndex: "weight"
                }, {
                    title: "出库时间",
                    dataIndex: "outStockTime",
                    render: (time) => (<span>{day(time)}</span>)
                }, {
                    title: "查布记录",
                    dataIndex: "flawInfo"
                }]}
                dataSource={props.barCodeData}
                pagination={false}
            />
        </Modal>
    </div>
}
const mapStateToProps = (state) => {
    return {
        barCodeData: state.outStockOrderBarCode_listReducer.outStockOrderBarCode || []
    }
}
export default connect(mapStateToProps, { getOutStockOrderBarCode })(withRouter(OrderDetail))