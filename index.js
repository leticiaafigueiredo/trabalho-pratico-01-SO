class Processo {

  constructor(numProcesso, surtoP, prioridadeP, chegadaP){
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
    surto.push(Math.floor(Math.random() * 50));
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
  }
});

function renderRoundRobinTable(quantProcessos) {
  const tabelaRR = document.getElementById('tabelaRR');
  tabelaRR.innerHTML = '';
  let processos = [] 

  for (let i = 0; i < quantProcessos; i++) {
    const rowRR = renderRows((i+1), surto[i], prioridade[i], chegada[i]);
    tabelaRR.appendChild(rowRR);
    let p = new Processo((i+1), surto[i], prioridade[i], chegada[i]);
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

function somaTempoSurto(processos){
  let somatorioTempoSurto = 0;
  for(let i = 0; i<processos.length; i++){
    somatorioTempoSurto += processos[i].surtoP;
  }
  return somatorioTempoSurto;
}

function popularListaComProcessos(listaExecucaoProcessos, processosOrdenados) {
  for(let i=0; i<processosOrdenados.length; i++){
    listaExecucaoProcessos.set(processosOrdenados[i], []);
  }
  return listaExecucaoProcessos;
}

function adicionarValor(listaExecucaoProcessos, processo, passo) {
  listaExecucaoProcessos.get(processo).push(passo);
}

function roundRobin(processos){
  let PassoComAnterior = 0;
  let somatorioTemposSurto = 0;
  somatorioTemposSurto = somaTempoSurto(processos);
  let processosOrdenados = [];
  processosOrdenados = sortProcessosPorChegada(processos);

  let listaExecucaoProcessos = new Map();
  listaExecucaoProcessos = popularListaComProcessos(listaExecucaoProcessos, processosOrdenados);

  while(somatorioTemposSurto != 0){
    for(let i = 0; i<processosOrdenados.length; i++){
      let tempoSurtoRestante = processosOrdenados[i].surtoP - quantum;
      
      if(processosOrdenados[i].surtoP == 0){
        adicionarValor(listaExecucaoProcessos, processosOrdenados[i], processosOrdenados[i].surtoP);
      } else if(tempoSurtoRestante < 0){
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

function testa(listaExecucaoP){
  listaExecucaoP.forEach((valor, chave) => {
    console.log('Processo: ', chave.numProcesso, 'tempo de surto executado por execução: ', valor);
  });
}

function renderTimeline(listaExecucaoP, processo){
  const ol = document.getElementById('historias');
  const tamanhoArray = listaExecucaoP.get(processo).length;

  for(let i=0; i<tamanhoArray;i++){
    listaExecucaoP.forEach((valor, chave) => {
      const timeElement = renderProcessos(chave.numProcesso, valor[i]);
      ol.appendChild(timeElement);
    });
  }

}

function renderProcessos(numProcesso, final){
  const li = document.createElement('li');

  li.innerHTML = `
      <div class="d-flex flex-column align-items-start">
          <time class="h5 fw-bold">Processo ${numProcesso}</time>
          <span>${final}</span>
      </div>
  `;

  return li;
}

function mostraTimeline(){
  const timelineSection = document.querySelector('.timeline');
  timelineSection.style.display = 'block';
}












// Função para aplicar números manuais
document.getElementById('applyManualBtn').addEventListener('click', function () {
  let manualInput = document.getElementById('manualInput').value;
  let count = document.getElementById('inputNumber').value;

  // Limpa a mensagem de erro, se houver
  document.getElementById('errorMessage').classList.add('d-none');

  // Verifica se a quantidade inserida manualmente é igual ao número selecionado e se não há números negativos
  let manualNumbers = manualInput.split(',').map(num => num.trim());
  let containsNegative = manualNumbers.some(num => num < 0);

  if (manualNumbers.length != count || containsNegative) {
    // Mostra a mensagem de erro se a quantidade for diferente ou se houver números negativos
    document.getElementById('errorMessage').classList.remove('d-none');
  } else {
    // Limpa o campo de números gerados
    document.getElementById('generatedNumbers').value = "";

    // Exibe os números manuais no campo de números gerados
    document.getElementById('generatedNumbers').value = manualInput;
    document.getElementById('generatedNumbersToggle').style.display = 'block';
  }
});