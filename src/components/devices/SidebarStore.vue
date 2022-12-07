<script setup lang="ts">
import type { DragResult, IDeviceConfig } from "@/services/types/devices";
import OutboardPreview from "@/components/editor/OutboardPreview.vue";
import { Container, Draggable } from "vue-dndrop";
import TrashIcon from "../icons/TrashIcon.vue";
import PlusIcon from "../icons/PlusIcon.vue";
import PaletteIcon from "../icons/PaletteIcon.vue";
import { computed } from "@vue/reactivity";

const emit = defineEmits(["dragdevice", "removedevice", "createdevice", "openeditor"]);
const props = defineProps<{
    availableDevices: IDeviceConfig[];
    rackDevices: IDeviceConfig[];
    show: boolean;
}>();

const groupedDevices = computed(() => {
    const groups: Record<string, IDeviceConfig[]> = {};
    for (const device of props.availableDevices) {
        const category = device.category || "uncategorized";
        if (!(category in groups)) groups[category] = [];
        groups[category].push(device);
    }

    return groups;
});

function onDrop(dropResult: DragResult) {
    emit("dragdevice", dropResult);
}
</script>

<template>
    <div class="sidebar gap-2" :class="[{ 'p-2': show }, show ? 'w-1/2 md:w-1/4 xl:w-1/6' : 'w-0 overflow-hidden']">
        <div v-for="(devices, category) in groupedDevices" :key="category">
            <label class="text-gray-600 p-2">{{ category }}</label>
            <Container group-name="devices" data-index="available" orientation="vertical" @drop="onDrop">
                <Draggable v-for="device in devices" :key="device.id" class="relative last:mb-2">
                    <OutboardPreview
                        :device="device"
                        class="draggable-item cursor-pointer active:cursor-move opacity-95 hover:opacity-100 transition-opacity border border-gray-500"
                        :showPots="true"
                    />
                    <TrashIcon
                        v-if="!device.stock"
                        class="rounded-full border absolute top-1 right-0 text-white p-1 text-2xl bg-black/50 opacity-50 hover:opacity-100 transition-opacity cursor-pointer shadow hover:shadow-lg"
                        @click="$emit('removedevice', device)"
                    />
                    <PaletteIcon
                        v-if="!device.stock"
                        class="rounded-full border absolute bottom-1 right-0 text-white p-1 text-2xl bg-black/50 opacity-50 hover:opacity-100 transition-opacity cursor-pointer shadow hover:shadow-lg"
                        @click="$emit('openeditor', device)"
                    />
                </Draggable>
            </Container>
        </div>
        <div class="rounded border-2 border-dashed flex items-center justify-center p-5 m-1 mt-2 opacity-30 hover:opacity-70 transition-opacity cursor-pointer">
            <PlusIcon class="text-gray-100 text-xl" @click="$emit('createdevice')" />
        </div>
    </div>
</template>

<style scoped scss>
.sidebar {
    @apply overflow-scroll shadow-lg h-full border border-black transition-all;
}
</style>
