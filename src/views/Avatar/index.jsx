import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { fakeAuth } from "../../utils/fakeAuth";
import { Avatar, Menu, Dropdown, Input, Space, Badge, Modal, Form, Button, message } from 'antd';
import { connect } from "react-redux";
import { getCompanyList, switchConpany, changePassword } from "../../api/apiModule";
import './index.css';
import img from "../../utils/imgManger"
const { Search } = Input
const { SubMenu } = Menu;
function Avatars(props) {
  console.log("props==", props)
  const [company, setCompany] = useState([]);
  const [visible, setvisible] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    getCompanyList((res) => {
      setCompany([...res])
    })
  }, [])
  const _logout = () => {
    fakeAuth.signout();
    props.history.push('/login');
  }
  const onSearch = (value) => {
    console.log(value)
  }
  const switchs = (id) => {
    switchConpany(id, props.user.id, (res) => {
      console.log(res)
      if (res.code === 200) {
        window.location.reload()
      }
    })
  }
  const onCancel = () => {
    setvisible(false)
  }
  const openModal = () => {
    setvisible(true)
  }
  const handleOk = async () => {
    const value = await form.validateFields();
    value.id = props.user.id
    console.log("dhfbsejdr", value)
    changePassword(value, (res) => {
      if (res.code === 200) {
        message.success("密码修改成功！")
        fakeAuth.signout();
        props.history.push('/login');
        setvisible(false)
        return;
      }
      message.error("密码修改失败！");
      setvisible(false)
    })
  }
  const menu = (
    <Menu>
      {
        props.user.id === 1 && <SubMenu title="切换公司">
          {
            company.map((item) => (<Menu.Item onClick={() => { switchs(item.id) }}>{item.name}</Menu.Item>))
          }
        </SubMenu>
      }
      <Menu.Item>
        <span className="label" onClick={openModal}>修改密码</span>
      </Menu.Item>
      <Menu.Item>
        <div>
          <span className="label" onClick={_logout}>退出登录</span>
        </div>
      </Menu.Item>
    </Menu>
  );
  return (
    <div className="userInfo">
      <Space>
        <Search onSearch={onSearch} />
        <div className="msg-box">
          <Badge>
            <img src={img.msg} className="msg" alt="消息提示" />
          </Badge>
        </div>
        <Dropdown overlay={menu} placement="bottomCenter" className="dropMenu">
          <Avatar
            style={{
              color: '#f56a00',
              backgroundColor: '#fde3cf',
            }}
            size="large"
          // src={props.user.headImgUrl}
          >
          </Avatar>
        </Dropdown>
        <span>{props.user.nickname}</span>
      </Space>
      <Modal
        className="customModal user-center"
        destroyOnClose={true}
        title={'修改密码'}
        visible={visible}
        footer={[
          // <span className="modalFooterBtn">{editType === 2 && ""}{editType === 1 && "保存编辑"}</span>,
          <Button key="submit" type="primary" onClick={handleOk} >
            保存
          </Button>,
          <Button onClick={onCancel}>
            取消
          </Button>
        ]}
        onCancel={onCancel}
      >
        <Form
          // {...layout}
          form={form}
          layout="horizontal"
          name="form_in_modal"
          preserve={false}
        >
          <Form.Item label="旧密码" name="oldPassword" rules={[{ required: true, message: '请输入密码!' }]}>
            <Input type="password" />
          </Form.Item>
          <Form.Item label="新密码" name="newPassword" rules={[{ required: true, message: '请输入新密码!' }]}>
            <Input type="password" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
const mapStateToProps = (state) => {
  return {
    user: state.userInfoReducer.userData
  }
}

export default connect(mapStateToProps)(withRouter(Avatars));