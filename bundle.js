/**
 * 
 * @returns {NodeListOf<HTMLDivElement>} carousels
 */

function isXs() {
    return matchMedia("(min-width: 0px)").matches;
}

function isSm() {
    return matchMedia("(min-width: 600px)").matches;
}

function isMd() {
    return matchMedia("(min-width: 900px)").matches;
}

function isLg() {
    return matchMedia("(min-width: 1200px)").matches;
}

function getCarousels() {
    return document.querySelectorAll('.carousel');
}
/**
 * 
 * @param {HTMLDivElement} carousel 
 * @returns {number} carousel item amount per page
 */
function getCarouselItemCount() {
    return isLg() ? 6 : isMd() ? 5 : isSm() ? 4 : 3;
}
/**
 * 
 * @param {HTMLDivElement} carousel 
 * @returns {HTMLDivElement} carousel's slider element
 */
function getCarouselSlider(carousel) {
    return carousel.querySelector('.carousel-slider');
}
/**
 * 
 * @param {HTMLDivElement} carousel 
 * @returns {HTMLDivElement} carousel's content element
 */
function getCarouselContent(carousel) {
    return carousel.querySelector('.carousel-content');
}

/**
 * 
 * @param {HTMLDivElement} carousel 
 * @returns {HTMLDivElement} carousel's item element
 */
function getCarouselItems(carousel) {
    return carousel.querySelectorAll('.carousel-item');
}
/**
 * 
 * @param {HTMLDivElement} carousel 
 * @returns {HTMLDivElement} carousel's control previous;
 */
function getCarouselControlPrev(carousel) {
    return carousel.querySelector('.carousel-control.carousel-control-prev');
}
/**
 * 
 * @param {HTMLDivElement} carousel 
 * @returns {HTMLDivElement} carousel's control next
 */
function getCarouselControlNext(carousel) {
    return carousel.querySelector('.carousel-control.carousel-control-next')
}
/**
 * 
 * @param {HTMLDivElement} carousel 
 * @returns {HTMLDivElement} carousel item's width
 */
function getCarouselItemWidth(carousel) {
    return carousel.querySelector('.carousel-item').getBoundingClientRect().width;
}

function initialCarousels() {
    const carousels = getCarousels();
    carousels.forEach((carousel) => {
        const itemCount = getCarouselItemCount();
        const content = getCarouselContent(carousel);
        const originalItems = getCarouselItems(carousel);
        const slider = getCarouselSlider(carousel);
        const controlPrev = getCarouselControlPrev(carousel);
        const controlNext = getCarouselControlNext(carousel);
        const sliderWidth = slider.getBoundingClientRect().width;
        const controlPrevWidth = controlPrev.getBoundingClientRect().width;
        const controlNextWidth = controlNext.getBoundingClientRect().width;

        // get initial item's width
        const itemWidth = (sliderWidth - (controlPrevWidth + controlNextWidth)) / itemCount;
        originalItems.forEach(item => {
            item.style.width = `${itemWidth}px`;
        });

        const shouldDuplicate = (itemCount * 2) >= originalItems.length && originalItems.length >= itemCount;

        if (shouldDuplicate) {
            const clonedItems = new Array(originalItems.length).fill(null).map((_, index) => originalItems[index].cloneNode(true));
            clonedItems.forEach((item) => content.appendChild(item));
        }

        content.style.paddingLeft = `${controlPrevWidth}px`;
        controlPrev.style.visibility = 'hidden';

        controlNext.addEventListener('click', () => {
            controlPrev.style.pointerEvents = 'none';
            controlNext.style.pointerEvents = 'none';

            const currentItems = getCarouselItems(carousel);
            const currentItemWidth = getCarouselItemWidth(carousel);
            const currentItemCount = getCarouselItemCount();
            const currentFirstlyItems = new Array(currentItemCount).fill(null).map((_, index) => currentItems[index]);
            const clonedCurrentFirstlyItems = currentFirstlyItems.map(item => item.cloneNode(true));

            clonedCurrentFirstlyItems.forEach(item => content.appendChild(item));

            slider.addEventListener('scrollend', () => {
                if (slider.scrollLeft) {
                    currentFirstlyItems.forEach(item => item.remove());
                }
                slider.scrollBy({ left: currentItemCount * -currentItemWidth, behavior: 'instant' });
                controlPrev.style.visibility = 'visible';
                controlPrev.style.pointerEvents = 'auto';
                controlNext.style.pointerEvents = 'auto';
            }, { once: true });
            slider.scrollBy({ left: currentItemCount * currentItemWidth, behavior: 'smooth' });
        })

        controlPrev.addEventListener('click', () => {
            controlPrev.style.pointerEvents = 'none';
            controlNext.style.pointerEvents = 'none';

            const currentItems = getCarouselItems(carousel);
            const currentItemWidth = getCarouselItemWidth(carousel);
            const currentItemCount = getCarouselItemCount();
            const currentLastlyItems = new Array(currentItemCount).fill(null).map((_, index) => currentItems[currentItems.length - index - 1]);
            const clonedCurrentLastlyItems = currentLastlyItems.map(item => item.cloneNode(true));

            clonedCurrentLastlyItems.forEach(item => content.prepend(item));
            currentLastlyItems.forEach((item) => item.remove());

            slider.addEventListener('scrollend', () => {
                slider.addEventListener('scrollend', () => {
                    controlPrev.style.pointerEvents = 'auto';
                    controlNext.style.pointerEvents = 'auto';
                }, { once: true });
                slider.scrollBy({ left: currentItemCount * -currentItemWidth, behavior: 'smooth' });
            }, { once: true });
            slider.scrollBy({ left: currentItemCount * currentItemWidth, behavior: 'instant' });
        })
    });
}

function resizeCarousels() {
    const carousels = getCarousels();
    carousels.forEach(carousel => {
        const items = getCarouselItems(carousel);
        const slider = getCarouselSlider(carousel);
        const controlPrev = getCarouselControlPrev(carousel);
        const controlNext = getCarouselControlNext(carousel);
        const itemCount = getCarouselContent();
        const sliderWidth = slider.getBoundingClientRect().width;
        const controlPrevWidth = controlPrev.getBoundingClientRect().width;
        const controlNextWidth = controlNext.getBoundingClientRect().width;
        const itemWidth = (sliderWidth - (controlPrevWidth + controlNextWidth)) / itemCount;
        items.forEach(item => {
            item.style.width = `${itemWidth}px`;
        });
    });
}

window.addEventListener('load', () => {
    initialCarousels();
})

window.addEventListener('resize', () => {
    resizeCarousels();
})

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const headerSection = document.querySelector('.header-section');
    if (scrollTop) {
        console.log('test');
        headerSection.classList.add('sticky');
    } else {
        headerSection.classList.remove('sticky');
    }
})