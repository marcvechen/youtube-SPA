import { useDispatch } from "react-redux";
import { login } from "../../redux/authSlice";
import { useForm, Controller } from "react-hook-form";
import { Button, Input } from "antd";
import { useNavigate } from "react-router";
function LoginForm() {
  const {
    setError,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      navigate("/");
    } else {
      setError("root.serverError", {
        type: "manual",
        message: result.payload,
      });
    }
  };
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <form
        style={{
          margin: 150,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: 15,
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3>Login</h3>
        {errors.root?.serverError && (
          <p style={{ color: "red" }}>{errors.root.serverError.message}</p>
        )}
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Required field",
            pattern: {
              value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
              message: "Write corrent an email",
            },
          }}
          render={({ field }) => <Input placeholder="Email" {...field} />}
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Required field",
          }}
          render={({ field }) => (
            <Input.Password placeholder="password" {...field} />
          )}
        />

        {errors.password && (
          <p style={{ color: "red" }}>{errors.password.message}</p>
        )}
        <Button
          color="primary"
          variant="solid"
          type="primary"
          htmlType="submit"
        >
          Login
        </Button>
      </form>
    </div>
  );
}
export default LoginForm;
