import { useDispatch } from "react-redux";
import { register } from "../../redux/authSlice";
import { useForm, Controller } from "react-hook-form";
import { Button, Input } from "antd";
import { useNavigate } from "react-router";

function RegisterForm() {
  const {
    setError,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const passwordWatch = watch("password");
  const onSubmit = async (data) => {
    const result = await dispatch(register(data));
    if (register.fulfilled.match(result)) {
      navigate("/");
    } else {
    }
    setError("root.serverError", {
      type: "manual",
      message: result.payload,
    });
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
        <h3>Register</h3>
        {errors.root?.serverError && (
          <p style={{ color: "red" }}>{errors.root.serverError.message}</p>
        )}
        <Controller
          name="name"
          control={control}
          rules={{ required: "Required field" }}
          render={({ field }) => <Input placeholder="Name" {...field} />}
        />
        {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
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
            validate: (value) =>
              /^(?=.*[A-Z]).{6,}$/.test(value) || "Password is too weak",
          }}
          render={({ field }) => (
            <Input.Password placeholder="password" {...field} />
          )}
        />
        {errors.password && (
          <p style={{ color: "red" }}>{errors.password.message}</p>
        )}
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: "Required field",
            validate: (value) =>
              value === passwordWatch || "Password should be same",
          }}
          render={({ field }) => (
            <Input.Password placeholder="Confirm password" {...field} />
          )}
        />
        {errors.confirmPassword && (
          <p style={{ color: "red" }}>{errors.confirmPassword.message}</p>
        )}
        <Button
          color="primary"
          variant="solid"
          type="primary"
          htmlType="submit"
        >
          Register
        </Button>
      </form>
    </div>
  );
}
export default RegisterForm;
