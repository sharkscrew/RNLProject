import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/input/FloatingLabelInput";

function LoginForm() {
    return (
        <form>
            <div className="mb-4">
                <FloatingLabelInput
                    label="Username"
                    type="text"
                    name="username"
                    required
                    autoFocus
                />
            </div>
            <div className="mb-4">
                <FloatingLabelInput
                    label="Password"
                    type="password"
                    name="password"
                    required
                />
            </div>
            <SubmitButton className="w-full" label="Sign in" />
        </form>
    );
}

export default LoginForm;
