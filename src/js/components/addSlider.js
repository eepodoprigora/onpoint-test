const SecondSlider = "second-slider";
const SecondSliderDraggableClassname = "second-slider-draggable";
const SecondSliderLine = "second-slider__line";
const SecondSlideClassName = "second-slider__item-wrapper";
const ScrollWrapper = "scroll-wrapper";
const ScrollBase = "scroll-base";
const ScrollPointer = "scroll-pointer";

class AddSlider {
  constructor(element) {
    this.containerNode = element;
    this.size = element.childElementCount;

    this.manageHTML = this.manageHTML.bind(this);
    this.setParameters = this.setParameters.bind(this);
    this.setEvents = this.setEvents.bind(this);
    this.startDrag = this.startDrag.bind(this);
    this.stopDrag = this.stopDrag.bind(this);
    this.dragging = this.dragging.bind(this);
    this.setStylePosition = this.setStylePosition.bind(this);

    this.manageHTML();
    this.setParameters();
    this.setEvents();
  }
  setParameters() {
    const coordsContainer = this.containerNode.getBoundingClientRect();
    this.height = coordsContainer.height;
    this.lineNode.style.height = `${this.size * this.height}px`;
    Array.from(this.slideNodes).forEach((slideNode) => {
      slideNode.style.height = `${this.height}px`;
    });
  }
  manageHTML() {
    this.containerNode.innerHTML = `
     <div class="${SecondSliderLine}">
     ${this.containerNode.innerHTML}
     </div>

     <div class="${ScrollWrapper}" >
   <div class="${ScrollBase}"></div>
   <div class="${ScrollPointer}"></div>
   </div>
   `;

    this.scrollNode = this.containerNode.querySelector(`.${ScrollWrapper}`);

    document.querySelector(".scroll").append(this.scrollNode);

    this.lineNode = this.containerNode.querySelector(`.${SecondSliderLine}`);
    this.scrollPointer = this.scrollNode.querySelector(`.${ScrollPointer}`);
    this.scrollBase = this.scrollNode.querySelector(`.${ScrollBase}`);

    this.slideNodes = Array.from(this.lineNode.children).map((childNode) =>
      wrapElementByDiv({
        element: childNode,
        className: SecondSlideClassName,
      })
    );
  }

  setEvents() {
    this.scrollPointer.addEventListener("pointerdown", this.startDrag);
   window.addEventListener("pointerup", this.stopDrag);
  }

  startDrag(e) {
    window.addEventListener("pointermove", this.dragging);
    this.clickY = e.pageY;

  }

  stopDrag(e) {
    window.removeEventListener("pointermove", this.dragging);
    this.scrollPointer.removeEventListener("pointermove", this.dragging);
    this.scrollNode.classList.remove('active-scroll')
  }

  dragging(e) {
    this.dragY = e.pageY;
    const dragShift = this.dragY - this.clickY;
    this.setStylePosition(dragShift);
    if (
      this.scrollPointer.getBoundingClientRect().top < this.scrollBase.getBoundingClientRect().top  ||
      this.scrollPointer.getBoundingClientRect().bottom > this.scrollBase.getBoundingClientRect().bottom
    ) {
      this.stopDrag();
    }
    this.scrollNode.classList.add('active-scroll')

  }

  setStylePosition(shift) {
    this.lineNode.style.transform = `translate3d(0, -${shift}px, 0)`;
    this.scrollPointer.style.transform = `translate3d(0, ${shift}px, 0)`;
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


