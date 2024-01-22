export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
  }

  onStart = (event) => {
    event.preventDefault();
    this.wrapper.addEventListener("mousemove", this.onMove);
  };

  onEnd = (event) => {
    this.wrapper.removeEventListener("mousemove", this.onMove);
  };

  onMove = (event) => {};

  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
  }

  init() {
    this.addSlideEvents();
  }
}
