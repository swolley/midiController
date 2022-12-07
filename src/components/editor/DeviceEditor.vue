<script setup lang="ts">
import type { IDeviceConfig } from "@/services/types/devices";
import { Container, Draggable } from "vue-dndrop";
defineProps<{
    device: IDeviceConfig;
}>();
function onDrop(groupIndex: "rack" | "available", dropResult: Event) {
    // let result = applyDrag(groupIndex === "rack" ? props.rackDevices : props.availableDevices, dropResult);
    //   Vue.set(this.groups, groupIndex, result);
    console.log("drop from", groupIndex);
}

function applyDrag(list: IDeviceConfig[], dragResult: Event) {
    // const { removedIndex, addedIndex, payload } = dragResult;
    // if (removedIndex === null && addedIndex === null) return list;
    // const result = [...list];
    // let itemToAdd = payload;
    // if (removedIndex !== null) itemToAdd = result.splice(removedIndex, 1)[0];
    // if (addedIndex !== null) result.splice(addedIndex, 0, itemToAdd);
    // return result;
}
</script>

<template>
    <form v-if="device">
        <div class="flex gap-2" v-if="device">
            <div class="flex flex-col grow">
                <label for="id" class="form-label">id</label>
                <input name="id" class="form-input" :value="device.id" />
            </div>
            <div class="flex flex-col grow">
                <label for="deviceLabel" class="form-label">label</label>
                <input name="deviceLabel" class="form-input" :value="device.label" />
            </div>
            <div class="flex flex-col grow">
                <label for="backgroundColor" class="form-label">background color</label>
                <input tpe="color" name="backgroundColor" class="form-input" :value="device.backgroundColor" />
            </div>
            <div class="flex flex-col grow">
                <label for="panelColor" class="form-label">panel color</label>
                <input tpe="color" name="panelColor" class="form-input" :value="device.panelColor" />
            </div>
            <div class="flex flex-col grow">
                <label for="borderColor" class="form-label">border color</label>
                <input tpe="color" name="borderColor" class="form-input" :value="device.borderColor" />
            </div>
        </div>
        <hr class="h-px m-2 border-gray-800" />
        <div class="gap-2">
            <Container
                group-name="devices"
                class="grow-0 shrink-0 overflow-x-auto gap-1 shadow-inner"
                data-index="rackDevices"
                orientation="vertical"
                lock-axis="y"
                non-drag-area-selector=".field"
                drag-handle-selector=".column-drag-handle"
            >
                <Draggable v-for="(controller, index) in device.controllers" :key="index" class="flex items-center gap-2">
                    <span class="column-drag-handle text-white opacity-20 hover:opacity-30 transtition-opacity cursor-pointer active:cursor-move flex"
                        >&#x2630;</span
                    >
                    <div class="grow grid grid-cols-5 gap-2">
                        <div class="flex flex-col field">
                            <label for="type" class="form-label">type</label>
                            <select name="type" class="form-select" v-model="controller.type">
                                <option value="LCD">lcd</option>
                                <option value="TOGGLE">toggle</option>
                                <option value="ROTARY">rotary</option>
                            </select>
                        </div>
                        <div class="flex flex-col field">
                            <label for="controllerLabel" class="form-label">label</label>
                            <input tpe="text" name="controllerLabel" class="form-input" :value="controller.label" />
                        </div>
                        <div class="flex flex-col field">
                            <label for="message" class="form-label">message</label>
                            <select name="message" class="form-select" v-model="controller.type">
                                <option value="PC">Program Change</option>
                                <option value="CC">Control Change</option>
                            </select>
                        </div>
                        <div class="flex flex-col field">
                            <label for="minValue" class="form-label">min value</label>
                            <input tpe="number" name="minValue" class="form-input" :value="controller.minValue" />
                        </div>
                        <div class="flex flex-col field">
                            <label for="maxValue" class="form-label">min value</label>
                            <input tpe="number" name="maxValue" class="form-input" :value="controller.maxValue" />
                        </div>
                    </div>
                </Draggable>
            </Container>
        </div>
    </form>
</template>

<style scss scoped>
.form-label {
    @apply text-sm text-gray-500;
}

.form-input {
    @apply rounded border border-white/10 w-full p-2 shadow bg-white/10 hover:bg-white/20 text-white transition-colors h-10;
}
.form-select {
    @apply rounded border border-white/10 w-full py-2.5 p-2 shadow bg-white/10 hover:bg-white/20 text-white transition-colors  h-10;
}
option {
    @apply bg-black/90;
}

.field {
    @apply grow justify-center;
}
</style>
