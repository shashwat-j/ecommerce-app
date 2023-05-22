import { alpha, Autocomplete, Badge, Box, Button, MenuItem, Select, styled } from '@mui/material'
import { IconButton, Toolbar } from '@mui/material'
import { Typography } from '@mui/material'
import { AppBar } from '@mui/material'
import React from 'react'
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp'
import { useDispatch, useSelector } from 'react-redux'
import { getItemCount } from '../utils'
import TextField from '@mui/material/TextField'
import { fetchAllCategories } from '../feature/categories-slice'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchParams, Link } from 'react-router-dom'
import { useTheme } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useAuth } from '../firebase/Auth'
import { Menu } from "@mui/material"

const Search = styled("section")(({theme})=>({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
}));

const StyledAutocomplete  =styled(Autocomplete)(({theme}) => ({
  color: "inherit",
  width: "100%",
  "& .MuiTextField-root":{//space after & means following class is a of child (JSS syntax)
    paddingRight: `calc(1em + ${theme.spacing(4)})`
  },
  "& .MuiInputBase-input":{
    color: theme.palette.common.white,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiSvgIcon-root":{
    color: theme.palette.common.white,
  },
}))

const SearchIconWrapper = styled("section")(({ theme }) => ({
  padding: theme.spacing(0,2),
  height: "100%",
  position: "absolute",
  right: 0,
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}))

const StyledLink = styled(Link)(({theme}) => ({
  color: theme.palette.common.white,
  textDecoration: "none",
}))

function SearchBar(props){

  const theme = useTheme();
  const products = useSelector((state)=> state.products?.value);
  const categories = useSelector((state)=> state.categories?.value);
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const searchTerm = searchParams.get("searchterm")
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedCategory(category??"all")
  }, [category])
  

  if(!categories.length){
    dispatch(fetchAllCategories())
  }
  function handleCategoryChange(event){
    const {value} = event.target;
    navigate(value === "all"? "/" : `/?category=${value}${searchTerm?"&searchterm="+searchTerm:''}`);
  }
  function handleSearchChange(searchTerm){
    if(searchTerm){
      navigate(selectedCategory==="all"? `?searchterm=${searchTerm}`:`/?category=${selectedCategory}&searchterm=${searchTerm}`)
    }
    else{
      navigate(selectedCategory==="all"? `/`:`/?category=${selectedCategory}`)
    }
  }
  return (
    <Search sx={{display:{xs:props.xsDisplay, sm:props.smDisplay}}}>
      <Select size="small" onChange={handleCategoryChange} value={selectedCategory} variant="standard" labelId="selected-category" id="selected-category-id" sx={{
        m:1,
        textTransform: "capitalize",
        "&": {//JSS syntax
          "::before": {
            "::hover": {
              border:"none",
            }
          },
          "::before, &::after":{
            border: "none",
          },
          ".MuiSelect-standard": {//found class from inspect
            color: "common.white",
          },
          ".MuiSelect-icon": {
            fill: theme.palette.common.white,
          },
        },
      }}>
        <MenuItem sx={{
          textTransform: "capitalize",
        }} value="all">all</MenuItem>
        {categories?.map(category=><MenuItem sx={{
          textTransform: "capitalize",
        }} key={category} value={category}>{category}</MenuItem>)}
      </Select>
      <StyledAutocomplete
    freeSolo
    id = "selected-product"
    value={selectedProduct}
    onChange={(e, value)=>{handleSearchChange(value?.label)}}
    disablePortal
    options={Array.from(selectedCategory==="all"? products : products.filter((prod)=>prod.category===selectedCategory), prod=> ({id:prod.id, label:prod.title}))}
    sx={{  }}
    renderInput={(params) => <TextField {...params} />}
    />
    <SearchIconWrapper>
      <SearchIcon />
    </SearchIconWrapper>
    </Search>
  )
}


export default function Header() {

  const { user, signOut } = useAuth();
  const cartItems = useSelector((state) => state.cart?.value);
  const count = getItemCount(cartItems);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  function navigateToCart() {
    navigate("/cart");
  }
  function handleProfileMenuOpen(e) {
    setAnchorEl(e.currentTarget);
  }
  function handleMenuClose() {
    setAnchorEl(null);
  }
  async function logout() {
    await signOut();
    navigate("/login");
  }
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id="user-profile-menu"
      keepMounted
      transformOrigin={{
        horizontal: "right",
        vertical: "top",
      }}
      anchorOrigin={{
        horizontal: "right",
        vertical: "bottom",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
      <MenuItem onClick={logout}>Logout</MenuItem>
    </Menu>
  )

  return (
    <>
    <AppBar  
    position="sticky"
    sx={{
      py: 1,
    }}>
        <Toolbar sx={{
          display: "flex",
          gap: 2
        }}>
            <Typography variant='h6' color="inherit" sx={{//css in sx will override mui css
              flexGrow:1,//so it takes entire free space available
              justifyContent:"space-between",
            }}>
              <StyledLink to="/">
                SlipKart
              </StyledLink>
            </Typography>
            <SearchBar xsDisplay="none" smDisplay="flex"/>{/*Using function as a component. It is necessary to start func name with capital letter */}
            <Box flexBasis={500} sx={{ display: "flex", justifyContent: "flex-end"}}>
            <IconButton onClick={navigateToCart} size="large" aria-label="shows cart items count" color="inherit">
              <Badge badgeContent={count} color="error">
                <ShoppingCartSharpIcon />
              </Badge>
            </IconButton>
            {user ? (
              <Button onClick={handleProfileMenuOpen} color="inherit">
                Hello, {user.displayName ?? user.email}
              </Button>
            ) : (
              <Button color="inherit">Login</Button>
            )}
          </Box>
        </Toolbar>
        <SearchBar xsDisplay="flex" smDisplay="none"/>
    </AppBar>
    {renderMenu}
    </>
  )
}
