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
    console.log(props)
    const [bizDate, setbizDate] = useState("");
    const [remark, setremark] = useState("")
    const [address, setaddress] = useState("")
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
                        { title: "#" },
                        { title: "生产单号" },
                        { title: "客户单号" },
                        { title: "坯布编码" },
                        { title: "布类" },
                        { title: "纱别" },
                        { title: "针寸" },
                        { title: "客户颜色" },
                        { title: "出货卷数" },
                        { title: "出货重量" },
                        { title: "单位" },
                        { title: "加工单价" },
                        { title: "金额" },
                    ]}
                    dataSource={[]}
                    pagination={false}

                />
            </div>
        </div>
    </div>
}

export default withRouter(CreateEnterStockOrder)