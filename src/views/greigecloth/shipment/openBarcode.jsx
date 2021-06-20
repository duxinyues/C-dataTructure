/*
 * @FileName: 
 * @Author: 1638877065@qq.com
 * @Date: 2021-06-19 14:31:01
 * @LastEditors: 1638877065@qq.com
 * @LastEditTime: 2021-06-19 16:05:48
 * @FilePath: \cloud-admin\src\views\greigecloth\shipment\openBarcode.jsx
 * @Description: 展示所选的条码、编辑
 */

import React, { useEffect, useState } from "react";
import { Modal, Table } from "antd";
import { day } from "../../../utils/config"
function OpenBarcode(props) {
    console.log(props)
    const [visible, setvisible] = useState(false);
    const [selected, setselected] = useState([]);
    const [barcode, setbarcode] = useState([]);
    useEffect(() => {
        setvisible(props.isOpen)
    }, []);

    const onCancel = () => {
        setvisible(false)
    }
    const rowSelection_modal = {
        selectedRowKeys: selected,
        onChange: (_selectedRowKeys, _selectedRows) => {
            console.log(_selectedRows);
            setselected(_selectedRowKeys);
            setbarcode(_selectedRows)
        },
    };
    const selectBarcode = () => {
        props.editSelectBarcode({
            data:barcode,
            open:false
        });
        setvisible(false);
    }
    return <Modal
        title="条码明细"
        visible={visible}
        onCancel={onCancel}
        okText="取消入库"
        cancelText="关闭"
        onOk={selectBarcode}
    >
        <Table
            columns={[
                { title: "条码", dataIndex: "barcode" },
                { title: "疋号", dataIndex: "seq" },
                { title: "入库重量", dataIndex: "weight" },
                { title: "入库日期", dataIndex: "inStockTime", render: (time) => (<span>{day(time)}</span>) },
                { title: "查布记录", dataIndex: "" }
            ]}
            dataSource={props.data}
            rowSelection={rowSelection_modal}
            rowKey={(record, index) => record.id}
            pagination={false}
        />
    </Modal>
}

export default OpenBarcode