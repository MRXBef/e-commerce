import React, { useEffect, useState } from 'react'
import '../css/HomePage.css'
import Header from '../components/Header'
import Card from '../components/Card'
import productImage from '../assets/img/productTest.jpeg'
import ownerProfile from '../assets/img/login-hero.png'
import axios from 'axios'
import PageLoader from '../components/PageLoader'
import { axiosInterceptors } from '../utils/tokenHandler'
import rupiahFormat from '../utils/rupiahFormat'

const HomePage = () => {
  const [authorized, setAuthorized] = useState(false)
  const [checkIsAuthorized, setCheckAuthorized] = useState(true)
  const [token, setToken] = useState(null)
  const [expire, setExpire] = useState(0)
  const [products, setProducts] = useState([])

  //inisialisasi axios interceptors
  const axiosJWT = axiosInterceptors({expire, setToken, setExpire})

  useEffect(() => {
    refreshToken()
    getProduct()
  },[])

  const refreshToken = async() => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASEURL}/token`)
      if(response) {
        setAuthorized(true)
        setToken(response.data.accessToken)
      }
    } catch (error) {
      console.log(error.response)
      setAuthorized(false)
    } finally {
      setCheckAuthorized(false)
    }
  }

  const getProduct = async() => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASEURL}/product`)
      setProducts(response.data.datas)
    } catch (error) {
      console.log(error.response)
    }
  }

  console.log(products)


  if(checkIsAuthorized) {
    return (
      <div style={{width: '100%', height: '100vh', backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <PageLoader/>
      </div>
    )
  }

  return (
    <div className='homepage-container'>
        <Header isAuthorize={authorized}/>
        
        <div className="content-container">
          <div className="highlight-container">
            {
              products.map((product, index) => (
                <Card key={index} args={{
                  productTitle: product.name,
                  thumbnail: `${import.meta.env.VITE_BASEURL}/product/${product.thumbnail}`,
                  ownerAvatar: product.avatar,
                  productPrice: rupiahFormat(product.price),
                  productDiscount: product.discount
                }}/>
              ))
            }
          </div>
        </div>
    </div>
  )
}

export default HomePage