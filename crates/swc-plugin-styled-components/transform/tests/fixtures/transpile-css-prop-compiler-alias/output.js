import { c as _c } from "react/compiler-runtime";
import { Box, Flex } from 'design';
import { Box as DesignSystemBox } from '@gravitational/design-system';
import Icons from './icons';
import styled from 'styled-components';
const Lines = styled(Box)`
  padding: 4px;
`;
var _StyledLines = styled(Lines)`color: red;`;
// The React Compiler aliases module-level components into function-local temporaries and uses those as
// JSX tags. The styled component created for the css prop still has to live at module scope, so the
// alias is resolved back to the component it names.
export function Compiled({ lines, maxHeight }) {
    const T0 = Box;
    const T1 = Lines;
    const T2 = DesignSystemBox;
    const T3 = Icons.Foo;
    const t0 = lines.map((line)=><div key={line}>{line}</div>);
    return <_StyledBox maxHeight={maxHeight}>
      <_StyledLines>{t0}</_StyledLines>
      <T2 css={{
        color: 'red'
    }}>ignored library, not transformed</T2>
      <_StyledIconsFoo/>
    </_StyledBox>;
}
export function Chained() {
    const T0 = Flex;
    const T1 = T0;
    return <_StyledFlex/>;
}
// CSS arrays expose interpolation dependencies to the compiler before SWC runs.
export function CompiledCss(t0) {
    const $ = _c(5);
    const { active, maxWidth } = t0;
    let t1;
    if ($[0] !== active) {
        t1 = (props)=>active ? props.theme.colors.levels.elevated : "transparent";
        $[0] = active;
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== maxWidth || $[3] !== t1) {
        t2 = <_StyledDiv $_css={[
            "max-width: ",
            maxWidth,
            "px; background-color: ",
            t1,
            ";"
        ]}>compiled array</_StyledDiv>;
        $[2] = maxWidth;
        $[3] = t1;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    return t2;
}
var _StyledBox = styled(Box)({
    position: 'relative'
});
var _StyledFlex = styled(Flex)({
    display: 'flex'
});
var _StyledIconsFoo = styled(Icons.Foo)`margin: 0;`;
var _StyledDiv = styled("div")`${(p)=>p.$_css}`;
