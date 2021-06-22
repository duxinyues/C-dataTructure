/*
 * @FileName: 
 * @Author: 1638877065@qq.com
 * @Date: 2021-06-10 21:55:30
 * @LastEditors: 1638877065@qq.com
 * @LastEditTime: 2021-06-22 09:18:20
 * @FilePath: \cloud-admin\src\views\production\order\addYarnInfo.jsx
 * @Description: 
 */
import React, { useState, useEffect } from "react";
import { PlusCircleOutlined, MinusCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { message, Input } from "antd";
function AddYarnInfo(props) {
    const [refresh, setRefresh] = useState(false);
    const [tableHead, settableHead] = useState([
        {
            title: '纱别',
            dataIndex: 'yarnName',
        },
        {
            title: '纱牌/纱批',
            dataIndex: 'yarnBrandBatch',
        },
        {
            title: '纱比%',
            dataIndex: 'rate',
        },
        {
            title: '织损%',
            dataIndex: 'knitWastage',
        },
        {
            title: '计划用量',
            dataIndex: 'planWeight',
        }]); //表头
    const [addIndex, setaddIndex] = useState(2); // 数组新增元素的位置
    const [tableBody, settableBody] = useState([]);
    const [addRow, setaddRow] = useState([1, 2, 3, 4, 5]);
    const [mouseEnterRow, setmouseEnterRow] = useState();
    props.saveValue(90); // 向父组件传递参数

    useEffect(() => {
        refresh && setTimeout(() => setRefresh(false))
    }, [refresh])
    const addHead = () => {
        const _tableHead = tableHead;
        const _addRow = addRow;
        if (addIndex > 5) { message.success("最多只能添加5组纱批"); return; }

        _tableHead.splice(addIndex, 0, {
            title: '纱牌/纱批' + addIndex,
            dataIndex: 'yarnBrandBatch' + addIndex,
        });
        _addRow.splice(addIndex, 0, 1)
        settableHead(_tableHead);
        setaddRow(_addRow);
        setaddIndex(addIndex + 1);
    }
    const subHead = (item) => {
        const _tableHead = tableHead;
        const _addRow = addRow;
        const subIndex = tableHead.indexOf(item);
        _tableHead.splice(subIndex, 1);
        _addRow.splice(subIndex, 1)
        settableHead(_tableHead);
        setaddRow(_addRow);
        setaddIndex(subIndex);
        setRefresh(true);
    }
    const addRowBtn = () => {
        const tableRow = tableBody;
        tableRow.push(1);
        settableBody(tableRow);
        setRefresh(true);
    }
    const mouseEnter = (index) => {
        console.log(index);
        setmouseEnterRow(index)
    }
    return <React.Fragment>
        <span>用料信息<PlusCircleOutlined onClick={addRowBtn} style={{ color: "#2db7f5" }} /></span>
        <div className="tableHead">
            {
                tableHead.map((item, key) => {
                    if (item.dataIndex === "yarnBrandBatch2" || item.dataIndex === "yarnBrandBatch3" || item.dataIndex === "yarnBrandBatch4" || item.dataIndex === "yarnBrandBatch5") {
                        return <div className="table-td" key={key}>{item.title}<MinusCircleOutlined onClick={() => {
                            subHead(item);
                        }} style={{ color: "#2db7f5" }} /></div>
                    }
                    if (item.dataIndex === "yarnBrandBatch") {
                        return <div className="table-td" key={key}>{item.title}<PlusCircleOutlined onClick={addHead} style={{ color: "#2db7f5" }} /></div>
                    } else {
                        return <div className="table-td" key={key}>{item.title}</div>
                    }
                })
            }
        </div>
        <div className="tableBody">
            {
                tableBody.map((item, key) => {
                    console.log(item)
                    // 根据key的大小判断添加多少条数据
                    return <div className="table-tr" key={key} onMouseEnter={() => { mouseEnter(key) }}>
                        {mouseEnterRow == key && <CloseOutlined />}
                        {
                            addRow.map((ites, inds) => <div className="table-cel" key={inds}>
                                {/* 根据inds判断添加多少列 */}
                                {/* 根据key和inds判断编辑第几个数据 */}
                                <Input placeholder={key + "??=" + inds} />
                            </div>)
                        }
                    </div>
                })
            }
        </div>
    </React.Fragment>
}

export default AddYarnInfo