<template>
  <div class="flex min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-200">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <DashboardHeader title="Gestion des Tags" />

      <!-- Main Section -->
      <main class="p-6 space-y-6">
        <!-- Chargement -->
        <div v-if="loading" class="text-center py-6">
          <p class="text-gray-400">Chargement...</p>
        </div>

        <!-- Liste des tags -->
        <div v-else>
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-300">Liste des Tags</h2>
            <button
                @click="openModal('create')"
                class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Ajouter un tag
            </button>
          </div>

          <!-- Tableau des tags -->
          <div class="bg-gray-800 p-4 rounded-lg">
            <table class="w-full table-auto text-left">
              <thead class="bg-gray-700 text-gray-300">
              <tr>
                <th class="px-6 py-3">Nom</th>
                <th class="px-6 py-3">Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="tag in tags"
                  :key="tag.id"
                  class="hover:bg-gray-700 text-gray-200"
              >
                <td class="px-6 py-3">{{ tag.name }}</td>
                <td class="px-6 py-3 space-x-3">
                  <button
                      @click="openModal('edit', tag)"
                      class="bg-yellow-500 hover:bg-yellow-400 text-white px-3 py-1 rounded-md"
                  >
                    Modifier
                  </button>
                  <button
                      @click="deleteTagHandler(tag.id)"
                      class="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-md"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Modal pour Ajouter/Modifier -->
        <Modal
            v-if="modalVisible"
            :visible="modalVisible"
            :title="modalMode === 'create' ? 'Ajouter un tag' : 'Modifier un tag'"
            @close="closeModal"
        >
          <form @submit.prevent="modalMode === 'create' ? createTagHandler() : updateTagHandler()">
            <div class="space-y-4">
              <label class="block">
                <span class="text-gray-300">Nom du tag</span>
                <input
                    v-model="tagForm.name"
                    type="text"
                    class="mt-1 block w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2"
                    required
                />
              </label>
            </div>
            <div class="mt-6 flex justify-end space-x-4">
              <button
                  type="button"
                  @click="closeModal"
                  class="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Annuler
              </button>
              <button
                  type="submit"
                  class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import Sidebar from "../components/Dashboard/Sidebar.vue";
import DashboardHeader from "../components/Dashboard/DashboardHeader.vue";
import Modal from "../components/Dashboard/Modal.vue";
import { useToast } from "../composables/Toast";
import { getTags, createTag, updateTag, deleteTag } from "../api/admin";

const { success, error } = useToast();

const tags = ref([]); // Liste des tags
const loading = ref(false); // Indicateur de chargement

// État de la modal
const modalVisible = ref(false);
const modalMode = ref("create");
const tagForm = ref({ id: null, name: "" });

// Charger les tags
const fetchTags = async () => {
  try {
    loading.value = true;
    const response = await getTags();
    tags.value = response; // Assurez-vous que l'API renvoie un tableau
  } catch (err) {
    error("Erreur lors du chargement des tags.");
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Ajouter un tag
const createTagHandler = async () => {
  try {
    await createTag({
      name: tagForm.value.name
    });
    success("Tag ajouté avec succès !");
    fetchTags();
    closeModal();
  } catch (err) {
    error("Erreur lors de la création du tag.");
    console.error(err);
  }
};

// Modifier un tag
const updateTagHandler = async () => {
  try {
    await updateTag({
      id: tagForm.value.id,
      name: tagForm.value.name
    });
    success("Tag mis à jour avec succès !");
    fetchTags();
    closeModal();
  } catch (err) {
    error("Erreur lors de la mise à jour du tag.");
    console.error(err);
  }
};

// Supprimer un tag
const deleteTagHandler = async (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce tag ?")) {
    try {
      await deleteTag(id);
      success("Tag supprimé avec succès !");
      fetchTags();
    } catch (err) {
      error("Erreur lors de la suppression du tag.");
      console.error(err);
    }
  }
};

// Ouvrir la modal
const openModal = (mode, tag = null) => {
  modalMode.value = mode;
  modalVisible.value = true;
  tagForm.value = tag
      ? { id: tag.id, name: tag.name }
      : { id: null, name: "" };
};

// Fermer la modal
const closeModal = () => {
  modalVisible.value = false;
  tagForm.value = { id: null, name: "" };
};

// Charger les tags au montage
onMounted(() => fetchTags());
</script>
