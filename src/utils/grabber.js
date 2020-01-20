let grabber = async (url, start, end) => {
  let ref,
    link,
    title,
    desel,
    description,
    rateel,
    rate,
    stories = [];
  for (let i = start; i <= end; i++) {
    text = await window.fetch(url + "/" + i + "-page").then(r => r.text());
    text = text
      .replace(/<script([\S\s]*?)>([\S\s]*?)<\/script>/gi, "") // remove script tags
      .replace(/<style([\S\s]*?)>([\S\s]*?)<\/style>/gi, ""); // remove style tags
    result = text.match(/<div class="b-story-list"[^>]*>(.|[\n\r])*<\/div>/)[0];
    div = document.createElement("div");
    div.innerHTML = result;
    for (story of div.children[0].children) {
      ref = story.querySelector("h3 a");
      if (!ref) continue;
      link = ref.href;
      title = ref.innerText;
      desel = story.querySelector(".b-sli-description");
      description = desel ? desel.innerText : "";
      rateel = story.querySelector(".b-sli-rating");
      rate = rateel ? parseFloat(rateel.innerText) : 0;
      stories.push({ title, link, description, rate });
    }
  }
  return JSON.stringify(stories);
};
