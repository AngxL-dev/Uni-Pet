let map;
let marker;

window.onload = () => {
  map = L.map('mapa').setView([-23.5505, -46.6333], 13); 

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);


  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 15);
        marker = L.marker([latitude, longitude]).addTo(map);
      },
      () => console.log("Geolocalização não permitida.")
    );
  }
};

function buscarEndereco() {
  const endereco = document.getElementById('endereco').value;

  if (!endereco.trim()) return;

  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        const { lat, lon } = data[0];
        map.setView([lat, lon], 16);

        if (marker) {
          marker.setLatLng([lat, lon]);
        } else {
          marker = L.marker([lat, lon]).addTo(map);
        }
      }
    })
    .catch(err => console.error("Erro ao buscar endereço:", err));
}


let timeout;
function debouncedBuscarEndereco() {
  clearTimeout(timeout);
  timeout = setTimeout(buscarEndereco, 500);
}
