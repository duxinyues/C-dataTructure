import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { fakeAuth } from "../../utils/fakeAuth";
import { Avatar, Menu, Dropdown, Input, Space, Badge } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import { getCompanyList, switchConpany } from "../../api/apiModule";
import './index.css';
import img from "../../utils/imgManger"
const { Search } = Input
const { SubMenu } = Menu;
function Avatars(props) {
  console.log("props==", props)
  const [company, setCompany] = useState([])
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
  const menu = (
    <Menu>
      {
        props.user.id === 1 && <SubMenu title="切换公司">
          {
            company.map((item) => (<Menu.Item onClick={() => { switchs(item.id) }}>{item.name}</Menu.Item>))
          }
        </SubMenu>
      }
      {/* <Menu.Item>
        <Link to="/user">
          <span className="label">个人设置</span>
        </Link>
      </Menu.Item> */}
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
    </div>
  )
}
const mapStateToProps = (state) => {
  return {
    user: state.userInfoReducer.userData
  }
}

export default connect(mapStateToProps)(withRouter(Avatars));