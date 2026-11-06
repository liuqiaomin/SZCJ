import axios from '@/utils/axios'
import moment from "moment";

/**
 * 登录
 */
export function uppd(params) {
  return axios({
    url: '/branch/uppd.php',
    method: 'post',
    data: params
  })
}
/**
 * 登录
 */
export function login(params) {
  return axios({
    url: '/branch/login.php',
    method: 'post',
    data: params
  })
}


/**
 * 获取图形验证码
 */
export function getCode(params) {
  return axios({
    url: '/branch/getCaptchaCode.php',
    method: 'post',
    data: params
  })
}
/**
 * 权限列表（侧边栏权限和按钮权限）
 * @param params
 */
export function getPermission(params) {
  return axios({
    url: '/branch/getPermission.php',
    method: 'post',
    data: params
  })
}

/**
 * 统一请求
 * @param params
 */
export function api(params) {
  return axios({
    url: '/branch/api.php',
    method: 'post',
    data: params
  })
}

///导出入库表
export function warehouse_api(params) {
  return axios({
    url: '/branch/Classes/Warehousing.php',
    method: 'post',
    data: params
  })
}
//导出总库存数据
export function Totalinventory_api(params) {
  return axios({
    url: '/branch/Classes/Totalinventory.php',
    method: 'post',
    data: params
  })
}
//导出总库存数据
export function Outbound_api(params) {
  return axios({
    url: '/branch/Classes/Outbound.php',
    method: 'post',
    data: params
  })
}
//导出盘点


export function Inventory_api(params) {
  return axios({
    url: '/branch/Classes/Inventory.php',
    method: 'post',
    data: params
  })
}

//导出业务员报名
export function Salesperson_api(params) {
  return axios({
    url: '/branch/Classes/Salesperson.php',
    method: 'post',
    data: params
  })
}

//后台新订单打印
export function API_PHP_DEMO(params) {
  return axios({
    url: '/branch/API-PHP/API_PHP_DEMO.php',
    method: 'post',
    data: params
  })
}
//后台退货订单打印
export function API_PHP_DEMO_return(params) {
  return axios({
    url: '/branch/API-PHP/return.php',
    method: 'post',
    data: params
  })
}
