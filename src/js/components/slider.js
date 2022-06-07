const SliderMain = "slider__main";
const SliderDraggableClassname = "slider-draggable";
const SliderMainLine = "slider__line";
const MainSlideClassName = "slider__item-wrapper";
const PopupSliderDotsClassName = "slide__dots";
const PopupSliderDotClassName = "slide__dot";
const PopupSliderDotActiveClassName = "slide__dot-active";
const PopupSlideNavClassName = "slide__nav";
const PopupSlideNavLeftClassName = "slide__nav-left";
const PopupSlideNavRightClassName = "slide__nav-right";

class Slider {
  constructor(element) {
    this.containerNode = element;
    this.size = element.childElementCount;
    this.currentSlide = 0;
    this.currentSlideWasChanged = false;

    this.manageHTML = this.manageHTML.bind(this);
    this.setParameters = this.setParameters.bind(this);
    this.setEvents = this.setEvents.bind(this);
    this.resizeSlider = this.resizeSlider.bind(this);
    this.startDrag = this.startDrag.bind(this);
    this.stopDrag = this.stopDrag.bind(this);
    this.dragging = this.dragging.bind(this);
    this.setStylePosition = this.setStylePosition.bind(this);
    this.setStyleTransition = this.setStyleTransition.bind(this);
    this.resetStyleTransition = this.resetStyleTransition.bind(this);
    this.goHome = this.goHome.bind(this);
    this.goToSecondSlide = this.goToSecondSlide.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.clickDots = this.clickDots.bind(this);
    this.moveToLeft = this.moveToLeft.bind(this);
    this.moveToRight = this.moveToRight.bind(this);
    this.changeCurrentSlide = this.changeCurrentSlide.bind(this);
    this.changeActiveDotClass = this.changeActiveDotClass.bind(this);

    this.manageHTML();
    this.setParameters();
    this.setEvents();
  }
  setParameters() {
    const coordsContainer = this.containerNode.getBoundingClientRect();
    this.width = coordsContainer.width;
    this.maximumX = -(this.size - 1) * this.width;
    this.x = -this.currentSlide * this.width;
    this.resetStyleTransition();
    this.lineNode.style.width = `${this.size * this.width}px`;
    this.setStylePosition();
    Array.from(this.slideNodes).forEach((slideNode) => {
      slideNode.style.width = `${this.width}px`;
    });
  }
  manageHTML() {
    this.containerNode.innerHTML = `
     <div class="${SliderMainLine}">
     ${this.containerNode.innerHTML}
     </div>
     <div class="${PopupSlideNavClassName}">
     <button class="${PopupSlideNavLeftClassName}"></button>
     <button class="${PopupSlideNavRightClassName}"></button>
    </div>
    <div class="${PopupSliderDotsClassName}"></div>
     `;
    this.lineNode = this.containerNode.querySelector(`.${SliderMainLine}`);
    this.dotsNode = this.containerNode.querySelector(
      `.${PopupSliderDotsClassName}`
    );

    this.homeButton = document.querySelector(".home__button");
    this.whatsNextButton = document.querySelector(".whats-next");
    console.log(this.whatsNextButton)
    this.moreButton = document.querySelector(".slide__more");
    this.closePopupButton = document.querySelector(".popup__close");
    this.popup = document.querySelector(".popup");
    this.body = document.querySelector("body");
    this.scroll = document.querySelector(".scroll");
   this.muchSperm =document.querySelectorAll('.slide__pink-sperm-second')

    this.slideNodes = Array.from(this.lineNode.children).map((childNode) =>
      wrapElementByDiv({
        element: childNode,
        className: MainSlideClassName,
      })
    );

    this.dotsNode.innerHTML = Array.from(Array(this.size).keys())
      .map(
        (key) =>
          `<button class="${PopupSliderDotClassName}  ${
            key === this.currentSlide ? PopupSliderDotActiveClassName : ""
          }"</button> `
      )
      .join("");

    this.dotNodes = this.dotsNode.querySelectorAll(
      `.${PopupSliderDotClassName}`
    );
    this.navLeft = this.containerNode.querySelector(
      `.${PopupSlideNavLeftClassName}`
    );
    this.navRight = this.containerNode.querySelector(
      `.${PopupSlideNavRightClassName}`
    );
  }
  setEvents() {
    this.debounceResizeSlider = debounce(this.resizeSlider);
    window.addEventListener("resize", this.debounceResizeSlider);
    window.addEventListener("pointerup", this.stopDrag);
    this.moreButton.addEventListener("click", this.debounceResizeSlider);
    this.lineNode.addEventListener("pointerdown", this.startDrag);
    this.homeButton.addEventListener("click", this.goHome);
    this.whatsNextButton.addEventListener("click", this.goToSecondSlide);
    this.moreButton.addEventListener("click", this.openPopup);
    this.closePopupButton.addEventListener("click", this.closePopup);
    this.dotsNode.addEventListener("click", this.clickDots);
    this.navLeft.addEventListener("click", this.moveToLeft);
    this.navRight.addEventListener("click", this.moveToRight);
    this.scroll.addEventListener("pointerdown", this.stopDrag);
  }
  clickDots(e) {
    const dotNode = e.target.closest("button");
    if (!dotNode) {
      return;
    }
    let dotNumber;
    for (let i = 0; i < this.dotNodes.length; i++) {
      if (this.dotNodes[i] === dotNode) {
        dotNumber = i;
        break;
      }
    }
    if (dotNumber === this.currentSlide) {
      return;
    }
    this.currentSlide = dotNumber;
    this.changeCurrentSlide();
  }
  moveToLeft() {
    if (this.currentSlide <= 0) {
      return;
    }
    this.currentSlide = this.currentSlide - 1;
    this.changeCurrentSlide();
  }
  moveToRight() {
    if (this.currentSlide >= this.size - 1) {
      return;
    }
    this.currentSlide = this.currentSlide + 1;
    this.changeCurrentSlide();
  }
  changeCurrentSlide() {
    this.x = -this.currentSlide * this.width;
    this.setStylePosition();
    this.setStyleTransition();
    this.changeActiveDotClass();
  }
  changeActiveDotClass() {
    for (let i = 0; i < this.dotNodes.length; i++) {
      this.dotNodes[i].classList.remove(PopupSliderDotActiveClassName);
    }
    this.dotNodes[this.currentSlide].classList.add(
      PopupSliderDotActiveClassName
    );
  }
  closePopup() {
    this.popup.classList.remove("popup--active");
    this.lineNode.addEventListener("pointerdown", this.startDrag);
  }
  openPopup() {
    this.popup.classList.add("popup--active");
    this.lineNode.removeEventListener("pointerdown", this.startDrag);
  }
  goToSecondSlide() {
    this.lineNode.style.transform = `translate3d(-${this.width}px, 0, 0)`;
    this.currentSlide = 1;
    this.spermAnimate()
  }

  goHome() {
    this.lineNode.style.transform = `translate3d(0, 0, 0)`;
    this.currentSlide = 0;
    for(let element of this.muchSperm) {
      element.classList.remove('animating')
    }
  }

  destroyEvents() {
    window.removeEventListener("resize", this.debounceResizeSlider);
    window.removeEventListener("pointerup", this.stopDrag);
    this.lineNode.removeEventListener("pointerdown", this.startDrag);
    this.dotsNode.removeEventListener("click", this.clickDots);
    this.navLeft.removeEventListener("click", this.moveToLeft);
    this.navRight.removeEventListener("click", this.moveToRight);
  }
  resizeSlider() {
    this.setParameters();
  }
  startDrag(e) {
    this.currentSlideWasChanged = false;
    this.clickX = e.pageX;
    this.clickY = e.pageY;
    this.startX = this.x;
    this.resetStyleTransition();

    window.addEventListener("pointermove", this.dragging);

  }
  stopDrag() {
    window.removeEventListener("pointermove", this.dragging);
    this.containerNode.classList.remove(SliderDraggableClassname);
    this.changeCurrentSlide();
       if(this.currentSlide === 1) {
        this.spermAnimate()
    }

    const imgs = document.getElementsByTagName('img')
    for(let img of imgs) {
      img.ondragstart = () => {
        return false;
      };
    }
  }
  spermAnimate() {
    for(let element of this.muchSperm) {
 element.classList.add('animating')
}
}
  dragging(e) {
    if (
      document
        .querySelector(".scroll-wrapper")
        .classList.contains("active-scroll")
    ) {
      return;
    }
    this.dragX = e.pageX;
    const dragShift = this.dragX - this.clickX;
    const easing = dragShift / 5;
    this.x = Math.max(
      Math.min(this.startX + dragShift, easing),
      this.maximumX + easing
    );
    this.setStylePosition();

    // change active slide
    if (
      dragShift > 20 &&
      dragShift > 0 &&
      !this.currentSlideWasChanged &&
      this.currentSlide > 0
    ) {
      this.containerNode.classList.add(SliderDraggableClassname);
      this.currentSlideWasChanged = true;
      this.currentSlide = this.currentSlide - 1;
    }
    if (
      dragShift < -20 &&
      dragShift < 0 &&
      !this.currentSlideWasChanged &&
      this.currentSlide < this.size - 1
    ) {
      this.containerNode.classList.add(SliderDraggableClassname);
      this.currentSlideWasChanged = true;
      this.currentSlide = this.currentSlide + 1;
    }
  }

  setStylePosition() {
    this.lineNode.style.transform = `translate3d(${this.x}px, 0, 0)`;
  }
  setStyleTransition() {
    this.lineNode.style.transition = `all .3s ease 0s`;
  }
  resetStyleTransition() {
    this.lineNode.style.transition = `all 0 ease 0s`;
  }
}

// helpers
function wrapElementByDiv({ element, className }) {
  const wrapperNode = document.createElement("div");
  wrapperNode.classList.add(className);

  element.parentNode.insertBefore(wrapperNode, element);
  wrapperNode.appendChild(element);

  return wrapperNode;
}

function debounce(func, time = 100) {
  let timer;
  return function (e) {
    clearTimeout(timer);
    timer = setTimeout(func, time, e);
  };
}

class PopupSlider extends Slider {
  constructor(element) {
    super(element);
  }

  openPopup() {
    this.lineNode.addEventListener("pointerdown", this.startDrag);
  }
}
