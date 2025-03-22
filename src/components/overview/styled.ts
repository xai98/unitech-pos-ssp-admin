import styled from "styled-components";
import { Card } from "antd";

export const Container = styled.div`
  padding: 16px;
`;

export const FilterCard = styled(Card)`
  margin-bottom: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const StatCard = styled(Card)`
  transition: all 0.3s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

