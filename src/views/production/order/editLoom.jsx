import React ,{useState}from "react";
import { EditableProTable } from '@ant-design/pro-table';
function EditLoom(props) {
    const defaultData=props.loomData
    const [editableKeysloom, setEditableRowKeysloom] = useState(() =>
    defaultData.map((item) => item.id))
    const [loomData, setloomData] = useState(defaultData)
    const loomColumns = [
        {
            title: '机号',
            key: 'loomId',
            dataIndex: 'loomId',
            valueType: 'select',
            valueEnum: props.loom
        },
        {
            title: "卷数",
            dataIndex: "volQty"
        }, {
            title: '操作',
            valueType: 'option',
            render: () => {
                return null;
            },
        },
    ]
    return <EditableProTable
        columns={loomColumns}
        rowKey="id"
        value={loomData}
        onChange={(value) => {
            console.log("====", value)
        }}
        recordCreatorProps={{
            newRecordType: 'dataSource',
        }}
        editable={{
            type: 'multiple',
            editableKeysloom,
            actionRender: (row, config, defaultDoms) => {
                return [defaultDoms.delete];
            },
            onValuesChange: (record, recordList) => {
                console.log("编辑行数据==", recordList)
            },
            onChange: setEditableRowKeysloom,
        }}
    />
}

export default EditLoom