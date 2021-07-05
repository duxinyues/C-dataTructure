import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Layout, Menu, message } from 'antd';
import { connect } from "react-redux";
import { USER_INFO } from "../../actons/type";
import { getUserInfo } from "../../api/apiModule"
import { fakeAuth } from "../../utils/fakeAuth";
import './index.css';
import logo from "../../assets/img/logo1.png";
const { Sider } = Layout;
const { SubMenu } = Menu;
function SiderNav(props) {
    const history = useHistory()
    const [collapsed, setcollapsed] = useState(false);
    const [menus, setmenus] = useState([]);
    const [openKeys, setOpenKeys] = useState([]);
    useEffect(() => {
        getUserInfo((res) => {
            if (res.code == 200) {
                setmenus(res.data.menus);
                props.userData(res.data);
                return;
            }
            message.warning("您的登录信息无效！请重新登录", 1).then(() => {
                fakeAuth.signout();
                history.push('/login');
            })
        })
    }, [])
    const renderMenus = (menu, key) => {
        if (menu.children) {
            return <SubMenu key={menu.url} title={
                <span>
                    <span>{menu.name}</span>
                </span>}>
                {
                    menu.children.map((item, key) => {
                        return renderMenus(item, key)
                    })
                }
            </SubMenu>
        } else {
            return <Menu.Item key={menu.id}>
                <Link to={menu.path}>
                    <span className="navTitle">
                        {menu.name}
                    </span>
                </Link>
            </Menu.Item>
        }
    }

    const onCollapse = collapsed => {
        setcollapsed(collapsed)
    };
    const onOpenChange = (keys) => {
        setOpenKeys([keys.pop()]);
    }
    const goHome = () => {
        history.push("/home")
    }
    return (
        <Sider
            width="208"
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            collapsedWidth="80"
            onBreakpoint={broken => {
                console.log(broken);
            }}
        >
            <div className="logo" onClick={goHome} ><img src={logo} alt="" style={{ width: "100%" }} /></div>
            <Menu
                openKeys={openKeys}
                onOpenChange={onOpenChange}
                mode="inline"
                theme="dark"
                collapsed={collapsed.toString()}
            >
                {
                    menus.map((item, key) => {
                        return renderMenus(item, key)
                    })
                }
            </Menu>
        </Sider>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        userData: (item) => {
            dispatch({
                type: USER_INFO,
                userData: item
            })
        }
    }
}
export default connect(null, mapDispatchToProps)(SiderNav)