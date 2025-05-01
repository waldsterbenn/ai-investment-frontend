<template>
  <div class="card">
    <header class="card-header">
      <slot name="icon"></slot>
      <slot name="heading"></slot>
    </header>
    <div class="card-body">
      <slot name="content" class="card-text"></slot>
    </div>
  </div>
</template>

<style scoped></style>
