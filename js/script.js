import debounce from "./debounce.js";
import { SlideNav } from "./slide.js";
debounce();
const slide = new SlideNav(".slide", ".wrapper");
slide.init();
slide.addArrow(".prev", ".next");
slide.changeSlide(3);
slide.activePrevSlide();
