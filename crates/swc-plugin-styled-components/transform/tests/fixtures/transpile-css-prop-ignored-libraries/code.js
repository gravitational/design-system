// Import components from the ignored library
import { Box, styled as designStyled } from '@gravitational/design-system';
import DesignSystem from '@gravitational/design-system';

// Import styled from styled-components (should still work)
import styled from 'styled-components';

// Component directly imported from ignored library should NOT transform CSS prop
const DirectImportTest = () => {
  return <Box css={{ color: 'red' }}>This CSS prop should NOT be transformed</Box>;
};

// Component derived from ignored library using styled from ignored library
const DerivedWithIgnoredStyled = designStyled(Box, {});
const IgnoredStyledTest = () => {
  return <DerivedWithIgnoredStyled css={{ color: 'blue' }}>CSS prop should NOT be transformed</DerivedWithIgnoredStyled>;
};

// Component derived from ignored library using styled from styled-components
const DerivedWithStyledComponents = styled(Box)`
  background: yellow;
`;
const DerivedTest = () => {
  return <DerivedWithStyledComponents css={{ color: 'green' }}>CSS prop should NOT be transformed</DerivedWithStyledComponents>;
};

// Namespace import test
const NamespaceTest = () => {
  return <DesignSystem.Box css={{ color: 'purple' }}>CSS prop should NOT be transformed</DesignSystem.Box>;
};

// Regular component NOT from ignored library - CSS prop SHOULD be transformed
const RegularDiv = () => {
  return <div css={{ color: 'orange' }}>This CSS prop SHOULD be transformed</div>;
};

// Custom component NOT from ignored library - CSS prop SHOULD be transformed
const CustomComponent = styled.div`
  padding: 10px;
`;
const CustomTest = () => {
  return <CustomComponent css={{ color: 'pink' }}>This CSS prop SHOULD be transformed</CustomComponent>;
};

// Mixed case - some from ignored, some not
const MixedTest = () => {
  return (
    <>
      <Box css={{ color: 'red' }}>Should NOT transform</Box>
      <div css={{ color: 'blue' }}>SHOULD transform</div>
      <DerivedWithIgnoredStyled css={{ color: 'green' }}>Should NOT transform</DerivedWithIgnoredStyled>
      <CustomComponent css={{ color: 'yellow' }}>SHOULD transform</CustomComponent>
    </>
  );
};