import axios from "axios";

export default axios.create({
  baseURL: 'https://uxcandy.com/~shapoval/test-task-backend/v2',
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  params: {
    developer: 'David'
  }
})
