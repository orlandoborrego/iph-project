<template>
  <main class="login-shell">
    <section class="login-brand" aria-label="Sistema institucional">
      <div class="brand-top"><img src="/logos/logo_fgjtam.png" alt="Fiscalía General de Justicia de Tamaulipas" /><span>FGJ Tamaulipas</span></div>
      <div class="brand-copy">
        <span class="eyebrow"><i></i> Plataforma institucional</span>
        <h1>Informe Policial<br /><em>Homologado</em></h1>
        <p>Captura, consulta y seguimiento de registros policiales desde un espacio de trabajo seguro.</p>
      </div>
      <div class="brand-foot"><span class="shield">✓</span><span><b>Acceso protegido</b><small>Uso exclusivo de personal autorizado</small></span></div>
      <span class="brand-orb orb-one"></span><span class="brand-orb orb-two"></span>
    </section>

    <section class="login-content">
      <div class="login-card">
        <div class="mobile-logo"><img src="/logos/logo_fgjtam.png" alt="FGJ Tamaulipas" /></div>
        <div class="form-heading"><span class="eyebrow">Bienvenido</span><h2>Inicia sesión</h2><p>Ingresa tus credenciales para continuar.</p></div>
        <form @submit.prevent="handleLogin" novalidate>
          <div class="login-field" :class="{ 'has-error': usuarioTouched && !usuario.trim() }">
            <label for="usuario">Usuario</label>
            <div class="input-wrap"><span class="field-icon" aria-hidden="true">♙</span><input id="usuario" v-model.trim="usuario" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" name="username" required :aria-invalid="usuarioTouched && !usuario.trim()" aria-describedby="usuario-hint" placeholder="Tu usuario institucional" @blur="usuarioTouched = true" @input="error = ''" /></div>
            <small v-if="usuarioTouched && !usuario.trim()" id="usuario-hint" class="field-hint">Ingresa tu usuario.</small>
          </div>
          <div class="login-field" :class="{ 'has-error': passwordTouched && !password }">
            <label for="password">Contraseña</label>
            <div class="input-wrap"><span class="field-icon" aria-hidden="true">⌑</span><input id="password" v-model="password" :type="mostrarPassword ? 'text' : 'password'" autocomplete="current-password" autocapitalize="none" autocorrect="off" spellcheck="false" name="password" required :aria-invalid="passwordTouched && !password" placeholder="Ingresa tu contraseña" @blur="passwordTouched = true" @input="error = ''" /><button class="password-toggle" type="button" :aria-label="mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'" :aria-pressed="mostrarPassword" @click="mostrarPassword = !mostrarPassword">{{ mostrarPassword ? 'Ocultar' : 'Mostrar' }}</button></div>
            <small v-if="passwordTouched && !password" class="field-hint">Ingresa tu contraseña.</small>
          </div>
          <div v-if="error" class="login-error" role="alert"><span aria-hidden="true">!</span>{{ error }}</div>
          <button class="login-submit" type="submit" :disabled="cargando"><span v-if="cargando" class="spinner" aria-hidden="true"></span>{{ cargando ? 'Verificando acceso…' : 'Entrar al sistema' }}<span v-if="!cargando" aria-hidden="true">→</span></button>
        </form>
        <p class="login-security"><span>▣</span> Conexión segura · Sesión institucional</p>
      </div>
      <footer class="login-footer">© {{ new Date().getFullYear() }} Fiscalía General de Justicia de Tamaulipas</footer>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth";

const usuario = ref("");
const password = ref("");
const error = ref("");
const cargando = ref(false);
const mostrarPassword = ref(false);
const usuarioTouched = ref(false);
const passwordTouched = ref(false);
const auth = useAuthStore();
const router = useRouter();

async function handleLogin() {
  usuarioTouched.value = true;
  passwordTouched.value = true;
  error.value = "";
  if (!usuario.value.trim() || !password.value) return;
  cargando.value = true;
  try {
    await auth.login(usuario.value, password.value);
    await router.push({ name: "panel" });
  } catch (err) {
    if (!err?.response) {
      error.value = "No hay conexión con el servidor. Verifica tu red e inténtalo de nuevo.";
    } else {
      error.value = err.response.data?.msg || "No se pudo validar el acceso. Revisa tus credenciales e inténtalo de nuevo.";
    }
  } finally {
    cargando.value = false;
  }
}
</script>
