// Função para gerar números aleatórios

let surto = [], prioridade = [], chegada = [];

function generateNumbers(quantProcessos) {
  for (let i = 0; i < quantProcessos; i++) {
    surto.push(Math.floor(Math.random() * 100));
    prioridade.push(Math.floor(Math.random() * quantProcessos));
    chegada.push(Math.floor(Math.random() * (quantProcessos * 1.5)));
  }
}

document.getElementById('generateBtn').addEventListener('click', function () {
  let quantProcessos = document.getElementById('inputNumber').value;

  if (quantProcessos > 0) {
    generateNumbers(quantProcessos);
    // document.getElementById('generatedNumbers').value = generatedNumbers.join(', ');
    // document.getElementById('generatedNumbersToggle').style.display = 'block';
    renderRoundRobinTable(quantProcessos)
  }
});

function renderRoundRobinTable(quantProcessos) {
  const tabelaRR = document.getElementById('tabelaRR');

  for (let i = 0; i < quantProcessos; i++) {
    const rowRR = renderRows((i+1), surto[i], prioridade[i], chegada[i]);
    tabelaRR.appendChild(rowRR);
  }
}

function renderRows(NumProcesso, surtoP, prioridadeP, chegadaP) {
  const row = document.createElement('tr');
  row.innerHTML = `
      <td>P${NumProcesso}</td>
      <td>${surtoP}</td>
      <td>${prioridadeP}</td>
      <td>${chegadaP}</td>
  `;

  return row;
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