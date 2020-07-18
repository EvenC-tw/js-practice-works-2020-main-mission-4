const uuid = `f7828c74-e344-45f1-a069-f542ff88c6fc`
const proxies = {
	callbackPX(res, callback) {
		return (function () {
			if (callback && typeof callback === 'function') {
				const { status, data } = res
				callback(data)
			}
		})()
	},
	errorPX(err) {
		// TODO some error handle
		if (err && err.response && err.response.status) {
			switch (err.response.status) {
				case 401:
					document.cookie = `token=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
					setAxios.setHead('Authorization', `Bearer ${token}`)
					location.reload()
					break
				default:
					break
			}
		}
	},
}
const apis = {
	login(data, callback) {
		axios
			.post(`auth/login`, data)
			.then((res) => proxies.callbackPX(res, callback))
			.catch(proxies.errorPX)
	},
	getProductList(data, callback) {
		const { page } = data
		axios
			.get(`${uuid}/admin/ec/products?page=${page}`)
			.then((res) => proxies.callbackPX(res, callback))
			.catch(proxies.errorPX)
	},
	createProduct(data, callback) {
		axios
			.post(`${uuid}/admin/ec/product`, data)
			.then((res) => proxies.callbackPX(res, callback))
			.catch(proxies.errorPX)
	},
	getProduct(data, callback) {
		const { id } = data
		axios
			.get(`${uuid}/admin/ec/product/${id}`)
			.then((res) => proxies.callbackPX(res, callback))
			.catch(proxies.errorPX)
	},
	updateProduct(data, callback) {
		const { id, tempProduct } = data
		axios
			.patch(`${uuid}/admin/ec/product/${id}`, tempProduct)
			.then((res) => proxies.callbackPX(res, callback))
			.catch(proxies.errorPX)
	},
	deleteProduct(data, callback) {
		const { id } = data
		axios
			.delete(`${uuid}/admin/ec/product/${id}`)
			.then((res) => proxies.callbackPX(res, callback))
			.catch(proxies.errorPX)
	},
}
