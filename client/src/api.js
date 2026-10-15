import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost/time_slot_booking_system/server/api',
});

export default api;
