<template>
  <div class="dashboard-container">
    <div class="content-wrapper">
      <!-- Logo区域 -->
      <!-- <div class="logo-container">
        <img src="/static/logo.png" alt="Logo" class="logo">
      </div> -->

      <!-- 动态文字区域 -->
      <div class="text-container">
        <transition name="fade" mode="out-in">
          <div :key="currentText" class="dynamic-text rainbow-text">
            {{ currentText }}
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardAdmin',
  data() {
    return {
      texts: [
        'OVERLOOK INVESTMENTS LIMITED'
      ],
      currentTextIndex: 0,
      timer: null
    }
  },
  computed: {
    currentText() {
      return this.texts[this.currentTextIndex]
    }
  },
  mounted() {
    this.startTextAnimation()
  },
  beforeDestroy() {
    this.clearTimer()
  },
  methods: {
    startTextAnimation() {
      this.clearTimer()

      this.timer = setInterval(() => {
        this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length
      }, 1000)
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  .content-wrapper {
    text-align: center;
    width: 100%;

    .logo-container {
      margin-bottom: 60px;

      .logo {
        width: 300px;
        height: auto;
        object-fit: contain;
      }
    }

    .text-container {
      min-height: 30vh;  /* 确保容器至少占屏幕高度的30% */
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;

      .dynamic-text {
        font-size: min(8vw, 96px);  /* 响应式字体大小，最大96px */
        font-weight: bold;
        letter-spacing: 0.1em;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        white-space: nowrap;
        width: 100%;
        padding: 0 20px;
      }
    }
  }
}

.rainbow-text {
  background: linear-gradient(
    to right,
    #ff0000,
    #ff7f00,
    #ffff00,
    #00ff00,
    #0000ff,
    #4b0082,
    #8f00ff
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: rainbow 8s linear infinite;
  background-size: 200% auto;
}

@keyframes rainbow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.8s ease;
}

.fade-enter {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.dynamic-text {
  transform-style: preserve-3d;
  perspective: 1000px;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px) rotateX(0deg);
  }
  50% {
    transform: translateY(-10px) rotateX(5deg);
  }
  100% {
    transform: translateY(0px) rotateX(0deg);
  }
}

@media screen and (max-width: 768px) {
  .dashboard-container {
    .content-wrapper {
      .logo-container {
        .logo {
          width: 200px;
        }
      }

      .text-container {
        min-height: 20vh;  /* 在移动端稍微减小高度 */

        .dynamic-text {
          font-size: min(10vw, 64px);  /* 移动端调整字体大小 */
        }
      }
    }
  }
}
</style>
