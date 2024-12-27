import request from '@/utils/request'

// 查询SysSiteBanners列表
export function listSysSiteBanners(query) {
    return request({
        url: '/api/v1/sys-site-banners',
        method: 'get',
        params: query
    })
}

// 查询SysSiteBanners详细
export function getSysSiteBanners (id) {
    return request({
        url: '/api/v1/sys-site-banners/' + id,
        method: 'get'
    })
}


// 新增SysSiteBanners
export function addSysSiteBanners(data) {
    return request({
        url: '/api/v1/sys-site-banners',
        method: 'post',
        data: data
    })
}

// 修改SysSiteBanners
export function updateSysSiteBanners(data) {
    return request({
        url: '/api/v1/sys-site-banners/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除SysSiteBanners
export function delSysSiteBanners(data) {
    return request({
        url: '/api/v1/sys-site-banners',
        method: 'delete',
        data: data
    })
}

