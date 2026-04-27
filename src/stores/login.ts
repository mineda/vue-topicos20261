import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const loginStore = defineStore('loginStore', () => {

  const token = ref<string>()

  const erro = ref<string>()

  async function login(nome: string, senha: string) {
    try {
      const login = (await axios.post('login', {
        username: nome,
        password: senha
      })).data
      token.value = login.token
      erro.value = undefined
    } catch (e) {
      token.value = undefined
      erro.value = (e as Error).message
    }

  }

  return { erro, token, login }},
  {
    persist: true
  }
)
