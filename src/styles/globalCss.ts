import styled from "styled-components";

export const CardContainer = styled.div`
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 7px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;


export const CardTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin: 0 0 16px 0;
  font-weight: 600;
`;

export const CardHeader = styled.div`
display: flex;
justify-content: space-between;
align-item: center;
margin-bottom:10px;
`