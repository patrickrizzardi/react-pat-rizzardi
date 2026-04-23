<script setup lang="ts"></script>

<template>
  <div class="pointer-events-none absolute inset-x-0 -bottom-px">
    <svg
      class="wave block w-full"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
    >
      <path
        class="text-cyan/8"
        fill="currentColor"
        d="M0,80 C360,160 720,20 1080,100 C1260,140 1380,120 1440,100 L1440,200 L0,200 Z"
      />
      <path
        class="text-cyan/5"
        fill="currentColor"
        d="M0,120 C240,60 480,160 720,100 C960,40 1200,140 1440,80 L1440,200 L0,200 Z"
      />
      <path
        fill="currentColor"
        class="text-navy"
        d="M0,140 C320,180 640,120 960,160 C1120,175 1300,150 1440,130 L1440,200 L0,200 Z"
      />
    </svg>
  </div>
</template>

<style scoped>
  .wave {
    height: 150px;
  }

  @media (min-width: 768px) {
    .wave {
      height: 200px;
    }
  }
</style>
