import Axios from "axios";

const ApiTest= (url)=>{
    let token = sessionStorage.getItem('token') ?   sessionStorage.getItem('token') : ''
    Axios.get(`http://localhost:5555/${url}`
        ,{
            headers: {
                'token': token
            }}
    )
        .then(res=>{
            sessionStorage.setItem("token", res.data.token);
            return res.data.data
        })
        .catch((err) => console.log(err))

}
export default ApiTest