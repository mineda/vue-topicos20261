<template>
  <div>
    <h1>{{ nome }} - {{ senha }}</h1>

    <form @submit.prevent="salvar">
      <p>
        <label id="labelNome" for="nome">Nome: </label>
        <input id="nome" type="text" :value="nome" @input="nomeMudou" required/>
      </p>
      <p>
        <label id="labelSenha" for="senha">Senha: </label>
        <input id="senha" type="password" v-model="senha" required/>
      </p>
      <p v-if="!senha || (senha  && senha.length < 4)">Senha muito curta!</p>
      <div v-else>Senha válida!</div>
      <button type="submit">Salvar</button>
      <p v-if="erro">{{ erro }}</p>
    </form>

    <button @click="atualizarUsuarios">Atualizar</button>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Senha</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="usuario in usuarios" :key="usuario.id">
          <td>{{ usuario.id }}</td>
          <td>{{ usuario.nome }}</td>
          <td>{{ usuario.senha }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { onMounted } from 'vue'

interface Usuario {
  id?: number,
  nome: string,
  senha: string
}

const nome = ref<string>()
const senha = ref<string>()
const erro = ref<string>()

const usuarios = ref<Usuario[]>([
  { id: 1, nome: 'João', senha: '1234' },
  { id: 2, nome: 'Maria', senha: 'abcd' },
  { id: 3, nome: 'Pedro', senha: 'senha' }
])

nome.value = 'Teste'

function nomeMudou(event: Event) {
  const input = event.target as HTMLInputElement
  nome.value = input.value
}

async function atualizarUsuarios() {
  try{
    usuarios.value = (await axios.get('usuario')).data
    erro.value = undefined
  } catch (e) {
    erro.value = (e as Error).message
  }
}

async function salvar() {
  try {
    await axios.post('usuario', {
      nome: nome.value,
      senha: senha.value
    })
    nome.value = ''
    senha.value = ''
    atualizarUsuarios()
    erro.value = undefined
  } catch (e) {
    erro.value = (e as Error).message
  }

}

onMounted(() => {
  atualizarUsuarios()
})

</script>
