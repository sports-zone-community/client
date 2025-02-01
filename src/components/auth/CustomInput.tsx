import { InputType } from "../../shared/enums/input-type.enum.ts";
import PasswordInput from "./PasswordInput.tsx";
import { UseFormRegisterReturn } from "react-hook-form";

export interface CustomInputProps {
    labelTitle: string;
    inputType: InputType;
    registration: UseFormRegisterReturn;
    error?: string;
}

const CustomInput = ({
    labelTitle,
    inputType,
    registration,
    error,
}: CustomInputProps) => {
    if (inputType === InputType.PASSWORD) {
        return (
            <PasswordInput
                labelTitle={labelTitle}
                registration={registration}
                error={error}
            />
        );
    }

    return (
        <div className="flex flex-col h-20">
            <label className="input-label">{labelTitle}</label>
            <input type={inputType} {...registration} className="input" />
            {error && <span className="input-error">{error}</span>}
        </div>
    );
};

export default CustomInput;
