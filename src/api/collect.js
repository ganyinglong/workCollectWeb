import request from '@/utils/request'

export function formSubmit (form) {
  return request({
    url: '/workcollect/submitCollect',
    method: 'post',
    data: form
  })
}
