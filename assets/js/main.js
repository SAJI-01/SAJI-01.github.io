/**
* Template Name: MyPortfolio
* Template URL: https://bootstrapmade.com/myportfolio-bootstrap-portfolio-website-template/
* Updated: Aug 08 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);


  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  const switchInput = document.getElementById('switch');

  // Set the body to dark mode on load
  document.body.classList.add('dark-background');



})();

// Image slider functionality
document.addEventListener('DOMContentLoaded', function() {
    const sliders = document.querySelectorAll('.image-slider');

    sliders.forEach(slider => {
        const images = slider.querySelectorAll('img');
        let currentIndex = 0;

// Initial setup - only first image visible
        images.forEach((img, index) => {
            if (index !== 0) {
                img.classList.remove('active');
            }
        });

// Function to rotate images
        function rotateImages() {
            images[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].classList.add('active');
        }

// Set interval to rotate images every 2 seconds
        setInterval(rotateImages, 2000);
    });
});

/*--------------------------------*/
// Blur Bar Slider Interaction
document.addEventListener('DOMContentLoaded', function() {
    const filterContainer = document.querySelector('.portfolio-filters-bar');
    if (!filterContainer) return;

    const filterItems = filterContainer.querySelectorAll('li');

    // Create slider bar element
    const sliderBar = document.createElement('div');
    sliderBar.className = 'slider-bar';
    filterContainer.insertBefore(sliderBar, filterContainer.firstChild);

    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let activeIndex = 0;

    // Get filter positions and widths
    function getFilterPositions() {
        return Array.from(filterItems).map(item => ({
            left: item.offsetLeft,
            width: item.offsetWidth,
            element: item
        }));
    }

    // Update slider bar position
    function updateSliderPosition(index, instant = false) {
        const positions = getFilterPositions();
        const target = positions[index];

        if (instant) {
            sliderBar.style.transition = 'none';
        } else {
            sliderBar.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }

        sliderBar.style.left = `${target.left}px`;
        sliderBar.style.width = `${target.width}px`;

        if (instant) {
            setTimeout(() => {
                sliderBar.style.transition = '';
            }, 10);
        }
    }

    // Find closest filter based on position
    function findClosestFilter(x) {
        const positions = getFilterPositions();
        let closest = 0;
        let minDistance = Infinity;

        positions.forEach((pos, index) => {
            const center = pos.left + pos.width / 2;
            const distance = Math.abs(x - center);

            if (distance < minDistance) {
                minDistance = distance;
                closest = index;
            }
        });

        return closest;
    }

    // Set active filter
    function setActiveFilter(index) {
        filterItems.forEach(item => item.classList.remove('filter-active'));
        filterItems[index].classList.add('filter-active');
        activeIndex = index;
        updateSliderPosition(index);

        // Check if it's the About link
        const aboutLink = filterItems[index].querySelector('a[href="about.html"]');
        if (aboutLink) {
            // Let the link navigate naturally
            return;
        }

        // Trigger isotope filter for other items
        const filterValue = filterItems[index].getAttribute('data-filter');
        if (filterValue && window.initIsotope) {
            window.initIsotope.arrange({ filter: filterValue });
            if (typeof aosInit === 'function') {
                aosInit();
            }
        }
    }

    // Mouse/Touch start
    function handleStart(e) {
        const touch = e.touches ? e.touches[0] : e;
        const rect = filterContainer.getBoundingClientRect();
        startX = touch.clientX - rect.left;
        currentX = startX;

        // Check if starting on a filter item
        const clickedIndex = Array.from(filterItems).findIndex(item => {
            const itemRect = item.getBoundingClientRect();
            return touch.clientX >= itemRect.left && touch.clientX <= itemRect.right;
        });

        if (clickedIndex !== -1) {
            isDragging = true;
            filterContainer.classList.add('dragging');
            sliderBar.classList.add('animating');
            e.preventDefault();
        }
    }

    // Mouse/Touch move
    function handleMove(e) {
        if (!isDragging) return;

        const touch = e.touches ? e.touches[0] : e;
        const rect = filterContainer.getBoundingClientRect();
        currentX = touch.clientX - rect.left;

        // Update slider position during drag
        const positions = getFilterPositions();
        const containerWidth = filterContainer.offsetWidth;

        // Clamp to container bounds
        const clampedX = Math.max(0, Math.min(currentX, containerWidth));

        // Find and preview closest filter
        const closestIndex = findClosestFilter(clampedX);
        const target = positions[closestIndex];

        sliderBar.style.transition = 'all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        sliderBar.style.left = `${target.left}px`;
        sliderBar.style.width = `${target.width}px`;

        // Provide visual feedback
        filterItems.forEach((item, index) => {
            if (index === closestIndex) {
                item.style.transform = 'scale(1.03)';
            } else {
                item.style.transform = '';
            }
        });

        e.preventDefault();
    }

    // Mouse/Touch end
    function handleEnd(e) {
        if (!isDragging) return;

        isDragging = false;
        filterContainer.classList.remove('dragging');
        sliderBar.classList.remove('animating');

        const rect = filterContainer.getBoundingClientRect();
        const touch = e.changedTouches ? e.changedTouches[0] : e;
        const endX = touch.clientX - rect.left;

        // Find closest filter and activate it
        const closestIndex = findClosestFilter(endX);

        // Reset transforms
        filterItems.forEach(item => {
            item.style.transform = '';
        });

        // Check if it's the About link before setting active
        const aboutLink = filterItems[closestIndex].querySelector('a[href="about.html"]');
        if (aboutLink) {
            // Navigate to about page
            window.location.href = 'about.html';
            return;
        }

        setActiveFilter(closestIndex);
    }

    // Click handler for direct selection
    filterItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            if (!isDragging) {
                // Check if it's the About link
                const aboutLink = item.querySelector('a[href="about.html"]');
                if (aboutLink) {
                    // Let the link work naturally, just update the slider visually
                    setActiveFilter(index);
                    // Don't prevent default - let link navigate
                    return;
                }

                // For other filters, prevent default and set active
                e.preventDefault();
                setActiveFilter(index);
            }
        });
    });

    // Event listeners
    filterContainer.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);

    // Touch events
    filterContainer.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);

    // Initialize slider position
    const activeFilter = filterContainer.querySelector('.filter-active');
    const initialIndex = Array.from(filterItems).indexOf(activeFilter);
    updateSliderPosition(initialIndex >= 0 ? initialIndex : 0, true);

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateSliderPosition(activeIndex, true);
        }, 100);
    });

    // Store isotope instance globally for filter changes
    const isotopeLayout = document.querySelector('.isotope-layout');
    if (isotopeLayout) {
        const container = isotopeLayout.querySelector('.isotope-container');
        imagesLoaded(container, function() {
            window.initIsotope = new Isotope(container, {
                itemSelector: '.isotope-item',
                layoutMode: 'masonry',
                filter: '*',
                sortBy: 'original-order'
            });
        });
    }
});