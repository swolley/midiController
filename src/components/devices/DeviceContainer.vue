<script lang="ts" setup>
import { useColors } from "@/composables/useColors";
import { ref } from "vue";
import CollapseButton from "../controllers/CollapseButton.vue";
import ScrewIcon from "../controllers/ScrewIcon.vue";

export interface IDeviceProps {
    background: string;
    collapsable: boolean;
    collapsed: boolean;
    display?: "vertical" | "horizontal";
    label?: string;
}

const emit = defineEmits(["togglecollapse"]);
const props = withDefaults(defineProps<IDeviceProps>(), { background: "#000000", display: "vertical" });

const { background, isFgInverted } = useColors(props.background);
const collapsed = ref<boolean>(false);
const invert = ref<boolean>(isFgInverted);

function toggleCollapsed() {
    if (props.collapsable) collapsed.value = !collapsed.value;
    emit("togglecollapse");
}
</script>

<template>
    <!-- DEVICE -->
    <div class="device" :class="{ collapsed: collapsed }" :style="{ 'background-color': background.toString() }">
        <div class="px-2 flex flex-col items-center" :class="collapsed ? 'justify-center' : 'justify-between'">
            <ScrewIcon />
            <span class="column-drag-handle opacity-20 hover:opacity-30 transtition-opacity cursor-pointer active:cursor-move">&#x2630;</span>
            <ScrewIcon v-show="!collapsed" />
        </div>
        <div class="flex grow relative px-2" :class="display === 'vertical' ? 'flex-col' : 'flex-row'">
            <label
                v-if="label"
                class="absolute mix-blend-soft-light top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transition-opacity whitespace-nowrap"
                :class="[{ invert: invert }, collapsed ? 'opacity-20 text-3xl' : 'opacity-0  text-7xl']"
            >
                {{ label }}
            </label>
            <div class="flex justify-between relative">
                <CollapseButton
                    class="items-start"
                    v-if="collapsable"
                    :collapsed="collapsed"
                    :invert="invert"
                    @togglecollapse="toggleCollapsed"
                    title="Toggle collapse"
                />
                <!-- custom headers -->
                <!-- <template v-if="!collapsed"> -->
                <slot name="header"></slot>
                <!-- </template> -->
            </div>
            <div class="flex grow relative h-full mx-auto w-full lg:w-11/12" v-show="!collapsed">
                <!-- device controllers -->
                <slot></slot>
            </div>
        </div>
        <div class="px-2 flex flex-col items-center" :class="collapsed ? 'justify-center' : 'justify-between'">
            <ScrewIcon />
            <span class="column-drag-handle opacity-20 hover:opacity-30 transtition-opacity cursor-pointer active:cursor-move">&#x2630;</span>
            <ScrewIcon v-show="!collapsed" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.device {
    @apply rounded-sm my-1 mx-0.5 py-2 overflow-hidden select-none flex;
    box-shadow: 0px 1px 4px;
    background-image: url(/metal.jpg);
    background-blend-mode: soft-light;
    min-height: 135px;

    &:not(.collapsed):hover label {
        @apply opacity-10;
    }

    &.collapsed {
        min-height: 40px;
        max-height: 40px;
    }
}
</style>
