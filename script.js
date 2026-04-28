const metricValues = document.querySelectorAll(".metric-value");

const animateValue = (element) => {
  const target = Number(element.dataset.target || 0);
  const duration = 1100;
  const start = performance.now();

  const frame = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased);

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  };

  requestAnimationFrame(frame);
};

const metricObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    animateValue(entry.target);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.5 });

metricValues.forEach((item) => metricObserver.observe(item));

const canvas = document.getElementById("signalCanvas");

if (canvas) {
  const context = canvas.getContext("2d");
  const nodes = [];
  const pointer = { x: canvas.width / 2, y: canvas.height / 2 };

  const resizeCanvas = () => {
    const ratio = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(width * ratio));
    canvas.height = Math.max(1, Math.floor(height * ratio));
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(ratio, ratio);

    nodes.length = 0;

    const amount = window.innerWidth < 768 ? 28 : 42;
    for (let index = 0; index < amount; index += 1) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2.2 + 1.2,
      });
    }
  };

  const draw = () => {
    const { width, height } = canvas.getBoundingClientRect();
    context.clearRect(0, 0, width, height);

    const glow = context.createRadialGradient(
      pointer.x,
      pointer.y,
      0,
      pointer.x,
      pointer.y,
      Math.max(width, height) * 0.55
    );
    glow.addColorStop(0, "rgba(255, 122, 26, 0.22)");
    glow.addColorStop(0.55, "rgba(105, 226, 255, 0.10)");
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    for (let index = 0; index < nodes.length; index += 1) {
      const node = nodes[index];
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) {
        node.vx *= -1;
      }
      if (node.y < 0 || node.y > height) {
        node.vy *= -1;
      }

      for (let inner = index + 1; inner < nodes.length; inner += 1) {
        const other = nodes[inner];
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 110) {
          context.strokeStyle = `rgba(255, 255, 255, ${0.14 - distance / 900})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(node.x, node.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      }

      const proximity = Math.hypot(node.x - pointer.x, node.y - pointer.y);
      const alpha = Math.max(0.25, 1 - proximity / 280);

      context.fillStyle = `rgba(255, 209, 102, ${alpha})`;
      context.beginPath();
      context.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      context.fill();
    }

    context.strokeStyle = "rgba(255,255,255,0.08)";
    context.strokeRect(18, 18, width - 36, height - 36);

    requestAnimationFrame(draw);
  };

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
  });

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  draw();
}
