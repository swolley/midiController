<template>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2">
        <h1 class="flex flex-col md:flex-row items-end text-white text-center gap-4">
            <span class="text-9xl md:ml-8">404</span>
            <span class="mb-3">This is not the page you are looking for!!</span>
            <div class="animation mb-3"></div>
        </h1>
        <div class="h-1 grow bg-gradient-to-r from-white to-transparent"></div>
    </div>
</template>

<style scoped lang="scss">
$color_bar: #696969;
$color_high: #4b7b4a;

.animation {
    width: 100px;
    height: 20px;
    background: $color_bar;
    position: relative;
    // transform: translate(-110px);
    box-shadow: 0 -30px 0 $color_bar, 0 -60px 0 $color_bar, 0 -90px 0 $color_bar, 0 -120px 0 $color_bar;
    animation-name: bar1;
    animation-duration: 0.3s;
    animation-direction: alternate;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    &:before {
        content: "";
        position: absolute;
        transform: translate(60px, 0);
        @extend .animation;
        box-shadow: 0 -30px 0 $color_bar;
        animation-name: bar2;
    }
    &:after {
        content: "";
        position: absolute;
        transform: translate(170px, 0);
        @extend .animation;
        box-shadow: 0 -30px 0 $color_bar, 0 -60px 0 $color_bar, 0 -90px 0 $color_bar;
        animation-name: bar3;
    }
}

@keyframes bar1 {
    0%,
    19.9% {
        box-shadow: 0 -30px 0 $color_bar, 0 -60px 0 mix($color_high, $color_bar, 50%), 0 -90px 0 mix($color_high, $color_bar, 75%),
            0 -120px 0 mix($color_high, $color_bar, 100%);
    }
    20%,
    39.9% {
        box-shadow: 0 -30px 0 $color_bar, 0 -60px 0 mix($color_high, $color_bar, 50%), 0 -90px 0 mix($color_high, $color_bar, 75%);
    }
    40%,
    59.9% {
        box-shadow: 0 -30px 0 $color_bar, 0 -60px 0 mix($color_high, $color_bar, 50%);
    }
    60%,
    79.9% {
        box-shadow: 0 -30px 0 $color_bar;
    }
    80%,
    100% {
        box-shadow: none;
    }
}

@keyframes bar2 {
    0%,
    19.9% {
        box-shadow: none;
    }
    20%,
    39.9% {
        box-shadow: 0 -30px 0 $color_bar;
    }
    40%,
    59.9% {
        box-shadow: 0 -30px 0 $color_bar, 0 -60px 0 mix($color_high, $color_bar, 50%);
    }
    60%,
    79.9% {
        box-shadow: 0 -30px 0 $color_bar, 0 -60px 0 mix($color_high, $color_bar, 50%), 0 -90px 0 mix($color_high, $color_bar, 75%),
            0 -120px 0 mix($color_high, $color_bar, 100%);
    }
    80%,
    100% {
        box-shadow: 0 -30px 0 $color_bar, 0 -60px 0 mix($color_high, $color_bar, 50%), 0 -90px 0 mix($color_high, $color_bar, 75%);
    }
}

@keyframes bar3 {
    0%,
    19.9% {
        box-shadow: 0 -30px 0 $color_bar, 0 -60px 0 mix($color_high, $color_bar, 50%);
    }
    20%,
    39.9% {
        box-shadow: 0 -30px 0 $color_bar;
    }
    40%,
    59.9% {
        box-shadow: 0 -30px 0 $color_bar, 0 -60px 0 mix($color_high, $color_bar, 50%);
    }
    60%,
    79.9% {
        box-shadow: 0 -30px 0 $color_bar, 0 -60px 0 mix($color_high, $color_bar, 50%), 0 -90px 0 mix($color_high, $color_bar, 75%);
    }
    80%,
    100% {
        box-shadow: 0 -30px 0 $color_bar, 0 -60px 0 mix($color_high, $color_bar, 50%), 0 -90px 0 mix($color_high, $color_bar, 75%),
            0 -120px 0 mix($color_high, $color_bar, 100%);
    }
}
</style>
