import axios from 'axios'

const axiosInstance = axios.create()

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response !== undefined){
            if(error.response.status === 401){
                if(window.location.pathname !== "/" && window.location.pathname !== "/session/signin"){
                    window.location.href = "/"
                }
            }
        } else {
            console.log(error)
        }
        return Promise.reject(
            (error.response) || 'Something went wrong!'
        )
    }
)

export default axiosInstance
