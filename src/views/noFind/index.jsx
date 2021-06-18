import { Result, Button } from 'antd';
import { withRouter } from 'react-router-dom';
function NoFind(props) {
    document.title = "数织通"
    const goHome = ()=>{
        props.history.push("/home")
    }
    return <Result
        status="404"
        title="404"
        subTitle="抱歉，你访问的页面不存在"
        extra={<Button type="primary" onClick={goHome}>返回首页</Button>}
    />
}

export default withRouter(NoFind)
