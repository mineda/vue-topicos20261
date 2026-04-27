import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const usuarioStore = defineStore('usuarioStore', () => {

  interface Usuario {
    id?: number,
    nome: string,
    senha: string
  }

  const erro = ref<string>()

  const usuarios = ref<Usuario[]>([
    { id: 1, nome: 'João', senha: '1234' },
    { id: 2, nome: 'Maria', senha: 'abcd' },
    { id: 3, nome: 'Pedro', senha: 'senha' }
  ])

  async function atualizarUsuarios() {
    try{
      usuarios.value = (await axios.get('usuario')).data
      erro.value = undefined
    } catch (e) {
      erro.value = (e as Error).message
    }
  }

  async function salvar(nome: string, senha: string) {
    try {
      await axios.post('usuario', {
        nome: nome,
        senha: senha
      })
      atualizarUsuarios()
      erro.value = undefined
    } catch (e) {
      erro.value = (e as Error).message
    }

  }


  return { usuarios, erro, atualizarUsuarios, salvar }
})
