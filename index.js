new Vue({
  el: "#app",
  created: function () {
    var self = this;
    axios
      .get("http://api.open-notify.org/iss-now.json")
      .then(function (response) {
        self.iss.push(response.data);
      });
    setTimeout(() => (this.spineActive = false), 6000);
    setTimeout(() => this.creaMapa(), 7000);
    setInterval(this.obtienePosicion, 1500);
  },
  data: {
    iss: [],
    spineActive: true,
    mapaCreado: [],
    centro: [],
    pushpin: [],
    posicionAnterior: [],
  },
  methods: {
    obtienePosicion: function () {
      var self = this;
      axios
        .get("http://api.open-notify.org/iss-now.json")
        .then(function (response) {
          self.posicionAnterior = {lat:self.iss[0].lat,longi:self.iss[0].longi};
          
          self.iss.pop();
          self.iss.push({
            lat: response.data.iss_position.latitude,
            longi: response.data.iss_position.longitude,
          });
          self.mapaCreado.setView({
            center: new Microsoft.Maps.Location(
              response.data.iss_position.latitude,
              response.data.iss_position.longitude
            ),
          });
          self.center = self.mapaCreado.getCenter();
          self.pushpin.setLocation(self.center);
          var coor = [
            self.center,
            new Microsoft.Maps.Location(
              self.posicionAnterior.lat,
              self.posicionAnterior.longi
            ),
            
          ];
          var line = new Microsoft.Maps.Polyline(coor, {
            strokeColor: "red",
            strokeThickness: 5,
            strokeDashArray: [4, 4]
          });
          self.mapaCreado.entities.push(line);
        });
    },
    creaMapa: async function () {
      var self = this;
      this.mapaCreado = new Microsoft.Maps.Map("#myMap", {
        credentials:
          "YOUR_BING_MAPS_KEY",
        center: new Microsoft.Maps.Location(-32.906, -68.844),
        zoom: 11,
      });
      this.mapaCreado.setView({
        center: new Microsoft.Maps.Location(self.iss[0].lat, self.iss[0].longi),
      });
      this.centro = this.mapaCreado.getCenter();
      this.pushpin = new Microsoft.Maps.Pushpin(self.centro, {
        icon: "satelite.svg",
      });
      this.mapaCreado.entities.push(self.pushpin);
    },
  },
});
