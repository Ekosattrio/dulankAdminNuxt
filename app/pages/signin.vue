<template>
  <div class="account-content w-100">
    <div class="login-wrapper login-new">
      <div class="container">
        <div class="login-content user-login bg-white dark:bg-gray-900 dark:border dark:border-gray-800">
          <div class="login-logo text-center mb-4">
            <NuxtLink to="/">
              <img src="/assets/img/logo.png" alt="Dulank Admin" class="mx-auto" />
            </NuxtLink>
          </div>

          <form novalidate @submit.prevent="handleLogin">
            <div class="login-userset">
              <div class="login-userheading">
                <h3 class="text-gray-900 dark:text-white">Sign In</h3>
                <h4 class="text-gray-500 dark:text-gray-400">
                  Access the Dulank Admin panel using your email and password.
                </h4>
              </div>

              <!-- Error Alert -->
              <div
                v-if="errorMessage"
                role="alert"
                class="mb-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
              >
                <FeatherIcon name="alert-circle" size="15" class="mt-0.5 shrink-0" />
                <span>{{ errorMessage }}</span>
              </div>

              <div class="form-login mb-3">
                <label class="form-label text-gray-700 dark:text-gray-300" for="login-email">Email Address</label>
                <div class="form-addons position-relative">
                  <input
                    id="login-email"
                    v-model="email"
                    type="email"
                    name="email"
                    autocomplete="username"
                    class="form-control"
                    :class="{ 'border-red-400': fieldErrors.email }"
                    placeholder="Enter your email address"
                    aria-describedby="login-email-error"
                    aria-invalid="true"
                    :aria-errormessage="fieldErrors.email ? 'login-email-error' : undefined"
                    @input="clearFieldError('email')"
                  />
                  <img
                    src="/assets/img/icons/mail.svg"
                    alt=""
                    class="position-absolute end-0 top-50 translate-middle-y me-3"
                  />
                </div>
                <p v-if="fieldErrors.email" id="login-email-error" class="mt-1 text-xs text-danger">
                  {{ fieldErrors.email }}
                </p>
              </div>

              <div class="form-login mb-3">
                <label class="form-label" for="login-code">Kode authenticator (jika aktif)</label>
                <input id="login-code" v-model="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" class="form-control" />
              </div>
              <div class="form-login mb-3">
                <label class="form-label text-gray-700 dark:text-gray-300" for="login-password">Password</label>
                <div class="pass-group position-relative">
                  <input
                    id="login-password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    name="password"
                    autocomplete="current-password"
                    class="form-control pass-input"
                    :class="{ 'border-red-400': fieldErrors.password }"
                    placeholder="Enter your password"
                    aria-describedby="login-password-error"
                    aria-invalid="true"
                    :aria-errormessage="fieldErrors.password ? 'login-password-error' : undefined"
                    @input="clearFieldError('password')"
                  />
                  <button
                    type="button"
                    class="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer border-0 bg-transparent text-muted"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                    :title="showPassword ? 'Hide password' : 'Show password'"
                    @click="showPassword = !showPassword"
                  >
                    <FeatherIcon :name="showPassword ? 'eye' : 'eye-off'" :size="16" />
                  </button>
                </div>
                <p v-if="fieldErrors.password" id="login-password-error" class="mt-1 text-xs text-danger">
                  {{ fieldErrors.password }}
                </p>
              </div>

              <div class="form-login authentication-check mb-3">
                <div class="row align-items-center">
                  <div class="col-6">
                    <div class="custom-control custom-checkbox">
                      <label class="checkboxs ps-4 mb-0 pb-0 line-height-1 position-relative cursor-pointer">
                        <input v-model="rememberMe" type="checkbox" />
                        <span class="checkmarks"></span>
                        <span class="ms-2 text-sm text-gray-700 dark:text-gray-300">Remember me</span>
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

              <div class="form-login mb-2">
                <button
                  class="btn btn-login w-100 btn-primary py-2 text-white font-semibold d-inline-flex align-items-center justify-content-center gap-2"
                  type="submit"
                  :disabled="isSubmitting"
                  :aria-busy="isSubmitting"
                >
                  <FeatherIcon v-if="isSubmitting" name="loader" size="15" class="animate-spin" />
                  {{ isSubmitting ? 'Signing In...' : 'Sign In' }}
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Kredensial demo hanya tampil di lingkungan development -->
        <div
          v-if="isDev"
          class="mx-auto mt-4 flex max-w-[450px] flex-wrap items-center justify-center gap-x-2 rounded-lg border border-dashed border-gray-300 bg-white/70 px-4 py-2.5 text-center text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-400"
        >
          <span>
            Demo: <code class="font-semibold text-gray-700 dark:text-gray-300">admin@dulank.test</code> /
            <code class="font-semibold text-gray-700 dark:text-gray-300">admin12345</code>
          </span>
          <button type="button" class="font-semibold text-primary hover:underline" @click="fillDemoCredentials">
            Isi otomatis
          </button>
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

useLegacyPage({
  title: 'Sign In',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
});

const isDev = import.meta.dev;

const email = ref("");
const password = ref("");
const code = ref("");
const rememberMe = ref(true);
const showPassword = ref(false);
const errorMessage = ref("");
const isSubmitting = ref(false);
const fieldErrors = ref<{ email?: string; password?: string }>({});

const route = useRoute();

// Halaman asal yang disimpan middleware/auth saat pengguna belum login.
// Hanya menerima path internal (cegah open redirect `//host`).
const redirectTarget = computed(() => {
  const redirect = route.query.redirect;

  return typeof redirect === "string" && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";
});

const { login } = useAdminAuth();

const clearFieldError = (field: "email" | "password") => {
  if (fieldErrors.value[field]) {
    fieldErrors.value[field] = undefined;
  }
};

const validate = (): boolean => {
  const errors: { email?: string; password?: string } = {};
  const normalizedEmail = email.value.trim();

  if (!normalizedEmail) {
    errors.email = "Email wajib diisi.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    errors.email = "Format email tidak valid.";
  }

  if (!password.value) {
    errors.password = "Password wajib diisi.";
  }

  fieldErrors.value = errors;

  if (errors.email) {
    document.getElementById("login-email")?.focus();
  } else if (errors.password) {
    document.getElementById("login-password")?.focus();
  }

  return Object.keys(errors).length === 0;
};

const handleLogin = async () => {
  if (isSubmitting.value) return;

  errorMessage.value = "";

  if (!validate()) {
    return;
  }

  isSubmitting.value = true;

  try {
    await login(email.value.trim(), password.value, rememberMe.value, code.value);
    await navigateTo(redirectTarget.value);
  } catch (error: unknown) {
    const fetchError = error as {
      status?: number;
      data?: { message?: string };
      statusMessage?: string;
    };

    errorMessage.value =
      fetchError?.data?.message ??
      (fetchError?.status === 401 ? "Email atau password salah." : null) ??
      fetchError?.statusMessage ??
      "Sign in failed. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

const fillDemoCredentials = () => {
  email.value = "admin@dulank.test";
  password.value = "admin12345";
  clearFieldError("email");
  clearFieldError("password");
};
</script>

<style scoped>
.login-content {
  max-width: 450px;
  margin: 0 auto;
  padding: 30px;
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
.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
