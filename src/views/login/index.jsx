import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, Checkbox, message, Tabs, Spin } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { connect } from "react-redux"
import { fakeAuth } from '../../utils/fakeAuth'
import { login } from "../../actons/action"
import { requestUrl } from "../../utils/config"
import './index.css';
import Footer from "../../components/Footer/index"
import img from "../../utils/imgManger"
const { TabPane } = Tabs;
const NormalLoginForm = (props) => {
  const [spinning, setspinning] = useState(false)
  const onFinish = (params) => {
    console.log("登录==", params);
    setspinning(true)
    fetch(requestUrl + `/api-uaa/oauth/token?username=${params.username}&password=${params.password}&grant_type=password&scope=app&client_id=webApp&client_secret=webApp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      return res.json()
    }).then((res) => {
      console.log("登录", res)
      if (res.code === 200) {
        fakeAuth.setToken(res.data.access_token);
        setspinning(false);
        props.history.push('/home');
        message.success('登陆成功', 1);
        return;
      }
      message.error("登录失败请重新登录！")
    }).catch((err) => console.log(err))
  };
  const callback = (key) => {
    console.log(key)
  }
  return (
    <div className="container">
      <Spin spinning={spinning} tip="正在登录...">
        <div className="login-form">
          <div className="title">
            <img src={img.logo} className="logo-img" />
            <span>数织通</span>
          </div>
          {/* <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="账户密码登录" key="1"> */}
          <Form
            name="normal_login"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码!',
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>
            <Form.Item className="row">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>自动登录</Checkbox>
              </Form.Item>

              <a className="login-form-forgot" href="">
                忘记密码
              </a>
            </Form.Item>
            <Form.Item className="btn">
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
          {/* </TabPane> */}
          {/* <TabPane tab="手机登录" key="2">
              <Form
                name="normal_login"
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
              >
                <Form.Item
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: '请输入手机号码!',
                    },
                  ]}
                >
                  <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="手机号码" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: '请输入密码!',
                    },
                  ]}
                >
                  <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="密码"
                  />
                </Form.Item>
                <Form.Item className="row">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>自动登录</Checkbox>
                  </Form.Item>

                  <a className="login-form-forgot" href="">
                    忘记密码
                  </a>
                </Form.Item>
                <Form.Item className="btn">
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs> */}
        </div>

      </Spin>
      <Footer />
    </div>
  );
};

const mapStateToProps = state => {
  console.log(state.loginReducer.tokenInfor)
  return { tokenData: state.loginReducer.tokenInfor }
};

export default connect(mapStateToProps, { login })(withRouter(NormalLoginForm));