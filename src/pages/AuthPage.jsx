import LoginForm from "../features/auth/LoginForm";
import RegisterForm from "../features/auth/RegisterForm";
import { Button } from "antd";

import { useState } from "react";
function AuthPage() {
  const [isMode, setIsMode] = useState(true);
  const handleClick = () => {
    setIsMode((prevMode) => !prevMode);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        alignItems: "center",
      }}
    >
      {isMode ? <LoginForm /> : <RegisterForm />}
      <Button onClick={handleClick}>
        {isMode ? "I don't have an account" : "I have an account"}
      </Button>
    </div>
  );
}
export default AuthPage;
