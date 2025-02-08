document.addEventListener("DOMContentLoaded", function () {
  const stars = document.querySelectorAll(".star");
  let selectedRating = 0;

  stars.forEach((star, index) => {
    star.addEventListener("mouseover", () => {
      resetStars();
      highlightStars(index);
    });

    star.addEventListener("click", () => {
      selectedRating = index + 1;
      persistSelection();
    });

    star.addEventListener("mouseout", () => {
      if (selectedRating === 0) {
        resetStars();
      } else {
        persistSelection();
      }
    });
  });

  function highlightStars(index) {
    for (let i = 0; i <= index; i++) {
      stars[i].classList.add("hovered");
    }
  }

  function resetStars() {
    stars.forEach((star) => star.classList.remove("hovered", "active"));
  }

  function persistSelection() {
    for (let i = 0; i < selectedRating; i++) {
      stars[i].classList.add("active");
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const reviewLink = document.getElementById("review");
  const reviewBox = document.getElementById("reviewBox");
  const submitButton = document.getElementById("submitReview");
  const reviewText = document.getElementById("reviewText");

  // Mostra ou esconde a caixa ao clicar no link
  reviewLink.addEventListener("click", function () {
    reviewBox.classList.toggle("hidden");
    reviewText.focus(); // Já coloca o cursor no campo de texto
  });

  // Simula envio da resenha
  submitButton.addEventListener("click", function () {
    const text = reviewText.value.trim();

    if (text === "") {
      alert("Por favor, escreva uma resenha antes de enviar.");
      return;
    }

    alert("Resenha enviada: " + text);
    reviewText.value = ""; // Limpa o campo
    reviewBox.classList.add("hidden"); // Oculta a caixa novamente
  });
});
