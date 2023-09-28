import { reactive, readonly } from 'vue'
import { ui } from 'fwk-q-ui'
import fb from 'src/boot/firebase'
import moment from 'moment'

const state = reactive({
    accounts: undefined,
    settings: undefined
})
const actions = {
    setAccounts (data) {
        console.log('store setAccounts:', data)
        state.accounts = data
    },
    setSettings (data) {
        console.log('store setSettings:', data)
        state.settings = data
    },
    async getSettings () {
        console.log('store getSettings')
        const res = await fb.getCollection('config')
        actions.setSettings(res[0])
    },
    async getAccounts (sortField, dir) {
        console.log('store getSalesByDate')
        ui.actions.showLoading()
        const ops = {
            field: 'balance',
            op: '<',
            val: 0,
            sortField,
            dir
        }
        const res = await fb.getCollectionFlex('clients', ops)
        actions.setAccounts(res)
        ui.actions.hideLoading()
        return res
    },
    async getMovementsByClient (clientId) {
        console.log('store getMovementsByClient:', clientId)
        ui.actions.showLoading()
        const ops = {
            field: 'idClient',
            op: '==',
            val: clientId,
            sortField: 'datetime',
            sortDir: 'asc'
        }
        const res = await fb.getCollectionFlex('movements', ops)
        console.log('store getMovementsByClient:', res)
        ui.actions.hideLoading()
        return res
    },
    async getDetailsByMov (movId) {
        console.log('store getDetailsByMov:', movId)
        ui.actions.showLoading()
        const res = await fb.getCollection(`movements/${movId}/details`)
        console.log('store getDetailsByMov:', res)
        ui.actions.hideLoading()
        return res
    }
}

export default {
    state: readonly(state),
    actions
}
