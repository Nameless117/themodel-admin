import request from '@/utils/request'

// 查询SysSiteSubscriptionConfig列表
export function listSysSiteSubscriptionConfig(query) {
    return request({
        url: '/api/v1/sys-site-subscription-config',
        method: 'get',
        params: query
    })
}

// 查询SysSiteSubscriptionConfig详细
export function getSysSiteSubscriptionConfig (id) {
    return request({
        url: '/api/v1/sys-site-subscription-config/' + id,
        method: 'get'
    })
}


// 新增SysSiteSubscriptionConfig
export function addSysSiteSubscriptionConfig(data) {
    return request({
        url: '/api/v1/sys-site-subscription-config',
        method: 'post',
        data: data
    })
}

// 修改SysSiteSubscriptionConfig
export function updateSysSiteSubscriptionConfig(data) {
    return request({
        url: '/api/v1/sys-site-subscription-config/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除SysSiteSubscriptionConfig
export function delSysSiteSubscriptionConfig(data) {
    return request({
        url: '/api/v1/sys-site-subscription-config',
        method: 'delete',
        data: data
    })
}

