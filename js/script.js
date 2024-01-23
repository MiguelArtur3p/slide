import debounce from "./debounce.js";
import Slide from "./slide.js";
debounce();
const slide = new Slide(".slide", ".wrapper");
slide.init();
slide.changeSlide(1);
slide.activePrevSlide();
