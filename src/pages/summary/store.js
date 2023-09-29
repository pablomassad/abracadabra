import { reactive, readonly } from 'vue'
import { ui } from 'fwk-q-ui'
import fb from 'src/boot/firebase'

const state = reactive({
    clients: undefined
})
const actions = {
    setClients (data) {
        console.log('store setClients:', data)
        state.clients = data
    },
    async getClients (sortField, sortDir) {
        console.log('store getClients:', sortField, sortDir)
        ui.actions.showLoading()
        const ops = {
            sortField,
            sortDir
        }
        const res = await fb.getCollectionFlex('clients', ops)
        actions.setClients(res)
        ui.actions.hideLoading()
        return res
    },
    async getSumDetailsByClient (clientId) {
        console.log('store getSumDetailsByClient:', clientId)
        ui.actions.showLoading()
        const ops = {
            field: '',
            op: '==',
            val: clientId,
            sortField: 'datetime',
            sortDir: 'desc'
        }
        const res = await fb.getCollectionFlex('movements', ops)
        ui.actions.hideLoading()
        return res
    }
}

export default {
    state: readonly(state),
    actions
}
