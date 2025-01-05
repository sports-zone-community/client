import CustomInput from "../../../components/auth/CustomInput.tsx";
import { InputType } from "../../../shared/enums/input-type.enum.ts";
import { useAuth } from "../../../shared/hooks/useAuth.ts";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Popup from "../../../components/common/Popup.tsx";

const registerSchema = z
    .object({
        fullName: z.string().min(2, "Full name is required"),
        username: z.string().min(3, "Username must be at least 3 characters"),
        email: z.string().email("Invalid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /^(?=.*[A-Za-z])(?=.*\d)/,
                "Password must contain letters and numbers"
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type FormData = z.infer<typeof registerSchema>;

const RegisterForm = () => {
    const navigate = useNavigate();
    const { register: registerUser, isLoading } = useAuth();
    const [popupMessage, setPopup] = useState<string>("");
    const [isSuccessful, setIsSuccessful] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty, isValid },
    } = useForm<FormData>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: FormData) => {
        const { confirmPassword, ...registerData } = data;
        const response = await registerUser(registerData);

        if (!response.success) {
            setPopup("Registration failed. Please try again");
            setIsSuccessful(false);
        } else {
            setPopup("Registration successful. You can now login");
            setIsSuccessful(true);
        }
    };

    const handlePopupClose = () => {
        setPopup("");
        if (isSuccessful) {
            navigate("/login");
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-y-3 w-full"
            >
                <CustomInput
                    labelTitle="Full Name"
                    inputType={InputType.TEXT}
                    registration={register("fullName")}
                    error={errors.fullName?.message}
                />
                <CustomInput
                    labelTitle="Username"
                    inputType={InputType.TEXT}
                    registration={register("username")}
                    error={errors.username?.message}
                />
                <CustomInput
                    labelTitle="Email"
                    inputType={InputType.EMAIL}
                    registration={register("email")}
                    error={errors.email?.message}
                />
                <CustomInput
                    labelTitle="Password"
                    inputType={InputType.PASSWORD}
                    registration={register("password")}
                    error={errors.password?.message}
                />
                <CustomInput
                    labelTitle="Confirm password"
                    inputType={InputType.PASSWORD}
                    registration={register("confirmPassword")}
                    error={errors.confirmPassword?.message}
                />
                <button
                    type="submit"
                    disabled={!isDirty || !isValid || isLoading}
                    className="bg-blue-500 w-full mt-2 rounded-3xl text-white h-12 hover disabled:bg-blue-300"
                >
                    Register
                </button>
            </form>
            {popupMessage && (
                <Popup message={popupMessage} onClose={handlePopupClose} />
            )}
        </>
    );
};

export default RegisterForm;
