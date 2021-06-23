import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { fakeAuth } from "../../utils/fakeAuth";
import { Avatar, Menu, Dropdown, Input, Space, Badge } from 'antd';
import { connect } from "react-redux";
import './index.css';
import img from "../../utils/imgManger"
const { Search } = Input
function Avatars(props) {
  const _logout = () => {
    fakeAuth.signout();
    props.history.push('/login');
  }
  const onSearch = (value) => {
    console.log(value)
  }
  const menu = (
    <Menu>
      <Menu.Item>
        <Link to="/">
          <span className="label">个人中心</span>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/user">
          <span className="label">个人设置</span>
        </Link>
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
            src={props.user.headImgUrl}
          >
          </Avatar>
        </Dropdown>
        <span>{props.user.nickname}</span>
      </Space>
    </div>
  )
}
const mapStateToProps = (state) => {
  return {
    user: state.userInfoReducer.userData
  }
}

export default connect(mapStateToProps)(withRouter(Avatars));