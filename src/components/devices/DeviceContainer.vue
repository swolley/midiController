<script lang="ts" setup>
import { useColors } from "@/composables/useColors";
import { ref } from "vue";
import CollapseButton from "@/components/controllers/CollapseButton.vue";
import ScrewIcon from "@/components/controllers/ScrewIcon.vue";
import DragIcon from "@/components/icons/DragIcon.vue";
import type Color from "@/services/classes/Color";

const emit = defineEmits(["togglecollapse"]);
const props = withDefaults(
    defineProps<{
        background: Color;
        collapsable: boolean;
        collapsed: boolean;
        draggable?: boolean;
        selected?: boolean;
        display?: "vertical" | "horizontal";
        label?: string;
    }>(),
    {
        display: "vertical",
        draggable: false,
        selected: false,
    }
);

const { background, isFgInverted } = useColors(props.background);
const currentlyCollapsed = ref<boolean>(props.collapsed);
const invert = ref<boolean>(isFgInverted);

function toggleCollapsed() {
    if (props.collapsable) currentlyCollapsed.value = !currentlyCollapsed.value;
    emit("togglecollapse");
}
</script>

<template>
    <!-- DEVICE -->
    <div
        class="device"
        :class="{ collapsed: currentlyCollapsed || collapsed }"
        :style="{ 'background-color': background.toString(), 'box-shadow': selected ? '0px 10px 12px 6px' : '0px 1px 4px' }"
    >
        <div
            class="px-2 flex flex-col items-center"
            v-show="!collapsed && !currentlyCollapsed"
            :class="currentlyCollapsed || collapsed ? 'justify-center' : 'justify-between'"
        >
            <ScrewIcon />
            <DragIcon v-if="draggable" :class="[{ invert }, 'column-drag-handle']" />
            <ScrewIcon />
        </div>
        <div class="flex grow relative px-2" :class="display === 'vertical' ? 'flex-col' : 'flex-row'">
            <div class="flex justify-between relative">
                <CollapseButton
                    class="items-start"
                    v-if="collapsable"
                    :collapsed="currentlyCollapsed || collapsed"
                    :invert="invert"
                    @togglecollapse="toggleCollapsed"
                    title="Toggle collapse"
                />
                <!-- custom headers -->
                <slot name="header"></slot>
            </div>
            <div class="flex grow relative h-full mx-auto w-full lg:w-11/12" v-show="!currentlyCollapsed && !collapsed">
                <!-- device controllers -->
                <slot></slot>
            </div>
        </div>
        <div
            class="px-2 flex flex-col items-center"
            v-show="!collapsed && !currentlyCollapsed"
            :class="currentlyCollapsed || collapsed ? 'justify-center' : 'justify-between'"
        >
            <ScrewIcon />
            <DragIcon v-if="draggable" :class="[{ invert }, 'column-drag-handle']" />
            <ScrewIcon />
        </div>
    </div>
</template>

<style scoped lang="scss">
.device {
    @apply rounded-sm my-1 mx-0.5 py-2 overflow-hidden select-none flex;
    // box-shadow: 0px 1px 4px;
    background-image: url(/metal.jpg);
    background-blend-mode: soft-light;
    min-height: 151px;

    &:not(.collapsed):hover label {
        @apply opacity-10;
    }

    &.collapsed {
        min-height: unset;
        // max-height: 40px;
    }
}
</style>
