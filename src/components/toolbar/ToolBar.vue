<script lang="ts" setup>
import AngleDownIcon from "../icons/AngleDownIcon.vue";
import AngleUpIcon from "../icons/AngleUpIcon.vue";
import ConsoleIcon from "../icons/ConsoleIcon.vue";
import BookIcon from "../icons/BookIcon.vue";
import SlidersIcon from "../icons/SlidersIcon.vue";

const emit = defineEmits(["togglecollapseall", "openeditor", "toggleconsole", "togglestore", "togglesettings"]);

function toggleCollapseAll(collapse: boolean) {
    emit("togglecollapseall", collapse);
}
</script>

<template>
    <nav class="flex justify-between gap-2">
        <div class="flex gap-2">
            <button class="btn btn-outline h-8 xl:h-7 aspect-square invert" title="Open Settings">
                <BookIcon @click="$emit('togglestore')" />
            </button>
            <button class="btn btn-outline h-8 xl:h-7 aspect-square invert" title="Open Settings">
                <SlidersIcon @click="$emit('togglesettings')" />
            </button>
        </div>
        <div class="flex gap-2">
            <button class="btn btn-outline h-8 xl:h-7 aspect-square invert" title="Collapse all">
                <AngleUpIcon @click="() => toggleCollapseAll(true)" />
            </button>
            <button class="btn btn-outline h-8 xl:h-7 aspect-square invert" title="Expand all">
                <AngleDownIcon @click="() => toggleCollapseAll(false)" />
            </button>
            <button class="btn btn-outline h-8 xl:h-7 aspect-square invert" title="Toggle Console">
                <ConsoleIcon @click="$emit('toggleconsole')" />
            </button>
        </div>
    </nav>
</template>

<style scoped lang="scss"></style>
