type Booleanish = boolean | 'true' | 'false';

export function dataAttr(condition: boolean | undefined) {
  return (condition ? '' : undefined) as Booleanish;
}
