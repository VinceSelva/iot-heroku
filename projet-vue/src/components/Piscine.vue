
<template>
  <div>
    <h1> Bienvenue sur la piscine </h1>
      <div class="contentPiscine">
        <p>Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. 
        Le Lorem Ipsum est le fauxddddd texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des 
        morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi 
        adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la 
        vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de 
        mise en page de texte, comme Aldus PageMaker.
        </p>
        <p>
        Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. 
        Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des 
        morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi 
        adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la 
        vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de 
        mise en page de texte, comme Aldus PageMaker.</p>
      </div>

      <div class="ledPiscine">
        <p> Led </p>
        <md-button class="md-primary md-raised" v-on:click="switchState('30:AE:A4:86:C3:20')">Allumer la led</md-button>
        <br>
        <md-button class="md-primary md-raised" v-on:click="switchState('30:AE:A4:86:C3:20')">Eteindre la led</md-button>
      </div>

      <div class="tempPiscine">
        <p> Gestion de la température </p>
        <p>Température : 48 °C</p>

        <p>----</p>
        <p id="temp"> </p>
        <p id="light"> </p>

      </div>

      <div class="voletPiscine">
        <p> Gestion du volet </p>
        <md-button class="md-primary md-raised" v-on:click="switchState('30:AE:A4:86:C3:20')">Ouvrir la piscine</md-button>
        <br>
        <md-button class="md-primary md-raised" v-on:click="switchState('30:AE:A4:86:C3:20')">Fermer la piscine</md-button>
      </div>

  </div>
</template>


<script>

export default {
  name: "Piscine",
  data() {
    return {
      states: [],
      node_url: "http://localhost:3000",
      which_esps: [
        "30:AE:A4:86:C3:20",
        "30:AE:A4:86:CA:7C",
        ""
      ],
      name: "",
      componentKey: 0
    };
  },
  components: {
    
  },
  props: {
    msg: String
  },
  mounted() {},

  methods: {
    start: function() {
      for (var i = 0; i < this.which_esps.length; i++) {
        this.getStates("/esp/light", [], this.which_esps[i]);
      }
      for (var j = 0; j < this.which_esps.length; j++) {
        this.getStates("/esp/temp", [], this.which_esps[j]);
      }
    },

    async switchState(wh) {
      var url = this.node_url + "/esp/led";
      var message = "on";
      var header = new Headers();
      header.append("Content-Type", "application/json");
      await fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify({
          message: message,
          who: wh
        })
      });
    },


    get_states(path_on_node, serie, wh) {

      this.node_url = "http://localhost:3000";

        function lastValue(path, val){
               if(path == "/esp/temp")
               document.getElementById("temp").innerHTML = "La Température est de " + val + "°C";
               if(path == "/esp/light")
               document.getElementById("light").innerHTML = "La Lumiere est de " + val + " lumen";
            }

      var liste = []
      wh = "30:AE:A4:86:C3:20";
      let url = this.node_url + path_on_node + "?who=" + wh;
      fetch(url)
        .then(responseJSON => {
          return responseJSON.json();
        })
        .then(responseJS => {
          this.items = responseJS;

          if (this.items) {
            this.items.forEach(function(element) {
                liste.push([Date.parse(element.date), element.value]);
            });
          }
          serie.data = liste;
          lastValue(path_on_node,(liste[(liste.length - 1)][1]));
        });
    }



  }
};
</script>

<style>

h1{
  font-size: 40px;
}

.ledPiscine{
  font-size: 25px;
  float: left;
  margin-top: 300px;
  margin-left: 100px;
}

.tempPiscine{
  font-size: 25px;
  float: right;
  margin-top: 300px;
  margin-right: 100px;
}

.voletPiscine{
  font-size: 25px;
  margin-top: 300px;
  margin-right: 100px;
}


.contentPiscine{
  font-size: 18px;
  text-align: center;
}
</style>