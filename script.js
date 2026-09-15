// Números reais do Grupo Sorana (públicos no site atual, confirmados em
// /enderecos). Audi = showroom de vendas (Pinheiros); VW = WhatsApp do setor
// de Serviços (Casa Verde), o único confirmado com WhatsApp ativo do lado VW.
const WHATSAPP_AUDI = '5511913272977';
const WHATSAPP_VW = '5511995250280';

document.getElementById('ano').textContent = new Date().getFullYear();

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  nav.classList.toggle('is-open');
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    document.querySelectorAll('.nav-item.is-open').forEach((item) => item.classList.remove('is-open'));
  });
});

document.querySelectorAll('.nav-trigger').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    const item = trigger.closest('.nav-item');
    const wasOpen = item.classList.contains('is-open');
    document.querySelectorAll('.nav-item.is-open').forEach((el) => el.classList.remove('is-open'));
    if (!wasOpen) item.classList.add('is-open');
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav-item')) {
    document.querySelectorAll('.nav-item.is-open').forEach((el) => el.classList.remove('is-open'));
  }
});

// Slider do hero (home)
const heroSlides = document.querySelectorAll('.hero__slide');

if (heroSlides.length) {
  const heroDots = document.querySelectorAll('.hero__dot');
  const heroPromos = document.querySelectorAll('.hero__promo-slide');
  let heroCurrent = 0;
  let heroAutoplay;

  const showHeroSlide = (index) => {
    heroCurrent = (index + heroSlides.length) % heroSlides.length;
    heroSlides.forEach((slide, i) => slide.classList.toggle('is-active', i === heroCurrent));
    heroDots.forEach((dot, i) => dot.classList.toggle('is-active', i === heroCurrent));
    heroPromos.forEach((promo, i) => promo.classList.toggle('is-active', i === heroCurrent));
  };

  const resetHeroAutoplay = () => {
    clearInterval(heroAutoplay);
    heroAutoplay = setInterval(() => showHeroSlide(heroCurrent + 1), 6000);
  };

  document.getElementById('hero-prev')?.addEventListener('click', () => {
    showHeroSlide(heroCurrent - 1);
    resetHeroAutoplay();
  });

  document.getElementById('hero-next')?.addEventListener('click', () => {
    showHeroSlide(heroCurrent + 1);
    resetHeroAutoplay();
  });

  heroDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showHeroSlide(i);
      resetHeroAutoplay();
    });
  });

  resetHeroAutoplay();
}

// Busca no catálogo de modelos (páginas de marca)
const modeloBusca = document.getElementById('modelo-busca');

if (modeloBusca) {
  const modeloCards = document.querySelectorAll('#modelos-grid .modelo-card');
  const modeloVazio = document.getElementById('modelos-empty');

  modeloBusca.addEventListener('input', () => {
    const termo = modeloBusca.value.trim().toLowerCase();
    let visiveis = 0;

    modeloCards.forEach((card) => {
      const nome = card.dataset.nome || '';
      const match = nome.includes(termo);
      card.hidden = !match;
      if (match) visiveis++;
    });

    if (modeloVazio) modeloVazio.hidden = visiveis !== 0;
  });
}

// Abas da ficha técnica (páginas de modelo)
document.querySelectorAll('.ficha-tabs').forEach((wrap) => {
  const tabs = wrap.querySelectorAll('.ficha-tab');
  const panels = wrap.querySelectorAll('.ficha-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('is-active'));
      panels.forEach((p) => p.classList.remove('is-active'));
      tab.classList.add('is-active');
      wrap.querySelector(`.ficha-panel[data-panel="${tab.dataset.tab}"]`).classList.add('is-active');
    });
  });
});

const form = document.getElementById('contato-form');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const marca = data.get('marca');

    const linhas = [
      `Olá! Tenho interesse em ${marca === 'Ainda não sei' ? 'um veículo' : marca}.`,
      `Nome: ${data.get('nome')}`,
      `Telefone: ${data.get('telefone')}`,
    ];

    const mensagemExtra = data.get('mensagem');
    if (mensagemExtra) linhas.push(`Mensagem: ${mensagemExtra}`);

    const numero = marca === 'Volkswagen' ? WHATSAPP_VW : WHATSAPP_AUDI;
    const mensagem = encodeURIComponent(linhas.join('\n'));
    window.open(`https://wa.me/${numero}?text=${mensagem}`, '_blank', 'noopener');
  });
}

// Diálogos (avaliar usado / test-drive) — abrir, fechar, enviar pelo WhatsApp
document.querySelectorAll('[data-dialog-open]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const dialog = document.getElementById(trigger.dataset.dialogOpen);
    dialog?.showModal();
  });
});

document.querySelectorAll('.dialog').forEach((dialog) => {
  dialog.querySelectorAll('[data-dialog-close]').forEach((btn) => {
    btn.addEventListener('click', () => dialog.close());
  });

  // Fecha ao clicar fora (no backdrop) — clique no próprio <dialog> só acontece
  // fora da caixa de conteúdo, já que o form cobre a área interna.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});

const enviarPeloWhatsapp = (form, numero, linhas) => {
  const submitBtn = form.querySelector('.dialog-form__submit');
  const textoOriginal = submitBtn.textContent;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Abrindo WhatsApp...';

  const mensagem = encodeURIComponent(linhas.filter(Boolean).join('\n'));
  window.open(`https://wa.me/${numero}?text=${mensagem}`, '_blank', 'noopener');

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = textoOriginal;
    form.closest('dialog')?.close();
    form.reset();
  }, 500);
};

const formAvaliar = document.getElementById('form-avaliar');

if (formAvaliar) {
  formAvaliar.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(formAvaliar);

    enviarPeloWhatsapp(formAvaliar, WHATSAPP_AUDI, [
      'Olá! Gostaria de avaliar meu carro pra troca por um novo ou seminovo na Sorana.',
      `Nome: ${data.get('nome')}`,
      `WhatsApp: ${data.get('whatsapp')}`,
      `Veículo: ${data.get('marcaVeiculo')} ${data.get('modeloVeiculo')}`,
      data.get('ano') ? `Ano: ${data.get('ano')}` : '',
      data.get('km') ? `Quilometragem: ${data.get('km')}` : '',
      data.get('cidade') ? `Cidade: ${data.get('cidade')}` : '',
      data.get('observacoes') ? `Observações: ${data.get('observacoes')}` : '',
    ]);
  });
}

const formTestDrive = document.getElementById('form-test-drive');

if (formTestDrive) {
  formTestDrive.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(formTestDrive);
    const marca = data.get('marca');
    const numero = marca === 'Volkswagen' ? WHATSAPP_VW : WHATSAPP_AUDI;

    enviarPeloWhatsapp(formTestDrive, numero, [
      `Olá! Gostaria de agendar um test-drive de ${marca} — ${data.get('modelo')}.`,
      `Nome: ${data.get('nome')}`,
      `WhatsApp: ${data.get('whatsapp')}`,
      `Unidade: ${data.get('unidade')}`,
      `Melhor horário: ${data.get('horario')}`,
    ]);
  });
}
