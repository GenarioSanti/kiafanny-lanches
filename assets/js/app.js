// Configurações e variáveis globais
const urlParams = new URLSearchParams(window.location.search);
const cidade = urlParams.get('cidade');
const cardapio = document.getElementById('cardapio');
const carrinhoBtn = document.getElementById('carrinho-flutuante');
const contadorSpan = document.getElementById('contador');
let carrinho = [];

// Implementação de lazy loading para imagens
function lazyLoadImages() {
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
  }
}

// Função para abrir modal com detalhes do lanche
function abrirModal(lanche) {
  document.getElementById('modal-img').src = 'assets/images/hamburguer.png';
  document.getElementById('modal-nome').textContent = lanche[0];
  document.getElementById('modal-preco').textContent = lanche[1];
  document.getElementById('modal-desc').textContent = lanche[2];
  document.getElementById('quantidade').textContent = 1;

  const modal = document.getElementById('modal-lanche');
  modal.style.display = 'flex';

  setTimeout(() => {
    document.getElementById('menos').focus();
  }, 100);

  trapFocusInModal(modal);
}

// Trap focus dentro do modal
function trapFocusInModal(modal) {
  const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  modal.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    } else if (e.key === 'Escape') {
      fecharModal(modal.id);
    }
  });
}

// Fecha modais
function fecharModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Controles de quantidade
document.getElementById('mais').onclick = () => {
  let q = parseInt(document.getElementById('quantidade').textContent);
  document.getElementById('quantidade').textContent = q + 1;
};

document.getElementById('menos').onclick = () => {
  let q = parseInt(document.getElementById('quantidade').textContent);
  if (q > 1) document.getElementById('quantidade').textContent = q - 1;
};

// Fecha modal clicando fora
document.getElementById('modal-lanche').addEventListener('click', e => {
  if (e.target.id === 'modal-lanche') {
    fecharModal('modal-lanche');
  }
});

// Adiciona ao carrinho
document.getElementById('adicionar-modal').addEventListener('click', () => {
  const nome = document.getElementById('modal-nome').textContent;
  const preco = document.getElementById('modal-preco').textContent;
  const qtd = parseInt(document.getElementById('quantidade').textContent);

  for (let i = 0; i < qtd; i++) {
    carrinho.push({ nome, preco });
  }

  contadorSpan.textContent = carrinho.length;
  fecharModal('modal-lanche');

  const botaoFinalizar = document.getElementById('finalizar-pedido');
  botaoFinalizar.classList.add('pulse');
  setTimeout(() => botaoFinalizar.classList.remove('pulse'), 700);

  const feedback = document.createElement('div');
  feedback.className = 'feedback-toast';
  feedback.textContent = `${qtd}x ${nome} adicionado ao pedido`;
  document.body.appendChild(feedback);

  setTimeout(() => {
    feedback.classList.add('show');
    setTimeout(() => {
      feedback.classList.remove('show');
      setTimeout(() => document.body.removeChild(feedback), 300);
    }, 2000);
  }, 10);
});

// Finalizar pedido
document.getElementById('finalizar-pedido').addEventListener('click', () => {
  if (carrinho.length === 0) {
    alert("Você ainda não adicionou nenhum item.");
    return;
  }

  atualizarResumo();
  document.getElementById('modal-resumo').style.display = 'flex';

  setTimeout(() => {
    document.getElementById('enviar-whatsapp').focus();
  }, 100);

  trapFocusInModal(document.getElementById('modal-resumo'));
});

// Atualizar resumo
function atualizarResumo() {
  const lista = document.getElementById('lista-pedido');
  lista.innerHTML = '';

  const agrupado = {};
  carrinho.forEach(item => {
    if (!agrupado[item.nome]) agrupado[item.nome] = { ...item, qtd: 0 };
    agrupado[item.nome].qtd++;
  });

  let total = 0;
  Object.values(agrupado).forEach(item => {
    const precoNum = parseFloat(item.preco.replace("R$", "").replace(",", "."));
    total += precoNum * item.qtd;

    const linha = document.createElement('div');
    linha.className = "resumo-item";
    linha.innerHTML = `
      <span>${item.nome}</span>
      <div class="resumo-controles">
        <button aria-label="Diminuir quantidade de ${item.nome}" onclick="alterarQtd('${item.nome}', -1)">−</button>
        <span aria-live="polite">${item.qtd}</span>
        <button aria-label="Aumentar quantidade de ${item.nome}" onclick="alterarQtd('${item.nome}', 1)">+</button>
        <button aria-label="Remover ${item.nome}" onclick="removerItem('${item.nome}')">x</button>
      </div>
    `;
    lista.appendChild(linha);
  });

  document.getElementById('total-pedido').innerText = `Total: R$ ${total.toFixed(2).replace(".", ",")}`;
}

// Alterar quantidade
function alterarQtd(nome, delta) {
  if (delta === 0) return;

  let novos = [];
  let qtdAtual = 0;

  for (let item of carrinho) {
    if (item.nome === nome) qtdAtual++;
  }

  if (delta < 0 && qtdAtual <= 1) return;

  let contador = 0;
  for (let item of carrinho) {
    if (item.nome === nome) {
      contador++;
      if (delta < 0 && contador === 1) continue;
      novos.push(item);
    } else {
      novos.push(item);
    }
  }

  if (delta > 0) {
    for (let i = 0; i < delta; i++) {
      novos.push({ nome: nome, preco: carrinho.find(x => x.nome === nome).preco });
    }
  }

  carrinho = novos;
  contadorSpan.textContent = carrinho.length;
  atualizarResumo();
}

// Remover item
function removerItem(nome) {
  carrinho = carrinho.filter(item => item.nome !== nome);
  contadorSpan.textContent = carrinho.length;
  atualizarResumo();
}

// Fechar modal de resumo ao clicar fora
document.getElementById('modal-resumo').addEventListener('click', e => {
  if (e.target.id === 'modal-resumo') {
    fecharModal('modal-resumo');
  }
});

// Enviar pedido pelo WhatsApp
document.getElementById('enviar-whatsapp').addEventListener('click', () => {
  if (carrinho.length === 0) {
    alert("Seu pedido está vazio.");
    return;
  }

  let texto = "Olá! Quero fazer meu pedido:%0A";
  let total = 0;
  const agrupado = {};

  carrinho.forEach(item => {
    if (!agrupado[item.nome]) agrupado[item.nome] = { ...item, qtd: 0 };
    agrupado[item.nome].qtd++;
  });

  Object.values(agrupado).forEach(item => {
    texto += `- ${item.nome} x${item.qtd} (${item.preco})%0A`;
    total += parseFloat(item.preco.replace("R$", "").replace(",", ".")) * item.qtd;
  });

  texto += `%0ATotal: R$ ${total.toFixed(2).replace(".", ",")}`;

  let numero = '';
  if (cidade === 'canapi') numero = '5582982062539';
  if (cidade === 'inhapi') numero = '5582981075609';
  if (cidade === 'mata-grande') numero = '5582981404413';

  window.open(`https://wa.me/${numero}?text=${texto}`, '_blank');
});

// Estilos visuais de feedback
const style = document.createElement('style');
style.textContent = `
  .pulse {
    animation: pulse-animation 0.7s ease-in-out;
  }
  @keyframes pulse-animation {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  .feedback-toast {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background-color: rgba(40, 167, 69, 0.9);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 9998;
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
    font-weight: 500;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  }
  .feedback-toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  @media (prefers-reduced-motion: reduce) {
    .pulse, .feedback-toast {
      transition: none !important;
      animation: none !important;
    }
  }
`;
document.head.appendChild(style);

// Mostrar cardápio e esconder tela inicial ao escolher cidade
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const cidade = urlParams.get('cidade');

  if (cidade) {
    document.querySelector('.fundo-estatico').style.display = "none";
    document.getElementById('cardapio').style.display = "grid";
    document.getElementById('carrinho-flutuante').style.display = "block";
  }

  window.alterarQtd = alterarQtd;
  window.removerItem = removerItem;
  window.fecharModal = fecharModal;
});

// Ativar modais ao clicar nos itens do cardápio (HTML fixo)
document.querySelectorAll('.cardapio .item').forEach(item => {
  const nome = item.querySelector('h3')?.textContent || '';
  const preco = item.querySelector('.price')?.textContent || '';
  const descricao = item.querySelector('p')?.textContent || '';
  const imagem = item.querySelector('img')?.getAttribute('src') || '';

  const dados = [nome, preco, descricao, imagem];

  item.style.cursor = "pointer";
  item.addEventListener('click', () => abrirModalHTML(dados));
});

// Função abrir modal (para HTML fixo)
function abrirModalHTML(lanche) {
  document.getElementById('modal-img').src = lanche[3];
  document.getElementById('modal-nome').textContent = lanche[0];
  document.getElementById('modal-preco').textContent = lanche[1];
  document.getElementById('modal-desc').textContent = lanche[2];
  document.getElementById('quantidade').textContent = 1;

  const modal = document.getElementById('modal-lanche');
  modal.style.display = 'flex';

  setTimeout(() => {
    document.getElementById('menos').focus();
  }, 100);

  trapFocusInModal(modal);
}
