// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS animation library
  AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: true
  });

  // Initialize Particles.js for hero background
  if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#ffffff',
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: true, mode: 'push' },
          resize: true
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 1 } },
          push: { particles_nb: 4 }
        }
      },
      retina_detect: true
    });
  }

  // Preloader
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.classList.add('hidden');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    });
  }

  // Notification Bar
  const notificationBar = document.querySelector('.notification-bar');
  const closeNotification = document.querySelector('.close-notification');
  
  if (closeNotification) {
    closeNotification.addEventListener('click', () => {
      notificationBar.style.display = 'none';
      // Save to localStorage to remember user closed it
      localStorage.setItem('notification-closed', 'true');
    });
    
    // Check if user previously closed the notification
    if (localStorage.getItem('notification-closed') === 'true') {
      notificationBar.style.display = 'none';
    }
  }

  // Smooth scrolling for navigation links
  document.querySelectorAll('.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('header').offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          if (mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
          }
        }
      }
    });
  });

  // Function to scroll to CTA section
  window.scrollToCTA = function() {
    const ctaSection = document.getElementById("cta");
    const headerHeight = document.querySelector('header').offsetHeight;
    const targetPosition = ctaSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  };

  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }

  // Sticky header on scroll
  const header = document.getElementById('main-header');
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
  });

  // Dark mode toggle
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    if (themeIcon) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      
      if (body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
      } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // Counter animation for stats
  const counters = document.querySelectorAll('.counter');
  const counterSpeed = 200; // Lower is faster

  function animateCounters() {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const increment = target / counterSpeed;

      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(animateCounters, 1);
      } else {
        counter.innerText = target;
      }
    });
  }

  // Start counter animation when in viewport
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(heroStats);
  }

  // Testimonial carousel
  const testimonialContainer = document.querySelector('.testimonial-container');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.carousel-arrow.prev');
  const nextBtn = document.querySelector('.carousel-arrow.next');
  let currentIndex = 0;

  function showTestimonial(index) {
    if (!testimonialContainer) return;
    
    const testimonials = document.querySelectorAll('.testimonial');
    if (index >= testimonials.length) index = 0;
    if (index < 0) index = testimonials.length - 1;
    
    currentIndex = index;
    testimonialContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update active dot
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  // Add click event to dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-index'));
      showTestimonial(index);
    });
  });

  // Add click events to prev/next buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showTestimonial(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showTestimonial(currentIndex + 1);
    });
  }

  // Auto-advance testimonials
  let testimonialInterval = setInterval(() => {
    showTestimonial(currentIndex + 1);
  }, 5000);

  // Pause auto-advance on hover
  if (testimonialContainer) {
    testimonialContainer.addEventListener('mouseenter', () => {
      clearInterval(testimonialInterval);
    });
    
    testimonialContainer.addEventListener('mouseleave', () => {
      testimonialInterval = setInterval(() => {
        showTestimonial(currentIndex + 1);
      }, 5000);
    });
  }

  // Pricing toggle
  const pricingToggle = document.getElementById('pricing-toggle');
  if (pricingToggle) {
    pricingToggle.addEventListener('change', () => {
      if (pricingToggle.checked) {
        document.body.classList.add('yearly-pricing');
        document.querySelectorAll('.period').forEach(el => {
          el.textContent = '/year';
        });
      } else {
        document.body.classList.remove('yearly-pricing');
        document.querySelectorAll('.period').forEach(el => {
          el.textContent = '/month';
        });
      }
    });
  }

  // FAQ accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const isActive = faqItem.classList.contains('active');
      
      // Close all FAQs
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // Open clicked FAQ if it wasn't already open
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });

  // Form submission handling
  const signupForm = document.getElementById('signup-form');
  const successMessage = document.querySelector('.form-message.success');
  const errorMessage = document.querySelector('.form-message.error');

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const name = document.getElementById('name').value;
      const interest = document.getElementById('interest') ? document.getElementById('interest').value : 'not-specified';
      
      // Form validation
      if (!email || !name) {
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
        
        setTimeout(() => {
          errorMessage.style.display = 'none';
        }, 5000);
        return;
      }
      
      // Simulate form submission with loading state
      const submitButton = signupForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitButton.disabled = true;
      
      setTimeout(() => {
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        
        // Reset form
        signupForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          successMessage.style.display = 'none';
        }, 5000);
      }, 1500);
    });
  }

  // Video modal
  const videoModal = document.getElementById('video-modal');
  const closeModal = document.querySelector('.close-modal');
  
  window.openVideoModal = function() {
    if (videoModal) {
      videoModal.classList.add('active');
      // Set video src (replace with your actual video URL)
      const iframe = videoModal.querySelector('iframe');
      iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
    }
  };
  
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      videoModal.classList.remove('active');
      // Stop video when closing modal
      const iframe = videoModal.querySelector('iframe');
      iframe.src = '';
    });
  }
  
  // Close modal when clicking outside content
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        videoModal.classList.remove('active');
        // Stop video when closing modal
        const iframe = videoModal.querySelector('iframe');
        iframe.src = '';
      }
    });
  }

  // Cookie consent
  const cookieConsent = document.querySelector('.cookie-consent');
  const acceptCookies = document.querySelector('.cookie-btn.accept');
  const cookieSettings = document.querySelector('.cookie-btn.settings');
  
  // Show cookie consent if not accepted before
  if (cookieConsent && !localStorage.getItem('cookies-accepted')) {
    setTimeout(() => {
      cookieConsent.classList.add('active');
    }, 2000);
  }
  
  if (acceptCookies) {
    acceptCookies.addEventListener('click', () => {
      localStorage.setItem('cookies-accepted', 'true');
      cookieConsent.classList.remove('active');
    });
  }
  
  if (cookieSettings) {
    cookieSettings.addEventListener('click', () => {
      // In a real implementation, this would open cookie settings
      alert('Cookie settings would open here in a real implementation.');
    });
  }

  // Back to top button
  const backToTopButton = document.getElementById('back-to-top');
  
  window.addEventListener('scroll', () => {
    if (backToTopButton) {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    }
  });
  
  if (backToTopButton) {
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Roadmap interaction
  const roadmapItems = document.querySelectorAll('.roadmap-item');
  
  roadmapItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
      roadmapItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Language selector
  const languageSelector = document.getElementById('language-selector');
  if (languageSelector) {
    languageSelector.addEventListener('change', (e) => {
      const language = e.target.value;
      // In a real implementation, this would change the site language
      console.log(`Language changed to: ${language}`);
    });
  }
});

// Prevent form submission on Enter key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
    const form = e.target.form;
    if (form) {
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        e.preventDefault();
        submitButton.click();
      }
    }
  }
});