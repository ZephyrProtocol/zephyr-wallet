// Library Imports
import React from "react";

// Relative Imports
import { Container, Row, Key, Value } from "./styles";

const TransferSummary = ({
  transferAsset,
  transferAmount,
  paymentId,
  recipientAddress
}) => {
  const first = recipientAddress.substring(0, 4);
  const last = recipientAddress.substring(recipientAddress.length - 4);
  const truncated = first + "...." + last;
  return (
    <Container>
      <Row>
        <Key>Transfer Asset</Key>
        <Value>{transferAsset}</Value>
      </Row>
      <Row>
        <Key>Transfer Amount</Key>
        <Value>{transferAmount}</Value>
      </Row>
      <Row>
        <Key>Recipient Address</Key>
        <Value>{recipientAddress === "--" ? "--" : truncated}</Value>
      </Row>
      <Row>
        <Key>Payment ID</Key>
        <Value>{paymentId}</Value>
      </Row>
    </Container>
  );
};

export default TransferSummary;