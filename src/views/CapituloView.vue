<template>
  <div>
    <form @submit.prevent="salvar">
      <p>
        <label id="labelTitulo" for="titulo">Título: </label>
        <input id="titulo" type="text" v-model="capitulo.titulo" required/>
      </p>
      <p>
        <label id="labelConteudo" for="conteudo">Conteúdo: </label>
        <input id="conteudo" type="text" v-model="capitulo.conteudo" />
      </p>
      <p>
        <label id="labelDataCriacao" for="dataCriacao">Data de Criação: </label>
        <input id="dataCriacao" type="date" v-model="capitulo.dataCriacao" required/>
      </p>
      <p>
        <label id="labelDataEntrega" for="dataEntrega">Data de Entrega: </label>
        <input id="dataEntrega" type="date" v-model="capitulo.dataEntrega" />
      </p>
      <p>
        <label id="labelTrabalho" for="trabalho">Trabalho: </label>
        <select id="trabalho" v-model="capitulo.trabalho.id" required>
          <option value="" disabled>Selecione um trabalho</option>
          <option v-for="trabalho in trabalhos" :key="trabalho.id" :value="trabalho.id">
            {{ trabalho.titulo }}
          </option>
        </select>
      </p>

      <button type="submit">Salvar</button>
    </form>
    <form @submit.prevent="buscarPorTituloTrabalhoEDataCriacao">
      <p>
        <label id="labelTituloTrabalho" for="texto">Título do Trabalho: </label>
        <input id="texto" type="text" v-model="tituloTrabalho" required/>
      </p>
      <p>
        <label id="labelDataCriacao" for="dataCriacao">Data de Criação: </label>
        <input id="dataCriacao" type="date" v-model="data" required/>
      </p>
      <button type="submit">Buscar</button>
    </form>
    <p v-if="erro">{{ erro }}</p>

    <button @click="atualizar">Carregar todos</button>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Situação</th>
          <th>Título do Trabalho</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="capitulo in capitulos" :key="capitulo.id">
          <td>{{ capitulo.id }}</td>
          <td>{{ capitulo.titulo }}</td>
          <td>{{ situacao(capitulo.dataCriacao, capitulo.dataEntrega) }}</td>
          <td>{{ capitulo.trabalho.titulo }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="capitulos.length === 0">Nenhum registro encontrado</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onMounted } from 'vue'
import axios from 'axios'

interface Trabalho {
  id: number
  titulo: string
}

interface Capitulo {
  id?: number
  titulo: string
  conteudo?: string
  dataCriacao: string
  dataEntrega?: string
  trabalho: Trabalho
}

const capitulo = ref<Capitulo>({
  titulo: '',
  dataCriacao: new Date().toISOString().slice(0, 16),
  trabalho: {
    id: 0,
    titulo: ''
  }
})

const capitulos = ref<Capitulo[]>(
  [
    {
      id: 1,
      titulo: 'Capítulo 1',
      conteudo: 'Conteúdo do capítulo 1',
      dataCriacao: '2023-08-01T19:10:00',
      trabalho: {
        id: 1,
        titulo: 'Trabalho 1'
      }
    }
  ])

const trabalhos = ref<Trabalho[]>(
  [
    {
      id: 1,
      titulo: 'Trabalho 1'
    },
    {
      id: 2,
      titulo: 'Trabalho 2'
    }
  ])

const tituloTrabalho = ref<string>('')

const data = ref<string>('')

const erro = ref<string>('')

async function atualizar() {
  try {
    const response = await axios.get('capitulo')
    capitulos.value = response.data
    erro.value = ''
  } catch (error) {
    console.error(error)
    erro.value = (error as Error).message
  }
}

async function buscarTrabalhos() {
  try {
    const response = await axios.get('trabalho')
    trabalhos.value = response.data
    erro.value = ''
  } catch (error) {
    console.error(error)
    erro.value = (error as Error).message
  }
}

async function salvar() {
  try {
    await axios.post('capitulo', capitulo.value)
    capitulo.value = {
      titulo: '',
      dataCriacao: new Date().toISOString().slice(0, 16),
      trabalho: {
        id: 0,
        titulo: ''
      }
    }
    erro.value = ''
    atualizar()
  } catch (error) {
    console.error(error)
    erro.value = (error as Error).message
  }
}

async function buscarPorTituloTrabalhoEDataCriacao() {
  try {
    const response = await axios.get('capitulo/atrasados', {
      params: {
        trabalho: tituloTrabalho.value,
        data: data.value
      }
    })
    capitulos.value = response.data
    erro.value = ''
  } catch (error) {
    console.error(error)
    erro.value = (error as Error).message
  }
}

function situacao(data1: string, data2: string | undefined): string {
  if(!data2) {
    return 'Pendente'
  }
  const d1 = new Date(data1)
  const d2 = new Date(data2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return 'Entregue após ' + Math.floor(diffTime / (1000 * 60 * 60 * 24)) + ' dias'
}

onMounted(() => {
  atualizar()
  buscarTrabalhos()

})

</script>
