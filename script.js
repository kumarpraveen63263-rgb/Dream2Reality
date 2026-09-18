/**
 * Dream2Reality - S.A. Engineering College (Autonomous)
 * CSR-Funded Student Innovation & Funding Support Competition
 * Interactive Frontend Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initParticleCanvas();
  init3DTilt();
  initMobileMenu();
  initFaqAccordion();
  initNavbarScroll();
  initDraftAutosave();
  initModalEscTriggers();
  initHeroVideo();
});

/* ===================================================================
   1. LIVE COUNTDOWN TIMER (Target: October 6, 2026, 09:30 AM IST)
   =================================================================== */
function initCountdown() {
  // Target: Tuesday, October 6, 2026, 09:30:00 IST (UTC+05:30)
  const targetDate = new Date('2026-10-06T09:30:00+05:30').getTime();

  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minsEl = document.getElementById('cdMins');
  const secsEl = document.getElementById('cdSecs');

  const barDays = document.getElementById('barDays');
  const barHours = document.getElementById('barHours');
  const barMins = document.getElementById('barMins');
  const barSecs = document.getElementById('barSecs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      const liveBadge = document.querySelector('.timer-live-badge');
      if (liveBadge) {
        liveBadge.innerHTML = '<span class="ping-dot" style="background:#10b981"></span> EVENT IN SESSION';
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days < 10 ? '0' + days : days;
    hoursEl.textContent = hours < 10 ? '0' + hours : hours;
    minsEl.textContent = minutes < 10 ? '0' + minutes : minutes;
    secsEl.textContent = seconds < 10 ? '0' + seconds : seconds;

    // Progress bar visualization
    if (barDays) barDays.style.width = Math.min(100, Math.max(5, (days / 60) * 100)) + '%';
    if (barHours) barHours.style.width = Math.min(100, Math.max(5, (hours / 24) * 100)) + '%';
    if (barMins) barMins.style.width = Math.min(100, Math.max(5, (minutes / 60) * 100)) + '%';
    if (barSecs) barSecs.style.width = Math.min(100, Math.max(5, (seconds / 60) * 100)) + '%';
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ===================================================================
   2. AMBIENT PARTICLES & CONSTELLATION CANVAS
   =================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(width > 768 ? 40 : 20, 50);
  const particles = [];

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.8 + 0.8;
      this.baseAlpha = Math.random() * 0.4 + 0.2;
      // Alternate subtle tech colors
      const colors = ['rgba(59, 130, 246,', 'rgba(244, 196, 48,', 'rgba(217, 4, 41,', 'rgba(16, 185, 129,'];
      this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.colorPrefix + this.baseAlpha + ')';
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.colorPrefix + '0.5)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.14;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(147, 197, 253, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ===================================================================
   3. 3D CARD TILT PHYSICS
   =================================================================== */
function init3DTilt() {
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ===================================================================
   4. MOBILE NAVIGATION DRAWER
   =================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  if (!menuBtn || !navMenu) return;

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking on any navigation link
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

/* ===================================================================
   5. FAQ ACCORDION
   =================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          const otherAns = other.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ===================================================================
   6. NAVBAR SCROLL & ACTIVE LINK SPY
   =================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Navbar background on scroll
    if (scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Active Section Spy
    let currentId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ===================================================================
   7. HERO VIDEO & CAMPUS CONTROLS
   =================================================================== */
function initHeroVideo() {
  const video = document.getElementById('heroBgVideo');
  const iconPlay = document.getElementById('iconPlay');
  const iconPause = document.getElementById('iconPause');
  const labelPlayPause = document.getElementById('labelPlayPause');

  if (!video) return;

  // Enforce muted and playsinline for modern browser autoplay policies
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');

  const startPlayback = () => {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (iconPlay) iconPlay.style.display = 'none';
          if (iconPause) iconPause.style.display = 'inline';
          if (labelPlayPause) labelPlayPause.textContent = 'Campus Cam';
        })
        .catch((e) => {
          console.warn('Autoplay waiting for gesture:', e);
        });
    }
  };

  // Immediate attempt
  startPlayback();

  // If browser halted playback without user gesture, resume on first interaction
  const gestureEvents = ['click', 'touchstart', 'scroll', 'pointerdown', 'keydown'];
  const onFirstInteraction = () => {
    if (video.paused) {
      startPlayback();
    }
  };

  gestureEvents.forEach((ev) => {
    window.addEventListener(ev, onFirstInteraction, { once: true, passive: true });
  });

  // Sync button icons with actual video state
  video.addEventListener('play', () => {
    if (iconPlay) iconPlay.style.display = 'none';
    if (iconPause) iconPause.style.display = 'inline';
    if (labelPlayPause) labelPlayPause.textContent = 'Campus Cam';
  });

  video.addEventListener('pause', () => {
    if (iconPlay) iconPlay.style.display = 'inline';
    if (iconPause) iconPause.style.display = 'none';
    if (labelPlayPause) labelPlayPause.textContent = 'Video Paused';
  });
}

window.toggleHeroVideoPlay = function () {
  const video = document.getElementById('heroBgVideo');
  if (!video) return;

  if (video.paused) {
    video.muted = true;
    video
      .play()
      .then(() => {
        showToast('Campus background video playing', 'info');
      })
      .catch((err) => {
        console.warn('Playback error:', err);
      });
  } else {
    video.pause();
    showToast('Campus video paused', 'info');
  }
};

window.toggleHeroVideoAudio = function () {
  const video = document.getElementById('heroBgVideo');
  const iconMuted = document.getElementById('iconMuted');
  const iconUnmuted = document.getElementById('iconUnmuted');
  const labelAudio = document.getElementById('labelAudio');

  if (!video) return;

  if (video.muted) {
    video.muted = false;
    if (iconMuted) iconMuted.style.display = 'none';
    if (iconUnmuted) iconUnmuted.style.display = 'inline';
    if (labelAudio) labelAudio.textContent = 'Audio On';
    showToast('Campus video audio enabled 🔊', 'info');
    if (video.paused) video.play().catch(() => {});
  } else {
    video.muted = true;
    if (iconMuted) iconMuted.style.display = 'inline';
    if (iconUnmuted) iconUnmuted.style.display = 'none';
    if (labelAudio) labelAudio.textContent = 'Audio Off';
    showToast('Campus video muted 🔇', 'info');
  }
};

/* ===================================================================
   8. CAMPUS VIDEO TOUR MODAL
   =================================================================== */
window.openCampusVideoModal = function () {
  const modal = document.getElementById('campusVideoModal');
  const modalPlayer = document.getElementById('modalVideoPlayer');
  const heroVideo = document.getElementById('heroBgVideo');

  if (!modal) return;

  // Pause hero background to save bandwidth and audio overlap
  if (heroVideo && !heroVideo.paused) {
    heroVideo.pause();
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  if (modalPlayer) {
    modalPlayer.currentTime = 0;
    modalPlayer.muted = false;
    modalPlayer.play().catch(() => {});
  }
};

window.closeCampusVideoModal = function () {
  const modal = document.getElementById('campusVideoModal');
  const modalPlayer = document.getElementById('modalVideoPlayer');
  const heroVideo = document.getElementById('heroBgVideo');

  if (!modal) return;

  if (modalPlayer) {
    modalPlayer.pause();
  }

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  // Resume hero video
  if (heroVideo) {
    heroVideo.play().catch(() => {});
  }
};

/* ===================================================================
   9. PHOTO ZOOM MODAL (ECE BLOCK)
   =================================================================== */
window.openPhotoZoomModal = function () {
  const modal = document.getElementById('photoZoomModal');
  if (!modal) return;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

window.closePhotoZoomModal = function () {
  const modal = document.getElementById('photoZoomModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

/* ===================================================================
   10. REGISTRATION MODAL & DRAFT AUTOSAVE
   =================================================================== */
const DRAFT_STORAGE_KEY = 'd2r_registration_draft';

function initDraftAutosave() {
  const form = document.getElementById('registrationForm');
  if (!form) return;

  // Restore saved draft if exists
  try {
    const savedData = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      Object.keys(parsed).forEach((key) => {
        const input = form.elements[key];
        if (input && input.type !== 'checkbox') {
          input.value = parsed[key];
        }
      });
      const draftIndicator = document.getElementById('draftIndicator');
      if (draftIndicator) {
        draftIndicator.style.display = 'inline-flex';
        draftIndicator.querySelector('span').textContent = 'Draft restored from previous session';
      }
    }
  } catch (err) {
    console.warn('Could not restore draft:', err);
  }

  // Autosave on input change
  form.addEventListener('input', () => {
    const formData = {};
    Array.from(form.elements).forEach((el) => {
      if (el.name && el.type !== 'checkbox' && el.type !== 'submit') {
        formData[el.name] = el.value;
      }
    });
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
      const draftIndicator = document.getElementById('draftIndicator');
      if (draftIndicator) {
        draftIndicator.style.display = 'inline-flex';
        draftIndicator.querySelector('span').textContent = 'Form progress auto-saved locally';
      }
    } catch (e) {
      // Storage quota or disabled
    }
  });
}

const GOOGLE_REGISTRATION_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSc44ZBiN8AE_ZlQ-Z70_1OeTWqIRuYqx6yubgGWdtwPnJyOsA/viewform';

window.openRegistrationModal = function () {
  window.open(GOOGLE_REGISTRATION_FORM_URL, '_blank', 'noopener,noreferrer');
};

window.closeRegistrationModal = function () {
  const modal = document.getElementById('registrationModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

window.handleRegistrationSubmit = function (event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = document.getElementById('submitBtn');

  // Verify form validity
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const projectTitle = document.getElementById('projectTitle')?.value || 'Student Innovation Project';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Verifying & Submitting...</span>';
  }

  // Simulate network dispatch
  setTimeout(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Submit Registration</span>';
    }

    // Generate confirmation code
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const regId = `D2R-2026-SAEC-${randomSuffix}`;

    const regIdDisplay = document.getElementById('regIdDisplay');
    const registeredTitle = document.getElementById('registeredTitle');
    if (regIdDisplay) regIdDisplay.textContent = regId;
    if (registeredTitle) registeredTitle.textContent = `"${projectTitle}"`;

    // Switch to success screen
    form.style.display = 'none';
    const successScreen = document.getElementById('successScreen');
    if (successScreen) successScreen.style.display = 'flex';

    // Clear saved draft
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (e) {}

    // Trigger celebration confetti
    triggerConfetti();

    showToast(`Registration Successful! Registration ID: ${regId}`, 'success');
  }, 800);
};

/* ===================================================================
   11. CALENDAR INVITATION (.ICS DOWNLOAD)
   =================================================================== */
window.addToCalendar = function () {
  const eventDetails = {
    title: 'Dream2Reality: Grand Finale & Pitch Competition - S.A. Engineering College',
    description:
      'CSR-Funded Student Innovation & Funding Support Competition presented by Atlas Copco Group, TRIDENT, and PSG STEP at S.A. Engineering College (Autonomous).',
    location: 'ECE Seminar Hall, ECE Block, S.A. Engineering College, Poonamallee - Avadi Road, Chennai - 600077',
    start: '20261006T040000Z', // 09:30 AM IST is 04:00 AM UTC
    end: '20261006T113000Z',   // 05:00 PM IST is 11:30 AM UTC
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//S.A. Engineering College//Dream2Reality 2026//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${eventDetails.title}`,
    `DESCRIPTION:${eventDetails.description}`,
    `LOCATION:${eventDetails.location}`,
    `DTSTART:${eventDetails.start}`,
    `DTEND:${eventDetails.end}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Dream2Reality-SAEC-Grand-Finale.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('Calendar event file (.ics) downloaded! Open to add to your calendar.', 'info');
};

/* ===================================================================
   12. POSTER VIEWER MODAL
   =================================================================== */
window.openPosterModal = function () {
  const modal = document.getElementById('posterModal');
  if (!modal) return;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

window.closePosterModal = function () {
  const modal = document.getElementById('posterModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

/* ===================================================================
   13. MODAL ESCAPE KEY LISTENER
   =================================================================== */
function initModalEscTriggers() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeRegistrationModal();
      closePosterModal();
      closeCampusVideoModal();
      closePhotoZoomModal();
    }
  });
}

/* ===================================================================
   14. CELEBRATION CONFETTI
   =================================================================== */
function triggerConfetti() {
  const colors = ['#d90429', '#f4c430', '#10b981', '#3b82f6', '#ffffff'];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const color = colors[Math.floor(Math.random() * colors.length)];

    piece.style.cssText = `
      position: fixed;
      top: -20px;
      left: ${Math.random() * 100}vw;
      width: ${Math.random() * 10 + 6}px;
      height: ${Math.random() * 12 + 6}px;
      background-color: ${color};
      opacity: ${Math.random() * 0.7 + 0.3};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      transform: rotate(${Math.random() * 360}deg);
      pointer-events: none;
      z-index: 9999;
      transition: transform ${Math.random() * 2 + 2}s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                  top ${Math.random() * 2 + 2}s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                  opacity 1s ease 1.5s;
    `;

    document.body.appendChild(piece);

    // Trigger fall
    setTimeout(() => {
      piece.style.top = `${window.innerHeight + 50}px`;
      piece.style.transform = `rotate(${Math.random() * 720}deg) translateX(${Math.random() * 100 - 50}px)`;
      piece.style.opacity = '0';
    }, 20);

    // Cleanup
    setTimeout(() => {
      piece.remove();
    }, 4500);
  }
}

/* ===================================================================
   15. TOAST NOTIFICATION SYSTEM
   =================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconSvg =
    type === 'success'
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f4c430" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <span style="font-size:0.88rem; font-weight:500;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}
