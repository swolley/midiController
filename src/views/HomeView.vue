<script setup lang="ts">
import BoxContainer from "@/components/rack/BoxContainer.vue";
import RackContainer from "@/components/rack/RackContainer.vue";
import ConsoleDevice from "@/components/devices/ConsoleDevice.vue";
import ToolBar from "@/components/toolbar/ToolBar.vue";
import { onMounted, ref } from "vue";
import { useRack } from "@/stores/useRack";
import ModalPanel from "@/components/modals/ModalPanel.vue";
import OutboardDevice from "@/components/devices/OutboardDevice.vue";
import type { Midi } from "@/services/classes/Midi";
import type { DragResult, IDeviceConfig } from "@/services/types/devices";
import { Container, Draggable } from "vue-dndrop";
import SidebarStore from "@/components/devices/SidebarStore.vue";
import DeviceEditor from "@/components/editor/DeviceEditor.vue";
import ConfirmDialog from "@/components/modals/ConfirmDialog.vue";
import type RackConsole from "@/services/classes/RackConsole";
import AppConfig from "@/components/editor/AppConfig.vue";
import type { Outboard } from "@/services/classes/Outboard";

const rackStore = useRack();
const initialized = ref<boolean>(false);
await rackStore
    .init()
    .then(() => (initialized.value = true))
    .catch(() => (initialized.value = false));

const showConsole = ref<boolean>(true);
const collapseAll = ref<boolean>(false);
const showStore = ref<boolean>(rackStore.rackDevices.length === 0);
const selectedDevice = ref<IDeviceConfig | undefined>(rackStore.rackDevices.length ? rackStore.rackDevices[0] : undefined);
const openSettings = ref<boolean>(false);
const openEditor = ref<boolean>(false);
const currentRemoveDeviceCb = ref<CallableFunction | null>(null);

function toggleConsole() {
    showConsole.value = !showConsole.value;
}

function toggleEditor(device?: IDeviceConfig) {
    if (device) selectedDevice.value = device;
    openEditor.value = device !== undefined;
}

function toggleStore() {
    showStore.value = !showStore.value;
}

function toggleCollapseAll(collapse: boolean) {
    console.log("collapse all", collapse);
    collapseAll.value = collapse;
}

function onDrop(dropResult: DragResult, list: "store" | "rack") {
    console.log(dropResult);
    if (dropResult.removedIndex !== null && dropResult.addedIndex === null) {
        rackStore.moveDevice(dropResult, list, list === "store" ? "rack" : "store");
    } else if (dropResult.removedIndex !== dropResult.addedIndex) {
        rackStore.reorderDevices(dropResult, list);
    }

    if (selectedDevice.value && rackStore.rackDevices.findIndex((d) => d.id === selectedDevice.value?.id) === -1) {
        selectedDevice.value = undefined;
    }

    if (!selectedDevice.value && rackStore.rackDevices.length === 1) selectedDevice.value = rackStore.rackDevices[0];
}

function touchStart(touchEvent: TouchEvent) {
    if (touchEvent.changedTouches.length !== 1) return;
    const posYStart = touchEvent.changedTouches[0].clientY;
    addEventListener("touchend", (touchEvent) => touchEnd(touchEvent as TouchEvent, posYStart), { once: true });
}
function touchEnd(touchEvent: TouchEvent, posYStart: number) {
    // We only care if one finger is used
    if (touchEvent.changedTouches.length !== 1) return;
    const posYEnd = touchEvent.changedTouches[0].clientY;
    if (posYStart > posYEnd) {
        showStore.value = false;
    } else if (posYStart < posYEnd) {
        showStore.value = true;
    }
}

function removeDevice(device: IDeviceConfig) {
    rackStore.removeDevice(device);
}

function askRemoveDevice(device: IDeviceConfig) {
    currentRemoveDeviceCb.value = () => removeDevice(device);
}

function createDevice() {
    const newDevice = rackStore.createDevice();
    toggleEditor(newDevice);
}

function onDeviceClick(device: Outboard) {
    selectedDevice.value = device;
    document.title = "App - " + device.label;
}

onMounted(() => {
    if (selectedDevice.value) document.title = "App - " + selectedDevice.value.label;
});
</script>

<template>
    <main class="h-full flex">
        <SidebarStore
            :show="showStore"
            :available-devices="rackStore.availableDevices"
            :rack-devices="rackStore.rackDevices"
            @dragdevice="(dropResult: DragResult) => onDrop(dropResult, 'store')"
            @removedevice="askRemoveDevice"
            @openeditor="toggleEditor"
            @createdevice="createDevice"
        />
        <!-- box -->
        <BoxContainer class="w-full" @touchstart="touchStart">
            <template v-slot:header>
                <!-- header -->
                <ToolBar
                    class="mx-2 my-3"
                    @toggleconsole="toggleConsole"
                    @togglestore="toggleStore"
                    @togglecollapseall="toggleCollapseAll"
                    @togglesettings="openSettings = !openSettings"
                />
            </template>
            <!-- rack -->
            <RackContainer :showConsole="showConsole">
                <Container
                    drag-handle-selector=".column-drag-handle"
                    group-name="devices"
                    data-index="rack"
                    orientation="vertical"
                    v-if="rackStore.midi"
                    @drop="(dropResult: DragResult) => onDrop(dropResult, 'rack')"
                    class="h-full"
                >
                    <!-- devices -->
                    <Draggable v-for="device in rackStore.rackDevices" :key="device.id">
                        <OutboardDevice
                            :background="device.backgroundColor"
                            :collapsable="true"
                            :draggable="true"
                            :collapsed="collapseAll"
                            :selected="selectedDevice !== undefined && selectedDevice.id === device.id"
                            :device="device"
                            :midi="(rackStore.midi as Midi)"
                            :is-selected="selectedDevice !== undefined && selectedDevice.id === device.id"
                            :init-completed="initialized"
                            @openeditor="() => toggleEditor(device)"
                            @click="onDeviceClick(device)"
                        />
                    </Draggable>
                </Container>

                <template v-slot:footer v-if="rackStore.console">
                    <!-- console -->
                    <ConsoleDevice
                        v-show="showConsole && rackStore.console"
                        :console="(rackStore.console as RackConsole)"
                        :collapsable="true"
                        :collapsed="collapseAll"
                    />
                </template>
            </RackContainer>
        </BoxContainer>

        <Teleport to="body">
            <ModalPanel v-if="selectedDevice && openEditor" :show="selectedDevice && openEditor" @close="() => toggleEditor()">
                <template v-slot:body>
                    <DeviceEditor :device="selectedDevice" class="px-5" />
                </template>
            </ModalPanel>

            <ModalPanel v-if="openSettings" :show="openSettings" @close="() => (openSettings = false)">
                <template v-slot:body>
                    <AppConfig />
                </template>
            </ModalPanel>

            <ConfirmDialog
                v-if="currentRemoveDeviceCb"
                message="Would you like to delete the selected device?"
                :yes-callback="currentRemoveDeviceCb"
                :no-callback="() => (currentRemoveDeviceCb = null)"
                @close="currentRemoveDeviceCb = null"
            />
        </Teleport>
    </main>
</template>

<style scoped lang="scss"></style>
