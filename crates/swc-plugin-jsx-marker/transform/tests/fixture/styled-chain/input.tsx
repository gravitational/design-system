import { Box, chakra } from '@chakra-ui/react';

const Card = chakra(Box, {
  base: {
    padding: '20px',
  },
});

const StyledCard = chakra(Card, { base: { background: 'blue' } });

function App() {
  return (
    <div>
      <Box>Plain Box</Box>
      <Card>Card Component</Card>
      <StyledCard>Styled Card</StyledCard>
    </div>
  );
}
