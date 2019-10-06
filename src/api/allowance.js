import request from '@/utils/request'

export function submitAllowance (params) {
  return request({
    url: '/workcollect/submitAllowance',
    method: 'post',
    data: params
  })
}

export function queryUserAllowances (uid) {
  return request({
    url: '/workcollect/queryAllowance',
    method: 'get',
    params: {uid}
  })
}
