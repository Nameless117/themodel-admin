import request from '@/utils/request'

// 查询SysSiteFooterConfig列表
export function listSysSiteFooterConfig(query) {
    return request({
        url: '/api/v1/sys-site-footer-config',
        method: 'get',
        params: query
    })
}

// 查询SysSiteFooterConfig详细
export function getSysSiteFooterConfig (id) {
    return request({
        url: '/api/v1/sys-site-footer-config/' + id,
        method: 'get'
    })
}


// 新增SysSiteFooterConfig
export function addSysSiteFooterConfig(data) {
    return request({
        url: '/api/v1/sys-site-footer-config',
        method: 'post',
        data: data
    })
}

// 修改SysSiteFooterConfig
export function updateSysSiteFooterConfig(data) {
    return request({
        url: '/api/v1/sys-site-footer-config/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除SysSiteFooterConfig
export function delSysSiteFooterConfig(data) {
    return request({
        url: '/api/v1/sys-site-footer-config',
        method: 'delete',
        data: data
    })
}

