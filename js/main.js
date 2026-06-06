// 이력서 사이트 공통 스크립트
document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== Hero: 파티클 네트워크 배경 ===== */
  const canvas = document.querySelector('.hero__canvas');
  const hero = document.querySelector('.hero');

  if (canvas && hero && !reducedMotion) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    const resize = () => {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
      const count = Math.min(90, Math.floor(canvas.width / 16));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.8 + 0.6,
      }));
    };

    const LINK_DIST = 130;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // 마우스 주변 입자는 살짝 밀려나는 효과
        if (mouse.x !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 110 && dist > 0.01) {
            p.x += (dx / dist) * 0.6;
            p.y += (dy / dist) * 0.6;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(147, 197, 253, 0.55)';
        ctx.fill();
      });

      // 가까운 입자끼리 선으로 연결
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(147, 197, 253, ${0.18 * (1 - dist / LINK_DIST)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    };

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('resize', resize);
    resize();
    draw();
  }

  /* ===== Hero: 타이핑 효과 ===== */
  const typingEl = document.querySelector('.hero__typing');

  if (typingEl && !reducedMotion) {
    const phrases = [
      '클라우드 · DaaS · 신사업 전략 전문가',
      'ICT R&D 기획 · 컨설팅 전문가',
      '기술을 비즈니스로 연결하는 전략가',
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;

    typingEl.textContent = '';

    const type = () => {
      const current = phrases[phraseIdx];

      if (deleting) {
        charIdx--;
        typingEl.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 35);
      } else {
        charIdx++;
        typingEl.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(type, 2600); // 문구 완성 후 대기
          return;
        }
        setTimeout(type, 75);
      }
    };

    setTimeout(type, 900); // 등장 애니메이션 후 시작
  }

  /* ===== Hero: 사진 마우스 틸트 ===== */
  const photo = document.querySelector('.hero__photo');

  if (photo && hero && !reducedMotion && window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      photo.style.transform = `perspective(700px) rotateY(${nx * 10}deg) rotateX(${-ny * 10}deg) translateY(${ny * -6}px)`;
    });
    hero.addEventListener('mouseleave', () => {
      photo.style.transform = '';
    });
  }

  // 섹션 스크롤 리빌 효과
  const sections = document.querySelectorAll('.section .container > *');
  sections.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // 현재 보고 있는 섹션 네비게이션 하이라이트
  const navLinks = document.querySelectorAll('.nav__menu a');
  const sectionEls = [...navLinks].map((a) =>
    document.querySelector(a.getAttribute('href'))
  );

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((a) =>
            a.classList.toggle(
              'active',
              a.getAttribute('href') === `#${entry.target.id}`
            )
          );
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sectionEls.forEach((el) => el && navObserver.observe(el));
});
