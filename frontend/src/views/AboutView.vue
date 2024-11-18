<template>
  <div class="container text-left w-75">
    <div class="row justify-content-md-center">
      <div class="col col-lg-2">
      </div>
      <div class="col col-md-auto">
        <div class="card">
          <header class="card-header">
            <h3 class="card-title">About this app</h3>
          </header>
          <div class="card-body">
            <blockquote class="blockquote">
              <span class="card-text">
                You can analyse the companies stocks and use the reports as you see fit.
              </span>
            </blockquote>
            <h4>Features:</h4>
            <ol>
              <li>Techical Analysis: LLM will analyse a stock's performance and evaluate it's near-term price direction,
                based on technical indicators.</li>
              <li>You can save an analysis report as a Markdown file (.md)</li>
            </ol>
          </div>
          <footer class="card-footer text-end">

          </footer>
        </div>
      </div>
      <div class="col col-lg-2">
      </div>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
