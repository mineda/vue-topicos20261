<template>
  <div>
    <form @submit.prevent="store.login(nome, senha)">
      <p>
        <label id="labelNome" for="nome">Nome: </label>
        <input id="nome" type="text" :value="nome" @input="nomeMudou" required/>
      </p>
      <p>
        <label id="labelSenha" for="senha">Senha: </label>
        <input id="senha" type="password" v-model="senha" required/>
      </p>
      <button type="submit">Login</button>
      <p v-if="store.erro">{{ store.erro }}</p>
      <p v-if="store.token">Token: {{ store.token }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { loginStore } from '../stores/login'


const nome = ref<string>('')
const senha = ref<string>('')
const store = loginStore()

function nomeMudou(event: Event) {
  const input = event.target as HTMLInputElement
  nome.value = input.value
}

</script>
