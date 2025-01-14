import { SignUp } from "@clerk/clerk-react";

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center  ">
      <SignUp signInUrl="/login" />
    </div>
  );
};

export default RegisterPage;
