<template>
    <div class="back">
        <div class="total">Total: ${{ totals.totDay }}</div>
        <div class="grdSubTotales">
            <div class="label">Efvo</div>
            <div class="val">${{ totals.totEF }}</div>
            <div class="label">Tar</div>
            <div class="val">${{ totals.totTG }}</div>
            <div class="label">PC</div>
            <div class="val">${{ totals.totPC }}</div>
            <div class="label">CC</div>
            <div class="val">${{ totals.totCC }}</div>
        </div>
        <div class="salesFrame">
            <div class="saleRow listHeaders ">
                <div @click="sortDirToggle('datetime')">Hora</div>
                <div @click="sortDirToggle('fullName')">Cliente</div>
                <div @click="sortDirToggle('cp')">CP</div>
                <div @click="sortDirToggle('amount')" style="text-align: right;">Monto</div>
            </div>
            <div class="listFrame">
                <div v-for="m in store.state.salesToday" :key="m" class="saleRow">
                    <div>{{ moment(m.datetime).format('HH:mm') }}</div>
                    <div>{{ m.fullName }}</div>
                    <div>{{ m.cp }}</div>
                    <div style="text-align: right;">${{ m.amount }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted, watch } from 'vue'
import { ui } from 'fwk-q-ui'
import store from 'src/pages/sales/store'
import moment from 'moment'

const initTotal = {
    totDay: 0,
    totCC: 0,
    totEF: 0,
    totTG: 0,
    totPC: 0
}
let totals = reactive({ ...initTotal })
const sortDir = {
    datetime: 'asc',
    fullName: 'asc',
    CP: 'asc',
    amount: 'asc'
}

onMounted(async () => {
    ui.actions.setTitle('Ventas día: ' + moment().format('DD/MM/YY'))
    store.actions.getSalesByDate('fullName', 'asc')
})
const sortDirToggle = (field) => {
    (sortDir[field] === 'asc') ? sortDir[field] = 'desc' : sortDir[field] = 'asc'
    store.actions.getSalesByDate(field, sortDir[field])
}
watch(() => store.state.salesToday, (newVal) => {
    totals = { ...initTotal }
    console.log('initTotal:', initTotal)
    if (newVal) {
        newVal.forEach((item) => {
            if (item.cp === 'CC') totals.totCC = totals.totCC + Number(item.amount)
            if (item.cp === 'TG') totals.totTG = totals.totTG + Number(item.amount)
            if (item.cp === 'PC') totals.totPC = totals.totPC + Number(item.amount)
            if (item.cp === 'EF') totals.totEF = totals.totEF + Number(item.amount)
        })
        totals.totDay = totals.totEF + totals.totTG + totals.totPC // totals.value.totCC
    }
})
</script>

<style scoped>
.total {
    text-align: center;
    font-size: 22px;
    text-shadow: 1px 1px 1px white;
    margin: 10px;
}

.grdSubTotales {
    display: grid;
    grid-template-columns: 34px 1fr 24px 1fr 22px 1fr 20px 1fr;
    justify-items: start;
    align-items: center;
    font-size: 17px;
    width: 90%;
    margin: auto;
}

.salesFrame {
    background-color: white;
    border-radius: 5px;
    margin: 16px;
    box-shadow: 1px 1px 4px gray;
}

.listHeaders {
    background-color: aquamarine;
    box-shadow: 0px 2px 4px lightgray;
    font-weight: bold;
    border-radius: 5px 5px 0 0;
}

.listFrame {
    height: calc(100vh - 180px);
    overflow: auto;
    background: var(--backPanel);
}

.saleRow {
    display: grid;
    grid-template-columns: 50px 1fr 20px 80px;
    padding: 4px 12px;
}

.label {
    font-weight: bold;
}
</style>
