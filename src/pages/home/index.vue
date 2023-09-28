<template>
    <div class="back">

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ui } from 'fwk-q-ui'

onMounted(async () => {
    ui.actions.setTitle('Abracadabra')
})
</script>

<style scoped></style>
