import { Badge, Box, Button } from '@mui/material'
import { IconButton, Toolbar } from '@mui/material'
import { Typography } from '@mui/material'
import { AppBar } from '@mui/material'
import React from 'react'
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp'

export default function Header() {
  return (
    <AppBar position="sticky">
        <Toolbar>
            <Typography variant='h6' color="inherit" sx={{//css in sx will override mui css
              flexGrow:1,//so it takes entire free space available
            }}>
              SlipKart
            </Typography>
            <Box sx={{display: {xs:"none", md:"flex"}}}>
              <IconButton size="large" aria-label="shows cart items count" color="inherit">
                <Badge badgeContent={1} color="error">
                  <ShoppingCartSharpIcon/>
                </Badge>
              </IconButton>
            </Box>
            <Button color="inherit">Login</Button>
        </Toolbar>
    </AppBar>
  )
}
