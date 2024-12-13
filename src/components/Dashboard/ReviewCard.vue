<template>
  <div class="bg-gray-800 p-6 rounded-lg shadow-md">
    <h3 class="text-lg font-bold text-primary mb-2">{{ article.title || "Titre non disponible" }}</h3>
    <p class="text-sm text-gray-400 mb-2">
      Auteur : {{ article.user?.name || "Auteur inconnu" }}
    </p>
    <p class="text-sm text-gray-400 mb-4">
      Créé le : {{ formatDate(article.created_at) || "Date inconnue" }}
    </p>
    <div class="flex gap-4">
      <button
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400"
          @click="$emit('read', article)"
      >
        Lire
      </button>

      <button
          class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400"
          @click="$emit('approve', article.id)"
      >
        Accepter
      </button>

      <button
          class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400"
          @click="openRejectModal"
      >
        Refuser
      </button>
    </div>

    <Modal
        v-if="rejectModalVisible"
        title="Raison du refus"
        :visible="rejectModalVisible"
        @close="closeRejectModal"
        @submit="submitReject"
    >
      <textarea
          v-model="rejectReason"
          class="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Expliquez pourquoi cet article est refusé..."
      ></textarea>
    </Modal>
  </div>
</template>

<script>
import { ref } from "vue";
import Modal from "./Modal.vue";
import { formatDate } from "../../utils/date";
import Toast from "../Shared/Toast.vue";

export default {
  components: { Modal },
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  emits: ["approve", "reject", "read"],
  setup(props, { emit }) {
    const rejectModalVisible = ref(false);
    const rejectReason = ref("");

    const openRejectModal = () => {
      rejectModalVisible.value = true;
    };

    const closeRejectModal = () => {
      rejectModalVisible.value = false;
      rejectReason.value = "";
    };

    const submitReject = () => {
      if (!rejectReason.value.trim()) {
        Toast.error("Veuillez fournir une raison pour le refus.");
        return;
      }
      emit("reject", { id: props.article.id, reason: rejectReason.value });
      closeRejectModal();
    };

    return {
      rejectModalVisible,
      rejectReason,
      openRejectModal,
      closeRejectModal,
      submitReject,
      formatDate,
    };
  },
};
</script>