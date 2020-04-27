<template>
  <div id="app">
    <md-toolbar v-if="authenticated">
      <router-link class="md-title nav" v-if="authenticated" to="/accueil">Accueil</router-link>
      <router-link class="md-title nav" v-if="authenticated" to="/piscine">Voir la piscine</router-link>
      <router-link class="md-title nav" v-if="authenticated" to="/poulailler">Voir le poulailler</router-link>
      <router-link class="md-title nav" v-if="authenticated" to="/graphiques">Voir les graphiques</router-link>
      <h3 class="nav-right2" v-if="authenticated" v-on:click="test()">Bonjour {{ identifiants.username }}</h3>
      <!--<router-link class="md-title nav-right1" v-if="authenticated" to="/" v-on:click.native="logout()" replace>Se déconnecter</router-link>-->
    </md-toolbar>
    <router-view @authenticated="setAuthenticated" />
  </div>
  
</template>


<script>
    export default {
        name: 'App',
        data() {
            return {
                authenticated: false,
                identifiants: {
                    username: "test",
                    password: "test"
                }
            }
        },
        mounted() {
            if(!this.authenticated) {
                this.$router.replace({ name: "" });
            }
        },
        methods: {
            setAuthenticated(status) {
                this.authenticated = status;
            },
            logout() {
                this.authenticated = false;
            },
            test(){
              alert("test");
            }
        }
    }
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

h1{
  font-size: 40px;
}

.md-toolbar{
  padding: 500px;
}

.nav{
  padding-right:50px;
}

.nav:hover{
  color:red;
}

.nav-right1 {
    margin-left: 46% !important;
 }
 .nav-right2 {
    margin-left: 46% !important;
    cursor: pointer;
 }
 
</style>
