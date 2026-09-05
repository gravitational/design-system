import { c as _c } from "react/compiler-runtime";
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

// CSS arrays expose interpolation dependencies to the compiler before SWC runs.
export function CompiledCss(t0) {
	const $ = _c(5);
	const { active, maxWidth } = t0;
	let t1;
	if ($[0] !== active) {
		t1 = (props) => active ? props.theme.colors.levels.elevated : "transparent";
		$[0] = active;
		$[1] = t1;
	} else {
		t1 = $[1];
	}
	let t2;
	if ($[2] !== maxWidth || $[3] !== t1) {
		t2 = <div css={[
			"max-width: ",
			maxWidth,
			"px; background-color: ",
			t1,
			";"
		]}>compiled array</div>;
		$[2] = maxWidth;
		$[3] = t1;
		$[4] = t2;
	} else {
		t2 = $[4];
	}
	return t2;
}
