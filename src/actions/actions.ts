export const FETCH_POST = "FETCH_POST";
export const fetchPost = () => (dispatch: any) => {
    fetch("https://my-json-server.typicode.com/duxinyues/duxinyues/posts")
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            dispatch({
                type: FETCH_POST,
                payload: data
            })
        })
}