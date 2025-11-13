// Import components from the ignored library
import { Box, styled as designStyled } from '@gravitational/design-system';
import DesignSystem from '@gravitational/design-system';
// Import styled from styled-components (should still work)
import styled from 'styled-components';
// Component directly imported from ignored library should NOT transform CSS prop
const DirectImportTest = ()=>{
    return <Box css={{
        color: 'red'
    }}>This CSS prop should NOT be transformed</Box>;
};
// Component derived from ignored library using styled from ignored library
const DerivedWithIgnoredStyled = designStyled(Box, {});
const IgnoredStyledTest = ()=>{
    return <DerivedWithIgnoredStyled css={{
        color: 'blue'
    }}>CSS prop should NOT be transformed</DerivedWithIgnoredStyled>;
};
// Component derived from ignored library using styled from styled-components
const DerivedWithStyledComponents = styled(Box)`
  background: yellow;
`;
var _StyledDerivedWithStyledComponents = styled(DerivedWithStyledComponents)({
    color: 'green'
});
const DerivedTest = ()=>{
    return <_StyledDerivedWithStyledComponents>CSS prop should NOT be transformed</_StyledDerivedWithStyledComponents>;
};
// Namespace import test
const NamespaceTest = ()=>{
    return <DesignSystem.Box css={{
        color: 'purple'
    }}>CSS prop should NOT be transformed</DesignSystem.Box>;
};
// Regular component NOT from ignored library - CSS prop SHOULD be transformed
const RegularDiv = ()=>{
    return <_StyledDiv>This CSS prop SHOULD be transformed</_StyledDiv>;
};
// Custom component NOT from ignored library - CSS prop SHOULD be transformed
const CustomComponent = styled.div`
  padding: 10px;
`;
var _StyledCustomComponent2 = styled(CustomComponent)({
    color: 'yellow'
});
var _StyledCustomComponent = styled(CustomComponent)({
    color: 'pink'
});
const CustomTest = ()=>{
    return <_StyledCustomComponent>This CSS prop SHOULD be transformed</_StyledCustomComponent>;
};
// Mixed case - some from ignored, some not
const MixedTest = ()=>{
    return <>
      <Box css={{
        color: 'red'
    }}>Should NOT transform</Box>
      <_StyledDiv2>SHOULD transform</_StyledDiv2>
      <DerivedWithIgnoredStyled css={{
        color: 'green'
    }}>Should NOT transform</DerivedWithIgnoredStyled>
      <_StyledCustomComponent2>SHOULD transform</_StyledCustomComponent2>
    </>;
};
var _StyledDiv = styled("div")({
    color: 'orange'
});
var _StyledDiv2 = styled("div")({
    color: 'blue'
});
