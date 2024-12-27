import request from '@/utils/request'

// 查询SysSiteConfig列表
export function listSysSiteConfig(query) {
    return request({
        url: '/api/v1/sys-site-config',
        method: 'get',
        params: query
    })
}

// 查询SysSiteConfig详细
export function getSysSiteConfig (id) {
    return request({
        url: '/api/v1/sys-site-config/' + id,
        method: 'get'
    })
}


// 新增SysSiteConfig
export function addSysSiteConfig(data) {
    return request({
        url: '/api/v1/sys-site-config',
        method: 'post',
        data: data
    })
}

// 修改SysSiteConfig
export function updateSysSiteConfig(data) {
    return request({
        url: '/api/v1/sys-site-config/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除SysSiteConfig
export function delSysSiteConfig(data) {
    return request({
        url: '/api/v1/sys-site-config',
        method: 'delete',
        data: data
    })
}

