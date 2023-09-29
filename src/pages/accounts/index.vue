<template>
    <div class="back">
        <q-input v-model="criteria" label="Buscar clientes" class="filterText" clearable color="black" bg-color="white" filled>
            <template v-slot:prepend>
                <q-icon name="search" />
            </template>
        </q-input>

        <div class="frame">
            <div class="accRow accHeaders ">
                <div class="label" @click="sortDirToggle('fullName')">Nombre</div>
                <div class="label" @click="sortDirToggle('balance')" style="justify-self: end;">Balance</div>
                <q-icon name="alarm" class="accIcon" />
                <q-icon name="local_atm" class="accIcon" />
            </div>
            <div class="accFrame" v-if="localAccounts">
                <div v-for="acc in localAccounts" :key="acc">
                    <div class="accRow" v-if="evalFilter(acc)" @click="toggleMovements(acc)">
                        <div>{{ acc.fullName }}</div>
                        <div style="justify-self: end;">{{ acc.balance }}</div>
                        <div class="btnAlert" :class="{'alertON': evalTimeAlert(acc)}"></div>
                        <div class="btnAlert" :class="{'alertON': evalMoneyAlert(acc)}"></div>
                    </div>
                    <div class="accBack" v-if="acc.showMovements">
                        <div class="accTotals">
                            <div>Total ventas: {{ acc.sales }}</div>
                            <div>Total balance: {{ acc.balance }}</div>
                        </div>
                        <div class="frame">
                            <div class="movRow movHeaders ">
                                <div class="label" @click="sortDirToggle('fecha')">Fecha</div>
                                <div class="label" @click="sortDirToggle('CP')">CP</div>
                                <div class="label" @click="sortDirToggle('balance')" style="justify-self: end;">Monto</div>
                            </div>
                            <div class="movFrame" v-if="acc.movements">
                                <div v-for="mov in acc.movements" :key="mov">
                                    <div class="movRow" v-if="((mov.cp == 'CC') || (mov.cp == 'PC'))" @click="toggleDetails(mov)">
                                        <div>{{ mov.datetime }}</div>
                                        <div>{{ mov.cp }}</div>
                                        <div style="justify-self: end;">{{ mov.amount }}</div>
                                    </div>
                                    <div class="movBack" v-if="mov.showDetails">
                                        <div class="detTotal">Detalle total: {{ mov.amount }}</div>
                                        <div class="frame">
                                            <div class="detRow detHeaders ">
                                                <div class="label">Descripción</div>
                                                <div class="label" style="justify-self: end;">Cant.</div>
                                                <div class="label" style="justify-self: end;">$ Unit</div>
                                                <div class="label" style="justify-self: end;">SubTot</div>
                                            </div>
                                            <div class="detFrame" v-if="mov.details">
                                                <div v-for="det in mov.details" :key="det">
                                                    <div class="detRow">
                                                        <div>{{ det.product }}</div>
                                                        <div style="justify-self: end;">{{ det.quantity }}</div>
                                                        <div style="justify-self: end;">{{ det.price }}</div>
                                                        <div style="justify-self: end;">{{ det.subtotal }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
const localAccounts = ref()

onMounted(async () => {
    ui.actions.setTitle('Cuentas Corriente')
    store.actions.getSettings()
    localAccounts.value = await store.actions.getAccounts('fullName', 'asc')
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
const toggleMovements = async (acc) => {
    acc.showMovements = !acc.showMovements
    if (acc.showMovements) { acc.movements = await store.actions.getMovementsByClient(acc.id) }
}
const toggleDetails = async (mov) => {
    mov.showDetails = !mov.showDetails
    if (mov.showDetails) { mov.details = await store.actions.getDetailsByMov(mov.id) }
}
</script>

<style scoped>
.frame {
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

.label {
    font-weight: bold;
    text-shadow: 1px 1px 1px white;
}

/*==================*/
/* ACCOUNTS */
/*==================*/

.accIcon {
    font-size: 23px;
    justify-self: center;
    text-shadow: 1px 1px 1px white;
}

.accRow {
    display: grid;
    grid-template-columns: 1fr 60px 50px 20px;
    padding: 4px 12px;
}

.accHeaders {
    background-color: #ffd18b;
    box-shadow: 0px 2px 4px lightgray;
    font-weight: bold;
    border-radius: 5px 5px 0 0;
}

.accBack {
    background: #ffe5bd;
    padding-bottom: 1px;
}

.accTotals {
    display: flex;
    ;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
}

.accFrame {
    padding-top: 10px;
    height: calc(100vh - 180px);
    overflow: auto;
    background: var(--backPanel);
}

/*==================*/
/* MOVEMENTS */
/*==================*/

.movRow {
    display: grid;
    grid-template-columns: 1fr 60px 50px;
    padding: 4px 12px;
}

.movHeaders {
    background-color: #eaa443;
    box-shadow: 0px 2px 4px lightgray;
    font-weight: bold;
    border-radius: 5px 5px 0 0;
}

.movBack {
    background: #ebc28a;
    padding-bottom: 1px;
}

.movFrame {
    padding-top: 10px;
    overflow: auto;
}

/*==================*/
/* DETAILS */
/*==================*/

.detRow {
    display: grid;
    grid-template-columns: 1fr 20px 50px 50px;
    padding: 4px 12px;
}

.detHeaders {
    background-color: #ef8409;
    box-shadow: 0px 2px 4px lightgray;
    font-weight: bold;
    border-radius: 5px 5px 0 0;
}

.detFrame {
    padding-top: 10px;
    overflow: auto;
}
</style>
