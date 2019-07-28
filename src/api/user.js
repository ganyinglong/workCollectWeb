import request from '@/utils/request'

export function userInfo (userName) {
  return request({
    url: '/workcollect/queryUserByUserName',
    method: 'get',
    params: { userName }
  })
}
