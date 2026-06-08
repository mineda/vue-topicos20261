<template>
  <div>
    <form @submit.prevent="salvar">
      <p>
        <label id="labelDescricao" for="descricao">Descrição: </label>
        <input id="descricao" type="text" v-model="detalhe.descricao" required/>
      </p>
      <p>
        <label id="labelAlcance" for="alcance">Alcance: </label>
        <input id="alcance" type="number" v-model="detalhe.alcance" />
      </p>
      <p>
        <label id="labelDataHoraCriacao" for="dataHoraCriacao">Data/hora de Criação: </label>
        <input id="dataHoraCriacao" type="datetime-local" v-model="detalhe.dataHora" required/>
      </p>
      <p>
        <label id="labelDataHoraAlteracao" for="dataHoraAlteracao">Data/hora de Alteração: </label>
        <input id="dataHoraAlteracao" type="datetime-local" v-model="detalhe.dataHoraAlteracao" />
      </p>
      <p>
        <label id="labelAnotacao" for="anotacao">Anotação: </label>
        <select id="anotacao" v-model="detalhe.anotacao.id" required>
          <option value="" disabled>Selecione uma anotação</option>
          <option v-for="anotacao in anotacoes" :key="anotacao.id" :value="anotacao.id">
            {{ anotacao.texto }}
          </option>
        </select>
      </p>

      <button type="submit">Salvar</button>
    </form>
    <form @submit.prevent="buscarPorTextoAnotacaoEAlcance">
      <p>
        <label id="labelTextoAnotacao" for="textoAnotacao">Texto da Anotação: </label>
        <input id="textoAnotacao" type="text" v-model="textoAnotacao" required/>
      </p>
      <p>
        <label id="labelAlcance" for="alcance">Alcance: </label>
        <input id="alcance" type="number" v-model="alcance" required/>
      </p>
      <button type="submit">Buscar</button>
    </form>
    <p v-if="erro">{{ erro }}</p>

    <button @click="atualizar">Carregar todos</button>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Descrição</th>
          <th>Situação</th>
          <th>Texto da Anotação</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="detalhe in detalhes" :key="detalhe.id">
          <td>{{ detalhe.id }}</td>
          <td>{{ detalhe.descricao }}</td>
          <td>{{ situacao(detalhe.dataHora, detalhe.dataHoraAlteracao) }}</td>
          <td>{{ detalhe.anotacao.texto }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="detalhes.length === 0">Nenhum registro encontrado</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onMounted } from 'vue'
import axios from 'axios'

interface Anotacao {
  id: number
  texto: string
}

interface Detalhe {
  id?: number
  descricao: string
  alcance?: number
  dataHora: string
  dataHoraAlteracao?: string
  anotacao: Anotacao
}

const detalhe = ref<Detalhe>({
  descricao: '',
  dataHora: new Date().toISOString().slice(0, 16),
  anotacao: {
    id: 0,
    texto: ''
  }
})

const detalhes = ref<Detalhe[]>(
  [
    {
      id: 1,
      descricao: 'Descrição do detalhe 1',
      alcance: 10,
      dataHora: '2023-08-01T19:10:00',
      dataHoraAlteracao: '2023-08-01T19:10:00',
      anotacao: {
        id: 1,
        texto: 'Anotação 1'
      }
    }
  ])

const anotacoes = ref<Anotacao[]>(
  [
    {
      id: 1,
      texto: 'Anotação 1'
    },
    {
      id: 2,
      texto: 'Anotação 2'
    }
  ])

const textoAnotacao = ref<string>('')

const alcance = ref<number>(0)

const erro = ref<string>('')

async function atualizar() {
  try {
    const response = await axios.get('detalhe')
    detalhes.value = response.data
    erro.value = ''
  } catch (error) {
    console.error(error)
    erro.value = (error as Error).message
  }
}

async function buscarAnotacoes() {
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
    await axios.post('detalhe', detalhe.value)
    detalhe.value = {
      descricao: '',
      dataHora: new Date().toISOString().slice(0, 16),
      anotacao: {
        id: 0,
        texto: ''
      }
    }
    erro.value = ''
    atualizar()
  } catch (error) {
    console.error(error)
    erro.value = (error as Error).message
  }
}

async function buscarPorTextoAnotacaoEAlcance() {
  try {
    const response = await axios.get('detalhe/buscar', {
      params: {
        anotacao: textoAnotacao.value,
        alcance: alcance.value
      }
    })
    detalhes.value = response.data
    erro.value = ''
  } catch (error) {
    console.error(error)
    erro.value = (error as Error).message
  }
}

function situacao(data1: string, data2: string | undefined): string {
  if(!data2) {
    return 'Original'
  }
  const d1 = new Date(data1)
  const d2 = new Date(data2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return 'Alterado em ' + formatarData(data2) + ' após ' + Math.floor(diffTime / (1000 * 60 * 60 * 24)) + ' dias'
}

function formatarData(data: string): string {
  const d = new Date(data)
  return d.toLocaleString('en-GB')
}

onMounted(() => {
  atualizar()
  buscarAnotacoes()

})

</script>
