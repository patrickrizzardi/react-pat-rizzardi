<script setup lang="ts"></script>

<template>
  <div class="absolute inset-x-0 bottom-0 overflow-hidden leading-[0]">
    <svg
      class="wave-back relative block w-full"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      style="height: 180px"
    >
      <path
        fill="currentColor"
        class="text-cyan-900/30"
        d="M0,160L48,170.7C96,181,192,203,288,192C384,181,480,139,576,133.3C672,128,768,160,864,181.3C960,203,1056,213,1152,202.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      />
    </svg>
    <svg
      class="wave-mid relative -mt-24 block w-full"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      style="height: 160px"
    >
      <path
        fill="currentColor"
        class="text-cyan-800/20"
        d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,218.7C672,213,768,171,864,154.7C960,139,1056,149,1152,165.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      />
    </svg>
    <svg
      class="wave-front relative -mt-20 block w-full"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      style="height: 140px"
    >
      <path
        fill="currentColor"
        class="text-navy-800"
        d="M0,256L48,261.3C96,267,192,277,288,272C384,267,480,245,576,234.7C672,224,768,224,864,234.7C960,245,1056,267,1152,261.3C1248,256,1344,224,1392,208L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      />
    </svg>
  </div>
</template>

<style scoped>
  .wave-back {
    animation: drift 8s ease-in-out infinite alternate;
  }
  .wave-mid {
    animation: drift 6s ease-in-out infinite alternate-reverse;
  }
  .wave-front {
    animation: drift 4s ease-in-out infinite alternate;
  }

  @keyframes drift {
    from {
      transform: translateX(-20px);
    }
    to {
      transform: translateX(20px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .wave-back,
    .wave-mid,
    .wave-front {
      animation: none;
    }
  }
</style>
