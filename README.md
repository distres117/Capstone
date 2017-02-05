[Live site](http://thecrawlspace.io/)

### Summary
This is a fullstack javascript application designed for interactively scraping web sites that do not offer an api.  The goal is to empower the user to create personal apis based on any web page's content. Once captured, data can be visualized using the charting tools.  Charts can be saved and viewed in a dashboard-like interface.  The tool is designed primarily as a proof-of-concept. 

### Highlights
  - Server-side scraping and task-scheduling mechanics
    - Content is scraped using Phantom.js.  The page is accessed as in a 'headless' browser, with the ability to interact with the DOM
    - Content can be scraped on an ongoing basis as scheduled tasks that run at any interval.
  - Interactive element selection
    - Targeted sites are presented as framed content and in which the user can direcly access the DOM and underlying data.
  

<h3>CrawlSpace</h3>
<h4>A tool for interactively scraping and visualizing the web</h4>
<ol>
  <li>fork or clone this repo, install dependencies using npm</li>
  <li>You'll also need a local install of MongoDb</li>
  <li>Start mongoDb prior to running</li>
  <li>To use the job runner, you'll need to start it as a separate process</li>
</ol>
