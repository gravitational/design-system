import { Box, Flex } from 'design';
import { Box as DesignSystemBox } from '@gravitational/design-system';
import Icons from './icons';
import styled from 'styled-components';

const Lines = styled(Box)`
  padding: 4px;
`;

// The React Compiler aliases module-level components into function-local temporaries and uses those as
// JSX tags. The styled component created for the css prop still has to live at module scope, so the
// alias is resolved back to the component it names.
export function Compiled({ lines, maxHeight }) {
  const T0 = Box;
  const T1 = Lines;
  const T2 = DesignSystemBox;
  const T3 = Icons.Foo;
  const t0 = lines.map(line => <div key={line}>{line}</div>);
  return (
    <T0 css={{ position: 'relative' }} maxHeight={maxHeight}>
      <T1 css={`color: red;`}>{t0}</T1>
      <T2 css={{ color: 'red' }}>ignored library, not transformed</T2>
      <T3 css={`margin: 0;`} />
    </T0>
  );
}

export function Chained() {
  const T0 = Flex;
  const T1 = T0;
  return <T1 css={{ display: 'flex' }} />;
}

// A css prop template the compiler hoisted ahead of the JSX. Its function interpolation has to reach
// styled-components as a function, not as the text `_temp` stringifies to.
export function HoistedTemplate({ maxWidth }) {
  const t0 = `
    max-width: ${maxWidth}px;
    background-color: ${_temp};
  `;
  return <div css={t0}>hoisted template</div>;
}

function _temp(props) {
  return props.theme.colors.levels.elevated;
}
