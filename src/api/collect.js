import request from '@/utils/request'

export function formSubmit (form) {
  return request({
    url: '/workcollect/submitCollect',
    method: 'post',
    data: form
  })
}

export function quryUserAttendance (uid, year, month) {
  return request({
    url: '/workcollect/quryUserAttendance',
    method: 'get',
    params: {uid, year, month}
  })
}
