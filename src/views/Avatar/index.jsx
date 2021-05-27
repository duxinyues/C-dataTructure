import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { fakeAuth } from "../../utils/fakeAuth";
import { Avatar, Menu, Dropdown } from 'antd';
import { connect } from "react-redux"
import './index.css';
function Avatars(props) {
  const [headImgUrl, setheadImgUrl] = useState(props.user.headImgUrl)
  const _logout = () => {
    fakeAuth.signout();
    props.history.push('/login');
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
    </div>
  )
}
const mapStateToProps = (state) => {
  return {
    user: state.userData.userData
  }
}
export default connect(mapStateToProps)(withRouter(Avatars));