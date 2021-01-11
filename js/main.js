/*
 * INDEX:
 *  - LISTENERS: active diferent listeners callbacks
 *  - NO JAVASCRIPT: if no javascript is enabled on this section will be deleted some classes that apply styles when no js is present
 *  - MAIN NAV BEHAVIOR: behavior of the principal top nav on index.html
 *  - SCROLL TO TOP BUTTON BEHAVIOR: scroll to top button present on every page, hided by default and showed by a certain amount of scroll Y axis
 *  - FIXED HEADERS: behavior of the fixed headers on the articles, one_work and one_article pages
 *  - APPEAR ELEMENTS BEHAVIOR: certain elements will appear following this functions on scroll
 *  - WORKS CAROUSEL: behavior of the works-section carousel of cards
 *  - COPY SOCIAL NAV TEXTS: the fixed social buttons bar include a copy option on click, here will set its working parameters
 *  - GROWABLE ELEMENTS MODAL: manage the growable elements to show it on the modal and navigate between they
 *  - LOAD PAGE: shows the load page before every page
 *  - GENERAL HELPERS: general function used by another ones
 */

/* LISTENERS */
/* Active the listeners */

/* Active the shared listeners */
$.each([dynamicArticlesHeader, elementsAppear, moveMainNavOnScroll, toggleScrollTopBtn], function(idx, fn) {
  $(document).on('load', fn);
  $(document).on('resize', fn);
  $(document).on('scroll', fn);
});
/* Active the other listeners */
$('.growable').each(function() { $(this).on('click', growOnGrowablesModal) });
$('[class^=copy-asset]').each(function() { $(this).on('click', copyText) });
$('.main-nav a[href^="#"], .footer-nav a[href^="#"]').each(function() { $(this).on('click', smoothScroll) });
$(this).on('load', showNoJsEls);
/* Load owl carousels with they options */
$(function() {
  $('.owl-carousel').owlCarousel({
    center: true,
    items: 1,
    loop: true,
    margin: 15,
    merge: true,
    responsive: {
      576: {
        items: 2
      },
      768: {
        items: 3
      }
    }
  });
});


/**
 * Active the listeners to play/pause video elements on hover
 * NOTE: you must change the class video-wrapper to youtube-wrapper if a youtube video is included to disable this function on the youtube videos
 */
$('.video-wrapper:not(.youtube-wrapper)').each(function() {
  $(this).on({
    'mouseenter': function(e) {
      $(this).children('.grid-video')[0].play()
    }, 
    'mouseleave': function(e) {
      $(this).children('.grid-video')[0].pause()
    }
  })
});

/* END LISTENERS */

/* NO JAVASCRIPT */
/* Functions that actives/desactives/shown/hide certain elements/behaviors if js is actived */

/*
 * When js is not actived nojs-improve class changes some styles
 */
$('.nojs-improve').removeClass('nojs-improve');


/**
 * Manage no js hided elements
 */
function showNoJsEls() {
  $('.nojs-hide').each(function () { $(this).css('display', 'block') });
}

/* END NO JAVASCRIPT */

/* MAIN NAV BEHAVIOR */

/**
 * Manage the behavior of the main nav on Y axis scrolls to improve its ux
 */
function moveMainNavOnScroll()  {
  const mainNav = document.getElementById('ctn-main-nav');
  const mainTitle = document.getElementById('ctn-nav-header');
  if (mainNav) {
    const mainNavBounds = mainNav.getBoundingClientRect();
    const welcomeSection = document.getElementById('welcome-section');
    const welcomeSectionBounds = welcomeSection.getBoundingClientRect();
    const pageY = window.pageYOffset / 2;
    const maxY = mainNavBounds.height + 30; /* Is the max top position for the nav **height + padding-bottom */
    const posY = pageY <= maxY ? pageY : maxY; 
    /* If the scroll is bigger than the welcome/carousel section and the main nav is going to disapear up */
    if ((window.pageYOffset > welcomeSectionBounds.height) && mainNavBounds.top <= 0) {
      negativize();
      /* Add class to fix on the top */
      mainNav.classList.add('fixed');
      /* Reset the translateY value, the X axis must be 50% to mantain horizontal centered the element */
      mainNav.style.transform = 'translate(-50%, 0px)';
      /* Show the main header */
      mainTitle && mainTitle.classList.add('shown');
    /* If the scroll is smaller or equal than the welcome/carousel section and the main nav was fixed early */
    } else if ((window.pageYOffset == welcomeSectionBounds.height) && mainNav.classList.contains('fixed')) {
      /* Remove the fixed class */
      // mainNav.classList.remove('fixed');
    /* When a Y axis scrolling is detected translate the nav on its Y axis respectivectly to the scroll amount */
    } else {
      mainNav.classList.remove('fixed');
      negativize();
      /* Translate Y axis according to the scroll amount on the Y axis, the X axis must be 50% to mantain horizontal centered the element */
      mainNav.style.transform = 'translate(-50%, ' + posY + 'px)';
      /* Hide the main header */
      mainTitle && mainTitle.classList.remove('shown');
    } 
    /* Add class to change nav styles when the nav is out of the welcome bounds */
    function negativize() {
      posY >= mainNavBounds.height / 2 ? mainNav.classList.add('negative') : mainNav.classList.remove('negative');
    }
  }
}

/* END MAIN NAV BEHAVIOR */


/* SCROLL TO TOP BUTTON BEHAVIOR */

/**
 * Scrolls to top of the page, called from the to top buttons
 */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Toggle class to show/hide a to top btn
 */
function toggleScrollTopBtn() {
  const toTopBtn = jQuery.makeArray($('.to-top-btn'));
  /* When the scrollY is bigger than 1000px or if the scroll height is bigger than the viewport and the scroll position is on the bottom */
  if (window.scrollY > 1000 || (document.documentElement.scrollHeight > document.documentElement.clientHeight && (window.scrollY + document.documentElement.clientHeight) >= document.documentElement.scrollHeight)) {
    $.each(toTopBtn, function(idx, btn) {
      $(btn).addClass('shown');
    });
    // [...toTopBtn].forEach(btn => $(btn).addClass('shown'));
  } else {
    $.each(toTopBtn, function(idx, btn) {
      if ($(btn).hasClass('shown')) {
        $(btn).removeClass('shown');
      }
    });
    // [...toTopBtn].forEach(btn => { if ($(btn).hasClass('shown')) $(btn).removeClass('shown') });
  }
}

/* END SCROLL TO TOP BUTTON BEHAVIOR */


/* FIXED HEADERS */

/**
 * Improve the ux of the diferent pages' header
 */
function dynamicArticlesHeader() {
  const articlesHeader = $('#articles-header');
  const secondaryNav = $('.ctn-secondary-nav');
  const oneArticleHeader = $('.one-article-header');
  const oneWorkTitle = $('.one-work-header');
  if (scrollDown() && (window.pageYOffset > 50 || document.documentElement.scrollTop > 50)) {
    articlesHeader && articlesHeader.addClass('sticked');
    secondaryNav && secondaryNav.addClass('sticked');
    oneArticleHeader && oneArticleHeader.addClass('to-stick');
    oneWorkTitle && oneWorkTitle.addClass('to-stick');
    if (window.pageYOffset > 100 || document.documentElement.scrollTop > 100) {
      oneArticleHeader && oneArticleHeader.addClass('sticked');
      oneWorkTitle && oneWorkTitle.addClass('sticked');
    }
  } else if (window.pageYOffset <= 300 || document.documentElement.scrollTop <= 300) {
    articlesHeader && articlesHeader.removeClass('sticked');
    secondaryNav && secondaryNav.removeClass('sticked');
    oneArticleHeader && oneArticleHeader.removeClass('to-stick');
    oneArticleHeader && oneArticleHeader.removeClass('sticked');
    oneWorkTitle && oneWorkTitle.removeClass('to-stick');
    oneWorkTitle && oneWorkTitle.removeClass('sticked');
  }
}

/* END FIXED HEADERS */


/* APPEAR ELEMENTS BEHAVIOR */

/**
 * Manage the appering elements, they must have the appear-elem class to be managed
 */
function elementsAppear() {
  $('.appear-with-js').each(function () { $(this).addClass('appear-elem') });
  /* Get the elements wich are on or near the viewport */
  // const appearingEl = [...$('.appear-elem')].filter(el => el.getBoundingClientRect().top <= window.innerHeight + 10);
  const appearingEl = $.grep($('.appear-elem').toArray(), function(el) { return el.getBoundingClientRect().top <= window.innerHeight + 10 });
  // appearingEl && appearingEl.forEach(el => $(el).addClass('appeared'));
  appearingEl && $.each(appearingEl, function(index, el) { $(el).addClass('appeared') });
}

/* END APPEAR ELEMENTS BEHAVIOR */


/* WORKS CAROUSEL */

/**
 * Works section carousel creation. The carousel needs at least 3 elements. 
 * The hard explanation of the carousels working is that the carousel make copies of the the items including its nested shown items + 1 (the cards). Every copy starts with the next sibling (the first starts with the firs, the second with the second, etc) and its positioned above the next sibling when a navigation is requested
 */

$('#works-cards-carousel', '#works-img-carousel').carousel({
  interval: 20000 
})
$('#works-cards-carousel.carousel .carousel-item', '#works-img-carousel.carousel .carousel-item').each(function(){
  var minPerSlide = 2;
  /* Get the next element, if no next get the first */
  var next = $(this).next();
  if (!next.length) {
    next = $(this).siblings(':first');
  }
  /* Clone the element and append to the carousel-item */
  next.children(':first-child').clone().appendTo($(this));
  /* Repeat the steps with the next 3 nested items */
  for (var i = 0; i < minPerSlide; i++) {
    next = next.next();
    if (!next.length) {
      next = $(this).siblings(':first');
    }
    next.children(':first-child').clone().appendTo($(this));
  }
});

/* END WORKS CAROUSEL */


/* COPY SOCIAL NAV TEXTS */

/**
 * Function to copy the social networks links on click event. Is used on the urls of the fixed social navs
 */
function copyText(ev) {
  var range = document.createRange();
  range.selectNode(document.getElementById(ev.target.id));
  window.getSelection().removeAllRanges(); /* Removing previous selections */
  window.getSelection().addRange(range); /* Add current selecion */
  document.execCommand('copy');
  window.getSelection().removeAllRanges(); /* Removing current selection */
  var currInterval; 
  if (!currInterval) {
    currInterval = setInterval(function() {
      ev.target.classList.remove('alert-text'); 
      clearInterval(currInterval);
    }, 500);
  } 
  ev.target.classList.add('alert-text');
}

/* END COPY SOCIAL NAV TEXTS */


/* GROWABLE ELEMENTS MODAL */

/**
 * Maybe you want to show better quality images/videos when they are shown on the modal and you might use something like below to change the files shown. 
 * I.e. if you have /your/dir/file.jpg you can shown on the modal /your/dir/file_big.jpg using something like this snipped:
 * let img = '/dir/image.jpg';
 * bigImg = img.slice(0, img.lastIndexOf('.')).concat('_big', img.slice(img.lastIndexOf('.')));
 * 
 * @param {MouseEvent} ev 
 */
function growOnGrowablesModal(ev) {
  $('#growables-modal-video, #growables-modal-img').each(function() { $(this).css('display', 'none') });
  var target = ev.target.classList.contains('growable-video') ? $('#growables-modal-video') : $('#growables-modal-img');
  $(target).css('display', 'block');
  setGrowablesModalCurrent(ev.target);
  $('#growables-modal').modal('show');
}

/**
 * Navigates on the carousel of the growables' modal. Is called from the navigation buttons on the modal
 * 
 * @param {String} step: can be 'next' or 'prev' and indicates the next step on the modal carousel
 */ 
function manageGrowablesModalCarousel(step) {
  const growables = jQuery.makeArray($('.growable'));
  const modalImg = $('#growables-modal-img');
  var currIndex = -1;
  growables.some(function(el, idx) { 
    if ($(el).children('img').attr('data-img') === modalImg.attr('data-img')) {
      currIndex = idx; 
      return true;
    }
  });
  /* Determine the new index based on the action caller */
  let index = function () {
    if (step === 'next') {
      return currIndex == growables.length  - 1 ? 0 : currIndex + 1;
    } else if (step === 'prev') {
      return currIndex == 0 ? growables.length - 1: currIndex - 1;
    }
  }();
  /* Sets the img and its caption on the modal */
  setGrowablesModalCurrent(growables[index]);
}

/**
 * Sets the img and its caption on the modal to show it grown. Is called from the click when open the modal or when navigate within the carousel.
 * 
 * @param {Node} elem: the elem with the new data to fill the img and its caption on the modal
 */
function setGrowablesModalCurrent(elem) {
  $('#growables-modal-img').attr('src', $(elem).children('img').attr('src'));
  $('#growables-modal-img').attr('data-img', $(elem).children('img').attr('data-img'));
  $('#growables-modal #modal-caption').html($(elem).children('img').attr('title'));
}

/* END GROWABLE ELEMENTS MODAL */


/* LOAD PAGE */

$(window).on('load', function() {
  if ($('.loading').length) {
    $('.loading').delay(1000).fadeOut(500);
  }
});

/* END LOAD PAGE */


/* GENERAL HELPERS */

/**
 * Smooth scroll on every nav link
 */
function smoothScroll(ev) {
  ev.preventDefault();
  document.querySelector(ev.target.hash).scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

/**
 * Determine if the scroll is up or down comparing the last scroll stored and the new scroll, if the new is bigger then there is a scroll down
 */
var lastScroll = 0;
function scrollDown() {
  const currScroll = window.pageYOffset || document.documentElement.scrollTop;
  let result = false;
  if (currScroll > lastScroll){
    /* Scrolling down */
    result = true;
  }
  lastScroll = currScroll <= 0 ? 0 : currScroll; 
  return result;
}

/* END GENERAL HELPERS */