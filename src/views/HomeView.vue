<script setup lang="ts">
import RackContainer from "@/components/rack/RackContainer.vue";
import { ref } from "vue";
import { useRack } from "@/stores/useRack";
import ModalPanel from "@/components/modals/ModalPanel.vue";
import SidebarStore from "@/components/devices/SidebarStore.vue";
import DeviceEditor from "@/components/editor/DeviceEditor.vue";
import AppConfig from "@/components/editor/AppConfig.vue";
import { Outboard } from "@/services/classes/Outboard";

const rackStore = useRack();

const showStore = ref<boolean>(rackStore.rackDevices.length === 0);
const modifiedDevice = ref<Outboard | undefined>();
const openSettings = ref<boolean>(false);
const openEditor = ref<boolean>(false);

function cloneDevice(device: Outboard) {
    return new Outboard(JSON.parse(JSON.stringify(device))) as Outboard;
}

function toggleEditor(device?: Outboard, askConfirm = false) {
    if (device) {
        modifiedDevice.value = cloneDevice(device);
    } else if (askConfirm && confirm("Do you want to cancel this device edting?")) {
        modifiedDevice.value = undefined;
    }
    openEditor.value = device !== undefined;
}
function saveAndCloseEditor() {
    if (modifiedDevice.value) {
        modifiedDevice.value = undefined;
        openEditor.value = false;
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
</script>

<template>
    <main class="h-full flex">
        <SidebarStore :show="showStore" @openeditor="toggleEditor" @createdevice="createDevice" />

        <RackContainer
            class="w-full"
            @touchstart="touchStart"
            @openeditor="toggleEditor"
            @togglestore="showStore = !showStore"
            @togglesettings="openSettings = !openSettings"
        />

        <Teleport to="body">
            <ModalPanel v-if="modifiedDevice && openEditor" :show="modifiedDevice && openEditor">
                <template v-slot:body>
                    <DeviceEditor :device="modifiedDevice" class="px-5" />
                </template>
                <template v-slot:footer>
                    <div class="flex flex-col md:flex-row grow gap-2">
                        <button
                            class="rounded border border-white/10 w-full p-2 shadow bg-white/10 hover:bg-white/20 text-white transition-colors"
                            @click="toggleEditor(undefined, true)"
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
