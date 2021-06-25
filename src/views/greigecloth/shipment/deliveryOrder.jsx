/*
 * @Author: 1638877065@qq.com
 * @Date: 2021-06-11 10:22:41
 * @LastEditTime: 2021-06-25 19:23:04
 * @LastEditors: 1638877065@qq.com
 * @Description: 细码打印
 * @FilePath: \cloud-admin\src\views\greigecloth\shipment\deliveryOrder.jsx
 * 
 */
import React, { useState, useRef, useEffect } from "react";
import { newOrderType, onlyFormat, sliceArrFn, sum } from "../../../utils/config"
import { Modal, Button } from "antd";
import ReactToPrint from 'react-to-print';
function DeliveryOrder(props) {
    console.log(props);
    const [visible, setvisible] = useState(true);
    const [pages, setpages] = useState(0)
    var str = 0
    const componentRef = useRef();
    useEffect(() => {
        // 统计页数
        var index = 0;
        props.deliveryOrder.orderList.map((item) => {
            item.loomList.map((items) => {
                index += sliceArrFn(items.barcodeList, 100).length;
            })
        })
        setpages(index)
    }, [])
    return <React.Fragment>
        <Modal
            width={1000}
            visible={visible}
            onCancel={() => { setvisible(false); props.modalState(false) }}
            footer={null}
            title="出库单"
        >
            <div ref={componentRef} className="outStockOrder">
                {
                    // 生产单

                    props.deliveryOrder.orderList.map((item, key) => {
                        return <div>
                            {
                                item.loomList.map((items, ids) => {
                                    return <div>
                                        {
                                            sliceArrFn(items.barcodeList, 100).map((itemss, indss) => {
                                                return <div className="delivery-order">
                                                    <div className="o-title">{props.deliveryOrder.company.name}出货单</div>
                                                    <div className="o-subtitle">
                                                        <div className="o-page">第{++str}页 共{pages}页</div>
                                                        <div className="o-address-info">{props.deliveryOrder.company.address} {props.deliveryOrder.company.contactAddress}  Tel：{props.deliveryOrder.company.contactPerson}  {props.deliveryOrder.company.contactPhone}</div>
                                                        <div>出货单号：{props.deliveryOrder.code}</div>
                                                    </div>
                                                    <div className="o-base-datta">
                                                        <div className="ob-row">
                                                            <div>客户：{props.deliveryOrder.customerName}</div>
                                                            <div>日期：{onlyFormat(props.deliveryOrder.bizDate, false)}</div>
                                                            <div>客户单号：{item.customerBillCode}</div>
                                                            <div>坯布编码：{item.greyFabricCode}</div>
                                                        </div>
                                                        <div className="ob-row">
                                                            <div>布类：{item.fabricType}</div>
                                                            <div>机号：{items.loomCode}</div>
                                                            <div>针寸：{item.needles}G-{item.inches}°</div>
                                                            <div></div>
                                                        </div>
                                                        <div className="ob-row">
                                                            纱别：{item.yarnInfo}
                                                            <p>{newOrderType[item.type].name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="o-barcode">
                                                        {
                                                            sliceArrFn(itemss, 8).map((barItem, index) => {
                                                                return <div className="o-col">
                                                                    <div className="col-title">{
                                                                        indss > 0 ? indss * 10 + index + 1 : index + 1
                                                                    }</div>
                                                                    {
                                                                        barItem.map((bar, barIndex) => {
                                                                            return <div className="col-row">
                                                                                <div>{
                                                                                    indss > 0 ? indss * 100 + index * 10 + barIndex + 1 : (index > 0 ? index * 10 + barIndex + 1 : barIndex + 1)

                                                                                }</div>
                                                                                <div>{bar.weight}</div>
                                                                            </div>
                                                                        })
                                                                    }
                                                                </div>
                                                            })
                                                        }
                                                    </div>
                                                    <div className="o-col-total">
                                                        {
                                                            sliceArrFn(itemss, 8).map((barItem, index) => {
                                                                return <div className="total-item">{sum(barItem)}</div>
                                                            })
                                                        }
                                                    </div>
                                                    <div className="o-footer-total">
                                                        <div>
                                                            <div className="o-barTotal">
                                                                共计{items.totalVolQty}条
                                                            </div>
                                                            <div className="o-weightTotal">
                                                                重量：{items.totalWeight}kg
                                                            </div>
                                                        </div>
                                                        <div className="o-remark">备注：中深色</div>
                                                        <div className="o-accept">签收及盖章</div>
                                                    </div>
                                                    <div className="o-note">
                                                        <span>备注:收货时请核对规格、数量，如有质量问题，请于7天内书面通知复核，一经裁剪，恕不负责。</span>
                                                        <span>制表：数织通</span>
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                })
                            }
                        </div>
                    })
                }
            </div>
            <div className="footer-btn">
                <ReactToPrint trigger={() => <Button onClick={() => { props.modalState(false) }}>打印</Button>} content={() => componentRef.current} />
            </div>
        </Modal>
    </React.Fragment>
}


export default DeliveryOrder