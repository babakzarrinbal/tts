// movebale elements

const draggingShadow = "none";
const draggingZindex = "999999999";
const resizeTransition = "height .3s,width .3s";
const placingTransition = ".3s";
const backtostartTransition = ".3s";
const surfacePadding = 20; // padding to stick to placeholder
const rotateScale = 0.017;
const rotateRoundTo = 5;
const resizeScale = 1;
const eventName = "bz-placed";
const classPrefix = "bz-movable";

//eslint-disable-next-line
const classList = {
  'classPrefix+"-container"': "container to limit movable element movement",
  'classPrefix+"-xonly"': "limit movable element to x axis only",
  'classPrefix+"-yonly"': "limit movable element to y axis only",
  'classPrefix+"-resize-to-placeholder"':
    "movable element will resize to placeholder",
  'classPrefix+"-freeroam"':
    "movable element will stay at position if not placed in placeholder",
  "classPrefix+'-moving'":
    "while moving this class is added to movable element",
};

document.body.onmousedown = document.body.ontouchstart = function (e) {
  let target = e.target.closest("." + classPrefix);
  if (!target) return;
  target.classList.add(classPrefix + "-moving");
  if (
    !target.style.transform ||
    !target.style.transform.includes("translate")
  ) {
    translateChange(target, 0, 0);
  }
  target.bzOrgTransition = target.style.transition;
  let container = target.parentElement.closest(
    "." + classPrefix + "-container"
  );
  let xonly = target.classList.contains(classPrefix + "-xonly");
  let yonly = target.classList.contains(classPrefix + "-yonly");
  let userselect = target.style.userSelect;
  target.bzOrgBoxshadow = target.style.boxShadow;
  let zIndex = target.style.zIndex;
  target.style.userSelect = "none";
  target.style.zIndex = draggingZindex;
  target.style.boxShadow = draggingShadow;
  let x = e.clientX || e.touches[0].clientX,
    y = e.clientY || e.touches[0].clientY,
    touches = e.touches,
    touchesDistAngl;
  let lx = x,
    ly = y;
  if (touches && touches.length === 2) {
    touchesDistAngl = calcDistAngle(touches[0], touches[1]);
  }

  let translate = target.style.transform.match(/translate\((\d*)\D+(\d*)/);
  let orgX = Number(translate[1]) || 0;
  let orgY = Number(translate[2]) || 0;
  x = x - orgX;
  y = y - orgY;

  let containerOrg,
    placeholders = [];
  let targetOrg = cumulativeOffset(target, { styleOffset: 1 });
  let targetResizable = target.classList.contains(
    classPrefix + "-resize-to-placeholder"
  );
  let targetPan = target.classList.contains(classPrefix + "-resizeable");
  let targetRotate = target.classList.contains(classPrefix + "-rotatable");
  if (targetResizable)
    target.bzOrgSize = {
      height: targetOrg.height + "px",
      width: targetOrg.width + "px",
    };

  let targetOrgActual = cumulativeOffset(target, {});
  if (container) {
    containerOrg = cumulativeOffset(container, { styleOffset: -1 });
    placeholders = Array.from(
      container.querySelectorAll("." + classPrefix + "-placeholder")
    );
  } else {
    placeholders = Array.from(
      document.body.querySelectorAll("." + classPrefix + "-placeholder")
    );
  }
  placeholders = placeholders.map((p) =>
    cumulativeOffset(p, { surfacePadding })
  );
  let placed;

  var moveFunc = (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    if ((targetRotate || targetPan) && e.touches && e.touches.length === 2) {
      let curDistAngl = calcDistAngle(e.touches[0], e.touches[1]);
      if (!touchesDistAngl) return (touchesDistAngl = curDistAngl);
      if (targetRotate) {
        changeRotate(target, curDistAngl.angle - touchesDistAngl.angle);
        touchesDistAngl.angle = curDistAngl.angle;
      }
      if (targetPan) {
        target.style.width =
          target.offsetWidth +
          (curDistAngl.dx - touchesDistAngl.dx) * resizeScale +
          "px";
        target.style.height =
          target.offsetHeight +
          (curDistAngl.dy - touchesDistAngl.dy) * resizeScale +
          "px";

        touchesDistAngl.dx = curDistAngl.dx;
        touchesDistAngl.dy = curDistAngl.dy;
      }

      return;
    } else if (
      e.getModifierState &&
      (e.getModifierState("Shift") || e.getModifierState("Control"))
    ) {
      if (targetPan && e.getModifierState("Shift")) {
        target.style.width =
          target.offsetWidth + (e.clientX - lx) * resizeScale + "px";
        target.style.height =
          target.offsetHeight + (e.clientY - ly) * resizeScale + "px";
      }
      if (targetRotate && e.getModifierState("Control")) {
        let dx = e.clientX - lx;
        let dy = e.clientY - ly;
        let ydir = e.clientY > targetOrg.centerY + orgY ? 1 : 0;
        let xdir = e.clientX > targetOrg.centerX + orgX ? 1 : 0;
        let direction = ydir
          ? xdir
            ? dx > 0 && dy > 0
              ? 0
              : dx
              ? -dx
              : dy
            : dx < 0 && dy > 0
            ? 0
            : dx
            ? -dx
            : dy
          : xdir
          ? dx > 0 && dy < 0
            ? 0
            : dx
            ? dx
            : dy
          : dx < 0 && dy < 0
          ? 0
          : dx
          ? dx
          : -dy;
        let dist = Math.sqrt(dx * dx + dy * dy);
        changeRotate(target, dist * (direction ? (direction < 0 ? -1 : 1) : 0));
      }

      lx = e.clientX;
      ly = e.clientY;
      return;
    } else {
      touchesDistAngl = undefined;
    }
    let tx = (yonly ? 0 : e.clientX || e.touches[0].clientX) - x;
    let ty = (xonly ? 0 : e.clientY || e.touches[0].clientY) - y;
    if (container) {
      if (targetOrg.left + tx < containerOrg.left)
        tx = containerOrg.left - targetOrg.left;
      if (targetOrg.top + ty < containerOrg.top)
        ty = containerOrg.top - targetOrg.top;
      if (containerOrg.right < targetOrg.right + tx)
        tx = containerOrg.right - targetOrg.right;
      if (containerOrg.bottom < targetOrg.bottom + ty)
        ty = containerOrg.bottom - targetOrg.bottom;
    }

    if (targetResizable) {
      target.style.transition = resizeTransition;
      target.style.height = target.bzOrgSize.height;
      target.style.width = target.bzOrgSize.width;
    }
    let p = {
      left: targetOrgActual.left + tx,
      top: targetOrgActual.top + ty,
      right: targetOrgActual.right + tx,
      bottom: targetOrgActual.bottom + ty,
      width: targetOrgActual.width,
      height: targetOrgActual.height,
    };
    placed = undefined;
    for (let ph of placeholders) {
      if (
        (((p.right > ph.left && p.right < ph.right) ||
          (p.left < ph.right && p.left > ph.left)) &&
          ((p.top > ph.top && p.top < ph.bottom) ||
            (p.bottom > ph.top && p.bottom < ph.bottom))) ||
        (p.left < ph.left &&
          p.right > ph.right &&
          (p.top > ph.bottom || p.bottom > ph.top)) ||
        (p.top < ph.top &&
          p.bottom > ph.bottom &&
          (p.right > ph.left || p.right < ph.left))
      ) {
        let s =
          Math.min(Math.min(p.right - ph.left, ph.right - p.left), p.width) *
          Math.min(p.height, Math.min(p.bottom - ph.top, ph.bottom - p.top));
        if (s >= ph.surface || s >= targetOrg.surface * 0.9) {
          placed = ph;

          break;
        }
      }
    }
    if (placed) {
      target.style.transition = placingTransition;
      target.style.transform = translateChange(
        target,
        placed.left - targetOrgActual.left,
        placed.top - targetOrgActual.top
      );

      target.style.boxShadow = target.bzOrgBoxshadow;
      if (targetResizable) {
        target.style.height = placed.height + "px";
        target.style.width = placed.width + "px";
      }
      const placedEvent = new CustomEvent(eventName, {
        bubbles: false,
        detail: { placeholder: placed, target },
      });
      target.dispatchEvent(placedEvent);
      placed.element.dispatchEvent(placedEvent);
    } else {
      target.style.boxShadow = draggingShadow;
      target.style.transform = translateChange(target, tx, ty);
    }
  };
  document.body.addEventListener("touchmove", moveFunc, { passive: false });
  document.body.onmousemove = moveFunc;
  document.body.onmouseup = document.body.ontouchend = () => {
    target.classList.remove(classPrefix + "-moving");
    target.style.userSelect = userselect;
    target.style.zIndex = zIndex;
    document.body.removeEventListener("touchmove", moveFunc);
    document.body.onmousemove = document.body.onmouseup = document.body.ontouchend = null;
    target.style.boxShadow = target.bzOrgBoxshadow;
    target.style.transition = target.bzOrgTransition;
    if (
      placeholders.length &&
      !placed &&
      !target.classList.contains(classPrefix + "-freeroam")
    ) {
      target.style.transition = backtostartTransition;
      let resetting = target.style.transform;
      target.style.transform = translateChange(target, orgX, orgY);
      if (target.style.transform !== resetting)
        target.addEventListener(
          "transitionend",
          () => (target.style.transition = target.bzOrgTransition),
          { once: true }
        );
      else target.style.transition = target.bzOrgTransition;
    }
  };
};

var cumulativeOffset = function (
  element,
  { styleOffset = 0, surfacePadding = 0 }
) {
  styleOffset = Math.round(
    styleOffset !== 0 ? styleOffset / Math.abs(styleOffset) : 0
  );
  let orgEle = element;
  let top = 0,
    left = 0;
  do {
    top += element.offsetTop || 0;
    left += element.offsetLeft || 0;
    element = element.offsetParent;
  } while (element);
  if (styleOffset === 0)
    return {
      left,
      top,
      right: orgEle.offsetWidth + left,
      bottom: orgEle.offsetHeight + top,
      width: orgEle.offsetWidth,
      height: orgEle.offsetHeight,
      centerX: left + orgEle.offsetWidth / 2,
      centerY: top + orgEle.offsetHeight / 2,
      surface:
        (orgEle.offsetWidth - surfacePadding) *
        (orgEle.offsetHeight - surfacePadding),
      element: orgEle,
    };
  let pad = getComputedStyle(orgEle, null);
  return {
    left:
      left -
      styleOffset *
        parseFloat(styleOffset >= 0 ? pad.marginLeft : pad.paddingLeft),
    top:
      top -
      styleOffset *
        parseFloat(styleOffset >= 0 ? pad.marginTop : pad.paddingTop),
    right:
      orgEle.offsetWidth +
      left +
      styleOffset *
        parseFloat(styleOffset >= 0 ? pad.marginRight : pad.paddingRight),
    bottom:
      orgEle.offsetHeight +
      top +
      styleOffset *
        parseFloat(styleOffset >= 0 ? pad.marginBottom : pad.paddingBottom),
    width: orgEle.offsetWidth,
    height: orgEle.offsetHeight,
    centerX: left + orgEle.offsetWidth / 2,
    centerY: top + orgEle.offsetHeight / 2,
    element: orgEle,
    surface:
      (orgEle.offsetWidth - surfacePadding) *
      (orgEle.offsetHeight - surfacePadding),
  };
};

var calcDistAngle = function (t1, t2) {
  let dy = t2.clientY - t1.clientY;
  let dx = t2.clientX - t1.clientX;
  return {
    dx,
    dy,
    distance: Math.sqrt(dx * dx + dy * dy),
    angle: Math.atan2(dy, dx),
  };
};

var translateChange = (ele, x, y) =>
  (ele.style.transform = ele.style.transform.includes("translate")
    ? ele.style.transform.replace(/translate.*?\)/, `translate(${x}px, ${y}px)`)
    : (ele.style.transform ? ele.style.transform + " " : "") +
      `translate(${x}px, ${y}px)`);
var changeRotate = (ele, rotation) => {
  return (ele.style.transform = ele.style.transform.includes("rotate")
    ? ele.style.transform.replace(/rotate\((.*?)\)/, (m, c) => {
        console.log();
        return `rotate(${
          Math.round(
            (fixrotate(rotation) + parseFloat(c)) * (100 / rotateRoundTo)
          ) /
          (100 / rotateRoundTo)
        }deg)`;
      })
    : (ele.style.transform ? ele.style.transform + " " : "") +
      `rotate(${
        Math.round(fixrotate(rotation) * (100 / rotateRoundTo)) /
        (100 / rotateRoundTo)
      }deg)`);
};

var fixrotate = (rad) =>
  (Math.round(rad * rotateScale * (180 / Math.PI) * (100 / rotateRoundTo)) /
    (100 / rotateRoundTo)) %
  360;
