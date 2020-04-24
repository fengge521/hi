import axios from 'axios'
import JSONBIG from 'json-bigint'
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  transformResponse: [
    function (data) {
      try {
        return JSONBIG.parse(data)
      } catch (err) {
        return data
      }
    }
  ]
})
// 请求拦截器
request.interceptors.request.use(
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
export default request
