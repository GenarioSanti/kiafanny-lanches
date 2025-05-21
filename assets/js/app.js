// Configurações e variáveis globais
const urlParams = new URLSearchParams(window.location.search);
const cidade = urlParams.get('cidade');
const cardapio = document.getElementById('cardapio');
const carrinhoBtn = document.getElementById('carrinho-flutuante');
const contadorSpan = document.getElementById('contador');
let carrinho = [];

// Dados do cardápio
const lanches = [
  ["Hambúrguer", "R$ 12,00", "pão, hambúrguer, queijo, presunto e salada"],
  ["Americano", "R$ 12,00", "pão, queijo, presunto, ovo, salada, maionese e ketchup"],
  ["X-Burguer", "R$ 15,00", "pão, hambúrguer, queijo, ovo, presunto e salada"],
  ["X-Calabresa", "R$ 20,00", "pão, hambúrguer, queijo, calabresa, presunto e salada"],
  ["X-Frango", "R$ 20,00", "pão, frango desfiado, queijo, presunto e salada"],
  ["X-Filé de Frango", "R$ 20,00", "pão, filé de frango, queijo, ovo, presunto, salada, maionese e ketchup"],
  ["X-Bacon", "R$ 25,00", "pão, hambúrguer, bacon, queijo, presunto e salada"],
  ["Hambúrguer Artesanal", "R$ 25,00", "pão, hambúrguer artesanal, cebola, cheddar, mussarela, presunto, ovo e salada"],
  ["Diferente", "R$ 30,00", "pão, hambúrguer, ovo, frango desfiado, coração de frango, queijo, presunto e salada"],
  ["X-Calabacon", "R$ 27,00", "pão, hambúrguer, calabresa, bacon, queijo, presunto e salada"],
  ["X-Frango Bacon", "R$ 28,00", "pão, frango desfiado, bacon, queijo, milho verde e salada"],
  ["X-Coração de Frango", "R$ 28,00", "pão, coração de frango, queijo, presunto e salada"],
  ["X-Frango Calabresa", "R$ 28,00", "pão, frango desfiado, calabresa, queijo, milho verde e salada"],
  ["X-Filé de Carne", "R$ 30,00", "pão, filé de carne, queijo, ovo, presunto e salada"],
  ["X-Tudo", "R$ 30,00", "pão, hambúrguer, calabresa, bacon, ovo, queijo, presunto e salada"],
  ["X-Tudão", "R$ 35,00", "pão, hambúrguer, calabresa, bacon, frango, ovo, queijo, presunto e salada"],
  ["Resenha", "R$ 35,00", "pão, 2 hambúrguer, 2 ovos, 2 queijos, 2 presuntos, bacon e salada"]
];

// Implementação de lazy loading para imagens
function lazyLoadImages() {
  if ('loading' in HTMLImageElement.prototype) {
    // Navegador suporta lazy loading nativo
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
  } else {
    // Fallback para navegadores que não suportam lazy loading nativo
    // Poderia ser implementado com Intersection Observer
  }
}

// Inicialização do cardápio
function inicializarCardapio() {
  if (cidade) {
    document.querySelector('.fundo-estatico').style.display = "none";
    cardapio.style.display = "grid";
    carrinhoBtn.style.display = "block";

    // Carregar itens do cardápio com lazy loading
    lanches.forEach((lanche, index) => {
      const div = document.createElement('div');
      div.className = "item";
      div.setAttribute('role', 'button');
      div.setAttribute('aria-label', `${lanche[0]} - ${lanche[1]}`);
      div.setAttribute('tabindex', '0');
      
      div.innerHTML = `
        <img src="assets/images/hamburguer.png" alt="${lanche[0]}" loading="lazy">
        <h3>${lanche[0]}</h3>
        <span class="price">${lanche[1]}</span>
        <p>${lanche[2]}</p>
      `;
      
      // Adicionar eventos de clique e teclado para acessibilidade
      div.addEventListener('click', () => abrirModal(lanche));
      div.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          abrirModal(lanche);
        }
      });
      
      cardapio.appendChild(div);
    });
    
    // Aplicar lazy loading em todas as imagens
    lazyLoadImages();
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
  
  // Acessibilidade: foco no primeiro elemento interativo do modal
  setTimeout(() => {
    document.getElementById('menos').focus();
  }, 100);
  
  // Capturar foco dentro do modal (trap focus)
  trapFocusInModal(modal);
}

// Função para manter o foco dentro do modal aberto
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

// Função para fechar modais
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

// Eventos para fechar modal ao clicar fora
document.getElementById('modal-lanche').addEventListener('click', e => {
  if (e.target.id === 'modal-lanche') {
    fecharModal('modal-lanche');
  }
});

// Adicionar ao carrinho
document.getElementById('adicionar-modal').addEventListener('click', () => {
  const nome = document.getElementById('modal-nome').textContent;
  const preco = document.getElementById('modal-preco').textContent;
  const qtd = parseInt(document.getElementById('quantidade').textContent);

  for (let i = 0; i < qtd; i++) {
    carrinho.push({ nome, preco });
  }

  // Feedback visual e sonoro para usuários
  contadorSpan.textContent = carrinho.length;
  fecharModal('modal-lanche');
  
  // Animação do botão de finalizar pedido
  const botaoFinalizar = document.getElementById('finalizar-pedido');
  botaoFinalizar.classList.add('pulse');
  setTimeout(() => botaoFinalizar.classList.remove('pulse'), 700);
  
  // Feedback para usuários (poderia ser um toast)
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
  
  // Acessibilidade: foco no primeiro elemento interativo
  setTimeout(() => {
    document.getElementById('enviar-whatsapp').focus();
  }, 100);
  
  // Trap focus no modal de resumo
  trapFocusInModal(document.getElementById('modal-resumo'));
});

// Atualizar resumo do pedido
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

// Alterar quantidade de itens
function alterarQtd(nome, delta) {
  if (delta === 0) return;

  let novos = [];
  let qtdAtual = 0;

  for (let item of carrinho) {
    if (item.nome === nome) qtdAtual++;
  }

  if (delta < 0 && qtdAtual <= 1) return; // não deixa remover o último com botão −

  let contador = 0;
  for (let item of carrinho) {
    if (item.nome === nome) {
      contador++;
      if (delta < 0 && contador === 1) continue; // remove só 1
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

// Remover item do carrinho
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

  // Abrir WhatsApp em nova aba
  window.open(`https://wa.me/${numero}?text=${texto}`, '_blank');
});

// Adicionar estilos dinâmicos para feedback visual
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

// Inicializar a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  inicializarCardapio();
  
  // Expor funções globais necessárias
  window.alterarQtd = alterarQtd;
  window.removerItem = removerItem;
  window.fecharModal = fecharModal;
});
