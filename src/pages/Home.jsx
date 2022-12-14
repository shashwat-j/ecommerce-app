import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'

export default function Home() {

    const [products, setProducts] = useState([]);

    async function fetchAllProducts(){
        const response = await fetch('https://fakestoreapi.com/products');
        const result = await response.json();
        setProducts(result);
    }

    useEffect(()=>{
        fetchAllProducts();
    },[]);

  return (
    <div>
        <pre>{JSON.stringify(products, null, 2)}</pre>
    </div>
  )
}
