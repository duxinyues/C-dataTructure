import { useEffect, useLayoutEffect, useState, } from "react"
import { Table, Input, Select, DatePicker } from "antd";
import { requestUrl } from "../../../utils/config";
import { withRouter } from "react-router-dom";
import 'moment/locale/zh-cn';
import moment from "moment"
import locale from 'antd/es/date-picker/locale/zh_CN';
import "../../yarnInventory/style.css"
const { TextArea } = Input;
const { Option } = Select;
document.title = "新增入库单"
function CreateEnterStockOrder(props) {
    console.log("props=======", props)
    const [bizDate, setbizDate] = useState("");
    const [remark, setremark] = useState("");
    const [address, setaddress] = useState("");

    useEffect(() => {
        if (props.data) {
            setbizDate(props.data.bizDate);
            setremark(props.data.remark);
        }
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
        console.log(value)
        setaddress(value);
        props.save({
            bizDate: bizDate,
            remark: remark,
            address: value
        })
    }
    const today = moment();
    return <div className="right">
        <div className="add-content">
            <div className="detail-title">
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
                        <TextArea autoSize={{ minRows: 2, maxRows: 6 }} value={props.data.remark} onChange={saveremark} />
                    </div>
                </div>
            </div>
            <div className="enter-yarn-table">
                <Table
                    columns={[
                        { title: "生产单号", width: 130, dataIndex: "knitOrderCode" },
                        { title: "客户单号", width: 130, dataIndex: "customerBillCode" },
                        { title: "坯布编码", width: 130, dataIndex: "greyFabricCode" },
                        { title: "布类", width: 130, dataIndex: "fabricType" },
                        { title: "纱别", width: 130 ,dataIndex:"yarnInfo"},
                        { title: "针寸", width: 70 ,dataIndex:"inches"},
                        { title: "客户颜色", width: 70  ,dataIndex:"customerCode"},
                        { title: "出货卷数", width: 70 ,dataIndex:"volQty"},
                        { title: "出货重量", width: 70 ,dataIndex:"weight"},
                        { title: "单位", width: 40,render:()=>(<span>kg</span>) },
                        { title: "加工单价", width: 70 ,dataIndex:"weight"},
                        { title: "金额", width: 130 ,dataIndex:"weight"},
                    ]}
                    dataSource={props.fabricStockIoDtls}
                    pagination={false}

                />
            </div>
        </div>
    </div>
}

export default withRouter(CreateEnterStockOrder)