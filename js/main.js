// 이력서 사이트 공통 스크립트
document.addEventListener('DOMContentLoaded', () => {
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
