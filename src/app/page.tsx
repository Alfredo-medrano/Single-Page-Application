"use client"; 

import AuthForm from "./components/AuthForm"; 
const HomePage = () => {
  return (
    <div>
      <h1>Login</h1>
      <AuthForm type="login" /> 
    </div>
  );
};

export default HomePage;
