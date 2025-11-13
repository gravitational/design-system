import { Box, VStack } from '@chakra-ui/react';
import React from 'react';
class MyComponent extends React.Component {
    render() {
        return <VStack data-uic="MyComponent-VStack">
        <Box data-uic="MyComponent-Box">In class component</Box>
      </VStack>;
    }
}
