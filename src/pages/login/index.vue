<template>
    <div class="backLogin">
        <img src="images/abracadabra.jpg" class="logo">
        <div class="grdLogin">
            <q-input color="black" bg-color="lightgray" filled v-model="dni" label="Ingrese contraseña" @keyup.enter="validateDocument" class="doc" />
            <q-btn color="warning" icon="login" @click="login" class="login" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const dni = ref()

onMounted(async () => {
})
const login = () => {
    router.push('/home')
}
</script>

<style scoped>
.logo {
    position: relative;
    display: grid;
    margin: 90px auto;
    width: 40vw;
    height: auto;
    min-width: 350px;
}

.backLogin {
    background: linear-gradient(#ffffff, white, #c8996f);
    margin: 0;
    padding: 0;
    height: 100vh;
}

.grdLogin {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 50px;
    align-items: center;
    height: auto;
    width: 300px;
    margin: auto;
    column-gap: 10px;
}

.doc {
    margin: auto;
    width: 100%;
}

.login {
    height: 50px;
}
</style>
