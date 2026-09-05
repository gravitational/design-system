import _styled from "styled-components";
export function ExistingString() {
    // Preserve the existing string and evaluate its interpolation only once.
    const cssText = `color: ${nextColor()};`;
    return <_StyledDiv data-css={cssText} $_css={cssText}/>;
}
var _StyledDiv = _styled("div")`${(p)=>p.$_css}`;
