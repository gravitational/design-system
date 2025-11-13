import { Box, chakra } from '@chakra-ui/react';

const Card = chakra(Box, { base: { padding: '20px' } });

const StyledCard = chakra(Card, { base: { background: 'blue' } });

const SuperStyledCard = chakra(StyledCard, {
  base: { border: '1px solid red' },
});

function App() {
  return (
    <div>
      <Box>Plain Box</Box>
      <Card>Card Component</Card>
      <StyledCard>Styled Card</StyledCard>
      <SuperStyledCard>Super Styled Card</SuperStyledCard>
    </div>
  );
}
