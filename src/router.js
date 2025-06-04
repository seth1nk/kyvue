import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
import AboutPage from './components/AboutPage.vue';
import ContactPage from './components/ContactPage.vue';
import AudiotrackList from './components/AudiotrackList.vue';
import ArtistList from './components/ArtistList.vue';
import LoginPage from './components/LoginPage.vue';
import RegisterPage from './components/RegisterPage.vue';
import ViewAudiotrack from './components/ViewAudiotrack.vue';
import ViewArtist from './components/ViewArtist.vue';

const routes = [
  { path: '/', component: HomePage },          
  { path: '/about', component: AboutPage },    
  { path: '/contact', component: ContactPage },
  { path: '/audiotracks', component: AudiotrackList },
  { path: '/artists', component: ArtistList },
  { path: '/login', component: LoginPage },    
  { path: '/register', component: RegisterPage }, 
  { path: '/view-audiotracks/:id', component: ViewAudiotrack },
  { path: '/view-artists/:id', component: ViewArtist },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;