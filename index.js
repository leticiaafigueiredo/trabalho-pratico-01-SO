class Processo {

  constructor(numProcesso, surtoP, prioridadeP, chegadaP) {
    this.numProcesso = numProcesso;
    this.surtoP = surtoP;
    this.prioridadeP = prioridadeP;
    this.chegadaP = chegadaP;
  }

}

// Função para gerar números aleatórios
let surto = [], prioridade = [], chegada = [], quantum, media;


function calcularMedia(surtos) {
  let soma = surtos.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
  return soma / surtos.length;
}

function generateNumbers(quantProcessos) {

  surto = [];
  prioridade = [];
  chegada = [];

  for (let i = 0; i < quantProcessos; i++) {
    surto.push(Math.floor(Math.random() * 50) + 5);
    prioridade.push(Math.floor(Math.random() * quantProcessos) + 1);
    chegada.push(Math.floor(Math.random() * (quantProcessos * 1.5)));
  }

  media = calcularMedia(surto);
  quantum = Math.floor(Math.random() * media) + 5
}

document.getElementById('generateBtn').addEventListener('click', function () {

  let quantProcessos = document.getElementById('inputNumber').value;

  if (quantProcessos > 0) {
    generateNumbers(quantProcessos);
    document.getElementById('quantum').textContent = quantum;
    renderRoundRobinTable(quantProcessos)
    mostraTabela()
  }
});

function renderRoundRobinTable(quantProcessos) {
  const tabelaRR = document.getElementById('tabelaRR');
  tabelaRR.innerHTML = '';
  let processos = []

  for (let i = 0; i < quantProcessos; i++) {
    const rowRR = renderRows((i + 1), surto[i], prioridade[i], chegada[i]);
    tabelaRR.appendChild(rowRR);
    let p = new Processo((i + 1), surto[i], prioridade[i], chegada[i]);
    processos.push(p);
  }
  roundRobin(processos);
}

function renderRows(numProcesso, surtoP, prioridadeP, chegadaP) {
  const row = document.createElement('tr');
  row.innerHTML = `
      <td>P${numProcesso}</td>
      <td>${surtoP}</td>
      <td>${prioridadeP}</td>
      <td>${chegadaP}</td>
  `;

  return row;
}

function mostraTabela() {
  const table = document.querySelector('.div-table');
  table.style.display = 'block';
}




// LÓGICA ROUND ROBIN

//INSTANCIA DE PROCESSO

function sortProcessosPorChegada(processos) {
  return processos.sort((a, b) => {
    // Primeiro ordena pelo tempo de chegada
    if (a.chegadaP !== b.chegadaP) {
      return a.chegadaP - b.chegadaP;
    }
    // Se o tempo de chegada for igual, ordena pela prioridade
    return a.prioridadeP - b.prioridadeP;
  });
}

function somaTempoSurto(processos) {
  let somatorioTempoSurto = 0;
  for (let i = 0; i < processos.length; i++) {
    somatorioTempoSurto += processos[i].surtoP;
  }
  return somatorioTempoSurto;
}

function popularListaComProcessos(listaExecucaoProcessos, processosOrdenados) {
  for (let i = 0; i < processosOrdenados.length; i++) {
    listaExecucaoProcessos.set(processosOrdenados[i], []);
  }
  return listaExecucaoProcessos;
}

function adicionarValor(listaExecucaoProcessos, processo, passo) {
  listaExecucaoProcessos.get(processo).push(passo);
}

function roundRobin(processos) {
  let PassoComAnterior = 0;
  let somatorioTemposSurto = 0;
  somatorioTemposSurto = somaTempoSurto(processos);
  let processosOrdenados = [];
  processosOrdenados = sortProcessosPorChegada(processos);

  let listaExecucaoProcessos = new Map();

  listaExecucaoProcessos.clear();

  listaExecucaoProcessos = popularListaComProcessos(listaExecucaoProcessos, processosOrdenados);

  while (somatorioTemposSurto != 0) {
    for (let i = 0; i < processosOrdenados.length; i++) {
      let tempoSurtoRestante = processosOrdenados[i].surtoP - quantum;

      if (processosOrdenados[i].surtoP == 0) {
        adicionarValor(listaExecucaoProcessos, processosOrdenados[i], processosOrdenados[i].surtoP);
      } else if (tempoSurtoRestante < 0) {
        tempoSurtoRestante = 0;
        somatorioTemposSurto -= processosOrdenados[i].surtoP;
        PassoComAnterior += processosOrdenados[i].surtoP
        adicionarValor(listaExecucaoProcessos, processosOrdenados[i], PassoComAnterior);
        processosOrdenados[i].surtoP = 0;
      } else {
        somatorioTemposSurto -= quantum;
        processosOrdenados[i].surtoP -= quantum;
        PassoComAnterior += quantum;
        adicionarValor(listaExecucaoProcessos, processosOrdenados[i], PassoComAnterior);
      }
    }
  }

  renderTimeline(listaExecucaoProcessos, processos[0])
  mostraTimeline()
}

function testa(listaExecucaoP) {
  listaExecucaoP.forEach((valor, chave) => {
    console.log('Processo: ', chave.numProcesso, 'tempo de surto executado por execução: ', valor);
  });
}

function renderTimeline(listaExecucaoP, processo) {
  const ol = document.getElementById('historias');
  const tamanhoArray = listaExecucaoP.get(processo).length;
  ol.innerHTML = '';

  for (let i = 0; i < tamanhoArray; i++) {
    listaExecucaoP.forEach((valor, chave) => {
      if (valor[i] != 0) {
        const timeElement = renderProcessos(chave.numProcesso, valor[i]);
        ol.appendChild(timeElement);
      }
    });
  }

}

function renderProcessos(numProcesso, final) {
  const li = document.createElement('li');

  li.innerHTML = `
      <div class="d-flex flex-column align-items-start">
          <time class="h5 fw-bold">Processo ${numProcesso}</time>
          <span>${final}</span>
      </div>
  `;

  return li;
}

function mostraTimeline() {
  const timelineSection = document.querySelector('.timeline');
  timelineSection.style.display = 'block';
}







(function () {
  // VARIABLES
  const timeline = document.querySelector(".timeline ol"),
    elH = document.querySelectorAll(".timeline li > div"),
    arrows = document.querySelectorAll(".timeline .arrows .arrow"),
    arrowPrev = document.querySelector(".timeline .arrows .arrow__prev"),
    arrowNext = document.querySelector(".timeline .arrows .arrow__next"),
    firstItem = document.querySelector(".timeline li:first-child"),
    lastItem = document.querySelector(".timeline li:last-child"),
    xScrolling = 280,
    disabledClass = "disabled";

  // START
  window.addEventListener("load", init);

  function init() {
    setEqualHeights(elH);
    animateTl(xScrolling, arrows, timeline);
    setSwipeFn(timeline, arrowPrev, arrowNext);
    setKeyboardFn(arrowPrev, arrowNext);
  }

  // SET EQUAL HEIGHTS
  function setEqualHeights(el) {
    let counter = 0;
    for (let i = 0; i < el.length; i++) {
      const singleHeight = el[i].offsetHeight;

      if (counter < singleHeight) {
        counter = singleHeight;
      }
    }

    for (let i = 0; i < el.length; i++) {
      el[i].style.height = `${counter}px`;
    }
  }

  // CHECK IF AN ELEMENT IS IN VIEWPORT
  // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // SET STATE OF PREV/NEXT ARROWS
  function setBtnState(el, flag = true) {
    if (flag) {
      el.classList.add(disabledClass);
    } else {
      if (el.classList.contains(disabledClass)) {
        el.classList.remove(disabledClass);
      }
      el.disabled = false;
    }
  }

  // ANIMATE TIMELINE
  function animateTl(scrolling, el, tl) {
    let counter = 0;
    for (let i = 0; i < el.length; i++) {
      el[i].addEventListener("click", function () {
        if (!arrowPrev.disabled) {
          arrowPrev.disabled = true;
        }
        if (!arrowNext.disabled) {
          arrowNext.disabled = true;
        }
        const sign = this.classList.contains("arrow__prev") ? "" : "-";


        if (counter === 0) {
          tl.style.transform = `translateX(-${scrolling}px)`;
        } else {
          const tlStyle = getComputedStyle(tl);
          // add more browser prefixes if needed here
          const tlTransformWebkit = tlStyle.getPropertyValue("-webkit-transform");
          const tlTransformMoz = tlStyle.getPropertyValue("-moz-transform");
          const tlTransform = tlStyle.getPropertyValue("transform");

          const transformValue = tlTransformWebkit || tlTransformMoz || tlTransform;


          const values = parseInt(transformValue.split(",")[4]) + parseInt(`${sign}${scrolling}`);

          tl.style.transform = `translateX(${values}px)`;
          tl.style.webkitTransform = `translateX(${values}px)`; // Para Safari
          tl.style.mozTransform = `translateX(${values}px)`; // Para Firefox
        }

        setTimeout(() => {
          isElementInViewport(firstItem)
            ? setBtnState(arrowPrev)
            : setBtnState(arrowPrev, false);
          isElementInViewport(lastItem)
            ? setBtnState(arrowNext)
            : setBtnState(arrowNext, false);
        }, 1100);

        counter++;
      });
    }
  }

  // ADD SWIPE SUPPORT FOR TOUCH DEVICES
  function setSwipeFn(tl, prev, next) {
    const hammer = new Hammer(tl);
    hammer.on("swipeleft", () => next.click());
    hammer.on("swiperight", () => prev.click());
  }

  // ADD BASIC KEYBOARD FUNCTIONALITY
  function setKeyboardFn(prev, next) {
    document.addEventListener("keydown", (e) => {
      if (e.which === 37 || e.which === 39) {
        const timelineOfTop = timeline.offsetTop;
        const y = window.pageYOffset;
        if (timelineOfTop !== y) {
          window.scrollTo(0, timelineOfTop);
        }
        if (e.which === 37) {
          prev.click();
        } else if (e.which === 39) {
          next.click();
        }
      }
    });
  }
})();

