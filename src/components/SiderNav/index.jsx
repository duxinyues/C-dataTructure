import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { connect } from "react-redux";
import { requestUrl } from "../../utils/config";
import { USER_INFO } from "../../actons/type";
import './index.css';
import logo from "../../assets/img/logo1.png";
const { Sider } = Layout;
const { SubMenu } = Menu;
function SiderNav(props) {
    console.log("Nav==", props)
    const [collapsed, setcollapsed] = useState(false);
    const [menus, setmenus] = useState([]);
    const [openKeys, setOpenKeys] = useState([]);
    useEffect(() => {
        fetch(requestUrl + "/api-user/user/findById?id=1", {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            },
        }).then(res => {
            return res.json()
        }).then((res) => {
            if (res.code == 200) {
                console.log("菜单==", res)
                setmenus(res.data.menus);
                props.userData(res.data)
            }
        }).catch((err) => { })
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
            <div className="logo" ><img src={logo} alt="" style={{ width: "100%" }} /></div>
            <Menu
                // defaultSelectedKeys={['1']}
                // defaultOpenKeys={['sub1', 'sub2']}
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