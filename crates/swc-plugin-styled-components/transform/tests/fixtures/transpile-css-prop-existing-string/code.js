export function ExistingString() {
  // Preserve the existing string and evaluate its interpolation only once.
  const cssText = `color: ${nextColor()};`;
  return <div css={cssText} data-css={cssText} />;
}
