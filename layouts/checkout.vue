<template>
  <div id="app">
    <div id="header-target"></div>
    <slot name="header">
      <header-lite> </header-lite>
    </slot>
    <main>
      <client-only>
        <slot></slot>
      </client-only>
    </main>
    <footer-main></footer-main>
    <navbar-bottom class="md:hidden"></navbar-bottom>
    <Notifications />
  </div>
</template>
<style lang="scss">
main {
  @apply container mx-auto flex-grow;
}

#app {
  @apply flex min-h-screen flex-col;
}
</style>
