<template>
    <div class="back" v-if="store.state.settings">
        <div class="alertsFrame">
            <q-slider class="alert" v-model="days" :min="1" :max="MAX_DAYS" :step="2" label :label-value="days + 'd'" label-always color="primary" markers track-size="20px" thumb-size="40px" thumb-color="blue" :marker-labels="daysLimit" />

            <q-slider class="alert" v-model="money" :min="0" :max="MAX_MONEY" :step="5000" label :label-value="'$' + money" label-always color="secondary" markers track-size="20px" thumb-size="40px" thumb-color="green" :marker-labels="moneyLimit" />
        </div>

        <q-btn color="primary" icon="save" @click="save" label="Guardar cambios" class="btnSave" />
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { ui } from 'fwk-q-ui'
import store from './store'

const MAX_DAYS = 30
const MAX_MONEY = 100000

const days = ref(0)
const money = ref(10000)
const daysLimit = ref({ 1: '1', [MAX_DAYS]: MAX_DAYS })
const moneyLimit = ref({ 0: '0', [MAX_MONEY]: '100k' })

onMounted(async () => {
    ui.actions.setTitle('Configuración de alertas')
    store.actions.getSettings()
})
const save = () => {
    store.actions.saveSettings(days.value, money.value)
}

watch(() => store.state.settings, (newVal) => {
    days.value = newVal.maxDays
    money.value = newVal.maxMoney
})
</script>

<style scoped>
.alertsFrame {
    height: 300px;
    margin: 100px 16px 0 16px;
}

.btnSave {
    display: flex;
    width: 300px;
    margin: auto;
}

.alert {
    background-color: white;
    box-shadow: 1px 1px 5px gray;
    border-radius: 5px;
    padding: 20px;
    margin: 10px 0;
}
</style>
