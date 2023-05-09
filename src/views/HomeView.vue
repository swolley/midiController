<script setup lang="ts">
import BoxContainer from "@/components/rack/BoxContainer.vue";
import RackContainer from "@/components/rack/RackContainer.vue";
import ConsoleDevice from "@/components/devices/ConsoleDevice.vue";
import ToolBar from "@/components/toolbar/ToolBar.vue";
import { computed, ref, watch } from "vue";
import { useRack } from "@/stores/useRack";
import ModalPanel from "@/components/modals/ModalPanel.vue";
import OutboardDevice from "@/components/devices/OutboardDevice.vue";
import type { Midi } from "@/services/classes/Midi";
import type { DropResult } from "@/services/types/devices";
import { Container, Draggable } from "vue-dndrop";
import SidebarStore from "@/components/devices/SidebarStore.vue";
import DeviceEditor from "@/components/editor/DeviceEditor.vue";
import type RackConsole from "@/services/classes/RackConsole";
import AppConfig from "@/components/editor/AppConfig.vue";
import type { Outboard } from "@/services/classes/Outboard";
import { useWindowSize } from "@vueuse/core";

const rackStore = useRack();
const { width } = useWindowSize();
const isDesktop = computed(() => width.value >= 1024);

const showConsole = ref<boolean>(true);
const collapseAll = ref<boolean>(false);
const showStore = ref<boolean>(rackStore.rackDevices.length === 0);
const selectedDevice = ref<Outboard | undefined>(rackStore.rackDevices.length ? (rackStore.rackDevices[0] as Outboard) : undefined);
const modifiedDevice = ref<Outboard | undefined>();
const openSettings = ref<boolean>(false);
const openEditor = ref<boolean>(false);

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
    collapseAll.value = collapse;
}

function onDrop(dropResult: DropResult) {
    if (dropResult.removedIndex === null && dropResult.addedIndex !== null) {
        rackStore.moveDeviceToRack(dropResult.payload.device, dropResult.addedIndex);
        selectedDevice.value = dropResult.payload.device;
    } else if (dropResult.removedIndex !== null && dropResult.addedIndex !== null && dropResult.payload.list === "rack") {
        rackStore.reorderRackDevices(dropResult.payload.device, dropResult.removedIndex, dropResult.addedIndex);
    }
}

function touchStart(touchEvent: TouchEvent) {
    if (touchEvent.changedTouches.length !== 1) return;
    const posYStart = touchEvent.changedTouches[0].clientY;
    addEventListener("touchend", (touchEvent) => touchEnd(touchEvent as TouchEvent, posYStart), { once: true });
}

function touchEnd(touchEvent: TouchEvent, posYStart: number) {
    // I only care if one finger is used
    if (touchEvent.changedTouches.length !== 1) return;
    const posYEnd = touchEvent.changedTouches[0].clientY;
    if (posYStart > posYEnd) {
        showStore.value = false;
    } else if (posYStart < posYEnd) {
        showStore.value = true;
    }
}

function createDevice() {
    const newDevice = rackStore.createNewDevice();
    toggleEditor(newDevice);
}

function onDeviceClick(device: Outboard) {
    selectedDevice.value = device;
}

function moveBackToStore(device: Outboard) {
    rackStore.moveDeviceBackToStore(device);
}

watch(
    () => selectedDevice.value,
    () => {
        if (selectedDevice.value) document.title = "App - " + selectedDevice.value.label;
    }
);
</script>

<template>
    <main class="h-full flex">
        <SidebarStore :show="showStore" @openeditor="toggleEditor" @createdevice="createDevice" />
        <!-- box -->
        <BoxContainer class="w-full" @touchstart="touchStart">
            <template v-slot:header>
                <!-- header -->
                <ToolBar
                    class="mx-2 my-3"
                    :show-toggle-console="isDesktop"
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
                    :get-child-payload="(index: number) => ({ list: 'rack', device: rackStore.rackDevices[index] })"
                    :fire-related-events-only="true"
                    drag-handle-selector=".column-drag-handle"
                    group-name="devices"
                    data-index="rack"
                    orientation="vertical"
                    @drop="(drop: DropResult) => onDrop(drop)"
                    v-if="rackStore.midi !== undefined || rackStore.http !== undefined"
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
                            @openeditor="() => toggleEditor(device as Outboard)"
                            @removedevice="() => moveBackToStore(device as Outboard)"
                            @click="onDeviceClick(device as Outboard)"
                        />
                    </Draggable>
                </Container>

                <template v-slot:footer v-if="rackStore.console && isDesktop">
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
