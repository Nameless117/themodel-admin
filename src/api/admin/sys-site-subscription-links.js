import request from '@/utils/request'

// 查询SysSiteSubscriptionLinks列表
export function listSysSiteSubscriptionLinks(query) {
    return request({
        url: '/api/v1/sys-site-subscription-links',
        method: 'get',
        params: query
    })
}

// 查询SysSiteSubscriptionLinks详细
export function getSysSiteSubscriptionLinks (id) {
    return request({
        url: '/api/v1/sys-site-subscription-links/' + id,
        method: 'get'
    })
}


// 新增SysSiteSubscriptionLinks
export function addSysSiteSubscriptionLinks(data) {
    return request({
        url: '/api/v1/sys-site-subscription-links',
        method: 'post',
        data: data
    })
}

// 修改SysSiteSubscriptionLinks
export function updateSysSiteSubscriptionLinks(data) {
    return request({
        url: '/api/v1/sys-site-subscription-links/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除SysSiteSubscriptionLinks
export function delSysSiteSubscriptionLinks(data) {
    return request({
        url: '/api/v1/sys-site-subscription-links',
        method: 'delete',
        data: data
    })
}

