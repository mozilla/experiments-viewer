const http = require('http');
const url = require('url');


const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  let redirectTarget = 'https://firefox-test-tube.herokuapp.com';
  const query = url.parse(req.url).query;

  // Redirect to corresponding expeirment pages on Test Tube
  if (query) {
    redirectTarget += `/experiments/${query.match(/ds=(.*?)(&|$)/)[1]}`;
  }

  res.writeHead(301, { Location: redirectTarget });
  res.end();
});

server.listen(port, () => console.log(`Listening on port ${port}...`));
