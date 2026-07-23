const results = document.getElementById('results');
const canvas = document.getElementById('profit-chart');
const ctx = canvas.getContext('2d');
const calculateBtn = document.getElementById('calculate-btn');
const scenarioButtons = document.querySelectorAll('.scenario-btn');
const businessCards = document.querySelectorAll('.business-card');
let animationFrameId;

const presetScenarios = {
  estandar: { a: 50, b: 0.5, c: 10, F: 1000 },
  demanda: { a: 70, b: 0.7, c: 12, F: 1200 },
  costo: { a: 45, b: 0.4, c: 6, F: 800 },
};

function currency(value) {
  return '$' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function readValues() {
  return {
    a: Number(document.getElementById('a').value),
    b: Number(document.getElementById('b').value),
    c: Number(document.getElementById('c').value),
    F: Number(document.getElementById('f').value),
  };
}

function syncInputs(values) {
  document.getElementById('a').value = values.a;
  document.getElementById('a-range').value = values.a;
  document.getElementById('b').value = values.b;
  document.getElementById('b-range').value = values.b;
  document.getElementById('c').value = values.c;
  document.getElementById('c-range').value = values.c;
  document.getElementById('f').value = values.F;
  document.getElementById('f-range').value = values.F;
}

function calculateOptimization(values) {
  const a = Number(values.a);
  const b = Number(values.b);
  const c = Number(values.c);
  const F = Number(values.F);

  if (b <= 0) {
    return {
      error: true,
      message: 'La sensibilidad de la demanda debe ser mayor a cero para encontrar un máximo.',
    };
  }

  const xOpt = (a - c) / (2 * b);
  const price = a - b * xOpt;
  const revenue = xOpt * price;
  const cost = c * xOpt + F;
  const profit = revenue - cost;
  const derivative = a - c - 2 * b * xOpt;
  const secondDerivative = -2 * b;
  const profitFunction = (x) => (a - c) * x - b * x * x - F;
  const xMax = Math.max(20, xOpt * 2 + 20);
  const points = [];

  for (let i = 0; i <= 100; i += 1) {
    const x = (i / 100) * xMax;
    points.push({ x, y: profitFunction(x) });
  }

  const yValues = points.map((point) => point.y);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  const rangeY = maxY - minY || 1;

  return {
    success: true,
    xOpt,
    price,
    revenue,
    cost,
    profit,
    derivative,
    secondDerivative,
    points,
    xMax,
    minY,
    maxY,
    rangeY,
  };
}

function renderResults(result) {
  if (result.error) {
    results.innerHTML = `
      <div class="result-box">
        <strong>Mensaje:</strong> ${result.message}
      </div>
    `;
    return;
  }

  const conclusion = result.secondDerivative < 0
    ? 'La utilidad alcanza un máximo porque la segunda derivada es negativa.'
    : 'El modelo no presenta un máximo claro con los datos ingresados.';

  const recommendation = result.profit > 0
    ? 'Conviene seguir con esta producción porque la utilidad es positiva.'
    : 'Es mejor revisar precios o costos, porque la utilidad sería negativa.';

  results.innerHTML = `
    <div class="result-box"><strong>Cantidad óptima:</strong> <span class="highlight">${result.xOpt.toFixed(2)} unidades</span></div>
    <div class="result-box"><strong>Precio sugerido:</strong> ${currency(result.price)}</div>
    <div class="result-box"><strong>Ingreso total:</strong> ${currency(result.revenue)}</div>
    <div class="result-box"><strong>Costo total:</strong> ${currency(result.cost)}</div>
    <div class="result-box"><strong>Utilidad máxima:</strong> <span class="highlight">${currency(result.profit)}</span></div>
    <div class="result-box"><strong>Derivada:</strong> ${result.derivative.toFixed(2)}</div>
    <div class="result-box"><strong>Segunda derivada:</strong> ${result.secondDerivative.toFixed(2)}</div>
    <div class="result-box"><strong>Conclusión:</strong> ${conclusion}</div>
    <div class="result-box"><strong>Recomendación:</strong> ${recommendation}</div>
  `;
}

function drawChart(result) {
  if (result.error) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  cancelAnimationFrame(animationFrameId);

  const startTime = performance.now();
  const duration = 900;

  function animate(time) {
    const progress = Math.min(1, (time - startTime) / duration);

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#dbeafe';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i += 1) {
      const y = padding + (innerHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(padding, padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const visibleCount = Math.max(2, Math.floor(result.points.length * progress));
    result.points.slice(0, visibleCount).forEach((point, index) => {
      const x = padding + (point.x / result.xMax) * innerWidth;
      const y = height - padding - ((point.y - result.minY) / (result.rangeY || 1)) * innerHeight;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    const optimalX = padding + (result.xOpt / result.xMax) * innerWidth;
    const optimalY = height - padding - ((result.profit - result.minY) / (result.rangeY || 1)) * innerHeight;
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(optimalX, optimalY, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.font = '12px Arial';
    ctx.fillText('Utilidad', 8, 18);
    ctx.fillText('Cantidad', width - 70, height - 12);

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate);
    }
  }

  animationFrameId = requestAnimationFrame(animate);
}

function update() {
  const result = calculateOptimization(readValues());
  renderResults(result);
  drawChart(result);
}

function applyScenario(name) {
  syncInputs(presetScenarios[name]);
  update();
  scenarioButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.scenario === name);
  });
}

function updateBusinessLabel(name) {
  const businessDescriptions = {
    panaderia: 'Simulación para una panadería que busca vender la cantidad ideal de panes y pasteles.',
    ropa: 'Simulación para una tienda de ropa que ajusta producción según demanda y precio.',
    cafeteria: 'Simulación para una cafetería que quiere equilibrar ventas, costos y utilidad.',
    cosmeticos: 'Simulación para una marca de cosméticos que busca maximizar margen por producto.',
  };

  const subtitle = document.querySelector('.subtitle');
  subtitle.textContent = businessDescriptions[name] || subtitle.textContent;
}

calculateBtn.addEventListener('click', update);

['a', 'b', 'c', 'f'].forEach((id) => {
  const input = document.getElementById(id);
  const range = document.getElementById(`${id}-range`);

  input.addEventListener('input', () => {
    const value = Number(input.value);
    if (Number.isFinite(value)) {
      range.value = value;
      update();
    }
  });

  range.addEventListener('input', () => {
    const value = Number(range.value);
    input.value = value;
    update();
  });
});

scenarioButtons.forEach((button) => {
  button.addEventListener('click', () => applyScenario(button.dataset.scenario));
});

businessCards.forEach((card) => {
  card.addEventListener('click', () => {
    businessCards.forEach((item) => item.classList.remove('active'));
    card.classList.add('active');
    updateBusinessLabel(card.dataset.business);
  });
});

update();
