document.addEventListener("DOMContentLoaded", () => {
  const alvo = document.querySelector(".tela-escolha");
  if (!alvo) return;

  const div = document.createElement("div");
  div.className = "assinatura-genario";
  div.innerHTML = `
    Feito por <strong>Genário</strong> – 
    <a href="https://wa.me/5582981435389?text=Ol%C3%A1,%20gostei%20da%20p%C3%A1gina%20que%20voc%C3%AA%20fez.%20Tenho%20interesse!" 
       target="_blank">
       Fale comigo no WhatsApp
    </a>
  `;
  alvo.appendChild(div);

  // Estilos via JS
  const estilo = document.createElement("style");
  estilo.textContent = `
    .assinatura-genario {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.85);
      text-align: center;
      margin-top: 1.5rem;
      text-shadow: 0 1px 3px rgba(0,0,0,0.3);
      font-weight: 400;
    }

    .assinatura-genario a {
      color: #d1ffd1;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .assinatura-genario a:hover {
      color: #8fff8f;
      text-decoration: underline;
    }
  `;
  document.head.appendChild(estilo);
});
