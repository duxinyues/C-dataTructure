import { useEffect, useState, } from "react"
import { Table, Input, DatePicker, Radio } from "antd";
import { PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { requestUrl } from "../../../utils/config";
import { withRouter } from "react-router-dom";
import 'moment/locale/zh-cn';
import moment from "moment"
import locale from 'antd/es/date-picker/locale/zh_CN';
import "../../yarnInventory/style.css"
const { TextArea } = Input;
function EditEnterStockOrder(props) {
    document.title = "编辑入库单";
    console.log("入库单详情", props);
    const _fabricStockIoDtls = props.data.fabricStockIoDtls
    const [bizDate, setbizDate] = useState("");
    const [remark, setremark] = useState("");
    const [address, setaddress] = useState("");
    // const [fabricStockIoDtls, setfabricStockIoDtls] = useState([])
    useEffect(() => {
        if (props.data) {
            setbizDate(props.data.bizDate);
            setremark(props.data.remark);
        }
        _fabricStockIoDtls.map((item)=>{
            item.summoney = (item.orderDto.productPrice * item.orderDto.weight).toFixed(2)
        })
        // setfabricStockIoDtls(_fabricStockIoDtls)

    }, []);

    // 选择入库日期
    const selectDate = (date, dateString) => {
        setbizDate(dateString)
        props.save({
            bizDate: dateString,
            remark: remark,
            address: address
        })
    }
    // 保存备注
    const saveremark = ({ target: { value } }) => {
        setremark(value)
        props.save({
            bizDate: bizDate,
            remark: value,
            address: address
        })
    }
    // 保存地址
    const saveAddress = ({ target: { value } }) => {
        setaddress(value);
        props.save({
            bizDate: bizDate,
            remark: remark,
            address: value
        })
    }
    const today = moment();
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            name: record.name,
        }),
    };
    const columns = [
        { title: "生产单号", width: 130, dataIndex: "orderDto", render: (orderDto) => (<span>{orderDto.code}</span>) },
        { title: "客户单号", width: 130, dataIndex: "orderDto", render: (orderDto) => (<span>{orderDto.customerBillCode}</span>) },
        { title: "坯布编码", width: 130, dataIndex: "orderDto", render: (orderDto) => (<span>{orderDto.greyFabricCode}</span>) },
        { title: "布类", width: 130, dataIndex: "orderDto", render: (orderDto) => (<span>{orderDto.fabricType}</span>) },
        { title: "纱别", width: 130, dataIndex: "orderDto", render: (orderDto) => (<span>{orderDto.yarnName}</span>) },
        { title: "针寸", width: 70, dataIndex: "orderDto", render: (orderDto) => (<span>{orderDto.inches}</span>) },
        { title: "客户颜色", width: 70, dataIndex: "orderDto", render: (orderDto) => (<span>{orderDto.customerCode}</span>) },
        { title: "出货卷数", width: 70, dataIndex: "volQty" },
        { title: "出货重量", width: 70, dataIndex: "orderDto", render: (orderDto) => (<span>{orderDto.weight}</span>) },
        { title: "单位", width: 40, render: () => (<span>kg</span>) },
        { title: "加工单价", width: 70, dataIndex: "orderDto", render: (orderDto) => (<span>{orderDto.productPrice}</span>) },
        { title: "金额", width: 130, dataIndex: "summoney"}]
    return <div className="right">
        <div className="add-content">
            <div className="detail-title">
                {props.data.billStatus === 0 ? <span style={{ marginRight: "10px" }}>未审核</span> : <span style={{ marginRight: "10px" }}>已审核</span>}
            </div>
            <div className="detail-basicData">
                <div className="row">
                    <div className="col">
                        <div className="label">入库单号</div>
                        <Input disabled placeholder="保存自动生成" />
                    </div>
                    <div className="col">
                        <div className="label13">客户</div>
                        <Input disabled value={props.data.customerName} />
                    </div>
                    <div className="col">
                        <div className="label">收货方</div>
                        <Input onChange={saveAddress} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="label12">出货时间</div>
                        <DatePicker onChange={selectDate} locale={locale} defaultValue={moment(today)}
                            showToday />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="label1">备注</div>
                        <TextArea autoSize={{ minRows: 2, maxRows: 6 }} defaultValue={props.data.remark} onChange={saveremark} />
                    </div>
                </div>
            </div>
            <div className="enter-yarn-table">
                <div className="">
                    <PlusCircleOutlined style={{ fontSize: '20px', marginRight: "10px" }} />
                    <CloseCircleOutlined style={{ fontSize: '20px' }} />
                </div>
                <Table
                    rowSelection={{
                        type: "checkbox",
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={props.data.fabricStockIoDtls}
                    pagination={false}
                    rowKey={(record, index) => record.id}
                />
            </div>
        </div>
    </div>
}

export default withRouter(EditEnterStockOrder)