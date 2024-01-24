import debounce from "./debounce.js";
export class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = {
      finalPosition: 0,
      startX: 0,
      movement: 0,
    };
    this.changeEvent = new Event("changeEvent");
  }

  transition(active) {
    this.slide.style.transition = active ? "transform .3s" : "";
  }

  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.8;
    return this.dist.finalPosition - this.dist.movement;
  }

  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px,0,0)`;
  }

  onStart = (event) => {
    event.preventDefault();
    this.dist.startX = event.clientX;
    this.wrapper.addEventListener("mousemove", this.onMove);
    this.transition(false);
  };

  onEnd = (event) => {
    this.wrapper.removeEventListener("mousemove", this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
    this.transition(true);
    this.changeSlideOnEnd();
  };

  onMove = (event) => {
    const finalPosition = this.updatePosition(event.clientX);
    this.moveSlide(finalPosition);
  };

  changeSlideOnEnd() {
    if (this.dist.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  }

  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
  }

  slidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }

  // slide config
  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return {
        position,
        element,
      };
    });
  }

  slidesIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  }

  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    this.dist.finalPosition = activeSlide.position;
    this.changeActiveClass();
    this.wrapper.dispatchEvent(this.changeEvent);
  }

  changeActiveClass() {
    this.slideArray.forEach((item) => {
      item.element.classList.remove("ativo");
    });
    this.slideArray[this.index.active].element.classList.add("ativo");
  }

  activePrevSlide = () => {
    if (this.index.prev !== undefined) {
      this.changeSlide(this.index.prev);
    }
  };

  activeNextSlide = () => {
    if (this.index.next !== undefined) {
      this.changeSlide(this.index.next);
    }
  };

  addResizeEvent() {
    window.addEventListener("resize", debounce(this.onResize, 200));
  }

  onResize = () => {
    setTimeout(() => {
      this.slidesConfig();
      this.changeSlide(this.index.active);
    }, 1000);
  };

  init() {
    this.addSlideEvents();
    this.slidesConfig();
    this.transition(true);
    this.addResizeEvent();
    return this;
  }
}

export class SlideNav extends Slide {
  addArrow(prev, next) {
    this.prevElemet = document.querySelector(prev);
    this.nextElemet = document.querySelector(next);
    this.addArrowEvent();
  }
  addArrowEvent() {
    this.prevElemet.addEventListener("click", this.activePrevSlide);
    this.nextElemet.addEventListener("click", this.activeNextSlide);
  }

  createControl() {
    const control = document.createElement("ul");
    control.dataset.control = "slide";
    this.slideArray.forEach((item, index) => {
      control.innerHTML += `<li><a href="#slide${index + 1}">${
        index + 1
      }</a></li>`;
    });
    this.wrapper.appendChild(control);
    return control;
  }

  activeControlItem = () => {
    this.controlArray.forEach((item) => item.classList.remove("ativo"));
    this.controlArray[this.index.active].classList.add("ativo");
  };

  eventControl = (item, index) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      this.changeSlide(index);
      this.activeControlItem();
    });
    this.wrapper.addEventListener("changeEvent", this.activeControlItem);
  };

  addControl(customControl) {
    this.control =
      document.querySelector(customControl) || this.createControl();
    this.controlArray = [...this.control.children];
    this.activeControlItem();
    this.controlArray.forEach(this.eventControl);
  }
}
