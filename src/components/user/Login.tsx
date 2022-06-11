import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  styled,
  Typography,
} from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Anchor } from ".";
import { DrawerState, LoginForm, User } from "../../commons/Types";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { Close, Visibility, VisibilityOff } from "@mui/icons-material";
import { SnackBarAction } from "../../commons/Alert";
import AuthenApi from "../../services/api/authen";
import { Link } from "react-router-dom";
import { useWebStore } from "../../providers/WebStoreProvider";

const StyledFormControl = styled(FormControl)({
  "&& fieldset": {
    // border: "3px solid rgb(11, 176, 226, 0.5)",
    border: "1px solid #9e9e9e",
  },
  "&:hover": {
    "&& fieldset": {
      border: "2px solid rgb(11, 176, 226, 0.5)",
    },
    "&& label": {
      color: "rgb(11, 176, 226)",
    },
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "2px solid rgb(11, 176, 226, 0.5) !important",
  },
  "& label": {
    color: "#9e9e9e",
    fontSize: "14px",
    "&.Mui-focused": {
      color: "rgb(11, 176, 226)",
    },
  },
});

const defaultValues = {
  username: "",
  password: "",
};

export const LoginDrawer: FC<{
  anchor: Anchor,
  drawerState: DrawerState,
  setDrawerState: React.Dispatch<React.SetStateAction<DrawerState>>,
}> = ({
  anchor,
  drawerState,
  setDrawerState,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  }).required();
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });
  const { enqueueSnackbar } = useSnackbar();
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const {
    modifyWebStore,
  } = useWebStore();

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleLogin: SubmitHandler<LoginForm> = (data) => {
    AuthenApi.Login(data)
      .then((res) => {
        enqueueSnackbar(`Login successfully. Welcome ${res.data.username}`, {
          variant: "success",
          autoHideDuration: 4000,
          action: SnackBarAction,
        });
        setDrawerState({
          ...drawerState,
          logIn: {
            ...drawerState["logIn"],
            [anchor]: false,
          },
        });

        localStorage.setItem("user", JSON.stringify(res.data));
        modifyWebStore({user: res.data});
        reset(defaultValues);
      })
      .catch((err) => {
        enqueueSnackbar(err.response.data.message, {
          variant: "error",
          autoHideDuration: 4000,
          action: SnackBarAction,
        });
      });
  };

  return (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      style={{
        width: "100%",
        padding: "5%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* <form onSubmit={handleSubmit(handleLogin)} style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", width: "100%" }}> */}
      <form onSubmit={handleSubmit(handleLogin)}>
        <Grid
          container
          sx={{ fontSize: 16, fontWeight: "bold" }}
          style={{ display: "flex", alignItems: "center" }}
        >
          <Grid item xs={12} sm={6}>
            <Typography style={{fontWeight: "bold"}}>Login</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            style={{ display: "flex", justifyContent: "right" }}
          >
            <IconButton
              onClick={() =>
                setDrawerState({
                  ...drawerState,
                  logIn: {
                    ...drawerState["logIn"],
                    [anchor]: false,
                  },
                })
              }
            >
              <Close style={{ fontSize: "18px" }} />
            </IconButton>
          </Grid>
        </Grid>
        <Divider style={{ marginTop: "5px" }} />
        <Controller
          render={({ field }) => (
            <StyledFormControl
              style={{ width: "100%", marginTop: "15px" }}
              size="small"
            >
              <InputLabel htmlFor="username" style={{ display: "flex", fontWeight: "bold" }}>
                Username <Typography color="error">&nbsp;*</Typography>
              </InputLabel>
              <OutlinedInput
                id="username"
                {...field}
                label="Username"
                error={!!errors.username}
              />
              {errors.username && (
                <Typography color="error" style={{ fontSize: "12px" }}>
                  {errors.username.message}
                </Typography>
              )}
            </StyledFormControl>
          )}
          name="username"
          control={control}
        />
        <Controller
          render={({ field }) => (
            <StyledFormControl
              style={{ width: "100%", marginTop: "15px" }}
              size="small"
            >
              <InputLabel htmlFor="password" style={{ display: "flex", fontWeight: "bold" }}>
                Password <Typography color="error">&nbsp;*</Typography>
              </InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                {...field}
                label="Password"
                error={!!errors.password}
              />
              {errors.password && (
                <Typography color="error" style={{ fontSize: "12px" }}>
                  {errors.password.message}
                </Typography>
              )}
            </StyledFormControl>
          )}
          name="password"
          control={control}
        />
        {/* <Box>
          <Typography
            color="error"
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            * Required
          </Typography>
        </Box> */}
        <Box>
          <Button
            variant="contained"
            size="medium"
            style={{
              backgroundColor: "rgb(11, 176, 226)",
              marginTop: "15px",
              width: "100%",
            }}
            type="submit"
          >
            Login
          </Button>
        </Box>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "15px",
          }}
        >
          <Button size="small">
            <Typography
              style={{ fontSize: "12px", textTransform: "capitalize" }}
            >
              Forgot Password?
            </Typography>
          </Button>
        </Box>
      </form>
    </Box>
  );
};
