<script setup lang="ts">
import BoxContainer from "@/components/rack/BoxContainer.vue";
import RackContainer from "@/components/rack/RackContainer.vue";
import ConsoleDevice from "@/components/devices/ConsoleDevice.vue";
import ToolBar from "@/components/toolbar/ToolBar.vue";
import { /*onMounted,*/ ref, watch } from "vue";
import { useRack } from "@/stores/useRack";
import ModalPanel from "@/components/modals/ModalPanel.vue";
import OutboardDevice from "@/components/devices/OutboardDevice.vue";
import type { Midi } from "@/services/classes/Midi";
import type { DragResult, DropResult } from "@/services/types/devices";
import { Container, Draggable } from "vue-dndrop";
import SidebarStore from "@/components/devices/SidebarStore.vue";
import DeviceEditor from "@/components/editor/DeviceEditor.vue";
import type RackConsole from "@/services/classes/RackConsole";
import AppConfig from "@/components/editor/AppConfig.vue";
import type { Outboard } from "@/services/classes/Outboard";

const rackStore = useRack();
// const initialized = ref<boolean>(false);
// await rackStore
//     .init()
//     .then(() => (initialized.value = true))
//     .catch(() => (initialized.value = false));

const showConsole = ref<boolean>(true);
const collapseAll = ref<boolean>(false);
const showStore = ref<boolean>(rackStore.rackDevices.length === 0);
const selectedDevice = ref<Outboard | undefined>(rackStore.rackDevices.length ? (rackStore.rackDevices[0] as Outboard) : undefined);
const modifiedDevice = ref<Outboard | undefined>();
const openSettings = ref<boolean>(false);
const openEditor = ref<boolean>(false);
const currentlyDragging = ref<Outboard | null>(null);

function cloneDevice(device: Outboard) {
    return JSON.parse(JSON.stringify(device)) as Outboard;
}

function toggleEditor(device?: Outboard) {
    if (device) {
        selectedDevice.value = device;
        modifiedDevice.value = cloneDevice(device);
    } else {
        modifiedDevice.value = device;
    }
    openEditor.value = device !== undefined;
}
function saveAndCloseEditor() {
    if (modifiedDevice.value) {
        selectedDevice.value = cloneDevice(modifiedDevice.value);
        modifiedDevice.value = undefined;
        openEditor.value = false;
    }
}

function toggleCollapseAll(collapse: boolean) {
    // console.log("collapse all", collapse);
    collapseAll.value = collapse;
}

function onDrop(dropResult: DropResult, list: "store" | "rack") {
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

function createDevice() {
    const newDevice = rackStore.createDevice();
    toggleEditor(newDevice);
}

function onDeviceClick(device: Outboard) {
    selectedDevice.value = device;
    // document.title = "App - " + device.label;
}

function startDragging(dragging: DragResult) {
    currentlyDragging.value = dragging.payload as Outboard;
}
function stopDragging() {
    currentlyDragging.value = null;
}

// onMounted(() => {
//     if (selectedDevice.value) document.title = "App - " + selectedDevice.value.label;
// });

watch(
    () => selectedDevice.value,
    () => {
        if (selectedDevice.value) document.title = "App - " + selectedDevice.value.label;
    }
);
</script>

<template>
    <main class="h-full flex">
        <SidebarStore
            :show="showStore"
            @dragdevice="(dropResult: DragResult) => onDrop(dropResult, 'store')"
            @openeditor="toggleEditor"
            @createdevice="createDevice"
        />
        <!-- box -->
        <BoxContainer class="w-full" @touchstart="touchStart">
            <template v-slot:header>
                <!-- header -->
                <ToolBar
                    class="mx-2 my-3"
                    @toggleconsole="showConsole = !showConsole"
                    @togglestore="showStore = !showStore"
                    @togglecollapseall="toggleCollapseAll"
                    @togglesettings="openSettings = !openSettings"
                />
            </template>
            <!-- rack -->
            <RackContainer :showConsole="showConsole">
                <Container
                    class="h-full"
                    :get-child-payload="(index: number) => rackStore.rackDevices[index]"
                    drag-handle-selector=".column-drag-handle"
                    group-name="devices"
                    data-index="rack"
                    orientation="vertical"
                    lock-axis="y"
                    v-if="rackStore.midi"
                    @drop="(dropResult: DragResult) => onDrop(dropResult, 'rack')"
                    @drag-start="startDragging"
                    @drag-end="stopDragging"
                >
                    <!-- devices -->
                    <Draggable v-for="device in rackStore.rackDevices" :key="device.id">
                        <OutboardDevice
                            :background="device.backgroundColor"
                            :collapsable="true"
                            :draggable="true"
                            :collapsed="collapseAll"
                            :selected="selectedDevice !== undefined && selectedDevice.id === device.id"
                            :device="(device as Outboard)"
                            :midi="(rackStore.midi as Midi)"
                            :is-selected="selectedDevice !== undefined && selectedDevice.id === device.id"
                            :init-completed="initialized"
                            @openeditor="() => toggleEditor(device as Outboard)"
                            @click="onDeviceClick(device as Outboard)"
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
            <ModalPanel v-if="modifiedDevice && openEditor" :show="modifiedDevice && openEditor">
                <template v-slot:body>
                    <DeviceEditor :device="modifiedDevice" class="px-5" />
                </template>
                <template v-slot:footer>
                    <div class="flex flex-col md:flex-row grow gap-2">
                        <button
                            class="rounded border border-white/10 w-full p-2 shadow bg-white/10 hover:bg-white/20 text-white transition-colors"
                            @click="toggleEditor()"
                        >
                            Cancel
                        </button>
                        <button
                            class="rounded border border-white/10 w-full p-2 shadow bg-white/10 hover:bg-white/20 text-white transition-colors"
                            @click="saveAndCloseEditor()"
                        >
                            Save
                        </button>
                    </div>
                </template>
            </ModalPanel>

            <ModalPanel v-if="openSettings" :show="openSettings" @close="() => (openSettings = false)">
                <template v-slot:body>
                    <AppConfig @forceclose="openSettings = false" />
                </template>
            </ModalPanel>
        </Teleport>
    </main>
</template>

<style scoped lang="scss"></style>
