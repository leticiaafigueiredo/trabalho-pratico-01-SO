 // Função para gerar números aleatórios
 function generateNumbers(count) {
    let numbers = [];
    for (let i = 0; i < count; i++) {
      numbers.push(Math.floor(Math.random() * 100)); // Gerando números entre 0 e 99
    }
    return numbers;
  }

  document.getElementById('generateBtn').addEventListener('click', function() {
    let count = document.getElementById('inputNumber').value;

    if (count > 0) {
      let generatedNumbers = generateNumbers(count);
      document.getElementById('generatedNumbers').value = generatedNumbers.join(', ');
      document.getElementById('generatedNumbersToggle').style.display = 'block';
    }
  });

  // Função para aplicar números manuais
  document.getElementById('applyManualBtn').addEventListener('click', function() {
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