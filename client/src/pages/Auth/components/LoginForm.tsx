import { useState, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/input/FloatingLabelInput";
import type { LoginCredentialsErrorFields } from "../../../interfaces/AuthInterface";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
    message: (message: string, isFailed: boolean) => void
}

const LoginForm: FC<LoginFormProps> = ({ message }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState<LoginCredentialsErrorFields>({})

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async (e: FormEvent) => {
        try {
            e.preventDefault()

            setIsLoading(true)

            await login(username, password)
            navigate('/genders')
        } catch (error: any) {
            if (error.response?.status === 401) {
                setErrors({})
                const text = error.response.data?.message
                message(typeof text === "string" ? text : "Login failed.", true)
            } else if (error.response?.status === 422) {
                setErrors(error.response.data.errors ?? {})
            } else {
                console.error("Unexpected error occured during logging user in:", error)
                // No error.response: usually network/CORS — still surface feedback in the toast
                message(
                    typeof error?.message === "string" && error.message
                        ? error.message
                        : "Could not reach the server."
                    , true)
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleLogin} noValidate>
                <div className="mb-4">
                    <FloatingLabelInput
                        label="Username"
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoFocus
                        errors={errors.username}
                    />
                </div>
                <div className="mb-4">
                    <FloatingLabelInput
                        label="Password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        errors={errors.password}
                    />
                </div>
                <SubmitButton className="w-full" label="Sign in" loading={isLoading} loadingLabel="Signing in..." />
            </form>
        </>
    );
};

export default LoginForm;
