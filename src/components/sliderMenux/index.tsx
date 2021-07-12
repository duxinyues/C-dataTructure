import { Menu } from "antd";
import { menus } from "../../config/menus";
const { Link } = require("react-router-dom");
function Slider() {
    const renderSubMenu = (item: any) => {
        return (
            <Menu.SubMenu
                key={item.key}
                title={
                    <span>
                        <span className="nav-text">{item.title}</span>
                    </span>
                }
            >
                {item.subs.map((sub: any) => (sub.subs ? renderSubMenu(sub) : renderMenuItem(sub)))}
            </Menu.SubMenu>
        );
    }
    const renderMenuItem = (item: any) => {
        return <Menu.Item key={item.key}>
            <Link to={(item.route || item.key) + (item.query || '')}>
                <span className="nav-text">{item.title}</span>
            </Link>
        </Menu.Item>
    }
    return <div >
        {menus.map((item: any) => {
            return <Menu mode="inline" key={item.key} >
                {item.subs
                    ? renderSubMenu(item)
                    : renderMenuItem(item)}
            </Menu>
        })
        }
    </div>

};

export default Slider