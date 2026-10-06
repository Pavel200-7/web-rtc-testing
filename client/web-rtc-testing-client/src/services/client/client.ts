import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BACKEBD_URL

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default apiClient