<template>
	<div
		:class="[modal.enable ? modal.enableClass : '', 'modal fade']"
		tabindex="-1"
		role="dialog"
		aria-labelledby="LoginModalLabel"
		aria-hidden="true"
	>
		<div class="modal-dialog modal-dialog-scrollable">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title text-center w-100" id="LoginModalLabel">{{ modal.title }}</h5>
				</div>
				<div class="modal-body">
					<form>
						<div class="form-group">
							<label for="email">Email</label>
							<input
								id="email"
								v-model="loginForm.email"
								class="form-control"
								type="text"
								name=""
								placeholder="login email here!"
								required
							/>
						</div>
						<div class="form-group">
							<label for="password">Password</label>
							<input
								id="password"
								v-model="loginForm.password"
								class="form-control"
								type="password"
								name=""
								placeholder="login password here!"
								required
							/>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" @click="handleLogin">Login</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
module.exports = {
	props: ['loginStatus'],
	data() {
		return {
			modal: {
				enable: null,
				enableClass: 'show d-block login-modal',
				title: 'Welcome Admin Dashboard',
				type: '',
			},
			loginForm: {
				email: '',
				password: '',
			},
		}
	},
	methods: {
		handleLogin() {
			apis.login(this.loginForm, (res) => {
				this.$emit('getLoginData', res)
				this.$bus.$emit('productList.updateIsModalShow', false)
			})
		},
	},
	created() {
		this.modal.enable = !this.loginStatus
		this.$bus.$emit('productList.updateIsModalShow', this.modal.enable)
	},
	watch: {
		loginStatus(curr, prev) {
			this.modal.enable = !curr
			this.$bus.$emit('productList.updateIsModalShow', this.modal.enable)
		},
	},
}
</script>
