import { createRouter, createWebHistory } from 'vue-router';
import JoinView from '@/views/JoinView.vue';
import RoomView from '@/views/RoomView.vue';

const routes = [
  {
    path: '/',
    name: 'join',
    component: JoinView,
  },
  {
    path: '/room/:roomCode',
    name: 'room',
    component: RoomView,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;