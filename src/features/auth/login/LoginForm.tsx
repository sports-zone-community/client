import CustomInput from "../../../components/auth/CustomInput.tsx";
import { InputType } from "../../../shared/enums/input-type.enum.ts";

const LoginForm = () => {
    return (
        <form className="flex flex-col gap-y-4 w-full">
            <CustomInput labelTitle="Username" inputType={InputType.TEXT} />
            <div className="flex flex-col">
                <CustomInput
                    labelTitle="Password"
                    inputType={InputType.PASSWORD}
                ></CustomInput>
                <span className="ml-auto text-gray-500 text-sm mt-1 cursor-pointer hover:text-gray-700 transition-colors">
                    Forgot password?
                </span>
            </div>
            <button className="bg-blue-500 w-full mt-10 rounded-3xl text-white h-12 hover">
                Login
            </button>
        </form>
    );
};

export default LoginForm;
