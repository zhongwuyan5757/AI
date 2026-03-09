const news = JSON.parse(require('fs').readFileSync('data/news.json','utf8'));
news.forEach((n, i) => {
  const isEn = /[a-zA-Z]{4,}/.test(n.title);
  const needsTranslation = isEn && (!n.titleZh || /[a-zA-Z]{5,}/.test(n.titleZh));
  if (needsTranslation) {
    console.log(n.id + '|' + n.title.substring(0, 120));
  }
});
