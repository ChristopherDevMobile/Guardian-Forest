/* ============================================
   Guardian Forest v0.1
   script.js
============================================ */

// ------------------------------
// Inicializa o mapa
// ------------------------------

const map = L.map("map").setView([-14.2350, -51.9253], 4);

// ------------------------------
// Camada do OpenStreetMap
// ------------------------------

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap Contributors'
}).addTo(map);

// ------------------------------
// Ícones
// ------------------------------

function corRisco(risco){

    switch(risco){

        case "Crítico":
            return "#D62828";

        case "Alto":
            return "#F77F00";

        case "Médio":
            return "#F4A261";

        default:
            return "#2A9D8F";
    }

}

// ------------------------------
// KPIs
// ------------------------------

let totalAlertas = 0;
let alertasCriticos = 0;
let totalTerras = 0;

// ------------------------------
// Carrega Terras Indígenas
// ------------------------------

fetch("dados/terras.geojson")

.then(response => response.json())

.then(data=>{

    totalTerras = data.features.length;

    document.getElementById("terras").textContent = totalTerras;

    L.geoJSON(data,{

        style:{

            color:"#2D6A4F",

            weight:2,

            fillColor:"#74C69D",

            fillOpacity:0.35

        },

        onEachFeature:function(feature,layer){

            layer.bindPopup(

                `
                <h3>${feature.properties.nome}</h3>

                <b>Estado:</b> ${feature.properties.estado}
                `
            );

        }

    }).addTo(map);

})

.catch(()=>{

    console.warn("GeoJSON de Terras Indígenas ainda não encontrado.");

});

// ------------------------------
// Carrega Alertas
// ------------------------------

fetch("dados/alertas.geojson")

.then(response=>response.json())

.then(data=>{

    totalAlertas = data.features.length;

    document.getElementById("totalAlertas").textContent = totalAlertas;

    L.geoJSON(data,{

        pointToLayer:function(feature,latlng){

            if(feature.properties.risco==="Crítico"){

                alertasCriticos++;

            }

            return L.circleMarker(latlng,{

                radius:8,

                fillColor:corRisco(feature.properties.risco),

                color:"#FFFFFF",

                weight:2,

                opacity:1,

                fillOpacity:0.9

            });

        },

        onEachFeature:function(feature,layer){

            layer.bindPopup(

                `
                <h3>🚨 Alerta</h3>

                <b>Data:</b> ${feature.properties.data}<br>

                <b>Município:</b> ${feature.properties.municipio}<br>

                <b>Área:</b> ${feature.properties.area} ha<br>

                <b>Distância:</b> ${feature.properties.distancia} km<br>

                <b>Risco:</b> ${feature.properties.risco}
                `
            );

        }

    }).addTo(map);

    document.getElementById("criticos").textContent = alertasCriticos;

})

.catch(()=>{

    console.warn("GeoJSON de Alertas ainda não encontrado.");

});

// ------------------------------
// Legenda
// ------------------------------

const legenda = L.control({position:'bottomright'});

legenda.onAdd = function(){

    const div = L.DomUtil.create('div');

    div.style.background = "white";
    div.style.padding = "10px";
    div.style.borderRadius = "8px";
    div.style.boxShadow = "0 0 10px rgba(0,0,0,.2)";
    div.style.fontSize = "14px";

    div.innerHTML = `
    <b>Nível de Risco</b><br><br>

    <span style="color:#D62828;">●</span> Crítico<br>

    <span style="color:#F77F00;">●</span> Alto<br>

    <span style="color:#F4A261;">●</span> Médio<br>

    <span style="color:#2A9D8F;">●</span> Baixo
    `;

    return div;

};

legenda.addTo(map);
