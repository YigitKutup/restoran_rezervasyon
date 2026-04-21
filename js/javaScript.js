// ================================================
//  REZERVASYON SİSTEMİ — javaScript.js
//  Yapımcı: Necati Yiğit Kutup | 2026
// ================================================

// ─── DEMO VERİLER ────────────────────────────────
const places = [
  {
    id: 1,
    name: "Lezzet Durağı",
    type: "restaurant",
    typeLabel: "🍽 Restoran",
    emoji: "🥘",
    bgColor: "#fff5e6",
    address: "Ankara Cad. No:14, Merkez",
    distance: "0.3 km",
    rating: 4.8,
    ratingCount: 312,
    price: "₺₺₺",
    tags: ["Türk Mutfağı", "Izgara", "Aile"],
    open: "10:00 – 23:00",
  },
  {
    id: 2,
    name: "Green Cup Kafe",
    type: "cafe",
    typeLabel: "☕ Kafe",
    emoji: "☕",
    bgColor: "#e8f5e9",
    address: "Bağlar Sok. No:7, Kızılay",
    distance: "0.6 km",
    rating: 4.6,
    ratingCount: 198,
    price: "₺₺",
    tags: ["Kahve", "Tatlı", "Çalışma Dostu"],
    open: "08:00 – 22:00",
  },
  {
    id: 3,
    name: "Pizza Köşe",
    type: "fastfood",
    typeLabel: "🍔 Fast Food",
    emoji: "🍕",
    bgColor: "#fce4ec",
    address: "İstasyon Cad. No:22, Çarşı",
    distance: "1.1 km",
    rating: 4.3,
    ratingCount: 540,
    price: "₺",
    tags: ["Pizza", "Hızlı Servis", "Paket"],
    open: "11:00 – 00:00",
  },
  {
    id: 4,
    name: "Mavi Teras Restaurant",
    type: "restaurant",
    typeLabel: "🍽 Restoran",
    emoji: "🦞",
    bgColor: "#e3f2fd",
    address: "Sahil Yolu No:3, Göl Kenarı",
    distance: "1.4 km",
    rating: 4.9,
    ratingCount: 427,
    price: "₺₺₺₺",
    tags: ["Deniz Ürünleri", "Manzaralı", "Romantik"],
    open: "12:00 – 23:30",
  },
  {
    id: 5,
    name: "Bamboo Coffee House",
    type: "cafe",
    typeLabel: "☕ Kafe",
    emoji: "🧋",
    bgColor: "#f3e5f5",
    address: "Yeni Mahalle Sok. No:5",
    distance: "0.9 km",
    rating: 4.5,
    ratingCount: 251,
    price: "₺₺",
    tags: ["Bubble Tea", "Vegan", "Organik"],
    open: "09:00 – 21:00",
  },
  {
    id: 6,
    name: "Burger Karargahı",
    type: "fastfood",
    typeLabel: "🍔 Fast Food",
    emoji: "🍔",
    bgColor: "#fff8e1",
    address: "Çarşı Meydanı No:11",
    distance: "0.5 km",
    rating: 4.2,
    ratingCount: 689,
    price: "₺",
    tags: ["Burger", "Paket Servis", "24 Saat"],
    open: "00:00 – 24:00",
  },
  {
    id: 7,
    name: "Anatolia Sofrası",
    type: "restaurant",
    typeLabel: "🍽 Restoran",
    emoji: "🫕",
    bgColor: "#e8f5e9",
    address: "Cumhuriyet Bul. No:44",
    distance: "1.8 km",
    rating: 4.7,
    ratingCount: 365,
    price: "₺₺",
    tags: ["Anadolu Mutfağı", "Ev Yemeği", "Öğle"],
    open: "11:30 – 22:00",
  },
  {
    id: 8,
    name: "The Morning Spot",
    type: "cafe",
    typeLabel: "☕ Kafe",
    emoji: "🥐",
    bgColor: "#fff3e0",
    address: "Park Arkası Sok. No:2",
    distance: "0.7 km",
    rating: 4.4,
    ratingCount: 183,
    price: "₺₺",
    tags: ["Kahvaltı", "Fırın", "Slow Coffee"],
    open: "07:30 – 18:00",
  },
];

// ─── STATE ───────────────────────────────────────
let reservations = JSON.parse(localStorage.getItem("reservations") || "[]");
let guestCount = 2;
let currentPlace = null;
let activeFilter = "all";

// ─── PLACE CARD RENDER ────────────────────────────
function renderPlaces(filter) {
  const grid = document.getElementById("placesGrid");
  grid.innerHTML = "";

  const filtered = filter === "all" ? places : places.filter(p => p.type === filter);

  filtered.forEach((place, i) => {
    const stars = "★".repeat(Math.floor(place.rating)) + (place.rating % 1 ? "½" : "");
    const card = document.createElement("div");
    card.className = "place-card";
    card.style.animationDelay = `${i * 0.07}s`;
    card.innerHTML = `
      <div class="place-cover" style="background:${place.bgColor}">
        <span style="position:relative;z-index:1;font-size:4.5rem">${place.emoji}</span>
        <span class="place-type-badge">${place.typeLabel}</span>
      </div>
      <div class="place-body">
        <div class="place-name">${place.name}</div>
        <div class="place-address">📍 ${place.address}</div>
        <div class="place-meta">
          <div class="place-rating">⭐ ${place.rating} <span style="font-weight:400;color:var(--text-muted)">(${place.ratingCount})</span></div>
          <div class="place-distance">🚶 ${place.distance}</div>
          <div class="place-price">${place.price}</div>
        </div>
        <div class="tags">
          ${place.tags.map(t => `<span class="tag">${t}</span>`).join("")}
        </div>
        <div style="font-size:.8rem;color:var(--text-muted);margin-bottom:14px">🕐 ${place.open}</div>
        <button class="reserve-btn" data-id="${place.id}">Rezervasyon Yap</button>
      </div>
    `;
    grid.appendChild(card);
  });

  // Bind reserve buttons
  document.querySelectorAll(".reserve-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openModal(parseInt(btn.dataset.id));
    });
  });
}

// ─── FILTER BUTTONS ───────────────────────────────
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    renderPlaces(activeFilter);
  });
});

// ─── MODAL ───────────────────────────────────────
function openModal(placeId) {
  currentPlace = places.find(p => p.id === placeId);
  if (!currentPlace) return;

  document.getElementById("modalEmoji").textContent  = currentPlace.emoji;
  document.getElementById("modalName").textContent    = currentPlace.name;
  document.getElementById("modalAddress").textContent = currentPlace.address;

  // Set min date to today
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("fdate").min = today;
  document.getElementById("fdate").value = "";
  document.getElementById("ftime").value = "";
  document.getElementById("fname").value = "";
  document.getElementById("fphone").value = "";
  document.getElementById("fnote").value = "";
  guestCount = 2;
  document.getElementById("cntVal").textContent = guestCount;

  document.getElementById("modalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalOverlay").addEventListener("click", (e) => {
  if (e.target === document.getElementById("modalOverlay")) closeModal();
});

// Counter
document.getElementById("cntMinus").addEventListener("click", () => {
  if (guestCount > 1) { guestCount--; document.getElementById("cntVal").textContent = guestCount; }
});
document.getElementById("cntPlus").addEventListener("click", () => {
  if (guestCount < 20) { guestCount++; document.getElementById("cntVal").textContent = guestCount; }
});

// ─── FORM SUBMIT ──────────────────────────────────
document.getElementById("reservationForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name  = document.getElementById("fname").value.trim();
  const phone = document.getElementById("fphone").value.trim();
  const date  = document.getElementById("fdate").value;
  const time  = document.getElementById("ftime").value;
  const note  = document.getElementById("fnote").value.trim();

  if (!name || !phone || !date || !time) return;

  const reservation = {
    id: Date.now(),
    placeId: currentPlace.id,
    placeName: currentPlace.name,
    placeEmoji: currentPlace.emoji,
    placeAddress: currentPlace.address,
    name, phone, date, time,
    guests: guestCount,
    note,
    createdAt: new Date().toISOString(),
  };

  reservations.push(reservation);
  localStorage.setItem("reservations", JSON.stringify(reservations));

  closeModal();
  showSuccess(reservation);
  renderMyReservations();
});

// ─── SUCCESS MODAL ────────────────────────────────
function showSuccess(res) {
  const formattedDate = new Date(res.date).toLocaleDateString("tr-TR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  document.getElementById("successDetails").innerHTML = `
    <div><strong>Mekan:</strong> ${res.placeEmoji} ${res.placeName}</div>
    <div><strong>Adres:</strong> ${res.placeAddress}</div>
    <div><strong>Ad Soyad:</strong> ${res.name}</div>
    <div><strong>Tarih:</strong> ${formattedDate}</div>
    <div><strong>Saat:</strong> ${res.time}</div>
    <div><strong>Kişi Sayısı:</strong> ${res.guests} kişi</div>
    ${res.note ? `<div><strong>Not:</strong> ${res.note}</div>` : ""}
  `;

  document.getElementById("successOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

document.getElementById("successClose").addEventListener("click", () => {
  document.getElementById("successOverlay").classList.remove("open");
  document.body.style.overflow = "";
});
document.getElementById("successOverlay").addEventListener("click", (e) => {
  if (e.target === document.getElementById("successOverlay")) {
    document.getElementById("successOverlay").classList.remove("open");
    document.body.style.overflow = "";
  }
});

// ─── MY RESERVATIONS ──────────────────────────────
function renderMyReservations() {
  const section = document.getElementById("myResSection");
  const grid    = document.getElementById("myResGrid");
  const navLink = document.getElementById("navMyRes");

  if (reservations.length === 0) {
    section.style.display = "none";
    navLink.style.display = "none";
    return;
  }

  section.style.display = "block";
  navLink.style.display = "inline";
  grid.innerHTML = "";

  reservations.slice().reverse().forEach((res, i) => {
    const formattedDate = new Date(res.date).toLocaleDateString("tr-TR", {
      weekday: "short", month: "long", day: "numeric"
    });
    const item = document.createElement("div");
    item.className = "res-item";
    item.style.animationDelay = `${i * 0.07}s`;
    item.innerHTML = `
      <div class="res-item-header">
        <div class="res-emoji">${res.placeEmoji}</div>
        <div>
          <strong>${res.placeName}</strong>
          <small>${res.placeAddress}</small>
        </div>
      </div>
      <div class="res-meta">👤 Ad: <span>${res.name}</span></div>
      <div class="res-meta">📅 Tarih: <span>${formattedDate} – ${res.time}</span></div>
      <div class="res-meta">👥 Kişi: <span>${res.guests} kişi</span></div>
      ${res.note ? `<div class="res-meta">📝 Not: <span>${res.note}</span></div>` : ""}
      <button class="res-cancel-btn" data-id="${res.id}">İptal Et</button>
    `;
    grid.appendChild(item);
  });

  document.querySelectorAll(".res-cancel-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!confirm("Bu rezervasyonu iptal etmek istediğinize emin misiniz?")) return;
      reservations = reservations.filter(r => r.id !== parseInt(btn.dataset.id));
      localStorage.setItem("reservations", JSON.stringify(reservations));
      renderMyReservations();
    });
  });
}

// ─── INIT ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderPlaces("all");
  renderMyReservations();
});
