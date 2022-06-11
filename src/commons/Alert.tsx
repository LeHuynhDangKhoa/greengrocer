import { useSnackbar } from "notistack";
import CloseIcon from '@mui/icons-material/Close';
import { Button } from "@mui/material";

export const SnackBarAction = (key: any) => {
    const { closeSnackbar } = useSnackbar();
    return (
        <Button onClick={() => { closeSnackbar(key) }} style={{ color: "white", top: 0, right: 0 }}>
            <CloseIcon />
        </Button>
    )
};