<template>
  <div class="card">
    <header class="card-header">
      <slot name="icon"></slot>
      <span class="me-1"></span>
      <slot name="heading"></slot>
    </header>
    <div class="card-body">
      <slot name="content" class="card-text"></slot>
    </div>
    <!-- <div class="card-footer text-end">
      <slot name="actionbutton"></slot>
    </div> -->
  </div>
</template>

<style scoped></style>
