<script setup lang="ts">
import type { DragResult, IDeviceConfig } from "@/services/types/devices";
import OutboardPreview from "@/components/editor/OutboardPreview.vue";
import { Container, Draggable } from "vue-dndrop";
import TrashIcon from "../icons/TrashIcon.vue";
import PlusIcon from "../icons/PlusIcon.vue";
import PaletteIcon from "../icons/PaletteIcon.vue";
// import { ref } from "vue";

const emit = defineEmits(["dragdevice", "removedevice", "createdevice", "openeditor"]);
defineProps<{
    availableDevices: IDeviceConfig[];
    rackDevices: IDeviceConfig[];
    show: boolean;
}>();

// let currentLabel: string | undefined = "";

// function checkGroup(category?: string): boolean {
//     if (category !== currentLabel) {
//         currentLabel = category;
//         return true;
//     }

//     return false;
// }

function onDrop(dropResult: DragResult) {
    emit("dragdevice", dropResult);
}
</script>

<template>
    <div class="sidebar" :class="[{ 'p-2': show }, show ? 'w-1/2 md:w-1/3 xl:w-1/5' : 'w-0 overflow-hidden']">
        <div class="rounded border-2 border-dashed flex items-center justify-center p-5 m-1 opacity-30 hover:opacity-70 transition-opacity cursor-pointer">
            <PlusIcon class="text-gray-100 text-xl" @click="$emit('createdevice')" />
        </div>
        <Container
            group-name="devices"
            data-index="available"
            orientation="vertical"
            class="grow overflow-y-scroll"
            :get-child-payload="(index: number) => rackDevices[index]"
            @drop="onDrop"
        >
            <template v-for="device in availableDevices" :key="device.id">
                <!-- <label v-if="checkGroup(device.category)" class="text-gray-600 p-2 select-none">{{ device.category || "Uncategorized" }}</label> -->
                <Draggable class="relative last:mb-2">
                    <OutboardPreview
                        :device="device"
                        class="draggable-item cursor-pointer active:cursor-move opacity-95 hover:opacity-100 transition-opacity border border-gray-500"
                        :showPots="true"
                    />
                    <template v-if="!device.stock">
                        <TrashIcon
                            class="rounded-full border absolute top-1 right-0 text-white p-1 text-2xl bg-black/50 opacity-50 hover:opacity-100 transition-opacity cursor-pointer shadow hover:shadow-lg"
                            @click="$emit('removedevice', device)"
                        />
                        <PaletteIcon
                            class="rounded-full border absolute top-1 right-7 text-white p-1 text-2xl bg-black/50 opacity-50 hover:opacity-100 transition-opacity cursor-pointer shadow hover:shadow-lg"
                            @click="$emit('openeditor', device)"
                        />
                    </template>
                </Draggable>
            </template>
        </Container>
    </div>
</template>

<style scoped scss>
.sidebar {
    @apply overflow-scroll shadow-lg h-full border border-black transition-all flex flex-col;
}
</style>
