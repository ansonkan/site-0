<main>
  <slot />
</main>

<style lang="scss" windi:preflights:global windi:safelist:global global>
  a,
  input,
  textarea,
  button {
    transition: box-shadow 0.3s ease, color 0.3s ease, font-size 0.3s ease;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(21, 156, 228, 0.4);
    }
  }
</style>
