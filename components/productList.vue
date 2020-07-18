<template>
	<div :class="[isModalShow ? 'opa-50' : '', 'container-fluid py-5']">
		<button type="button" class="btn btn-primary float-right" @click="showModal('create')">Create</button>
		<table class="table">
			<h1>List of Products</h1>
			<thead class="thead-dark">
				<tr>
					<th>Category</th>
					<th>Product Name</th>
					<th>List Price</th>
					<th>Retail Price</th>
					<th>Status</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				<template v-if="productList.length > 0">
					<tr v-for="product in productList" :key="product.id">
						<td>{{ product.category }}</td>
						<td>{{ product.name }}</td>
						<td>{{ product.listPrice && product.listPrice.toLocaleString() }}</td>
						<td>{{ product.retailPrice && product.retailPrice.toLocaleString() }}</td>
						<td :class="[product.status ? 'enabled' : 'disabled']">
							{{ product.status ? 'enabled' : 'disabled' }}
						</td>
						<td>
							<div class="btn-group" role="group" aria-label="Button group">
								<button
									type="button"
									class="btn btn-outline-primary"
									@click="showModal('edit', product.id)"
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
					<a class="page-link" href="#">Previous</a>
				</li>
				<li
					:class="[pagination.current_page === index + 1 ? 'active' : '', 'page-item']"
					v-for="(page, index) in pagination.total_pages"
					:key="index"
				>
					<a class="page-link" href="#" @click.prevent="getProductList(index + 1)">{{ index + 1 }}</a>
				</li>
				<li :class="[pagination.current_page === pagination.total_pages ? 'disabled' : '', 'page-item']">
					<a class="page-link" href="#">Next</a>
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
		this.$bus.$on('productList.updateModalShow', this.updateModalShow)
		this.$bus.$on('productList.updateProduct', this.updateProduct)
	},
	methods: {
		showModal(type, id) {
			let title = ''
			let tempProduct = { imageUrl: [] }
			switch (type) {
				case 'create':
					const newId = new Date().getTime()
					title = 'Create Product'
					tempProduct.id = newId
					break
				case 'edit':
					title = 'Edit Product'
					tempProduct = { ...this.productList.find((product) => product.id === id) }
					break
				default:
					break
			}
			this.$bus.$emit('productModal.showModal', { type, title })
			this.$bus.$emit('productModal.updateTempProduct', tempProduct)
		},
		deleteProduct(id) {
			apis.deleteProduct({ id }, (res) => {
				this.getProductList()
			})
		},
		createProduct(tempProduct) {
			apis.createProduct(this.revertProduct(tempProduct), (res) => {
				this.getProductList()
			})
		},
		updateProduct(data) {
			const { id, tempProduct } = data
			apis.updateProduct({ id, tempProduct: this.revertProduct(tempProduct) }, (res) => {
				this.getProductList()
			})
		},
		updateModalShow(data) {
			this.isModalShow = data
		},
		getProductList(page = 1) {
			apis.getProductList({ page }, (res) => {
				res.data && this.convertProduct(res.data)
				res.meta && res.meta.pagination && (this.pagination = res.meta.pagination)
			})
		},
		convert(product) {
			const { id, title, category, content, imageUrl, enabled, origin_price, price, unit } = product
			return {
				id,
				name: title,
				category,
				content,
				description: '',
				imageUrl,
				status: enabled,
				listPrice: origin_price,
				retailPrice: price,
				unit,
				options: null,
			}
		},
		revert(product) {
			const {
				id,
				name,
				category,
				content,
				description,
				imageUrl,
				status,
				listPrice,
				retailPrice,
				unit,
				options,
			} = product
			return {
				id,
				title: name,
				category,
				content,
				description,
				imageUrl,
				enabled: status,
				origin_price: listPrice,
				price: retailPrice,
				unit,
				options: options,
			}
		},
		convertProduct(data) {
			const isArray = Array.isArray(data)
			if (isArray) {
				this.productList = data.map((item) => this.convert(item))
			} else {
				return this.convert(data)
			}
		},
		revertProduct(data) {
			const isArray = Array.isArray(data)
			if (isArray) {
				this.productList = data.map((item) => this.revert(item))
			} else {
				return this.revert(data)
			}
		},
	},
	updated() {},
	mounted() {
		if (this.loginStatus) {
			this.getProductList()
		}
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
