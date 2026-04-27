<template>
  <div>
    <h1>{{ nome }} - {{ senha }}</h1>

    <form @submit.prevent="store.salvar(nome, senha)">
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
      <p v-if="store.erro">{{ store.erro }}</p>
    </form>

    <button @click="store.atualizarUsuarios">Atualizar</button>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Senha</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="usuario in store.usuarios" :key="usuario.id">
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
import { onMounted } from 'vue'
import { usuarioStore } from '../stores/usuario'


const nome = ref<string>('')
const senha = ref<string>('')
const store = usuarioStore()

function nomeMudou(event: Event) {
  const input = event.target as HTMLInputElement
  nome.value = input.value
}

onMounted(() => {
  store.atualizarUsuarios()
})

</script>
