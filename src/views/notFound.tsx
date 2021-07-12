import { Button } from "antd";
const { useHistory } = require("react-router-dom")
const style = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
}
function NotFound() {
    const history = useHistory();
    const goHome = ()=>{
        history.push("/app/dashboard/index")
    }
    return <div style={style}>这个页面被你藏哪了呢？ <Button type="primary" onClick={goHome}>返回首页</Button></div>
}

export default NotFound