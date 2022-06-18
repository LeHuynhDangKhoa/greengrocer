import { PhotoCamera, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Anchor } from ".";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import AuthenApi from "../../services/api/authen";
import { DrawerState, SignUpForm } from "../../commons/Types";
import { SnackBarAction } from "../../commons/Alert";
import { useSnackbar } from "notistack";
import Close from "@mui/icons-material/Close";

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

const Input = styled("input")({
  display: "none",
});

const defaultValues = {
  username: "",
  password: "",
  confirm_password: "",
  phone: "",
  email: "",
};

export const SignUpDrawer: FC<{
  anchor: Anchor;
  drawerState: DrawerState;
  setDrawerState: React.Dispatch<React.SetStateAction<DrawerState>>;
}> = ({ anchor, drawerState, setDrawerState }) => {
  const [showPassword, setShowPassword] = useState(false);
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
    confirm_password: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    phone: Yup.string().matches(/^[0-9]*$/, "Phone only contains mumber"),
  }).required();
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SignUpForm>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });
  const [image, setImage] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const imageRef = useRef<HTMLInputElement>(null);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp: SubmitHandler<SignUpForm> = (data) => {
    AuthenApi.SignUp(data)
      .then((res) => {
        enqueueSnackbar("Register new user successfully.", {
          variant: "success",
          autoHideDuration: 4000,
          action: SnackBarAction,
        });
        setDrawerState({
          ...drawerState,
          signUp: {
            ...drawerState["signUp"],
            [anchor]: false,
          },
          logIn: {
            ...drawerState["logIn"],
            [anchor]: true,
          },
        });
        reset(defaultValues);
        setImage("");
      })
      .catch((err) => {
        enqueueSnackbar(err.response.data.message, {
          variant: "error",
          autoHideDuration: 4000,
          action: SnackBarAction,
        });
      });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleChangeAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newImage = event.target?.files?.[0];
    if (newImage) {
      let reader = new FileReader();
      reader.onloadend = function () {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(newImage);
    }
  };

  const handleClearAvatar = () => {
    setImage("");
    if (imageRef !== null && imageRef.current !== null)
      imageRef.current.value = "";
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
      {/* <form onSubmit={handleSubmit(handleSignUp)} style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", width: "100%" }}> */}
      <form onSubmit={handleSubmit(handleSignUp)}>
        <Grid
          container
          sx={{ fontSize: 16, fontWeight: "bold" }}
          style={{ display: "flex", alignItems: "center" }}
        >
          <Grid item xs={12} sm={6}>
            <Typography style={{ fontWeight: "bold" }}>Sign Up</Typography>
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
                  signUp: {
                    ...drawerState["signUp"],
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
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                marginTop: "15px",
              }}
            >
              <Tooltip title="Upload" arrow placement="right">
                <Stack>
                  <Input
                    accept="image/*"
                    id="upload-button-file"
                    multiple
                    type="file"
                    ref={imageRef}
                    onChange={(event) => {
                      if (event.target.files && event.target.files.length > 0)
                        field.onChange(event.target.files[0]);
                      handleChangeAvatar(event);
                    }}
                  />
                  <label htmlFor="upload-button-file">
                    <IconButton aria-label="upload picture" component="span">
                      <Avatar alt="" src={image} sx={{ width: 70, height: 70 }}>
                        <PhotoCamera />
                      </Avatar>
                    </IconButton>
                  </label>
                </Stack>
              </Tooltip>
              {image.length > 0 && (
                <Button
                  size="small"
                  style={{
                    padding: 0,
                    fontSize: "12px",
                    textTransform: "capitalize",
                    color: "rgb(11, 176, 226)",
                  }}
                  onClick={handleClearAvatar}
                >
                  {" "}
                  Clear
                </Button>
              )}
            </Box>
          )}
          name="image"
          control={control}
        />
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
        <Controller
          render={({ field }) => (
            <StyledFormControl
              style={{ width: "100%", marginTop: "15px" }}
              size="small"
            >
              <InputLabel
                htmlFor="confirm password"
                style={{ display: "flex", fontWeight: "bold" }}
              >
                Confirm Password <Typography color="error">&nbsp;*</Typography>
              </InputLabel>
              <OutlinedInput
                id="confirm password"
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
                label="Confirm Password"
                error={!!errors.confirm_password}
              />
              {errors.confirm_password && (
                <Typography color="error" style={{ fontSize: "12px" }}>
                  {errors.confirm_password.message}
                </Typography>
              )}
            </StyledFormControl>
          )}
          name="confirm_password"
          control={control}
        />
        <Controller
          render={({ field }) => (
            <StyledFormControl
              style={{ width: "100%", marginTop: "15px" }}
              size="small"
            >
              <InputLabel htmlFor="email" style={{ display: "flex", fontWeight: "bold" }}>
                Email <Typography color="error">&nbsp;*</Typography>
              </InputLabel>
              <OutlinedInput
                id="email"
                {...field}
                label="Email"
                error={!!errors.email}
              />
              {errors.email && (
                <Typography color="error" style={{ fontSize: "12px" }}>
                  {errors.email.message}
                </Typography>
              )}
            </StyledFormControl>
          )}
          name="email"
          control={control}
        />
        <Controller
          render={({ field }) => (
            <StyledFormControl
              style={{ width: "100%", marginTop: "15px" }}
              size="small"
            >
              <InputLabel htmlFor="phone" style={{ fontWeight: "bold" }}>Phone</InputLabel>
              <OutlinedInput
                id="phone"
                {...field}
                label="phone"
                error={!!errors.phone}
              />
              {errors.phone && (
                <Typography color="error" style={{ fontSize: "12px" }}>
                  {errors.phone.message}
                </Typography>
              )}
            </StyledFormControl>
          )}
          name="phone"
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
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
            Sign Up
          </Button>
        </Box>
      </form>
    </Box>
  );
};
