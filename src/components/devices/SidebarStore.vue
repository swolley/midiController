<script lang="ts">
type SidebarDevices = Record<string, { opened: boolean; devices: Outboard[] }>;
</script>

<script setup lang="ts">
import type { DragResult, DropResult } from "@/services/types/devices";
import OutboardPreview from "@/components/editor/OutboardPreview.vue";
import { Container, Draggable } from "vue-dndrop";
import TrashIcon from "../icons/TrashIcon.vue";
import PlusIcon from "../icons/PlusIcon.vue";
import PaletteIcon from "../icons/PaletteIcon.vue";
import { useRack } from "@/stores/useRack";
import { ref } from "vue";
import type { Outboard } from "@/services/classes/Outboard";
import ConfirmDialog from "@/components/modals/ConfirmDialog.vue";
import AngleDownIcon from "../icons/AngleDownIcon.vue";
import AngleUpIcon from "../icons/AngleUpIcon.vue";
import { StringUtils } from "@/services/classes/Utils";

const emit = defineEmits([/*"dragdevice",*/ "createdevice", "openeditor"]);
defineProps<{
    show: boolean;
}>();

const rackStore = useRack();
rackStore.init();

const currentRemoveDeviceCb = ref<CallableFunction | null>(null);

const remapped: SidebarDevices = {};
for (const group in rackStore.availableDevices) {
    remapped[group] = { opened: false, devices: rackStore.availableDevices[group] };
}
const keys = Object.keys(remapped);
if (keys.length === 1) remapped[keys[0]].opened = true;

const groupedDevices = ref<SidebarDevices>(remapped);

function onDrop(dropResult: DropResult) {
    if (dropResult.addedIndex === null) {
        // emit("dragdevice", dropResult);
        console.log("cambio gruppo", dropResult.payload);
        rackStore.moveDeviceToRack(dropResult.payload.device.category, dropResult.removedIndex, dropResult.addedIndex);
    } else {
        rackStore.reorderCategoryDevices(dropResult);
    }
}

function removeDevice(device: Outboard) {
    rackStore.removeDevice(device);
}

function askRemoveDevice(device: Outboard) {
    currentRemoveDeviceCb.value = () => removeDevice(device);
}
</script>

<template>
    <div class="sidebar" :class="[{ 'p-2': show }, show ? 'w-1/2 md:w-1/3 xl:w-1/5' : 'w-0 overflow-hidden']">
        <div
            class="rounded border-2 border-dashed flex items-center justify-center p-5 m-1 mb-3 opacity-30 hover:opacity-70 transition-opacity cursor-pointer"
            @click="$emit('createdevice')"
        >
            <PlusIcon class="text-gray-100 text-xl" />
        </div>
        <div v-for="(group, name) in groupedDevices" :key="name">
            <div class="flex text-gray-500 items-center px-1 cursor-pointer" @click="group.opened = !group.opened">
                <div class="grow select-none">{{ StringUtils.ucFirst(name) }}</div>
                <AngleDownIcon v-if="group.opened" />
                <AngleUpIcon v-else />
            </div>
            <Transition>
                <Container
                    v-show="group.opened"
                    class="grow overflow-y-scroll relative"
                    group-name="devices"
                    :data-group="name"
                    orientation="vertical"
                    :get-child-payload="(index: number) => ({ group: name, device: group.devices[index] })"
                    @drop="onDrop"
                >
                    <template v-for="device in groupedDevices[name].devices" :key="device.id">
                        <!-- <label v-if="checkGroup(device.category)" class="text-gray-600 p-2 select-none">{{ device.category || "Uncategorized" }}</label> -->
                        <Draggable class="relative last:mb-2 draggable-item">
                            <OutboardPreview
                                class="cursor-pointer active:cursor-move opacity-95 hover:opacity-100 transition-opacity border border-gray-500"
                                :showPots="true"
                                :device="(device as Outboard)"
                            />
                            <template v-if="!device.stock">
                                <PaletteIcon
                                    class="rounded-full border absolute top-1 right-7 text-white p-1 text-2xl bg-black/50 opacity-50 hover:opacity-100 transition-opacity cursor-pointer shadow hover:shadow-lg"
                                    @click="$emit('openeditor', device)"
                                />
                                <TrashIcon
                                    class="rounded-full border absolute top-1 right-0 text-white p-1 text-2xl bg-black/50 opacity-50 hover:opacity-100 transition-opacity cursor-pointer shadow hover:shadow-lg"
                                    @click="askRemoveDevice(device as Outboard)"
                                />
                            </template>
                        </Draggable>
                    </template>
                </Container>
            </Transition>
        </div>

        <Teleport to="body">
            <ConfirmDialog
                v-if="currentRemoveDeviceCb !== null"
                message="Would you like to delete the selected device?"
                :yes-callback="currentRemoveDeviceCb"
                :no-callback="() => (currentRemoveDeviceCb = null)"
                @close="currentRemoveDeviceCb = null"
            />
        </Teleport>
    </div>
</template>

<style scoped scss>
.sidebar {
    @apply overflow-scroll shadow-lg h-full border border-black transition-all flex flex-col;
}
</style>
