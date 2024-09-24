import React, { useState, useEffect } from 'react';
import './App.css';

export default function LamportSimulator() {
  const [numProcesses, setNumProcesses] = useState(5);  // Estado para armazenar o número de processos
  const [processes, setProcesses] = useState([]);  // Estado para armazenar os tempos dos processos
  const [senderProcess, setSenderProcess] = useState(0);  // Estado para armazenar o processo que envia a mensagem
  const [receiverProcess, setReceiverProcess] = useState(0);  // Estado para armazenar o processo que recebe a mensagem
  const [senderTime, setSenderTime] = useState(0);  // Estado para armazenar o tempo do remetente
  const [receiverTime, setReceiverTime] = useState(0);  // Estado para armazenar o tempo do destinatário

  // useEffect para gerar os processos sempre que o número de processos for alterado
  useEffect(() => {
    generateProcesses();
  }, [numProcesses]);

  // Função para gerar processos com tempos lógicos incrementados aleatoriamente
  const generateProcesses = () => {
    const newProcesses = [];
    for (let i = 0; i < numProcesses; i++) {
      const increment = Math.floor(Math.random() * 9) + 1;  // Gera um incremento aleatório entre 1 e 9
      const process = Array.from({ length: 10 }, (_, index) => index * increment);  // Cria um processo com 10 eventos, espaçados pelo incremento
      newProcesses.push(process);  // Adiciona o processo ao array de processos
    }
    setProcesses(newProcesses);
  };

  // Função que simula o envio de uma mensagem de um processo para outro
  const handleSend = () => {
    // Validação: impede que o processo remetente e destinatário sejam iguais ou que os tempos sejam inválidos
    if (senderProcess === receiverProcess || senderTime >= processes[senderProcess].length || receiverTime >= processes[receiverProcess].length) {
      return;
    }

    const newProcesses = [...processes];  // Cria uma cópia dos processos
    const senderValue = newProcesses[senderProcess][senderTime]; // Recebe valores dos inputs
    const receiverValue = newProcesses[receiverProcess][receiverTime]; // Recebe valores dos inputs

    // Se o tempo do remetente for maior que o do destinatário, ajusta os tempos do receptor
    if (senderValue > receiverValue) {
      const increment = newProcesses[receiverProcess][1] - newProcesses[receiverProcess][0];  // Calcula o incremento usado pelo receptor
      for (let i = receiverTime; i < newProcesses[receiverProcess].length; i++) {  // Atualiza os tempos do receptor a partir do tempo de recebimento
        newProcesses[receiverProcess][i] = senderValue + 1 + (i - receiverTime) * increment;  // Incrementa o tempo a partir do valor do remetente
      }
    }

    setProcesses(newProcesses);  // Atualiza o estado dos processos com os novos tempos ajustados
  };

  return (
    <div className="lamport-simulator"> 
      <div className="input-group">
        <label>
          Number of Processes:
          <input
            type="number"
            value={numProcesses}  // Número de processos mostrado no input
            onChange={(e) => setNumProcesses(parseInt(e.target.value))}  // Atualiza o estado conforme o número de processos muda
            min={1}  // Valor mínimo permitido
            max={10}  // Valor máximo permitido
          />
        </label>
        <button onClick={generateProcesses}>Generate</button> 
      </div>

      {/* Inputs para definir o processo remetente, o tempo do remetente, o processo receptor e o tempo do receptor */}
      <div className="input-grid">
        <div>
          <label>
            Sender Process:
            <input
              type="number"
              value={senderProcess}  // Número do processo remetente
              onChange={(e) => setSenderProcess(parseInt(e.target.value))}  // Atualiza o processo remetente
              min={0}  // Valor mínimo permitido (primeiro processo)
              max={numProcesses - 1}  // Valor máximo baseado no número de processos
            />
          </label>
        </div>
        <div>
          <label>
            Sender Time:
            <input
              type="number"
              value={senderTime}  // Tempo do evento no processo remetente
              onChange={(e) => setSenderTime(parseInt(e.target.value))}  // Atualiza o tempo do remetente
              min={0}  // Tempo mínimo (primeiro evento)
              max={9}  // Tempo máximo (último evento)
            />
          </label>
        </div>
        <div>
          <label>
            Receiver Process:
            <input
              type="number"
              value={receiverProcess}  // Número do processo receptor
              onChange={(e) => setReceiverProcess(parseInt(e.target.value))}  // Atualiza o processo receptor
              min={0}  // Valor mínimo permitido
              max={numProcesses - 1}  // Valor máximo baseado no número de processos
            />
          </label>
        </div>
        <div>
          <label>
            Receiver Time:
            <input
              type="number"
              value={receiverTime}  // Tempo do evento no processo receptor
              onChange={(e) => setReceiverTime(parseInt(e.target.value))}  // Atualiza o tempo do receptor
              min={0}
              max={9}
            />
          </label>
        </div>
      </div>

      <button onClick={handleSend} className="send-button">Send</button>

      {/* Tabela que exibe os tempos lógicos de cada processo */}
      <table className="process-table">
        <thead>
          <tr>
            {processes.map((_, index) => (
              <th key={index}>P{index}</th>  /* Cabeçalho com o nome dos processos */
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {processes.map((process, colIndex) => (
                <td key={colIndex}>{process[rowIndex]}</td>  /* Células com os tempos lógicos */
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
