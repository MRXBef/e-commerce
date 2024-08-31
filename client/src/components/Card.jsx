import React from "react";

const Card = ({ args }) => {
  return (
    <div
      style={{
        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
        borderRadius: '10px',
        display: "flex",
        flexDirection: "column",
        padding: '5px',
        position: 'relative'
      }}
    >
        <img src={args.ownerAvatar} style={{
            position: 'absolute',
            top: '-10px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            objectFit: 'cover',
            right: '-10px',
            border: '2px solid var(--secondary-color)',
            backgroundColor: '#fff',
            boxShadow:
          "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
        }}/>
      <img
        src={args.thumbnail}
        style={{
          width: "100%",
          height: "200px",
          objectFit: 'cover'
        }}
      />
      <div style={{
        width: '100%',
        overflow: 'hidden'
      }}>
        <h1
            style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '100%',
                color: 'black'
            }}
        >{args.productTitle || 'SEPATU VANS UKURAN X'}</h1>
      </div>
      <div style={{
        width: '100%',
        height: '50px',
        marginTop: '10px',
        textAlign: 'center'
      }}>
        <h1 style={{color: 'var(--primary-color)', fontWeight: 'bold'}}>{args.productPrice || 'Rp. 150.000'}</h1>
      </div>
    </div>
  );
};

export default Card;
