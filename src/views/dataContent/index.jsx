import { withRouter } from "react-router-dom"
function DataContent(props) {
    console.log(props)
    const err = () => { }
    return <div >
        首页啦
    </div>
}

export default withRouter(DataContent)