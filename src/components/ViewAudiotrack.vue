<template>
  <div class="app-container">
    <h1 class="page-title">Просмотр аудиотрека</h1>
    <div v-if="loading" class="loading-message">Загрузка данных...</div>
    <div v-else-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-else-if="audiotrack" class="audiotrack-details">
      <div class="product-image-container">
        <img v-if="audiotrack.photo" :src="`${backendUrl}${audiotrack.photo}`" alt="Audiotrack Photo" class="product-image" />
        <span v-else>Нет изображения</span>
      </div>
      <div class="audiotrack-info">
        <p><strong>Название:</strong> {{ audiotrack.title || 'N/A' }}</p>
        <p><strong>Исполнитель:</strong> {{ audiotrack.artist || 'N/A' }}</p>
        <p><strong>Альбом:</strong> {{ audiotrack.album || 'N/A' }}</p>
        <p><strong>Длительность:</strong> {{ formatDuration(audiotrack.duration) || 'N/A' }}</p>
        <p><strong>Жанр:</strong> {{ audiotrack.genre || 'N/A' }}</p>
        <p><strong>Количество воспроизведений:</strong> {{ audiotrack.play_count || '0' }}</p>
        <p><strong>Год выпуска:</strong> {{ audiotrack.release_year || 'N/A' }}</p>
      </div>
      <div class="action-buttons">
        <button class="btn-secondary" @click="$router.push('/audiotracks')">Вернуться к списку</button>
      </div>
    </div>
    <div v-else class="error-message">Не удалось загрузить данные об аудиотреке.</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      audiotrack: null,
      loading: true,
      errorMessage: null,
      backendUrl: 'http://localhost:3000',
    };
  },
  async created() {
    const audiotrackId = this.$route.params.id;
    if (!/^\d+$/.test(audiotrackId)) {
      this.errorMessage = 'Некорректный ID';
      this.loading = false;
      return;
    }
    await this.fetchAudiotrack(audiotrackId);
  },
  methods: {
    async fetchAudiotrack(audiotrackId) {
      try {
        const response = await fetch(`${this.backendUrl}/api/view-audiotrack/${audiotrackId}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          if (response.status === 401) {
            this.$router.push('/login');
            return;
          }
          if (response.status === 404) {
            throw new Error('Аудиотрек не найден');
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        this.audiotrack = data;
      } catch (err) {
        console.error('Ошибка при получении данных аудиотрека:', err);
        this.errorMessage = err.message;
      } finally {
        this.loading = false;
      }
    },
    formatDuration(seconds) {
      if (!seconds) return 'N/A';
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    },
  },
};
</script>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #0d9488, #1e40af); /* Сине-зеленый градиент */
  color: #e0e0e0; /* Светло-серый текст */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.page-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #fef08a; /* Золотисто-желтый */
  background: linear-gradient(90deg, #047857, #1e40af); /* Зелено-синий градиент */
  padding: 12px;
  border-radius: 12px;
}

.audiotrack-details {
  background: rgba(6, 182, 212, 0.1); /* Полупрозрачный бирюзовый фон */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  padding: 20px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.product-image-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.product-image-container .product-image {
  max-width: 150px;
  max-height: 150px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #e0f7fa; /* Светло-бирюзовый бордер */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.audiotrack-info {
  text-align: center;
  width: 100%;
  word-wrap: break-word;
}

.audiotrack-info p {
  margin: 10px 0;
  color: #e0e0e0; /* Светло-серый текст */
  font-size: 1.25rem;
}

.audiotrack-info strong {
  color: #e0e0e0; /* Светло-серый текст */
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-secondary {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b; /* Темно-синий текст */
  background: rgba(16, 185, 129, 0.2); /* Полупрозрачный изумрудный фон */
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.btn-secondary:hover {
  background: rgba(16, 185, 129, 0.3); /* Чуть темнее при наведении */
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.loading-message,
.error-message {
  text-align: center;
  font-size: 1.2rem;
  color: #e0e0e0; /* Светло-серый текст */
}

@media (max-width: 768px) {
  .audiotrack-details {
    padding: 15px;
  }

  .product-image-container .product-image {
    max-width: 120px;
    max-height: 120px;
  }

  .audiotrack-info p {
    font-size: 1rem;
  }
}
</style>