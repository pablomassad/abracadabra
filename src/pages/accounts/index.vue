<template>
    <div class="backIntegralmente">
        <q-input v-model="criteria" label="Buscar clientes" class="filterText" clearable color="black" bg-color="lightgray" filled>
            <template v-slot:prepend>
                <q-icon name="search" />
            </template>
        </q-input>

        <div class="accountsFrame">
            <div class="accRow listHeaders ">
                <div class="label" @click="sortDirToggle('fullName')">Nombre</div>
                <div class="label" @click="sortDirToggle('balance')" style="justify-self: end;">Balance</div>
                <q-icon name="alarm" class="accIcon" />
                <q-icon name="local_atm" class="accIcon" />
            </div>
            <div class="listFrame" v-if="store.state.settings && store.state.accounts">
                <div v-for="acc in store.state.accounts" :key="acc">
                    <div class="accRow" v-if="evalFilter(acc)" @click="openMovements($event, acc)">
                        <div>{{ acc.fullName }}</div>
                        <div style="justify-self: end;">{{ acc.balance }}</div>
                        <div class="btnAlert" :class="{'alertON': evalTimeAlert(acc)}"></div>
                        <div class="btnAlert" :class="{'alertON': evalMoneyAlert(acc)}"></div>
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
import { useRouter } from 'vue-router'

const router = useRouter()
const criteria = ref()
const sortDir = {
    fullName: 'asc',
    balance: 'asc',
    CP: 'asc',
    amount: 'asc'
}

onMounted(async () => {
    ui.actions.setTitle('Cuentas Corriente')
    store.actions.getAccounts('fullName', 'asc')
    store.actions.getSettings()
})

const evalFilter = (acc) => {
    const flag = Object.keys(acc).some(k => {
        let result = false
        const o = acc[k]
        if (o) { result = o.toString().toUpperCase().indexOf(criteria.value?.toUpperCase()) !== -1 || (!criteria.value) }
        return result
    })
    return flag
}
const evalTimeAlert = (cli) => {
    let flag = false
    if (cli.balance < 0) {
        const today = new Date().getTime()
        const maxDays = store.state.settings.maxDays
        const difTime = Math.abs(today - cli.lastDatePaid)
        const difDays = Math.ceil(difTime / (1000 * 3600 * 24))
        flag = (difDays > maxDays)
    }
    return flag
}
const evalMoneyAlert = (cli) => {
    let flag = false
    if (cli.balance < 0) {
        const maxMoney = store.state.settings.maxMoney
        flag = (cli.balance < -maxMoney)
    }
    return flag
}
const sortDirToggle = (field) => {
    (sortDir[field] === 'asc') ? sortDir[field] = 'desc' : sortDir[field] = 'asc'
    store.actions.getAccounts(field, sortDir[field])
}
const openMovements = (acc) => {
    const pout = { cli: acc, type: 'CC' }
    router.push({ path: '/movements', query: { pin: pout } })
}
</script>

<style scoped>
.accountsFrame {
    background-color: white;
    border-radius: 5px;
    margin: 16px;
    box-shadow: 1px 1px 4px gray;
}

.filterText {
    margin: 8px 16px 0;
}

.clientIcon {
    font-size: 20px;
    text-shadow: 1px 1px 1px lightgray;
    padding: 0 8px 0 0;
    color: gray;
}

.accIcon {
    font-size: 23px;
    justify-self: center;
    text-shadow: 1px 1px 1px white;
}

.btnAlert {
    background-image: radial-gradient(farthest-corner at 6px 6px, pink 0%, red 40%, red 100%);
    border-radius: 50%;
    box-shadow: 1px 1px 4px gray;
    height: 20px;
    width: 20px;
    justify-self: center;
    opacity: 0.2;
}

.alertON {
    background-image: radial-gradient(farthest-corner at 6px 6px, pink 0%, red 40%, red 100%);
    opacity: 1;
}

.accRow {
    display: grid;
    grid-template-columns: 1fr 60px 50px 20px;
    padding: 4px 12px;
}

.label {
    font-weight: bold;
    text-shadow: 1px 1px 1px white;
}

.listHeaders {
    background-color: #ffe17f;
    box-shadow: 0px 2px 4px lightgray;
    font-weight: bold;
    border-radius: 5px 5px 0 0;
}

.listFrame {
    padding-top: 10px;
    height: calc(100vh - 180px);
    overflow: auto;
}
</style>
