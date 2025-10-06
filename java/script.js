const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSgoYge7VqmZeK8tKXFNffUUaxsZ0bbuZopz6sAQukQp5j-YGubsv0NSxpcpaqJ20Hqm7BmkzvYKxH5/pub?output=csv';

const container = document.getElementById('ranking');
const lastUpdated = document.getElementById('last-updated');
const customMessageContent = document.getElementById('customMessageContent');
const rulesSection = document.getElementById('rules');

function showRanking() {
  container.style.display = 'block';
  rulesSection.style.display = 'none';
  document.querySelector('h1').textContent = '🏆 RANK LEITORES TOP';
}

function showRules() {
  container.style.display = 'none';
  rulesSection.style.display = 'block';
  document.querySelector('h1').textContent = '📜 REGRAS DA COMPETIÇÃO';
}

function getUniqueTimestamp() {
  return new Date().getTime();
}

function loadRanking() {
  const uniqueURL = sheetURL + '&_=' + getUniqueTimestamp();

  fetch(uniqueURL)
    .then(res => res.text())
    .then(data => {
      const rows = data.split('\n').map(row => row.split(',')).filter(row => row.length >= 4);

      // Atualiza a mensagem personalizada com o valor de D2
      const customMessage = rows[1]?.[3]; // Linha 2, coluna D (índice 3)
      if (customMessage) {
        customMessageContent.textContent = customMessage;
      }

      const users = rows.slice(1).map(row => {
        const [avatar, name, points] = row;
        return { avatar, name, points: parseInt(points) };
      }).filter(u => u.name && !isNaN(u.points));

      users.sort((a, b) => b.points - a.points);
      container.innerHTML = '';

      users.forEach((user, index) => {
        const entry = document.createElement('div');
        entry.className = 'entry';
        if (index === 0) entry.classList.add('gold');
        else if (index === 1) entry.classList.add('silver');
        else if (index === 2) entry.classList.add('bronze');

        let crown = '';
        if (index === 0) crown = '👑';
        else if (index === 1) crown = '🥈';
        else if (index === 2) crown = '🥉';

        entry.innerHTML = `
          <div class="position">${index + 1}</div>
          <img src="${user.avatar || 'https://i.imgur.com/JR7kUFU.png'}" alt="avatar" onerror="this.src='https://i.imgur.com/JR7kUFU.png'">
          <div class="info">
            <div class="name">${user.name}</div>
            <div class="points">${user.points} pontos</div>
          </div>
          <div class="crown">${crown}</div>
        `;
        container.appendChild(entry);
      });

      const now = new Date();
      lastUpdated.textContent = 'ÚLTIMA ATUALIZAÇÃO: ' + now.toLocaleString('pt-BR');
    })
    .catch(error => {
      console.error('Erro ao carregar dados:', error);
      lastUpdated.textContent = 'Erro ao carregar dados.';
    });
}

// Partículas animadas (se você quiser manter esse efeito)
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = Math.random() * 5 + 3 + 'px';
    particle.style.height = particle.style.width;
    particle.style.backgroundColor = i % 3 === 0 ? 'var(--neon-yellow)' :
                                     i % 3 === 1 ? 'var(--neon-pink)' : 'var(--neon-blue)';
    particle.style.borderRadius = '50%';
    particle.style.opacity = Math.random() * 0.5 + 0.1;
    particle.style.top = Math.random() * 100 + 'vh';
    particle.style.left = Math.random() * 100 + 'vw';

    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * -20;

    particle.style.animation = `float ${duration}s ${delay}s infinite linear`;
    particlesContainer.appendChild(particle);
  }

  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes float {
      0% {
        transform: translateY(0) translateX(0);
        opacity: 0;
      }
      10%, 90% {
        opacity: 0.4;
      }
      100% {
        transform: translateY(-150vh) translateX(${Math.random() * 100 - 50}vw);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Inicialização
document.getElementById('current-year').textContent = new Date().getFullYear();
loadRanking();
createParticles();
setInterval(loadRanking, 30000); // Atualiza a cada 30s
