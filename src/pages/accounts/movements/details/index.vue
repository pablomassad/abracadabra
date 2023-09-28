<template>
    <div class="backIntegralmente">
        <div class="client"> {{ pin.cli.fullName }}</div>
        <div v-if="pin.type === 'RC'">Total: {{ pin.cli.sales }}</div>
        <div v-if="pin.type === 'CC'">Total: {{ pin.cli.balance }}</div>

        <div class="movFrame">
            <div class="movRow listHeaders ">
                <div class="label" @click="sortDirToggle('fecha')">Fecha</div>
                <div class="label" @click="sortDirToggle('CP')">CP</div>
                <div class="label" @click="sortDirToggle('balance')" style="justify-self: end;">Monto</div>
            </div>
            <div class="listFrame" v-if="store.state.movements">
                <div v-for="mov in store.state.movements" :key="mov">
                    <div class="movRow" v-if="((pin.type == 'CC') && ((mov.cp == 'CC') || (mov.cp == 'PC'))) || (pin.type == 'RC')" @click="openDetails(mov)">
                        <div>{{ mov.datetime }}</div>
                        <div>{{ mov.cp }}</div>
                        <div style="justify-self: end;">{{ mov.amount }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ui } from 'fwk-q-ui'
import { ref, onMounted } from 'vue'
import store from './store'
import { userRouter } from 'vue-router'

const router = userRouter()

onMounted(async () => {
    ui.actions.setTitle('Detalle Total')
    store.actions.getDetails(pin.cli.id)
})

</script>

<style scoped></style>
