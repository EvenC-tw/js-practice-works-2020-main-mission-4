<template>
	<div :class="[isModalShow ? 'opa-50' : '', 'container-fluid py-5']">
		<button type="button" class="btn btn-primary float-right" @click="editProduct('create')">Create</button>
		<table class="table">
			<h1>List of Products</h1>
			<thead class="thead-dark">
				<tr>
					<th>Category</th>
					<th>Product Title</th>
					<th>List Price</th>
					<th>Retail Price</th>
					<th>Enabled</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				<template v-if="productList.length > 0">
					<tr v-for="product in productList" :key="product.id">
						<td>{{ product.category }}</td>
						<td>{{ product.title }}</td>
						<td>{{ product.origin_price && product.origin_price.toLocaleString() }}</td>
						<td>{{ product.price && product.price.toLocaleString() }}</td>
						<td :class="[product.enabled ? 'enabled' : 'disabled']">
							{{ product.enabled ? 'enabled' : 'disabled' }}
						</td>
						<td>
							<div class="btn-group" role="group" aria-label="Button group">
								<button
									type="button"
									class="btn btn-outline-primary"
									@click="editProduct('edit', product.id)"
								>
									Edit
								</button>
								<button type="button" class="btn btn-outline-danger" @click="deleteProduct(product.id)">
									delete
								</button>
							</div>
						</td>
					</tr>
				</template>
				<template v-else>
					<tr>
						<td colspan="6" class="text-center">
							N/A
						</td>
					</tr>
				</template>
			</tbody>
		</table>
		<nav aria-label="Page navigation example">
			<ul class="pagination">
				<li :class="[pagination.current_page === 1 ? 'disabled' : '', 'page-item']">
					<a class="page-link" href="#" @click.prevent="getProductList(pagination.current_page - 1)"
						>Previous</a
					>
				</li>
				<li
					:class="[pagination.current_page === index + 1 ? 'active' : '', 'page-item']"
					v-for="(page, index) in pagination.total_pages"
					:key="index"
				>
					<a class="page-link" href="#" @click.prevent="getProductList(index + 1)">{{ index + 1 }}</a>
				</li>
				<li :class="[pagination.current_page === pagination.total_pages ? 'disabled' : '', 'page-item']">
					<a class="page-link" href="#" @click.prevent="getProductList(pagination.current_page + 1)">Next</a>
				</li>
			</ul>
		</nav>
	</div>
</template>

<script>
module.exports = {
	props: ['uuid', 'loginStatus'],
	data() {
		return {
			productList: [],
			pagination: {
				total: 1,
				count: 1,
				per_page: 25,
				current_page: 1,
				total_pages: 1,
				links: {},
			},
			isModalShow: false,
		}
	},
	created() {
		this.$bus.$on('productList.createProduct', this.createProduct)
		this.$bus.$on('productList.updateIsModalShow', this.updateIsModalShow)
		this.$bus.$on('productList.updateProduct', this.updateProduct)
		if (this.loginStatus) {
			this.getProductList()
		}
	},
	methods: {
		getProductList(page = 1) {
			apis.getProductList({ page }, (res) => {
				res.data && (this.productList = res.data)
				res.meta && res.meta.pagination && (this.pagination = res.meta.pagination)
			})
		},
		createProduct(tempProduct) {
			apis.createProduct(tempProduct, (res) => {
				this.getProductList()
			})
		},
		getProduct(id, callback) {
			apis.getProduct({ id }, callback)
		},
		editProduct(type, id) {
			let title = ''
			let tempProduct = { imageUrl: [] }
			switch (type) {
				case 'create':
					const newId = new Date().getTime()
					title = 'Create Product'
					tempProduct.id = newId
					this.updateShowModalData({ type, title, tempProduct })
					break
				case 'edit':
					title = 'Edit Product'
					this.getProduct(id, (res) => {
						tempProduct = res.data
						this.updateShowModalData({ type, title, tempProduct })
					})
					break
				default:
					break
			}
		},
		updateProduct(data) {
			apis.updateProduct(data, (res) => {
				this.getProductList()
			})
		},
		deleteProduct(id) {
			apis.deleteProduct({ id }, (res) => {
				this.getProductList()
			})
		},
		updateShowModalData(data) {
			const { type, title, tempProduct } = data
			this.$bus.$emit('productModal.showModal', { type, title })
			this.$bus.$emit('productModal.updateTempProduct', tempProduct)
		},
		updateIsModalShow(data) {
			this.isModalShow = data
		},
	},
	watch: {
		loginStatus(curr, prev) {
			if (curr) {
				this.getProductList()
			}
		},
	},
}
</script>
