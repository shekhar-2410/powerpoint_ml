import PropTypes from "prop-types";
import { Table, Box } from "@chakra-ui/react";

const SlideTable = ({ headers = [], rows = [] }) => {
  if (!headers.length || !rows.length) return null;

  return (
    <Box
      overflowX="auto"
      mt={8}
      borderRadius="xl"
      p={4}
      bg="rgba(255, 255, 255, 0.06)"
      border="1px solid rgba(255, 255, 255, 0.2)"
      backdropFilter="blur(10px)"
      boxShadow="lg"
    >
      <Table.Root>
        <Table.Header>
          <Table.Row>
            {headers.map((header, idx) => (
              <Table.ColumnHeader
                key={idx}
                bg="rgba(255,255,255,0.12)"
                color="cyan"
                fontSize="md"
                textTransform="uppercase"
                py={3}
                px={4}
                borderBottom="1px solid rgba(255, 255, 255, 0.2)"
              >
                {header}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {rows.map((row, rowIndex) => (
            <Table.Row key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <Table.Cell
                  key={cellIndex}
                  bg="rgba(255,255,255,0.06)"
                  color="white"
                  py={3}
                  px={4}
                  fontSize="sm"
                  borderBottom="1px solid rgba(255, 255, 255, 0.15)"
                >
                  {cell}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

SlideTable.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
};
export default SlideTable;
