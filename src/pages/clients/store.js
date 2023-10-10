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
    async getClients () {
        console.log('store getClients')
        ui.actions.showLoading()
        const res = await fb.getCollection('clients')
        actions.setClients(res)
        ui.actions.hideLoading()
    },
    async hideClient (cli) {
        console.log('store hideClient')
        ui.actions.showLoading()
        const tmp = { ...cli }
        tmp.hidden = true
        const res = await fb.setDocument('clients', tmp, cli.id)
        ui.actions.hideLoading()
    },
    async save (cli) {
        console.log('store save')
        ui.actions.showLoading()
        const res = await fb.setDocument('clients', cli, cli.id)
        ui.actions.hideLoading()
        return res
    }
}

export default {
    state: readonly(state),
    actions
}
