import React from 'react'
import '../css/HomePage.css'
import Header from '../components/Header'
import Card from '../components/Card'
import productImage from '../assets/img/productTest.jpeg'
import ownerProfile from '../assets/img/login-hero.png'

const HomePage = () => {
  return (
    <div className='homepage-container'>
        <Header/>
        
        <div className="content-container">
          <div className="highlight-container">
            <Card args={{
              thumbnail: productImage,
              ownerAvatar: ownerProfile
            }}/>
            <Card args={{
              thumbnail: productImage,
              ownerAvatar: ownerProfile
            }}/>
            <Card args={{
              thumbnail: productImage,
              ownerAvatar: ownerProfile
            }}/>
            <Card args={{
              thumbnail: productImage,
              ownerAvatar: ownerProfile
            }}/>
            <Card args={{
              thumbnail: productImage,
              ownerAvatar: ownerProfile
            }}/>
            <Card args={{
              thumbnail: productImage,
              ownerAvatar: ownerProfile
            }}/>
            <Card args={{
              thumbnail: productImage,
              ownerAvatar: ownerProfile
            }}/>
            <Card args={{
              thumbnail: productImage,
              ownerAvatar: ownerProfile
            }}/>
            <Card args={{
              thumbnail: productImage,
              ownerAvatar: ownerProfile
            }}/>
            <Card args={{
              thumbnail: productImage,
              ownerAvatar: ownerProfile
            }}/>
            <Card args={{
              thumbnail: productImage,
              ownerAvatar: ownerProfile
            }}/>
            <Card args={{
              thumbnail: productImage,
              ownerAvatar: ownerProfile
            }}/>
          </div>
        </div>
    </div>
  )
}

export default HomePage