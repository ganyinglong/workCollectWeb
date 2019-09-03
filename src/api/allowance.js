import request from '@/utils/request'

export function submitAllowance (params) {
  return request({
    url: '/workcollect/submitAllowance',
    method: 'post',
    data: params
  })
}
