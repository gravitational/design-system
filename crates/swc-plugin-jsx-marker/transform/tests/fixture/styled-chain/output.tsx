import { Box, chakra } from '@chakra-ui/react';
const Card = chakra(Box, {
    base: {
        padding: '20px'
    }
});
const StyledCard = chakra(Card, {
    base: {
        background: 'blue'
    }
});
function App() {
    return <div>
      <Box data-uic="App-Box">Plain Box</Box>
      <Card data-uic="App-Card-Box">Card Component</Card>
      <StyledCard data-uic="App-StyledCard-Card">Styled Card</StyledCard>
    </div>;
}
