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
          <form @submit.prevent="handleLogin">
            <div class="login-userset">
              <div class="login-userheading">
                <h3>Sign In</h3>
                <h4>Access the Dreamspos panel using your email and passcode.</h4>
              </div>
              <div class="form-login mb-3">
                <label class="form-label">Email Address</label>
                <div class="form-addons position-relative">
                  <input v-model="email" type="email" class="form-control" placeholder="Enter your email address" required />
                  <img
                    src="/assets/img/icons/mail.svg"
                    alt="img"
                    class="position-absolute end-0 top-50 translate-middle-y me-3"
                  />
                </div>
              </div>
              <div class="form-login mb-3">
                <label class="form-label">Password</label>
                <div class="pass-group position-relative">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control pass-input"
                    placeholder="Enter your password"
                    required
                  />
                  <span
                    class="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer text-muted"
                    @click="showPassword = !showPassword"
                  >
                    <i :class="showPassword ? 'ti ti-eye' : 'ti ti-eye-off'"></i>
                  </span>
                </div>
              </div>
              <div class="form-login authentication-check mb-3">
                <div class="row align-items-center">
                  <div class="col-6">
                    <div class="custom-control custom-checkbox">
                      <label class="checkboxs ps-4 mb-0 pb-0 line-height-1 position-relative cursor-pointer">
                        <input v-model="rememberMe" type="checkbox" />
                        <span class="checkmarks"></span>
                        <span class="ms-2 text-sm">Remember me</span>
                      </label>
                    </div>
                  </div>
                  <div class="col-6 text-end">
                    <NuxtLink to="/forgot-password" class="forgot-link text-primary text-sm hover:underline">
                      Forgot Password?
                    </NuxtLink>
                  </div>
                </div>
              </div>
              <div class="form-login mb-3">
                <button class="btn btn-login w-100 btn-primary py-2 text-white font-semibold" type="submit">Sign In</button>
              </div>
              <div class="signinform text-center mb-3">
                <h4 class="text-sm">
                  New on our platform?
                  <NuxtLink to="/signin" class="hover-a text-primary font-medium"> Create an account</NuxtLink>
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
                      <img src="/assets/img/icons/facebook-logo.svg" alt="Facebook" style="width: 24px; height: 24px" />
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" class="google-logo p-2 border rounded d-inline-block hover:shadow-sm">
                      <img src="/assets/img/icons/google.png" alt="Google" style="width: 24px; height: 24px" />
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" class="apple-logo p-2 border rounded d-inline-block hover:shadow-sm">
                      <img src="/assets/img/icons/apple-logo.svg" alt="Apple" style="width: 24px; height: 24px" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  layout: "auth",
});

useHead({
  title: "Sign In - Kacetak System",
});

const email = ref("admin@example.com");
const password = ref("123456");
const rememberMe = ref(false);
const showPassword = ref(false);

const handleLogin = () => {
  navigateTo("/");
};
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
