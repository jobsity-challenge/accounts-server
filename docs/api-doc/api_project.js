define({
  "name": "accounts-server-doc",
  "version": "1.0.0",
  "description": "JobSity Challenge Account Server API Documentation",
  "title": "JobSity Challenge Account Server API Documentation",
  "url": "https://account.example.com",
  "header": {
    "title": "Account Server API",
    "content": "<h1>Account Management Server</h1>\n<p>Account Management Server is an small microservice developed to allow in a simple way register/login users and authenticate request on external services to solve the JobSity Challenge.</p>\n<p>The idea behind this microservice is the OAuth2 standard, but this isn't OAuth2 implementation. The service handle three type of users, and for each type of user handle a virtual role to allow external services restrict access by user type. In this implementation the generated access token don't have expiration time and its only relationed with the account.</p>\n<h2>Installation of the service</h2>\n<ul>\n<li>Clone the repository</li>\n</ul>\n<pre class=\"prettyprint\">git clone https://gitlab.com/jobsity1/challenge/accounts-server.git\n</code></pre>\n<ul>\n<li>Install dependencies</li>\n</ul>\n<pre class=\"prettyprint\">cd accounts-server\nnpm install\n</code></pre>\n<ul>\n<li>Build the project</li>\n</ul>\n<pre class=\"prettyprint\">npm run build\n</code></pre>\n<ul>\n<li>Setup initial database (see next section for environment variables)</li>\n</ul>\n<pre class=\"prettyprint\">npm run setup\n</code></pre>\n<p>Initial database configuration generate by defaul five users:</p>\n<ul>\n<li>[User: jdoe@challenge.com; Password: challenge*2020] (Administrator)</li>\n<li>[User: janedoe@challenge.com; Password: challenge*2020]</li>\n<li>[User: chat@challenge.com; Password: challenge*2020]</li>\n<li>[User: web@challenge.com; Password: challenge*2020]</li>\n<li>[User: bot@challenge.com; Password: challenge*2020]</li>\n</ul>\n<h2>Running the service</h2>\n<p>The service can be runned directly from the command line with:</p>\n<pre class=\"prettyprint lang-bash\">npm start\n</pre>\n<p>or it can be build and runned watching for file changes</p>\n<pre class=\"prettyprint\">npm run dev\n</code></pre>\n<p>To run the service there are some environment variables that can be used to configure it:</p>\n<ul>\n<li><code>LOG</code>: Set the vebose level of the service debugger, allowed values are: error, warn, info, http, verbose, debug, silly (Default: debug)</li>\n<li><code>PORT</code>: Set the running port for the HTTP server (Default: 3000)</li>\n<li><code>INTERFACE</code>: Set the HTTP server listening interface (Default: 127.0.0.1)</li>\n<li><code>ENV</code>: Set the service running mode, allowd values are: dev, production (Default: dev)</li>\n<li><code>INSTANCES</code>: Set the number o workers runing into the cluster (Default: 1)</li>\n<li><code>MONGODB_URI</code>: Set the MongoDB database connection URI (Default: mongodb://127.0.0.1:27017/accounts_srv)</li>\n</ul>\n<h2>Documentation</h2>\n<p>The project its distributed with a <code>docs</code> folder. This folder contains the Postman Collection with examples for each request and the API Documentation generated with <code>apidoc</code>. To regenerate the documentation run the following command:</p>\n<pre class=\"prettyprint lang-bash\">npm run apidoc\n</pre>\n"
  },
  "template": {
    "withCompare": false,
    "withGenerator": true
  },
  "sampleUrl": false,
  "defaultVersion": "0.0.0",
  "apidoc": "0.3.0",
  "generator": {
    "name": "apidoc",
    "time": "2020-08-07T08:39:23.771Z",
    "url": "http://apidocjs.com",
    "version": "0.24.0"
  }
});
