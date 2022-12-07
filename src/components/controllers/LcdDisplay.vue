<script setup lang="ts">
import { computed } from "vue";
import ControllerLabel from "./ControllerLabel.vue";

const props = defineProps<{
    label?: string;
    invert: boolean;
    value?: string;
    note?: number;
}>();
const currentValue = computed(() => formatValueOutput(props.value || ""));
const currentNote = computed(() => formatNoteOutput(props.note || ""));

function formatValueOutput(value: number | string = "") {
    return ("" + value).substring(-3);
}

function formatNoteOutput(value: number | "") {
    const notes = ["c", "c#", "d", "e", "f", "f#", "g", "a♭", "a", "b♭", "b"];
    return value !== "" ? notes[(value - 1) % 11] + Math.floor((value - 1) / 11).toFixed() : "";
}
</script>

<template>
    <div class="flex flex-col items-center">
        <div class="flex items-center flex-row justify-center border-3d px-1 w-20 relative" :class="invert ? 'invert bg-white' : 'bg-black'">
            <div class="w-12 relative">
                <div
                    class="absolute w-12 font-digital text-2xl select-none cursor-default pointer-events-none bg-black/0 text-off/40 text-center mt-1"
                    :class="{ invert: invert }"
                >
                    888
                </div>
                <input
                    type="text"
                    v-model="currentValue"
                    readonly
                    maxlength="3"
                    class="font-digital w-12 text-2xl m-1 pr-3 select-none cursor-default pointer-events-none bg-black/0 text-on z-10 text-right"
                    :class="invert ? 'invert bg-black/0' : ''"
                />
            </div>
            <div class="absolute top-0 right-0">
                <small class="absolute right-0 mr-1 font-digital text-off/40" :class="{ invert: invert }">888</small>
                <small class="absolute right-0 mr-1 font-digital text-on z-10" :class="{ invert: invert }">{{ currentNote }}</small>
            </div>
        </div>
        <ControllerLabel v-if="label" :label="label" :invert="invert" />
    </div>
</template>

<style scoped lang="scss"></style>
0
