import { chakra } from '@chakra-ui/react';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';

export interface InputSearchProps {
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  children?: ReactNode;
  bigInputSize?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  isDisabled?: boolean;
}

export function InputSearch({
  searchValue,
  setSearchValue,
  children,
  bigInputSize = false,
  autoFocus = false,
  placeholder = 'Search...',
  isDisabled = false,
}: InputSearchProps) {
  const [inputValue, setInputValue] = useState(searchValue);
  useEffect(() => {
    setInputValue(searchValue);
  }, [searchValue]);

  const submitSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchValue(inputValue);
  };

  return (
    <Wrapper data-big={bigInputSize ? '' : undefined}>
      <Form onSubmit={submitSearch}>
        <StyledInput
          data-big={bigInputSize ? '' : undefined}
          placeholder={placeholder}
          value={inputValue}
          onChange={e => {
            setInputValue(e.currentTarget.value);
          }}
          autoFocus={autoFocus}
          disabled={isDisabled}
        />
        <ChildWrapperBackground>
          <ChildWrapper>{children}</ChildWrapper>
        </ChildWrapperBackground>
        <input type="submit" style={{ display: 'none' }} />
      </Form>
    </Wrapper>
  );
}

const Wrapper = chakra('div', {
  base: {
    borderRadius: 'full',
    width: '100%',
    height: 10,
    '&[data-big]': {
      height: 12,
    },
  },
});

const Form = chakra('form', {
  base: {
    position: 'relative',
    display: 'flex',
    overflow: 'hidden',
    borderRadius: 'full',
    height: '100%',
    background: 'transparent',
    maxWidth: '725px',
  },
});

const StyledInput = chakra('input', {
  base: {
    border: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
    transitionProperty: 'common',
    transitionDuration: 'moderate',
    color: 'text.main',
    bg: 'interactive.tonal.neutral.0',
    paddingInlineEnd: '184px',
    paddingInlineStart: 5,
    fontSize: 2,
    '&[data-big]': {
      fontSize: 3,
    },
  },
});

const ChildWrapperBackground = chakra('div', {
  base: {
    position: 'absolute',
    height: '100%',
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderInlineStart: '1px solid',
    borderInlineStartColor: 'interactive.tonal.neutral.0',
    borderInlineEndRadius: 'full',
  },
});

const ChildWrapper = chakra('div', {
  base: {
    position: 'relative',
    height: '100%',
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderInlineEndRadius: 'full',
  },
});
