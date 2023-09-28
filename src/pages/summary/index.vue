<template>
    <div class="back">
        <q-input v-model="criteria" label="Buscar clientes" class="filterText" clearable color="black" bg-color="white" filled>
            <template v-slot:prepend>
                <q-icon name="search" />
            </template>
        </q-input>

        <div class="frame">
            <div class="sumRow listHeaders ">
                <div @click="sortDirToggle('fullName')">Nombre</div>
            </div>
            <div class="listFrame">
                <div v-for="cli in clients" :key="cli" @click="toggleDetails(cli)">
                    <div v-if="evalFilter(cli)" class="sumRow client" :class="{'negativeTag': (cli.balance < 0), 'positiveTag': (cli.balance >= 0)}">{{ cli.fullName }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ui } from 'fwk-q-ui'
import { ref, onMounted } from 'vue'
import store from './store'

const criteria = ref()
const clients = ref()
const sortDir = {
    fullName: 'asc'
}

onMounted(async () => {
    ui.actions.setTitle('Resumenes de cuenta')
    clients.value = await store.actions.getClients('fullName', 'asc')
})
const evalFilter = (v) => {
    const flag = Object.keys(v).some(k => {
        let result = false
        const o = v[k]
        if (o) { result = o.toString().toUpperCase().indexOf(criteria.value?.toUpperCase()) !== -1 || (!criteria.value) }
        return result
    })
    return flag
}
const sortDirToggle = async (field) => {
    (sortDir[field] === 'asc') ? sortDir[field] = 'desc' : sortDir[field] = 'asc'
    clients.value = await store.actions.getClients(field, sortDir[field])
}
const toggleDetails = async (cli) => {
    cli.showDetails = !cli.showDetails
    if (cli.showDetails) {
        cli.details = await store.actions.getSumDetailsByClient(cli.id)
    }
}
</script>

<style scoped>
.filterText {
    margin: 8px 16px 0;
}

.frame {
    background-color: white;
    border-radius: 5px;
    margin: 16px;
    box-shadow: 1px 1px 4px gray;
}

.listHeaders {
    background-color: #ffbb8d;
    box-shadow: 0px 2px 8px black;
    font-weight: bold;
    border-radius: 5px 5px 0 0;
}

.listFrame {
    height: calc(100vh - 180px);
    overflow: auto;
    margin-top: 6px;
    padding-top: 4px;
    background: #e6e6e6;
}

.sumRow {
    display: grid;
    grid-template-columns: 1fr;
    padding: 4px 12px;
}

.client {
    padding: 8px;
    box-shadow: 1px 1px 4px gray;
    border-radius: 4px;
    margin: 12px 11px;
    background: white;
}

.negative {
    background-color: #f8ced5;
}

.positive {
    background-color: #d0e9d0;
}
</style>
