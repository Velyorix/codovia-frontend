<template>
  <section class="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0d0f18] via-[#131520] to-[#0a0b10] overflow-hidden">
    <!-- Background Particles -->
    <div class="absolute inset-0 pointer-events-none">
      <div v-for="i in 15" :key="i" class="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-twinkle" :style="generateParticleStyle(i)"></div>
    </div>

    <!-- Centered Content -->
    <div class="relative z-10 text-center">
      <!-- Central Globe with Ring Animation -->
      <div class="relative flex items-center justify-center mx-auto mb-16">
        <!-- Expanding Ring -->
        <div class="absolute w-40 h-40 rounded-full border-[3px] animate-ringPulse"
             style="border-color: rgba(157, 51, 223, 0.5);"></div>
        <!-- Core Circle with Animated Shadow -->
        <div class="relative w-32 h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full shadow-2xl animate-shadowPulse"></div>
      </div>

      <!-- Maintenance Message -->
      <h1 class="text-5xl font-extrabold mb-6 animate-fadeIn delay-200">
        <span class="text-gradient">
          Maintenance en cours
        </span>
      </h1>
      <p class="text-gray-400 text-lg mb-12 animate-fadeIn delay-300">
        Nous préparons quelque chose de génial pour vous. Revenez bientôt !
      </p>

      <!-- Progress Bar -->
      <div class="relative mx-auto w-2/3 max-w-lg h-6 bg-gray-700 rounded-full overflow-hidden mb-8">
        <div
            class="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-progressLoop"
        ></div>
        <div class="absolute inset-0 flex items-center justify-center text-white font-semibold">
          {{ progressPercentage }}%
        </div>
      </div>

      <!-- Task List Button -->
      <button
          class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition mb-4"
          @click="toggleTaskList"
      >
        {{ showTaskList ? "Masquer les étapes" : "Afficher les étapes restantes" }}
      </button>

      <!-- Social Links -->
      <div class="flex justify-center space-x-6 mt-4">
        <a href="https://twitter.com" target="_blank" class="text-gray-400 hover:text-purple-500 transition">
          <font-awesome-icon :icon="['fab', 'twitter']" size="2x" />
        </a>
        <a href="https://github.com" target="_blank" class="text-gray-400 hover:text-purple-500 transition">
          <font-awesome-icon :icon="['fab', 'github']" size="2x" />
        </a>
        <a href="mailto:support@codovia.com" class="text-gray-400 hover:text-purple-500 transition">
          <font-awesome-icon :icon="['fas', 'envelope']" size="2x" />
        </a>
      </div>

      <!-- Task List -->
      <div v-if="showTaskList" class="max-w-lg mx-auto bg-gray-800 p-4 rounded-lg shadow-md text-left mt-6">
        <h2 class="text-white text-xl font-bold mb-4">Étapes</h2>
        <table class="w-full text-left text-gray-300">
          <thead>
          <tr>
            <th class="border-b border-gray-700 pb-2">Tâche</th>
            <th class="border-b border-gray-700 pb-2">Statut</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="task in tasksToDo" :key="task" class="hover:bg-gray-700 transition">
            <td class="py-2">{{ task }}</td>
            <td class="py-2 text-yellow-400">À faire</td>
          </tr>
          <tr v-for="task in tasksDone" :key="task" class="hover:bg-gray-700 transition">
            <td class="py-2">{{ task }}</td>
            <td class="py-2 text-green-400">Terminé</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";

// FontAwesome Setup
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
library.add(faTwitter, faGithub, faEnvelope);

// Génère des styles aléatoires pour les particules
const generateParticleStyle = (index) => {
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;
  const delay = Math.random() * 5;
  const duration = Math.random() * 5 + 5;

  return {
    top: `${randomY}%`,
    left: `${randomX}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  };
};

// Tasks directories
const tasksToDo = ref([
    "Implémenter les tests unitaires"
]);
const tasksDone = ref([
    "Initialiser le projet",
    "Configurer TailwindCSS",
    "Configurer la base de données",
    "Créer les endpoints"
]);

// Calculate progress percentage
const progressPercentage = computed(() => {
  const totalTasks = tasksToDo.value.length + tasksDone.value.length;
  const completedTasks = tasksDone.value.length;
  return Math.round((completedTasks / totalTasks) * 100);
});

// Show/Hide Task List
const showTaskList = ref(false);
const toggleTaskList = () => {
  showTaskList.value = !showTaskList.value;
};
</script>

<style scoped>
/* Animation: Twinkling Particles */
@keyframes twinkle {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.8;
  }
}
.animate-twinkle {
  animation: twinkle linear infinite;
}

/* Animation: Gradient Text Effect */
.text-gradient {
  background: linear-gradient(270deg, #6c63ff, #f72585, #7209b7, #4cc9f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 300% 300%;
  animation: gradient 6s ease infinite;
}

/* Animation: Expanding Ring Pulse */
@keyframes ringPulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}
.animate-ringPulse {
  animation: ringPulse 2.5s infinite ease-out;
}

/* Animation: Shadow Pulse for the Bubble */
@keyframes shadowPulse {
  0% {
    box-shadow: 0 0 10px 5px rgba(157, 51, 223, 0.5);
  }
  100% {
    box-shadow: 0 0 20px 10px rgba(157, 51, 223, 0.2);
  }
}
.animate-shadowPulse {
  animation: shadowPulse 3s infinite alternate;
}

/* Animation: Progress Bar with Loop */
@keyframes progressLoop {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}
.animate-progressLoop {
  animation: progressLoop 3s linear infinite;
}

/* Animation: Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.animate-fadeIn {
  animation: fadeIn 1.5s ease-out forwards;
}
</style>