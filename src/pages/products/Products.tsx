import {
    Avatar,
    Box,
    Breadcrumbs,
    Button,
    Checkbox,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    LinearProgress,
    List,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Pagination,
    Rating,
    Select,
    SelectChangeEvent,
    Slider,
    Stack,
    styled,
    Tooltip,
    Typography,
} from "@mui/material";
import { Link, useLocation, useParams, useSearchParams, } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Category, Product, ProductCategory } from "../../commons/Types";
import { useEffect, useRef, useState } from "react";
import ProductsApi from "../../services/api/products";
import { useRootLayout } from "../../hooks/useRootLayout";
import { ProductCard } from "../../components/products/ProductCard";
import { NoProductFoundLogo } from "../../assets/icons/NoProductsFound";
import { useSnackbar } from "notistack";
import { SnackBarAction } from "../../commons/Alert";
import { useWebStore } from "../../providers/WebStoreProvider";
import { Close, PhotoCamera } from "@mui/icons-material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

const StyledFormControl = styled(FormControl)({
    "&& fieldset": {
        border: "3px solid rgb(11, 176, 226, 0.5)",
    },
    "&:hover": {
        "&& fieldset": {
            border: "3px solid rgb(11, 176, 226, 0.5)",
        },
        "&& label": {
            color: "rgb(11, 176, 226)",
        },
    },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
        border: "3px solid rgb(11, 176, 226, 0.5) !important",
    },
    "& label": {
        color: "rgb(11, 176, 226)",
        "&.Mui-focused": {
            color: "rgb(11, 176, 226)",
        },
    },
});

const StyledTextarea = styled("textarea")({
    "&:hover": {
        border: "2px solid rgb(11, 176, 226, 0.5)",
    },
    borderRadius: "8px",
});

const StyledHookFormControl = styled(FormControl)({
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

const PriceSlider = styled(Slider)({
    color: "#52af77",
    height: 8,
    "& .MuiSlider-track": {
        border: "none",
    },
    "& .MuiSlider-thumb": {
        height: 24,
        width: 24,
        backgroundColor: "#fff",
        border: "2px solid currentColor",
        "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
            boxShadow: "inherit",
        },
        "&:before": {
            display: "none",
        },
    },
    "& .MuiSlider-valueLabel": {
        lineHeight: 1.2,
        fontSize: 12,
        background: "unset",
        padding: 0,
        width: 32,
        height: 32,
        borderRadius: "50% 50% 50% 0",
        backgroundColor: "#52af77",
        transformOrigin: "bottom left",
        transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
        "&:before": { display: "none" },
        "&.MuiSlider-valueLabelOpen": {
            transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
        },
        "& > *": {
            transform: "rotate(45deg)",
        },
    },
});

const StyledPagination = styled(Pagination)({
    ul: {
        "& .Mui-selected": {
            backgroundColor: "rgb(76, 175, 80)",
            "&:hover": {
                backgroundColor: "rgb(76, 175, 80)",
            },
        },
    },
});

const breadcrumbs = [
    <Link
        key="1"
        color="inherit"
        to="/home"
        style={{ color: "#616161", fontWeight: "bold" }}
    >
        Greengrocer
    </Link>,
    <Typography key="2" color="text.primary">
        Products
    </Typography>,
];

const productsPerPageValue = [5, 10, 15, 20];

const sortValues = [
    { value: "name", display: "Name" },
    { value: "price", display: "Price" },
];

const orderValues = [
    { value: "asc", display: "Ascending" },
    { value: "desc", display: "Descending" },
];

const Input = styled("input")({
    display: "none",
});

const defaultCategoryValues = {
    name: "",
};
const defaultProductValues = {
    name: "",
    discount: 0,
    description: "",
    star: 3,
};

function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    let locationParams = useLocation().search;
    const key = useLocation().key;
    const urlParams = new URLSearchParams(locationParams);
    const { category } = useParams();
    const [pagination, setPagination] = useState({
        total: 1,
        page:
            parseInt(urlParams.get("page") || "") >= 0
                ? parseInt(urlParams.get("page") || "")
                : 1,
        itemPerPage:
            parseInt(urlParams.get("size") || "") >= 0
                ? parseInt(urlParams.get("size") || "")
                : 5,
    });
    const { header, setHeader } = useRootLayout();
    const [filters, setFilters] = useState({
        sort: urlParams.get("sort") ? urlParams.get("sort") : "",
        order: urlParams.get("order") ? urlParams.get("order") : "",
        search: urlParams.get("search") ? urlParams.get("search") : header.search,
        star: urlParams.get("star") ? urlParams.get("star") : "",
        discount: urlParams.get("discount") ? urlParams.get("discount") : "",
        priceFrom: urlParams.get("price_from") ? urlParams.get("price_from") : "",
        priceTo: urlParams.get("price_to") ? urlParams.get("price_to") : "",
    });
    const [categories, setCategories] = useState<Array<ProductCategory>>([]);
    const [products, setProducts] = useState<Array<Product>>([]);
    const [productsPerPage, setproductsPerPage] = useState(
        urlParams.get("size") || "10"
    );
    const [currentPage, setCurrentPage] = useState(
        urlParams.get("page") || "1"
    );
    const [sortValue, setSortValue] = useState(urlParams.get("sort") || "name");
    const [orderValue, setOrderValue] = useState(urlParams.get("order") || "asc");
    const [discountValue, setDiscountValue] = useState(urlParams.get("discount"));
    const [maxPrice, setMaxPrice] = useState(0);
    const [priceFromVale, setPriceFromValue] = useState(
        urlParams.get("price_from")
    );
    const [priceToValue, setPriceToValue] = useState(urlParams.get("price_to"));
    const [priceLoading, setPriceLoading] = useState(false);
    const [productsLoading, setProductsLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [sliderValue, setSliderValue] = useState([
        priceFromVale ? parseInt(priceFromVale, 10) : 0,
        priceToValue ? parseInt(priceToValue, 10) : maxPrice,
    ]);
    const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
    const [openAddProductModal, setOpenAddProductModal] = useState(false);
    const {
        webStore: { user, categoryCount, reloadFlag },
        modifyWebStore,
    } = useWebStore();
    const validationCategorySchema = Yup.object({
        name: Yup.string().required("Name is required"),
    }).required();
    const {
        handleSubmit: handleSubmitCategory,
        reset: resetCategory,
        control: controlCategory,
        formState: { errors: errorsCategory },
    } = useForm<Category>({
        defaultValues: defaultCategoryValues,
        resolver: yupResolver(validationCategorySchema),
    });
    const validationProductSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        price: Yup.number().positive("Price is required and must be a positive number").required("Price is required and must be a positive number"),
        discount: Yup.number().min(0, "Discount must be greater than or equal to 0").max(1, "Discount must be less than or equal to 100").required("Discount's value is from 0 to 100"),
    }).required();
    const {
        handleSubmit: handleSubmitProduct,
        reset: resetProduct,
        setValue,
        control: controlProduct,
        formState: { errors: errorsProduct },
    } = useForm<Product>({
        defaultValues: defaultProductValues,
        resolver: yupResolver(validationProductSchema),
    });
    // const [reloadFlag, setReloadFlag] = useState(false);
    const [productImage, setProductImage] = useState("");
    const [changeCategories, setChangeCategories] = useState(0);
    const imageRef = useRef<HTMLInputElement>(null);

    const handleChangePagination = (
        event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        event.preventDefault();
        setCurrentPage(value.toString());
        setPagination((pagination) => ({
            ...pagination,
            page: value,
        }));
    };

    const handleChangeProductsPerPage = (event: SelectChangeEvent) => {
        setproductsPerPage(event.target.value);
        setPagination((pagination) => ({
            ...pagination,
            itemPerPage: parseInt(event.target.value, 10),
        }));
    };

    const handleChangeSortBy = (event: SelectChangeEvent) => {
        setSortValue(event.target.value);
        setFilters((element) => ({
            ...element,
            sort: event.target.value,
        }));
    };

    const handleChangeOrder = (event: SelectChangeEvent) => {
        setOrderValue(event.target.value);
        setFilters((element) => ({
            ...element,
            order: event.target.value,
        }));
    };

    const handleChangeDiscount = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDiscountValue(event.target.checked.toString());
        setFilters((element) => ({
            ...element,
            discount: event.target.checked.toString(),
        }));
    };

    const handleChangePrice = (
        event: React.SyntheticEvent | Event,
        newValue: number | number[]
    ) => {
        if (Array.isArray(newValue)) {
            setSliderValue([newValue[0], newValue[1]]);
        }
    };

    const handleChangePriceEnd = (
        event: React.SyntheticEvent | Event,
        newValue: number | number[]
    ) => {
        if (Array.isArray(newValue)) {
            setPriceFromValue(newValue[0].toString());
            setPriceToValue(newValue[1].toString());
            setFilters((element) => ({
                ...element,
                priceFrom: newValue[0].toString(),
                priceTo: newValue[1].toString(),
            }));
        }
    };

    const handleOpenAddCategoryModal = () => {
        setOpenAddCategoryModal(true);
    };

    const handleCloseCategoryModal = () => {
        setOpenAddCategoryModal(false);
    };

    const handleAddCategory: SubmitHandler<Category> = (data) => {
        ProductsApi.AddCategory(data)
            .then((res) => {
                enqueueSnackbar(`Add category '${data.name}' successfully.`, {
                    variant: "success",
                    autoHideDuration: 4000,
                    action: SnackBarAction,
                });
                resetCategory(defaultCategoryValues);
                handleCloseCategoryModal();
                // setReloadFlag(!reloadFlag);
                modifyWebStore({ categoryCount: categoryCount + 1, reloadFlag: !reloadFlag })
            })
            .catch((err) => {
                enqueueSnackbar(err.response.data.message, {
                    variant: "error",
                    autoHideDuration: 4000,
                    action: SnackBarAction,
                });
            });
    };

    const handleOpenAddProductModal = () => {
        setOpenAddProductModal(true);
    };

    const handleCloseProductModal = () => {
        setOpenAddProductModal(false);
    };

    const handleAddProduct: SubmitHandler<Product> = (data) => {
        ProductsApi.AddProduct(data)
            .then((res) => {
                enqueueSnackbar(`Add product '${data.name}' successfully.`, {
                    variant: "success",
                    autoHideDuration: 4000,
                    action: SnackBarAction,
                });
                resetProduct(defaultProductValues);
                handleCloseProductModal();
                setProductImage("");
                // setReloadFlag(!reloadFlag);
                modifyWebStore({ reloadFlag: !reloadFlag })
            })
            .catch((err) => {
                enqueueSnackbar(err.response.data.message, {
                    variant: "error",
                    autoHideDuration: 4000,
                    action: SnackBarAction,
                });
            });
    };

    const handleChangeProductImage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newImage = event.target?.files?.[0];
        if (newImage) {
            let reader = new FileReader();
            reader.onloadend = function () {
                setProductImage(reader.result as string);
            };
            reader.readAsDataURL(newImage);
        }
    };

    const handleClearProductImage = () => {
        setProductImage("");
        if (imageRef !== null && imageRef.current !== null)
            imageRef.current.value = "";
    };

    useEffect(() => {
        const page =
            parseInt(urlParams.get("page") || "", 10) >= 0
                ? parseInt(urlParams.get("page") || "", 10)
                : parseInt(currentPage, 10);
        const size =
            parseInt(urlParams.get("size") || "", 10) >= 0
                ? parseInt(urlParams.get("size") || "", 10)
                : parseInt(productsPerPage, 10);
        const sort = urlParams.get("sort") ? urlParams.get("sort") : sortValue;
        const order = urlParams.get("order") ? urlParams.get("order") : orderValue;
        const search = urlParams.get("search") || header.search;
        const star = urlParams.get("star");
        const discount = urlParams.get("discount")
            ? urlParams.get("discount")
            : discountValue;
        const priceFrom = urlParams.get("price_from")
            ? urlParams.get("price_from")
            : priceFromVale;
        const priceTo = urlParams.get("price_to")
            ? urlParams.get("price_to")
            : priceToValue;
        setPagination((pagination) => ({
            ...pagination,
            page: page,
            itemPerPage: size,
        }));
        setFilters((element) => ({
            ...element,
            sort: sort ? sort : "",
            order: order ? order : "",
            search: search ? search : "",
            star: star ? star : "",
            discount: discount ? discount : "",
            priceFrom: priceFrom ? priceFrom : "",
            priceTo: priceTo ? priceTo : "",
        }));
        if (search) {
            setHeader((val) => ({ ...val, search: search.trim() }));
        }
    }, [key]);

    useEffect(() => {
        // handleSearch(header.search);
        setSearchParams({ search: header.search });
        if (header.search.length > 0) {
            setFilters((filters) => ({ ...filters, search: header.search }));
        } else {
            setFilters((filters) => ({ ...filters, search: "" }));
        }
    }, [header.search]);

    const handleSearch = (input: string) => {
        setSearchParams({ search: input });
        if (input.length > 0) {
            setFilters((filters) => ({ ...filters, search: input }));
        } else {
            setFilters((filters) => ({ ...filters, search: "" }));
        }
    };

    useEffect(() => {
        let unmounted = false;
        setCategoriesLoading(true);

        ProductsApi.GetProductsCategories()
            .then((res) => {
                if (unmounted) return;
                let tmp: Array<ProductCategory> = res.data.data;
                tmp = tmp.sort((a, b) => {
                    if (a.name.toLowerCase() <= b.name.toLowerCase()) {
                        return -1
                    } else {
                        return 1
                    }
                });
                let all = {
                    id: 0,
                    name: "All",
                    total: 0,
                };
                setChangeCategories(tmp[0].id)
                setValue("category_id", tmp[0].id);
                if (tmp.length > 0) {
                    for (let i = 0; i < tmp.length; i++) {
                        all.total += tmp[i].total;
                    }
                }
                tmp.unshift(all);
                setCategories(tmp);
                setCategoriesLoading(false);
            })
            .catch((err) => {
                enqueueSnackbar(err.response.data.message, {
                    variant: "error",
                    autoHideDuration: 4000,
                    action: SnackBarAction,
                });
            });

        return () => {
            unmounted = true;
        };
    }, [reloadFlag]);

    useEffect(() => {
        let unmounted = false;
        const offset = (pagination.page - 1) * pagination.itemPerPage;
        const { sort, order, search, star, discount, priceFrom, priceTo } = filters;
        setProductsLoading(true);

        let categoryId = "";
        if (category) {
            let tmp = category.split("_");
            categoryId = tmp.join(" ");
        }

        ProductsApi.ProductsIndex(
            search as string,
            categoryId as string,
            star as string,
            discount as string,
            priceFrom as string,
            priceTo as string,
            sort as string,
            order as string,
            offset > 0 ? offset : 0,
            pagination.itemPerPage
        )
            .then((res) => {
                if (unmounted) return;
                setProducts(res.data.data.data);
                setProductsLoading(false);
                const total = res.data.data.total;
                const maxPage = total ? Math.ceil(total / pagination.itemPerPage) : 1;

                setPagination((pagination) => ({
                    ...pagination,
                    page:
                        pagination.page > maxPage
                            ? maxPage
                            : total && total > 0 && pagination.page < 1
                                ? 1
                                : pagination.page,
                    total: total ? total : 1,
                }));

                window.history.replaceState(
                    {},
                    "",
                    `${window.location.pathname}?size=${pagination.itemPerPage}&page=${pagination.page > maxPage ? maxPage : pagination.page
                    }${sort ? `&sort=${sort}` : ""}${order ? `&order=${order}` : ""}${search ? `&search=${search}` : ""
                    }${discount ? `&discount=${discount}` : ""}${priceFrom ? `&price_from=${priceFrom}` : ""
                    }${priceTo ? `&price_to=${priceTo}` : ""}`
                );
            })
            .catch((err) => {
                enqueueSnackbar(err.response.data.message, {
                    variant: "error",
                    autoHideDuration: 4000,
                    action: SnackBarAction,
                });
            });

        return () => {
            unmounted = true;
        };
    }, [pagination.itemPerPage, filters, pagination.page, category, reloadFlag]);

    useEffect(() => {
        let unmounted = false;
        const sort = "discounted_price";
        const order = "desc";
        setPriceLoading(true);

        ProductsApi.ProductsIndex("", "", "", "", "", "", sort, order, 0, 1)
            .then((res) => {
                if (unmounted) return;
                setMaxPrice(res.data.data.data[0].discounted_price);
                setPriceLoading(false);
            })
            .catch((err) => {
                enqueueSnackbar(err.response.data.message, {
                    variant: "error",
                    autoHideDuration: 4000,
                    action: SnackBarAction,
                });
            });

        return () => {
            unmounted = true;
        };
    }, [reloadFlag]);

    return (
        <Container maxWidth="xl">
            <Box sx={{ flexGrow: 1 }} style={{ marginTop: 25 }}>
                <Grid container style={{ display: "flex", alignItems: "center" }}>
                    <Grid item xs={12} sm={3} container justifyContent="flex-start">
                        <Stack spacing={2} marginBottom={2}>
                            <Breadcrumbs
                                separator={<NavigateNextIcon fontSize="small" />}
                                aria-label="breadcrumb"
                            >
                                {breadcrumbs}
                            </Breadcrumbs>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={9} container justifyContent="flex-end">
                        {user && user.role === "admin" && (
                            <Box
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 0,
                                    marginRight: "15px",
                                }}
                            >
                                <Button
                                    variant="contained"
                                    size="small"
                                    style={{
                                        minWidth: "30px",
                                        backgroundColor: "#4caf50",
                                    }}
                                    onClick={handleOpenAddProductModal}
                                >
                                    New Product
                                </Button>
                                <Dialog
                                    open={openAddProductModal}
                                    onClose={handleCloseProductModal}
                                    maxWidth="sm"
                                    fullWidth
                                >
                                    <form onSubmit={handleSubmitProduct(handleAddProduct)}>
                                        <Grid
                                            container
                                            sx={{ fontSize: 16, fontWeight: "bold" }}
                                            style={{ display: "flex", alignItems: "center" }}
                                        >
                                            <Grid item xs={12} sm={6}>
                                                <DialogTitle fontWeight="bold">New Product</DialogTitle>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                                style={{ display: "flex", justifyContent: "right" }}
                                            >
                                                <DialogTitle>
                                                    <IconButton onClick={handleCloseProductModal}>
                                                        <Close style={{ fontSize: "18px" }} />
                                                    </IconButton>
                                                </DialogTitle>
                                            </Grid>
                                        </Grid>
                                        <Divider />
                                        <DialogContent style={{ paddingTop: 0, paddingBottom: 0 }}>
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
                                                                        if (
                                                                            event.target.files &&
                                                                            event.target.files.length > 0
                                                                        )
                                                                            field.onChange(event.target.files[0]);
                                                                        handleChangeProductImage(event);
                                                                    }}
                                                                />
                                                                <label htmlFor="upload-button-file">
                                                                    <Button
                                                                        aria-label="upload picture"
                                                                        component="span"
                                                                    >
                                                                        <Avatar
                                                                            alt=""
                                                                            src={productImage}
                                                                            sx={{ width: 150, height: 150 }}
                                                                            variant="square"
                                                                        >
                                                                            <PhotoCamera />
                                                                        </Avatar>
                                                                    </Button>
                                                                </label>
                                                            </Stack>
                                                        </Tooltip>
                                                        {productImage.length > 0 && (
                                                            <Button
                                                                size="small"
                                                                style={{
                                                                    padding: 0,
                                                                    fontSize: "12px",
                                                                    textTransform: "capitalize",
                                                                    color: "rgb(11, 176, 226)",
                                                                }}
                                                                onClick={handleClearProductImage}
                                                            >
                                                                {" "}
                                                                Clear
                                                            </Button>
                                                        )}
                                                    </Box>
                                                )}
                                                name="image"
                                                control={controlProduct}
                                            />
                                            <Controller
                                                render={({ field }) => (
                                                    <Box style={{
                                                        marginTop: "15px",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}>
                                                        <Rating
                                                            name="star-controlled"
                                                            defaultValue={3}
                                                            onChange={(e, newValue) => {
                                                                setValue("star", newValue as number);
                                                            }}
                                                        />
                                                    </Box>
                                                )}
                                                name="star"
                                                control={controlProduct}
                                            />
                                            <Grid container>
                                                <Grid item xs={12} sm={6}>
                                                    <Controller
                                                        render={({ field }) => (
                                                            <StyledHookFormControl
                                                                style={{ width: "100%", marginTop: "15px" }}
                                                            >
                                                                <InputLabel
                                                                    htmlFor="name"
                                                                    style={{ display: "flex", fontWeight: "bold" }}
                                                                >
                                                                    Name{" "}
                                                                    <Typography color="error">&nbsp;*</Typography>
                                                                </InputLabel>
                                                                <OutlinedInput
                                                                    id="name"
                                                                    {...field}
                                                                    label="Name"
                                                                    error={!!errorsProduct.name}
                                                                    style={{ width: "95%" }}
                                                                />
                                                                {errorsProduct.name && (
                                                                    <Typography
                                                                        color="error"
                                                                        style={{ fontSize: "12px" }}
                                                                    >
                                                                        {errorsProduct.name.message}
                                                                    </Typography>
                                                                )}
                                                            </StyledHookFormControl>
                                                        )}
                                                        name="name"
                                                        control={controlProduct}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}
                                                    style={{ display: "flex", justifyContent: "right" }}>
                                                    <Controller
                                                        render={({ field }) => (
                                                            <StyledHookFormControl
                                                                style={{ width: "95%", marginTop: "15px" }}
                                                            >
                                                                <InputLabel
                                                                    htmlFor="price"
                                                                    style={{ display: "flex", fontWeight: "bold" }}
                                                                >
                                                                    Price{" "}
                                                                    <Typography color="error">&nbsp;*</Typography>
                                                                </InputLabel>
                                                                <OutlinedInput
                                                                    id="price"
                                                                    onChange={(val) => setValue("price", Number(val.target.value))}
                                                                    label="Price"
                                                                    error={!!errorsProduct.price}
                                                                    type="number"
                                                                    inputProps={{ step: 0.01 }}
                                                                />
                                                                {errorsProduct.price && (
                                                                    <Typography
                                                                        color="error"
                                                                        style={{ fontSize: "12px" }}
                                                                    >
                                                                        {errorsProduct.price.message}
                                                                    </Typography>
                                                                )}
                                                            </StyledHookFormControl>
                                                        )}
                                                        name="price"
                                                        control={controlProduct}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Box style={{ marginTop: "15px" }}>
                                                <Typography
                                                    style={{ fontWeight: "bold", color: "#9e9e9e", fontSize: "12px" }}>
                                                    Description
                                                </Typography>
                                                <Controller
                                                    render={({ field }) => (
                                                        <StyledTextarea
                                                            rows={4}
                                                            aria-label="Description"
                                                            {...field}
                                                            style={{ width: "100%" }}
                                                        />
                                                    )}
                                                    name="description"
                                                    control={controlProduct}
                                                />
                                            </Box>
                                            <Grid container>
                                                <Grid item xs={12} sm={6}>
                                                    <Controller
                                                        render={({ field }) => (
                                                            <StyledHookFormControl fullWidth style={{
                                                                marginTop: "15px",
                                                                width: "95%"
                                                            }}>
                                                                <InputLabel id="categories"
                                                                    style={{ fontWeight: "bold" }}>
                                                                    Categories
                                                                </InputLabel>
                                                                <Select
                                                                    labelId="categories"
                                                                    value={changeCategories}
                                                                    label="Categories"
                                                                    onChange={(val) => {
                                                                        setValue("category_id", Number(val.target.value));
                                                                        setChangeCategories(Number(val.target.value));
                                                                    }}
                                                                    style={{ fontSize: "14px" }}
                                                                >
                                                                    {categories.filter(item => item.name !== "All").map((category) => {
                                                                        return (
                                                                            <MenuItem
                                                                                key={category.id + "-" + category.name}
                                                                                value={category.id}>
                                                                                {category.name}
                                                                            </MenuItem>
                                                                        );
                                                                    })}
                                                                </Select>
                                                            </StyledHookFormControl>
                                                        )}
                                                        name="category_id"
                                                        control={controlProduct}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "flex-end"
                                                }}>
                                                    <Controller
                                                        render={({ field }) => (
                                                            <StyledHookFormControl
                                                                style={{ width: "95%", marginTop: "15px" }}
                                                            >
                                                                <InputLabel
                                                                    htmlFor="discount"
                                                                    style={{ display: "flex", fontWeight: "bold" }}
                                                                >
                                                                    Discount (%)
                                                                    {/* <Typography color="error">&nbsp;*</Typography> */}
                                                                </InputLabel>
                                                                <OutlinedInput
                                                                    id="discount"
                                                                    onChange={(val) => setValue("discount", Number(val.target.value) / 100)}
                                                                    label="Discount (%)"
                                                                    error={!!errorsProduct.discount}
                                                                    type="number"
                                                                    defaultValue={0}
                                                                    inputProps={{ step: 0.1 }}
                                                                />
                                                                {errorsProduct.discount && (
                                                                    <Typography
                                                                        color="error"
                                                                        style={{ fontSize: "12px" }}
                                                                    >
                                                                        {errorsProduct.discount.message}
                                                                    </Typography>
                                                                )}
                                                            </StyledHookFormControl>
                                                        )}
                                                        name="discount"
                                                        control={controlProduct}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </DialogContent>
                                        <DialogActions
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
                                                    width: "20%",
                                                }}
                                                type="submit"
                                            >
                                                Add
                                            </Button>
                                        </DialogActions>
                                    </form>
                                </Dialog>
                            </Box>
                        )}
                        <Box sx={{ minWidth: 150 }} marginRight="15px">
                            <StyledFormControl fullWidth size="small">
                                <InputLabel id="sort-by" style={{ fontWeight: "bold" }}>
                                    Sort by
                                </InputLabel>
                                <Select
                                    labelId="sort-by"
                                    value={sortValue}
                                    label="Sort by"
                                    onChange={handleChangeSortBy}
                                    style={{ fontSize: "14px" }}
                                >
                                    {sortValues.map(({ value, display }, i) => {
                                        return (
                                            <MenuItem key={i + "-" + value} value={value}>
                                                {display}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </StyledFormControl>
                        </Box>
                        <Box sx={{ minWidth: 150 }} marginRight="15px">
                            <StyledFormControl fullWidth size="small">
                                <InputLabel id="order" style={{ fontWeight: "bold" }}>
                                    Order
                                </InputLabel>
                                <Select
                                    labelId="order"
                                    value={orderValue}
                                    label="Order"
                                    onChange={handleChangeOrder}
                                    style={{ fontSize: "14px" }}
                                >
                                    {orderValues.map(({ value, display }, i) => {
                                        return (
                                            <MenuItem key={i + "-" + value} value={value}>
                                                {display}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </StyledFormControl>
                        </Box>
                        <Box sx={{ minWidth: 150 }}>
                            <StyledFormControl fullWidth size="small">
                                <InputLabel
                                    id="products-per-page"
                                    style={{ fontWeight: "bold" }}
                                >
                                    Items per page
                                </InputLabel>
                                <Select
                                    labelId="products-per-page"
                                    value={productsPerPage}
                                    label="Items per page"
                                    onChange={handleChangeProductsPerPage}
                                    style={{ fontSize: "14px" }}
                                >
                                    {productsPerPageValue.map((value, i) => {
                                        return (
                                            <MenuItem key={i + "-" + value} value={value}>
                                                {value}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </StyledFormControl>
                        </Box>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid
                        item
                        xs={12}
                        sm={2.5}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Grid
                            container
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "10px",
                            }}
                        >
                            <Grid xs={12} sm={6} item>
                                <Typography
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        textTransform: "uppercase",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Categories
                                </Typography>
                            </Grid>
                            {/* {user && user.role === "admin" && (
                                <Grid
                                    xs={12}
                                    sm={6}
                                    item
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        padding: 0,
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        size="small"
                                        style={{
                                            minWidth: "30px",
                                            backgroundColor: "rgb(11, 176, 226)",
                                        }}
                                        onClick={handleOpenAddCategoryModal}
                                    >
                                        New Category
                                    </Button>
                                    <Dialog
                                        open={openAddCategoryModal}
                                        onClose={handleCloseCategoryModal}
                                        maxWidth="sm"
                                        fullWidth
                                    >
                                        <form onSubmit={handleSubmitCategory(handleAddCategory)}>
                                            <Grid
                                                container
                                                sx={{fontSize: 16, fontWeight: "bold"}}
                                                style={{display: "flex", alignItems: "center"}}
                                            >
                                                <Grid item xs={12} sm={6}>
                                                    <DialogTitle fontWeight="bold">
                                                        New Category
                                                    </DialogTitle>
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={6}
                                                    style={{display: "flex", justifyContent: "right"}}
                                                >
                                                    <DialogTitle>
                                                        <IconButton onClick={handleCloseCategoryModal}>
                                                            <Close style={{fontSize: "18px"}}/>
                                                        </IconButton>
                                                    </DialogTitle>
                                                </Grid>
                                            </Grid>
                                            <Divider/>
                                            <DialogContent
                                                style={{paddingTop: 0, paddingBottom: 0}}
                                            >
                                                <Controller
                                                    render={({field}) => (
                                                        <StyledHookFormControl
                                                            style={{width: "100%", marginTop: "15px"}}
                                                        >
                                                            <InputLabel
                                                                htmlFor="name"
                                                                style={{display: "flex"}}
                                                            >
                                                                Name{" "}
                                                                <Typography color="error">&nbsp;*</Typography>
                                                            </InputLabel>
                                                            <OutlinedInput
                                                                id="name"
                                                                {...field}
                                                                label="Name"
                                                                error={!!errorsCategory.name}
                                                            />
                                                            {errorsCategory.name && (
                                                                <Typography
                                                                    color="error"
                                                                    style={{fontSize: "12px"}}
                                                                >
                                                                    {errorsCategory.name.message}
                                                                </Typography>
                                                            )}
                                                        </StyledHookFormControl>
                                                    )}
                                                    name="name"
                                                    control={controlCategory}
                                                />
                                            </DialogContent>
                                            <DialogActions
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
                                                        width: "20%",
                                                    }}
                                                    type="submit"
                                                >
                                                    Add
                                                </Button>
                                            </DialogActions>
                                        </form>
                                    </Dialog>
                                </Grid>
                            )} */}
                        </Grid>
                        <Divider></Divider>
                        <List>
                            {categories.map(({ id, name, total }, i) => {
                                const path =
                                    name === "All"
                                        ? "/products"
                                        : "/products/" + name.split(" ").join("_");
                                const activeCategory = category
                                    ? category.split("_").join(" ")
                                    : "All";
                                return (
                                    <Grid
                                        container
                                        key={i + "-" + name.toLowerCase()}
                                        style={{ padding: 0, margin: 0 }}

                                    >
                                        <Grid
                                            xs={12}
                                            sm={6}
                                            item
                                            style={{
                                                display: "flex",
                                                justifyContent: "flex-start",
                                                padding: 0,
                                            }}
                                        // sx={{'&:hover button': {display:'unset'}}}
                                        >
                                            {/*<Button*/}
                                            {/*    size="small"*/}
                                            {/*    sx={{display:'none'}}*/}
                                            {/*>*/}
                                            {/*    delete*/}
                                            {/*</Button><Button*/}
                                            {/*    size="small"*/}
                                            {/*    sx={{display:'none'}}*/}
                                            {/*>*/}
                                            {/*    delete*/}
                                            {/*</Button>*/}
                                            <Link
                                                to={{
                                                    pathname: path,
                                                    search: locationParams,
                                                }}
                                                style={{ textDecoration: "none" }}
                                            >
                                                <Button
                                                    sx={{
                                                        color: "black",
                                                        "&:hover": {
                                                            color: "#4caf50 !important",
                                                            textDecoration: "none",
                                                        },
                                                    }}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "left",
                                                        width: "150px",
                                                        textTransform: "none",
                                                        fontSize: "16px",
                                                        color:
                                                            name === activeCategory ? "#4caf50" : "#9e9e9e",
                                                        fontWeight: name === activeCategory ? "bold" : "",
                                                    }}
                                                >
                                                    {name}
                                                </Button>
                                            </Link>
                                        </Grid>
                                        <Grid
                                            xs={12}
                                            sm={6}
                                            item
                                            style={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                padding: 0,
                                            }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Typography
                                                        style={{
                                                            color:
                                                                name === activeCategory
                                                                    ? "white"
                                                                    : "rgb(158, 158, 158)",
                                                            fontWeight: "bold",
                                                            display: "flex",
                                                            justifyContent: "flex-end",
                                                        }}
                                                    >
                                                        {total}
                                                    </Typography>
                                                }
                                                style={{
                                                    display: "flex",
                                                    maxWidth: "40px",
                                                    backgroundColor:
                                                        name === activeCategory ? "#4caf50" : "#f5f5f5",
                                                    marginLeft: "30px",
                                                    float: "right",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    borderRadius: "5px",
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                );
                            })}
                        </List>
                        <Typography
                            component="div"
                            style={{
                                textAlign: "left",
                                textTransform: "uppercase",
                                fontWeight: "bold",
                            }}
                        >
                            Filter by price
                        </Typography>
                        <Divider></Divider>
                        {!priceLoading ? (
                            <>
                                <PriceSlider
                                    style={{ marginTop: "15px" }}
                                    valueLabelDisplay="auto"
                                    // defaultValue={[priceFromVale ? parseInt(priceFromVale, 10) : 0, priceToValue ? parseInt(priceToValue, 10) : maxPrice]}
                                    value={
                                        sliderValue[1] === 0 && sliderValue[0] === 0
                                            ? [0, maxPrice]
                                            : sliderValue
                                    }
                                    min={0}
                                    max={maxPrice}
                                    onChangeCommitted={handleChangePriceEnd}
                                    onChange={handleChangePrice}
                                />
                                <Typography
                                    component="div"
                                    style={{
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        color: "rgb(76, 175, 80)",
                                    }}
                                >
                                    ${priceFromVale ? priceFromVale : 0} - $
                                    {priceToValue ? priceToValue : maxPrice}
                                </Typography>
                            </>
                        ) : (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "5px",
                                }}
                            >
                                <CircularProgress size="30px" />
                            </Box>
                        )}
                        <Box>
                            <FormControlLabel
                                label="Discount"
                                control={
                                    <Checkbox
                                        style={{ color: "#ff7062" }}
                                        onChange={handleChangeDiscount}
                                        checked={discountValue === "true" ? true : false}
                                    />
                                }
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "left",
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={9.5}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                        }}
                    >
                        {productsLoading && (
                            <Box
                                key={Math.random() * 100000000}
                                sx={{
                                    position: "absolute",
                                    width: "98%",
                                    top: 0,
                                    color: "#4caf50",
                                    marginTop: "10px",
                                    paddingLeft: "50px",
                                }}
                            >
                                <LinearProgress color="inherit" sx={{ width: 1 }} />
                            </Box>
                        )}
                        {products.length > 0 ? (
                            <Grid container style={{ paddingLeft: "50px" }}>
                                {products.map((product, i) => {
                                    return !categoriesLoading ? (
                                        <Grid
                                            item
                                            key={product.id + "-" + product.name}
                                            md={2.4}
                                            style={{
                                                marginTop: 25,
                                                textAlign: "center",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <ProductCard
                                                product={product}
                                                category={
                                                    categories.filter(
                                                        (category) => category.id === product.category_id
                                                    )[0].name
                                                }
                                                reload={reloadFlag}
                                            />
                                        </Grid>
                                    ) : (
                                        <Box
                                            sx={{ display: "flex" }}
                                            key={Math.random() * 100000000}
                                        >
                                            <CircularProgress />
                                        </Box>
                                    );
                                })}
                            </Grid>
                        ) : (
                            <Grid
                                container
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <NoProductFoundLogo
                                    width="200px"
                                    height="200px"
                                    fill="#9e9e9e"
                                />
                                <Typography component="div" style={{ fontSize: "18px" }}>
                                    No Products Found
                                </Typography>
                            </Grid>
                        )}
                        <Stack
                            spacing={2}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 15,
                            }}
                        >
                            <StyledPagination
                                count={
                                    pagination.total
                                        ? Math.ceil(pagination.total / pagination.itemPerPage)
                                        : 1
                                }
                                // variant="outlined"
                                shape="rounded"
                                color="primary"
                                page={pagination.page}
                                onChange={handleChangePagination}
                                showFirstButton
                                showLastButton
                            />
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
            {/* <SnackbarProvider maxSnack={5}>
        <Snackbar open={alert.open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {alert.msg}
          </Alert>
        </Snackbar>
      </SnackbarProvider> */}
        </Container>
    );
}

export default Products;
