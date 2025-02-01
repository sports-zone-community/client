import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { CustomInputProps } from "./CustomInput";

type PasswordInputProps = Omit<CustomInputProps, "inputType">;
const PasswordInput = ({
    labelTitle,
    registration,
    error,
}: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative flex flex-col h-20">
            <label className="input-label">{labelTitle}</label>
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    {...registration}
                    className="input"
                />
                {showPassword ? (
                    <EyeSlashIcon
                        className="absolute top-1/2 -translate-y-1/2 right-3 size-5 cursor-pointer"
                        onClick={() => setShowPassword(false)}
                    />
                ) : (
                    <EyeIcon
                        className="absolute top-1/2 -translate-y-1/2 right-3 size-5 cursor-pointer"
                        onClick={() => setShowPassword(true)}
                    />
                )}
            </div>
            {error && <span className="input-error">{error}</span>}
        </div>
    );
};

export default PasswordInput;
