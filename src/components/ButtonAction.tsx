import React from 'react';
import { Button } from "antd";

interface InteractiveButton {
  label?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  htmlType?: "button" | "submit" | "reset";
  type?: "primary" | "dashed" | "link" | "text" | "default";
  style?: React.CSSProperties;
  color?: "red" | "green" | "blue" | "pink" | "black" | 'gray';
  size?: "small" | "middle" | "large";
  backgroundColor?: string;
  icon?:any;
  form?:any;
}

const ButtonAction: React.FC<InteractiveButton> = ({
  style = {},
  label,
  onClick,
  disabled = false,
  loading = false,
  htmlType = 'submit',
  type = 'primary',
  size = 'middle',
  backgroundColor,
  color,
  icon,
  form
}) => {
  const buttonStyle = {
    width: '100%',
    backgroundColor: backgroundColor ? backgroundColor : '#001529', // จัดการสีถ้ามีการส่งค่าเข้ามา
    ...style,
    color: color? color : '#fff', // จัดการสีข้อความถ้ามีการส่งค่าเข้ามา
  };

  return (
    <>
      <Button
        type={type}
        htmlType={htmlType}
        onClick={onClick}
        style={buttonStyle}
        disabled={disabled || loading}
        loading={loading}
        size={size}
        className="login-form-button"
        icon={icon}
        form={form}
      >
        {loading ? 'ກຳລັງດຳເນີນການ' : label}
      </Button>
    </>
  );
};

export default ButtonAction;
