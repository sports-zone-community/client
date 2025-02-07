import CustomInput from "../CustomInput.tsx";
import { InputType } from "../../../shared/enums/input-type.enum.ts";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../../shared/hooks/useAuth.ts";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: { isDirty, isValid, errors },
    } = useForm<FormData>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
    });
    const { login, isLoading } = useAuth();

    return (
        <>
            <form
                onSubmit={handleSubmit(login)}
                className="flex flex-col gap-y-4 w-full"
            >
                <CustomInput
                    labelTitle="Email"
                    inputType={InputType.EMAIL}
                    registration={register("email")}
                    error={errors.email?.message}
                />
                <div className="flex flex-col">
                    <CustomInput
                        labelTitle="Password"
                        inputType={InputType.PASSWORD}
                        registration={register("password")}
                        error={errors.password?.message}
                    ></CustomInput>
                    <span className="ml-auto text-gray-500 text-sm mt-1 cursor-pointer hover:text-gray-700 transition-colors">
                        Forgot password?
                    </span>
                </div>
                <button
                    type="submit"
                    disabled={!isDirty || !isValid || isLoading}
                    className="bg-blue-500 w-full mt-2 rounded-3xl text-white h-12 hover disabled:bg-blue-300"
                >
                    Login
                </button>
            </form>
        </>
    );
};

export default LoginForm;
