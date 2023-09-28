<template>
    <q-layout view="hHh Lpr lff">
        <q-header elevated :class="$q.dark.isActive ? 'bg-secondary' : 'bg-orange'">
            <q-toolbar>
                <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />
                <q-toolbar-title>{{ ui.state.title }}</q-toolbar-title>
                <div>
                    <span>
                        Version: 1.0.0
                    </span>
                    <q-avatar style="cursor: pointer;" color="red" class="q-ml-sm" @click="(dialog = !dialog)">
                        PM
                    </q-avatar>
                </div>
            </q-toolbar>
        </q-header>

        <q-drawer v-model="drawerLeft"  :width="250" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'" :breakpoint="500" :overlay="true" behavior="desktop" style="color: #666;box-shadow: black 3px 3px 50px !important;">
            <q-list style="padding-top:20px">
                <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view v-slot="{Component}">
                <!--<transition :enter-active-class="route.meta.enterClass" :leave-active-class="route.meta.leaveClass">-->
                <component :is="Component" />
                <!--</transition>-->
            </router-view>
        </q-page-container>
    </q-layout>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { ui } from 'fwk-q-ui'
import EssentialLink from 'src/components/EssentialLink.vue'

const drawerLeft = ref(false)

const linksList = ref([
    {
        title: 'Clientes',
        caption: 'Alta, edición y baja',
        icon: 'group',
        link: '/clients'
    },
    {
        title: 'Ventas diarias',
        caption: 'Resumen diario de ventas',
        icon: 'point_of_sale',
        link: '/sales'
    },
    {
        title: 'Cuentas Corrientes',
        caption: 'Estado de cuentas',
        icon: 'currency_exchange',
        link: '/accounts'
    },
    {
        title: 'Resumenes de cuenta',
        caption: 'Lista de actividad',
        icon: 'work',
        link: '/summary'
    },
    {
        title: 'Reportes',
        caption: 'Graficos estadísticos',
        icon: 'area_chart',
        link: '/reports'
    },
    {
        title: 'Stock',
        caption: 'Administracion de stock',
        icon: 'vertical_split',
        link: '/stock'
    },
    {
        title: 'Mercaderia',
        caption: 'Administracion de códigos',
        icon: 'sell',
        link: '/products'
    },
    {
        title: 'Proveedores',
        caption: 'Gestion de proveedores',
        icon: 'real_estate_agent',
        link: '/providers'
    },
    {
        title: 'Opciones',
        caption: 'Configuracion de alertas',
        icon: 'settings',
        link: '/settings'
    },
    {
        title: 'Descargar App',
        caption: 'Bajar aplicación',
        icon: 'download',
        link: '/download'
    }
])

onMounted(() => {
    ui.actions.setTitle('Abracadabra')
})
const toggleLeftDrawer = () => {
    drawerLeft.value = !drawerLeft.value
}
</script>

<style scoped>

.title {
    color: rgb(255, 255, 255);
    justify-content: center;
    font-size: 35px;
    text-shadow: 1px 1px 1px black;
    font-weight: bold;
    align-content: center;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 1s ease-out;
}
</style>
