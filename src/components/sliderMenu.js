/*
 * @FileName: 
 * @Author: duxinyue
 * @Date: 2021-04-27 11:40:23
 * @LastEditors: duxinyue
 * @LastEditTime: 2021-05-19 15:48:40
 * @FilePath: \app1\src\components\sliderMenu.js
 * @Description: 
 */
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { menus } from "../config/menu"
function Slider() {
    const renderSubMenu = (item) => {
        return (
            <Menu.SubMenu
                key={item.key}
                title={
                    <span>
                        <span className="nav-text">{item.title}</span>
                    </span>
                }
            >
                {item.subs.map((sub) => (sub.subs ? renderSubMenu(sub) : renderMenuItem(sub)))}
            </Menu.SubMenu>
        );
    }
    const renderMenuItem = (item) => {
        return <Menu.Item key={item.key}>
            <Link to={(item.route || item.key) + (item.query || '')}>
                <span className="nav-text">{item.title}</span>
            </Link>
        </Menu.Item>
    }
    return  <div >
                {menus.map((item) => {
                                return  <Menu mode="inline" key={item.key} >
                                            {item.subs
                                                ? renderSubMenu(item)
                                                : renderMenuItem(item)}
                                        </Menu>
                            }) 
                }
            </div>
           
};

export default Slider