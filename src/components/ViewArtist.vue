<template>
  <div class="app-container">
    <h1 class="page-title">Просмотр исполнителя</h1>
    <div v-if="loading" class="loading-message">Загрузка данных...</div>
    <div v-else-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-else-if="artist" class="artist-details">
      <div class="product-image-container">
        <img v-if="artist.photo" :src="`${backendUrl}${artist.photo}`" alt="Artist Photo" class="product-image" />
        <span v-else>Нет изображения</span>
      </div>
      <div class="artist-info">
        <p><strong>Имя:</strong> {{ artist.name || 'N/A' }}</p>
        <p><strong>Биография:</strong> {{ artist.bio || 'N/A' }}</p>
        <p><strong>Страна:</strong> {{ artist.country || 'N/A' }}</p>
        <p><strong>Жанр:</strong> {{ artist.genre || 'N/A' }}</p>
        <p><strong>Год основания:</strong> {{ artist.formed_year || 'N/A' }}</p>
        <p>
          <strong>Активен:</strong>
          <span :class="['status', getStatusClass(artist.is_active)]">
            {{ artist.is_active ? 'Активен' : 'Неактивен' }}
          </span>
        </p>
        <p><strong>Лейбл:</strong> {{ artist.label || 'N/A' }}</p>
      </div>
      <div class="action-buttons">
        <button class="btn-secondary" @click="$router.push('/artists')">Вернуться к списку</button>
      </div>
    </div>
    <div v-else class="error-message">Не удалось загрузить данные об исполнителе.</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      artist: null,
      loading: true,
      errorMessage: null,
      backendUrl: 'http://localhost:3000',
    };
  },
  async created() {
    const artistId = this.$route.params.id;
    if (!/^\d+$/.test(artistId)) {
      this.errorMessage = 'Некорректный ID';
      this.loading = false;
      return;
    }
    await this.fetchArtist(artistId);
  },
  methods: {
    async fetchArtist(artistId) {
      try {
        const response = await fetch(`${this.backendUrl}/api/view-artist/${artistId}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          if (response.status === 401) {
            this.$router.push('/login');
            return;
          }
          if (response.status === 404) {
            throw new Error('Исполнитель не найден');
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        this.artist = data;
      } catch (err) {
        console.error('Ошибка при получении данных исполнителя:', err);
        this.errorMessage = err.message;
      } finally {
        this.loading = false;
      }
    },
    getStatusClass(is_active) {
      return is_active ? 'available' : 'unavailable';
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

.artist-details {
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

.artist-info {
  text-align: center;
  width: 100%;
  word-wrap: break-word;
}

.artist-info p {
  margin: 10px 0;
  color: #e0e0e0; /* Светло-серый текст */
  font-size: 1.25rem;
}

.artist-info strong {
  color: #e0e0e0; /* Светло-серый текст */
  font-weight: 600;
}

.status {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  min-width: 100px;
}

.status.available {
  background: #047857; /* Темно-зеленый */
  color: #ffffff;
}

.status.unavailable {
  background: #dc2626; /* Темно-красный */
  color: #ffffff;
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
  .artist-details {
    padding: 15px;
  }

  .product-image-container .product-image {
    max-width: 120px;
    max-height: 120px;
  }

  .artist-info p {
    font-size: 1rem;
  }
}
</style>