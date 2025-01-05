import googleSvg from "../../../assets/google.svg";
import facebookSvg from "../../../assets/facebook.svg";
import fansImage from "../../../assets/fans-charring.png";
import AuthIcon from "../../../components/auth/AuthIcon.tsx";
import { Link } from "react-router-dom";
import RegisterForm from "./RegisterForm.tsx";

const Register = () => {
    return (
        <div className="flex flex-row h-screen">
            <div className="flex basis-1/2 gap-8 justify-center items-center">
                <div className="flex flex-col w-104 justify-center items-center gap-8">
                    <span className="text-white text-4xl">
                        Create an account
                    </span>
                    <RegisterForm />
                    <div className="flex flex-row gap-4 w-full h-12">
                        <AuthIcon icon={googleSvg} title="Google" />
                        <AuthIcon icon={facebookSvg} title="Facebook" />
                    </div>
                </div>
                <span className="absolute bottom-0 left-0 mb-6 ml-6 text-gray-500">
                    Have an account?{" "}
                    <Link
                        to="/login"
                        className="text-white cursor-pointer hover:text-gray-300"
                    >
                        Sign In
                    </Link>
                </span>
            </div>
            <div className="basis-1/2">
                <img
                    src={fansImage}
                    className="w-full h-full p-6 rounded-6xl ml-auto"
                />
            </div>
        </div>
    );
};

export default Register;
