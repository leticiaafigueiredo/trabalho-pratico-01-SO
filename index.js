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
  return processos.sort((a, b) => a.chegadaP - b.chegadaP);
}

function somaTempoSurto(processos){
  for(let i = 0; i<processos.length; i++){
    somaTempoSurto += processos[i].surtoP;
  }
  return somaTempoSurto;
}

function roundRobin(processos){
  let somaTempoSurto = 0;
  somaTempoSurto = somaTempoSurto(processos);
  let processosOrdenados = [];
  processosOrdenados = sortProcessosPorChegada(processos);

  while(somaTempoSurto != 0){
    for(let i = 0; i<processosOrdenados.length; i++){
      let tempoSurtoRestante = processosOrdenados[i].surtoP - quantum;
      
      if(tempoSurtoRestante < 0){
        tempoSurtoRestante = 0;
        somaTempoSurto -= processosOrdenados[i].surtoP;
        processosOrdenados[i].surtoP = 0;
      } else {
        somaTempoSurto -= quantum;
        processosOrdenados[i].surtoP -= quantum;
      }
      processosOrdenados[i].surtoP = tempoSurtoRestante;
    }
  }
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