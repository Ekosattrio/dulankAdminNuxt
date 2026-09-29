<template>
  <div class="account-content w-100">
    <div class="login-wrapper login-new">
      <div class="container">
        <div class="login-content user-login">
          <div class="login-logo text-center mb-4">
            <NuxtLink to="/">
              <img src="/assets/img/logo.png" alt="img" class="mx-auto" />
            </NuxtLink>
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="login-userset">
              <div class="login-userheading">
                <h3>Forgot password?</h3>
                <h4>If you forgot your password, well, then we’ll email you instructions to reset your password.</h4>
              </div>
              <div class="form-login mb-3">
                <label class="form-label">Email</label>
                <div class="form-addons position-relative">
                  <input
                    v-model="email"
                    type="email"
                    class="form-control"
                    placeholder="Enter your email"
                    required
                  />
                  <img src="/assets/img/icons/mail.svg" alt="img" class="position-absolute end-0 top-50 translate-middle-y me-3" />
                </div>
              </div>
              <div class="form-login mb-3">
                <button type="submit" class="btn btn-login w-100 btn-primary py-2 text-white font-semibold">
                  Send Reset Link
                </button>
              </div>
              <div class="signinform text-center mb-3">
                <h4 class="text-sm">
                  Return to
                  <NuxtLink to="/signin" class="hover-a text-primary font-medium"> login</NuxtLink>
                </h4>
              </div>
              <div class="form-setlogin or-text text-center my-3 position-relative">
                <h4 class="text-muted text-xs bg-white px-2 d-inline-block position-relative z-1">OR</h4>
                <div class="border-top position-absolute top-50 start-0 end-0 z-0"></div>
              </div>
              <div class="form-sociallink">
                <ul class="d-flex justify-content-center gap-3 list-unstyled mb-0">
                  <li>
                    <a href="javascript:void(0);" class="facebook-logo p-2 border rounded d-inline-block hover:shadow-sm">
                      <img src="/assets/img/icons/facebook-logo.svg" alt="Facebook" style="width: 24px; height: 24px;" />
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" class="google-logo p-2 border rounded d-inline-block hover:shadow-sm">
                      <img src="/assets/img/icons/google.png" alt="Google" style="width: 24px; height: 24px;" />
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" class="apple-logo p-2 border rounded d-inline-block hover:shadow-sm">
                      <img src="/assets/img/icons/apple-logo.svg" alt="Apple" style="width: 24px; height: 24px;" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </form>
        </div>
        <div class="my-4 d-flex justify-content-center align-items-center copyright-text text-muted text-sm">
          <p>Copyright &copy; 2023 DreamsPOS. All rights reserved</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'auth'
})

useHead({
  title: 'Forgot Password - Kacetak System'
})

const email = ref('')

const handleSubmit = () => {
  alert('If an account exists for ' + email.value + ', a password reset link has been sent.')
  navigateTo('/signin')
}
</script>

<style scoped>
.login-content {
  max-width: 450px;
  margin: 0 auto;
  padding: 30px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
.btn-login {
  background-color: #ff9f43;
  border-color: #ff9f43;
  color: #fff;
  border-radius: 8px;
  padding: 10px;
}
.btn-login:hover {
  background-color: #e08730;
  border-color: #e08730;
}
</style>

