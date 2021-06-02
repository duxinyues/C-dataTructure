import { useEffect, useState, } from "react"
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
    const [customerId, setcustomerId] = useState("");
    const [bizDate, setbizDate] = useState("");
    const [billType, setbillType] = useState(0);
    const [remark, setremark] = useState("")
    const [yarn_stock_detail, setyarn_stock_detail] = useState({});
    const [customer, setcustomer] = useState([])
    useEffect(() => {
        getCustomer()
        if (props.data) {
            setyarn_stock_detail(props.data);
            setcustomerId(props.data.customerId);
            setbizDate(props.data.bizDate);
            setbillType(props.data.billType);
            setremark(props.data.remark);
        }
    }, []);

    // 选择客户
    const selectcustomer = (value) => {
        setcustomerId(value)
        props.save({
            customerId: value,
            bizDate: bizDate,
            billType: billType,
            remark: remark,
        })
    }
    // 选择入库日期
    const selectDate = (date, dateString) => {
        setbizDate(dateString)
        props.save({
            customerId: customerId,
            bizDate: dateString,
            billType: billType,
            remark: remark,
        })
    }
    // 保存备注
    const saveremark = ({ target: { value } }) => {
        setremark(value)
        props.save({
            customerId: customerId,
            bizDate: bizDate,
            billType: billType,
            remark: value,
        })
    }
    const enter_yarn_colums = [
        {
            title: '纱别',
            dataIndex: 'yarnName',
            key: 'yarnName',
        },
        {
            title: '纱牌/纱批',
            dataIndex: 'yarnBrandBatch',
            key: 'yarnBrandBatch',
        },
        {
            title: '色号',
            dataIndex: "colorCode",
            key: "colorCode",
        },
        {
            title: '客户单号',
            dataIndex: 'customerCode',
            key: 'customerCode',
        }, {
            title: '件数',
            dataIndex: 'pcs',
            key: 'pcs',
        },
        {
            title: '规格',
            dataIndex: 'spec',
            key: 'spec',
        },
        {
            title: '来纱净重',
            dataIndex: 'netWeight',
            key: 'netWeight',
        },
        {
            title: '欠重',
            dataIndex: 'lackWeight',
            key: 'lackWeight',
        },
        {
            title: '总欠重',
            dataIndex: 'totalLackWeight',
            key: 'totalLackWeight',
        },
        {
            title: '实收净重',
            dataIndex: 'weight',
            key: 'weight',
        }
    ];

    const getCustomer = () => {
        fetch(requestUrl + "/api-stock/stockCommon/findCustomerDown?companyId=1", {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            },
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log(res)
                if (res.code == 200) {
                    setcustomer(res.data)
                }
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
                        <Select onChange={selectcustomer} value={yarn_stock_detail.customerName}>
                            {
                                customer.map((item, key) => (<Option value={item.id} key={key}>{item.name}</Option>))
                            }
                        </Select>
                    </div>
                    <div className="col">
                        <div className="label">收货方</div>
                        <Input />
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
                        <TextArea autoSize={{ minRows: 2, maxRows: 6 }} value={yarn_stock_detail.remark} onChange={saveremark} />
                    </div>
                </div>
            </div>
            <div className="enter-yarn-table">
                <Table
                    columns={enter_yarn_colums}
                    dataSource={yarn_stock_detail.inDtls}
                    pagination={false}
                    summary={pageData => {
                        if (pageData.length == 0) return;
                        let pcsTotal = 0;
                        let netWeight = 0;
                        let lackWeight = 0;
                        let totalLackWeight = 0;
                        let weight = 0;
                        pageData.forEach((borrow) => {
                            pcsTotal += borrow.pcs;
                            netWeight += borrow.netWeight;
                            lackWeight += borrow.lackWeight;
                            totalLackWeight += borrow.totalLackWeight;
                            weight += borrow.weight;
                            totalLackWeight += borrow.totalLackWeight
                        });
                        return (
                            <>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell></Table.Summary.Cell>
                                    <Table.Summary.Cell></Table.Summary.Cell>
                                    <Table.Summary.Cell></Table.Summary.Cell>
                                    <Table.Summary.Cell>合计：</Table.Summary.Cell>
                                    <Table.Summary.Cell>{pcsTotal}</Table.Summary.Cell>
                                    <Table.Summary.Cell></Table.Summary.Cell>
                                    <Table.Summary.Cell>{netWeight}</Table.Summary.Cell>
                                    <Table.Summary.Cell>{lackWeight}</Table.Summary.Cell>
                                    <Table.Summary.Cell>{totalLackWeight}</Table.Summary.Cell>
                                    <Table.Summary.Cell>{weight}</Table.Summary.Cell>
                                </Table.Summary.Row>
                            </>
                        );
                    }}
                />
            </div>
        </div>
    </div>
}

export default withRouter(CreateEnterStockOrder)