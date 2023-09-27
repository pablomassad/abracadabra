import { reactive, readonly } from 'vue'
import { ui } from 'fwk-q-ui'
import fb from 'src/boot/firebase'

const state = reactive({
    settings: undefined
})
const actions = {
    setSettings (data) {
        console.log('store setSettings:', data)
        state.settings = data
    },
    async getSettings () {
        console.log('store getSettings')
        ui.actions.showLoading()
        const res = await fb.getCollection('config')
        actions.setSettings(res[0])
        ui.actions.hideLoading()
    },
    async saveSettings (days, money) {
        ui.actions.showLoading()
        const d = { id: 'settings', maxDays: days, maxMoney: money }
        await fb.setDocument('config', d, d.id)
        ui.actions.hideLoading()
    }
}

export default {
    state: readonly(state),
    actions
}
