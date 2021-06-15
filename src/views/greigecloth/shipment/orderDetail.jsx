import { useState } from "react"
import { Table, Input, Tag, } from "antd";
import { onlyFormat } from "../../../utils/config";
import { withRouter } from "react-router-dom";
import "../../yarnInventory/style.css"

const { TextArea } = Input;
document.title = "坯布出货"
function OrderDetail(props) {
    console.log(props)
    const [disable, setdisable] = useState(true);
    const enter_yarn_colums = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '生产单号',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.code ? item.code : ""}</span>),
            width: 130
        },
        {
            title: '客户单号',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.customerBillCode ? item.customerBillCode : ""}</span>),
            width: 130
        },
        {
            title: '坯布编码',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.greyFabricCode ? item.greyFabricCode : ""}</span>),
            width: 130
        },
        {
            title: '布类',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.fabricType ? item.fabricType : ""}</span>),
            width: 130
        },
        {
            title: '纱别',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.yarnName ? item.yarnName : ""}</span>),
            width: 130
        },
        {
            title: '针寸',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.inches ? item.inches : ""}</span>),
            width: 70
        },
        {
            title: '客户颜色',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.customerColor ? item.customerColor : ""}</span>),
            width: 70
        },
        {
            title: '出货卷数',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.volQty ? item.volQty : ""}</span>),
            width: 70
        },
        {
            title: '出货重量',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.weight ? item.weight : ""}</span>),
            width: 70
        },
        {
            title: '单位',
            width: 40,
            render:()=>(<span>kg</span>)
        },
        {
            title: '加工单价',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.productPrice}</span>),
            width: 70
        },
        {
            title: '金额',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.totalMoney}</span>),
            width: 130
        }
    ];
    return <div className="right">
        <div className="detail-title">
            <Tag>审核</Tag>
        </div>
        <div className="detail-basicData">
            <div className="row">
                <div className="col">
                    <div className="label">出库单号</div>
                    <Input disabled={disable} value={props.data.code} />
                </div>
                <div className="col">
                    <div className="label">客户</div>
                    <Input disabled={disable} value={props.data.customerName} />
                </div>
                <div className="col">
                    <div className="label">收货方</div>
                    <Input disabled={disable} value={props.data.address} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="label">出库时间</div>
                    <Input disabled={disable} value={onlyFormat(props.data.bizDate, true)} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="label1">备注</div>
                    <TextArea disabled={disable} autoSize={{ minRows: 2, maxRows: 6 }} value={props.data.remark} />
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
    </div>
}

export default withRouter(OrderDetail)