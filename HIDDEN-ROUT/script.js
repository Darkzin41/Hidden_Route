const track = document.querySelector(".carousel-track");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");

let index = 0;
const cardWidth = document.querySelector(".card").offsetWidth + 20; // Largura do card + margem

// Função para avançar
nextButton.addEventListener("click", () => {
  if (index < track.children.length - 3) {
    // Mostra 3 por vez
    index++;
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }
});

// Função para voltar
prevButton.addEventListener("click", () => {
  if (index > 0) {
    index--;
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }
});
