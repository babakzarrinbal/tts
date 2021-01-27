export function slideToOpen() {
  //eslint-disable-next-line
  document.body.onmousedown = document.body.ontouchstart = function(e, ev) {
    let target = e.target.closest(".bzsto");
    if (!target) return;
    if (
      !target.style.transform ||
      !target.style.transform.includes("translate")
    )
      target.style.transform += "translate(0px,0px)";
    target.bzOrgTransition = target.style.transition;
    let container = target.parentElement.closest(".bzstoContainer");
    let x = e.clientX || e.touches[0].clientX;
    let containerOrg = cumulativeOffset(container, 7);
    let targetOrg = cumulativeOffset(target);
    let tx;
    var moveFunc = (e) => {
      tx = (e.clientX || e.touches[0].clientX) - x;
      if (targetOrg.left + tx < containerOrg.left) tx=containerOrg.left - targetOrg.left;
      if (targetOrg.right + tx > containerOrg.right) tx=containerOrg.right-targetOrg.right;
      target.style.transform = target.style.transform.replace(
        /translate.*?\)/,
        `translate(${tx}px, ${0}px)`
      );
    };
    document.body.addEventListener("touchmove", moveFunc, { passive: false });
    document.body.onmousemove = moveFunc;
    document.body.onmouseup = document.body.ontouchend = () => {
      document.body.removeEventListener("touchmove", moveFunc);
      document.body.onmousemove = document.body.onmouseup = document.body.ontouchend = null;
      if (targetOrg.right + tx === containerOrg.right) {
        const placedEvent = new CustomEvent("unlock", {
          bubbles: false,
        });
        target.dispatchEvent(placedEvent);
      } else {
        target.style.transform = target.style.transform.replace(
          /translate.*?\)/,
          `translate(${0}px, ${0}px)`
        );
        target.style.transition = "0.3s";
        target.addEventListener(
          "transitionend",
          () => (target.style.transition = target.bzOrgTransition),
          { once: true }
        );
      }
    };
  };
  var cumulativeOffset = function(element, padMarg=0) {
    let orgEle = element;
    let top = 0,
      left = 0;
    do {
      top += element.offsetTop || 0;
      left += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);
    return {
      left: left + padMarg,
      top: top + padMarg,
      right: orgEle.offsetWidth + left - padMarg,
      bottom: orgEle.offsetHeight + top - padMarg,
    };
  };
}
