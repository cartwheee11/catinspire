class Element {
  constructor(element) {
    this.DOM = element;
    this._originalIncrease = 0;
    this._originalAngle = 0;
    this._originalOffset = 0;
    this._originalOpacity = 1;
    this._finalTransformation = "";

    this.offset = 0;
    this.opacity = 1;
    this.angle = 0;
    this.increase = 1;

    // this.transform();
  }

  transform() {
    this.DOM.style.transform =
      "" +
      "translateY(" +
      this.offset +
      "px) rotate(" +
      this.angle +
      "deg) scale(" +
      this.increase +
      ")";

    this.DOM.style.opacity = this.opacity;
  }
}

export default class Prlx {
  constructor(option) {
    this.elements = [];
    if (typeof option == "string")
      this.DOMs = document.querySelectorAll(option);
    else if (option instanceof NodeList || option instanceof HTMLCollection)
      this.DOMs = option;
    else if (option instanceof HTMLElement)
      option.setAttribute("wrapnodelist", ""),
        (this.DOMs = document.querySelectorAll("[wrapnodelist]")),
        option.removeAttribute("wrapnodelist");
    else this.DOMs = document.querySelectorAll(".prlx");

    let that = this;
    [].forEach.call(this.DOMs, function (elem) {
      let newElement = new Element(elem);
      that.elements.push(newElement);
      // console.log(elem instanceof HTMLElement);
    });
  }

  print() {
    console.log(this.elements);
    return this;
  }

  _getVariance(elem) {
    // console.log(window.innerHeight - elem.DOM.getBoundingClientRect().top + elem.offset * parseFloat(getComputedStyle(elem.DOM).height));
    // return window.innerHeight - elem.DOM.getBoundingClientRect().top + elem.offset;
    let increase = elem.increase,
      angle = elem.angle,
      offset = elem.offset;
    (elem.offset = 0), (elem.angle = 0), (elem.increase = 1);
    elem.transform();
    let variance = window.innerHeight - elem.DOM.getBoundingClientRect().top;
    (elem.offset = offset), (elem.angle = angle), (elem.increase = increase);
    elem.transform();
    return variance;
  }

  _isReached(elem) {
    return this._getVariance(elem) >= 0;
  }

  opacity() {
    let that = this;
    function setOpacity() {
      [].forEach.call(that.elements, function (elem) {
        console.log(elem);
        // elem.opacity =
        // 1 - ((that._getVariance(elem) / 100) * vel - elem._originalOffset);
        elem.opacity =
          1 - (that._getVariance(elem) - elem._originalOffset) / 1000;
      });
    }

    [].forEach.call(that.elements, function (elem) {
      if (that._isReached(elem)) {
        elem._originalOpacity = 1;
      }
    });

    setOpacity();
    window.addEventListener("scroll", function () {
      setOpacity();
      that.elements.forEach(function (elem) {
        elem.transform();
      });
    });
    return this;
  }

  translate(depth) {
    let that = this;
    depth = depth ? depth : 1;
    function setOffset() {
      [].forEach.call(that.elements, function (elem) {
        elem.offset = that._getVariance(elem) * depth - elem._originalOffset;
      });
    }
    // НАЗНАЧЕНИЕ originalOffset, если элемент isReached
    [].forEach.call(that.elements, function (elem) {
      if (that._isReached(elem)) {
        elem._originalOffset = that._getVariance(elem) * depth;
      }
    });
    setOffset();
    window.addEventListener("scroll", function () {
      setOffset();
      that.elements.forEach(function (elem) {
        elem.transform();
      });
    });
    return this;
  }

  rotate(speed) {
    let that = this;
    speed = speed ? speed : 0;
    function setAngle() {
      that.elements.forEach(function (elem) {
        elem.angle =
          (that._getVariance(elem) + elem.offset) * speed - elem._originalAngle;
      });
    }
    [].forEach.call(that.elements, function (elem) {
      if (that._isReached(elem)) {
        elem._originalAngle = that._getVariance(elem) * speed;
      }
    });
    setAngle();
    window.addEventListener("scroll", function () {
      setAngle();
      that.elements.forEach(function (elem) {
        elem.transform();
      });
    });
    return that;
  }

  scale(speed, start) {
    let that = this;
    start = start ? start : 1;
    speed = speed ? speed : 0;
    speed = speed / 100;
    function setIncrease() {
      that.elements.forEach(function (elem) {
        elem.increase =
          that._getVariance(elem) * speed + start - elem._originalIncrease;
      });
    }
    [].forEach.call(that.elements, function (elem) {
      if (that._isReached(elem)) {
        elem._originalIncrease = that._getVariance(elem) * speed;
      }
    });
    setIncrease();
    window.addEventListener("scroll", function () {
      setIncrease();
      that.elements.forEach(function (elem) {
        elem.transform();
      });
    });
    return that;
  }
}
