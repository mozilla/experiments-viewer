module.exports = {
  'Page title is correct': function(browser) {
    browser.url(browser.launchUrl)
           .verify.title('Firefox Experiments Viewer')
           .end();
  },
};
