<template>
  <div>
    <form @submit.prevent="salvar">
      <p>
        <label id="labelTexto" for="texto">Texto: </label>
        <input id="texto" type="text" v-model="texto" required/>
      </p>
      <p>
        <label id="labelDataHora" for="dataHora">Data/Hora: </label>
        <input id="dataHora" type="datetime-local" v-model="dataHora"/>
      </p>
      <p>
        <label id="labelUsuario" for="usuario">Usuário: </label>
        <select id="usuario" v-model="idUsuario" required>
          <option value="" disabled>Selecione um usuário</option>
          <option v-for="usuario in store.usuarios" :key="usuario.id" :value="usuario.id">
            {{ usuario.nome }}
          </option>
        </select>
      </p>

      <button type="submit">Salvar</button>
    </form>
    <form @submit.prevent="buscarPorTextoENomeUsuario">
      <p>
        <label id="labelTexto" for="texto">Texto: </label>
        <input id="texto" type="text" v-model="texto" required/>
      </p>
      <p>
        <label id="labelNomeUsuario" for="nomeUsuario">Nome do Usuário: </label>
        <input id="nomeUsuario" type="text" v-model="nomeUsuario" required/>
      </p>
      <button type="submit">Buscar</button>
    </form>
    <p v-if="erro">{{ erro }}</p>

    <button @click="atualizar">Carregar todos</button>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Texto</th>
          <th>Antiguidade</th>
          <th>Nome do Usuário</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="anotacao in anotacoes" :key="anotacao.id">
          <td>{{ anotacao.id }}</td>
          <td>{{ anotacao.texto }}</td>
          <td>{{ diferencaEmDias(anotacao.dataHora) }} dias</td>
          <td>{{ anotacao.autor.nome }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onMounted } from 'vue'
import axios from 'axios'
import { usuarioStore } from '../stores/usuario'

interface Anotacao {
  id: number
  texto: string
  dataHora: string
  autor: {
    nome: string
  }
}

const store = usuarioStore()

const texto = ref<string>('')
const dataHora = ref<Date>(new Date())
const idUsuario = ref<number>(0)
const nomeUsuario = ref<string>('')

const anotacoes = ref<Anotacao[]>([{
  id: 1,
  texto: 'Teste',
  dataHora: '2023-08-01T19:10:00',
  autor: {
    nome: 'admin'
  }
}])

const erro = ref<string>('')

async function atualizar() {
  try {
    const response = await axios.get('anotacao')
    anotacoes.value = response.data
    erro.value = ''
  } catch (error) {
    console.error(error)
    erro.value = (error as Error).message
  }
}

async function salvar() {
  try {
    await axios.post('anotacao', {
      texto: texto.value,
      dataHora: dataHora.value,
      autor: {
        id: idUsuario.value
      }
    })
    texto.value = ''
    dataHora.value = new Date()
    idUsuario.value = 0
    erro.value = ''
    atualizar()
  } catch (error) {
    console.error(error)
    erro.value = (error as Error).message
  }
}

async function buscarPorTextoENomeUsuario() {
  try {
    const response = await axios.get('anotacao/busca', {
      params: {
        texto: texto.value,
        usuario: nomeUsuario.value
      }
    })
    anotacoes.value = response.data
    erro.value = ''
  } catch (error) {
    console.error(error)
    erro.value = (error as Error).message
  }
}

function diferencaEmDias(data1: string): number {
  const d1 = new Date(data1)
  const d2 = new Date()
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

onMounted(() => {
  atualizar()
  store.atualizarUsuarios()
})

</script>
