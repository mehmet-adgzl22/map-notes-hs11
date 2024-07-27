import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { detecIcon, setStorage } from "./helpers.js";

var map;
let coords = [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];
var layerGroup = [];

const onMapClick = (e) => {
  form.style.display = "flex";
  coords = [e.latlng.lat, e.latlng.lng];
};
const loadMap = (e) => {
  map = L.map("map").setView([51.505, -0.09], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  layerGroup = L.layerGroup().addTo(map);
  renderNoteList(notes);
  map.on("click", onMapClick);
};

navigator.geolocation.getCurrentPosition(
  loadMap,
  console.log("Kullancı kabul etmedi")
);

const renderMarker = (item) => {
  console.log(item);
  L.marker(item.coords, { icon: detecIcon(item.status) })
    .addTo(layerGroup)
    .bindPopup(`${item.desc}`);
};

const renderNoteList = (item) => {
  list.innerHTML = "";
  layerGroup.clearLayers();

  item.forEach((item) => {
    const listElement = document.createElement("li");
    listElement.dataset.id = item.id;

    listElement.innerHTML = `
         <div>
              <p>${item.desc}</p>
              <p><span>Tarih:</span>14.07.2024</p>
              <p><span>Durum:</span>status</p>
            </div>
            <i id="delete" class="bi bi-x"></i>
            <i id="fly" class="bi bi-airplane-fill"></i>
    
    `;
    list.insertAdjacentElement("afterbegin", listElement);

    renderMarker(item);
  });
};

const handleSubmit = (e) => {
  e.preventDefault();
  const desc = e.target[0].value;
  const date = e.target[1].value;
  const status = e.target[2].value;
  notes.push({ id: uuidv4(), desc, date, status, coords });
  setStorage(notes);

  renderNoteList(notes);

  form.style.display = "none";
};

const handleClick = (e) => {
  console.log(e);
  const id = e.target.parentElement.dataset.id;
  if (e.target.id === "delete") {
    console.log(notes);
    notes = notes.filter((note) => note.id != id);
    setStorage(notes);
    renderNoteList(notes);
  }
  if (e.target.id === "fly") {
    const note = notes.find((note) => note.id == id);
    map.flyTo(note.coords);
  }
};

//! HTML'den gelenler
const form = document.querySelector("form");
const list = document.querySelector("ul");

//! Olay İzleyicileri
form.addEventListener("submit", handleSubmit);
list.addEventListener("click", handleClick);
