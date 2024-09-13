import * as icon from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import avatar from "../assets/img/avatar.png";
import Card from "../components/Card";
import Header from "../components/Header";
import InputTextWithICon from "../components/InputTextWithICon";
import PageLoader from "../components/PageLoader";
import "../css/pages-css/ProfilePage.css";
import {
  categoryData,
  handleAvatarChange,
  handleProductImageChange,
} from "../utils/profilePage";
import rupiahFormat from "../utils/rupiahFormat";
import {
  axiosInterceptors,
  decodeToken,
  refreshToken,
} from "../utils/tokenHandler";

const ProfilePage = () => {
  //auth state
  const [authorized, setAuthorized] = useState(false);
  const [checkIsAuthorized, setCheckAuthorized] = useState(true);
  const [token, setToken] = useState(null);
  const [expire, setExpire] = useState(0);

  //this state
  const [user, setUser] = useState({
    username: "",
    email: "",
    avatar: null,
    balance: 0,
    followings: [],
    followeds: [],
    products: [],
    carts: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAddFormShow, setIsAddFormShow] = useState(false);
  const [insertedProduct, setInsertedProduct] = useState({
    productName: "",
    productPrice: "",
    productStock: "",
    productDiscount: 0,
    productDesc: "",
    productCategory: [],
  });
  const [files, setFiles] = useState([]);

  //inisialisasi axios interceptors
  const axiosJWT = axiosInterceptors({ expire, token, setToken, setExpire });

  const navigate = useNavigate();
  const categories = categoryData();

  useEffect(() => {
    refreshToken({ setAuthorized, setCheckAuthorized, setExpire, setToken });
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!authorized && !checkIsAuthorized) {
      navigate("/login");
    }
  }, [authorized, checkIsAuthorized, navigate]);

  const fetchUserData = async () => {
    try {
      const response = await axiosJWT.get(
        `${import.meta.env.VITE_BASEURL}/user`
      );
      setUser({ ...response.data });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error.response);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setInsertedProduct((prevState) => {
        const updatedCategories = checked
          ? [...prevState.productCategory, value]
          : prevState.productCategory.filter((category) => category !== value);

        return {
          ...prevState,
          productCategory: updatedCategories,
        };
      });
    } else {
      setInsertedProduct((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();

    //mengubah array category menjadi format koma
    const categoryFormat = insertedProduct.productCategory.join(",");
    const discountFormat = insertedProduct.productDiscount / 100;

    const formData = new FormData();
    formData.append("name", insertedProduct.productName);
    formData.append("price", insertedProduct.productPrice);
    formData.append("stock", insertedProduct.productStock);
    formData.append("discount", discountFormat);
    formData.append("description", insertedProduct.productDesc);
    formData.append("category", categoryFormat);
    Array.from(files).forEach((file) => {
      formData.append("image", file);
    });

    try {
      await axiosJWT.post(`${import.meta.env.VITE_BASEURL}/product`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setIsAddFormShow(false);
      fetchUserData();
      setInsertedProduct((prevState) => ({
        ...prevState,
        productName: "",
        productPrice: "",
        productStock: "",
        productDiscount: 0,
        productDesc: "",
        productCategory: [],
      }));
      setFiles([]);
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleShowAvatar = () => {
    if (user.avatar === null) {
      return avatar;
    }
    return `${import.meta.env.VITE_BASEURL}/user/avatar/${user.avatar}`;
  };

  const handleDeleteProduct = async(product) => {
    if(!confirm("Ingin Menghapus Product ini?")) return
    try {
      const response = await axiosJWT.delete(`${import.meta.env.VITE_BASEURL}/product/${product.uuid}`)
      fetchUserData()
    } catch (error) {
      console.error(error)
    }
  }

  if (checkIsAuthorized) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PageLoader />
      </div>
    );
  }

  // Jangan render halaman jika tidak authorized (taruh di halaman khusus untuk user yang sudah ter authorized)
  if (!authorized) {
    return null;
  }

  return (
    <div className="profile-container">
      <Header
        args={{
          isAuthorized: authorized,
          token: decodeToken(token),
        }}
      />
      {isLoading ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            backgroundColor: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PageLoader />
        </div>
      ) : (
        <div className="content-container">
          <div className="profile-info-container">
            <div className="profile-avatar">
              <input
                type="file"
                id="changeAvatar"
                style={{ display: "none" }}
                accept="image/*"
                onChange={(e) =>
                  handleAvatarChange(e, user, axiosJWT, fetchUserData)
                }
              />
              <label className="change-avatar-label" htmlFor="changeAvatar">
                <i>
                  <CIcon icon={icon.cilPen} />
                </i>
                <img src={handleShowAvatar()} />
              </label>
            </div>
            <div className="profile-status">
              <div className="profile-biodata">
                <h1>@{user.username}</h1>
                <h1 style={{ fontSize: "15px", color: "var(--info-color)" }}>
                  {user.followeds.length} pengikut | {user.followings.length}{" "}
                  mengikuti
                </h1>
              </div>
            </div>
            <div className="profile-menu">
              <h1>{rupiahFormat(user.balance)}</h1>
              <i style={{ position: "relative", backgroundColor: "var(--warning-color)" }}>
                <p
                  style={{
                    position: "absolute",
                    fontSize: "10px",
                    padding: "0px 6px 0px 6px",
                    backgroundColor: "var(--danger-color)",
                    borderRadius: "50%",
                    bottom: "-5px",
                    right: "-5px",
                  }}
                >
                  {user.carts.length}
                </p>
                <CIcon icon={icon.cilCart} />
              </i>
              <i>
                <CIcon icon={icon.cilSettings} />
              </i>
            </div>
          </div>

          <div className="product-title-container">
            <h1>Produk Kamu</h1>
            <i onClick={() => setIsAddFormShow(true)}>
              <CIcon icon={icon.cilPlus} />
            </i>
          </div>
          <div className="product-container">
            {user.products.map((product, index) => (
              <Card
                key={index}
                args={{
                  isOwnProduct: true,
                  totalOfProduct: user.products.length,
                  productTitle: product.name,
                  productThumbnail: `${
                    import.meta.env.VITE_BASEURL
                  }/product/image/${product.images[0].file_name}`,
                  ownerAvatar: `${import.meta.env.VITE_BASEURL}/user/avatar/${
                    user.avatar
                  }`,
                  productPrice: rupiahFormat(product.price),
                  productDiscount: product.discount,
                  productUuid: product.uuid,
                  productOwner: product.owner,
                  deleteProduct: () => handleDeleteProduct(product)
                }}
              />
            ))}
          </div>

          {/* form add product */}
          <div
            onClick={() => setIsAddFormShow(false)}
            className={`form-add-container ${
              isAddFormShow ? `` : `form-add-container-hidden`
            }`}
          >
            <form onClick={(e) => e.stopPropagation()} onSubmit={addProduct}>
              <h1
                style={{
                  fontSize: "17px",
                  fontWeight: "500",
                  color: "var(--info-color)",
                }}
              >
                Tambah Produk
              </h1>
              <InputTextWithICon
                args={{
                  width: "100%",
                  type: "text",
                  name: "productName",
                  event: handleInputChange,
                  value: insertedProduct.productName,
                  iconColor: "var(--secondary-color)",
                  iconName: icon.cilPlus,
                  placeholder: "''",
                  label: "Nama Produk",
                  borderColor: "grey",
                }}
              />
              <InputTextWithICon
                args={{
                  width: "100%",
                  type: "number",
                  name: "productPrice",
                  event: handleInputChange,
                  value: insertedProduct.productPrice,
                  iconColor: "var(--secondary-color)",
                  iconName: icon.cilPlus,
                  placeholder: "0",
                  label: "Harga Produk",
                  borderColor: "grey",
                }}
              />
              <InputTextWithICon
                args={{
                  width: "100%",
                  type: "number",
                  name: "productStock",
                  event: handleInputChange,
                  value: insertedProduct.productStock,
                  iconColor: "var(--secondary-color)",
                  iconName: icon.cilPlus,
                  placeholder: "0",
                  label: "Stok Produk",
                  borderColor: "grey",
                }}
              />
              <InputTextWithICon
                args={{
                  width: "100%",
                  type: "number",
                  name: "productDiscount",
                  event: handleInputChange,
                  value: insertedProduct.productDiscount,
                  iconColor: "var(--secondary-color)",
                  iconName: icon.cilPlus,
                  placeholder: "0",
                  label: "Diskon Produk (%)",
                  borderColor: "grey",
                }}
              />
              <label
                style={{ fontSize: "14px", marginBottom: "-5px" }}
                htmlFor="textarea"
              >
                Deskripsi Produk
              </label>
              <textarea
                className="textarea"
                id="textarea"
                placeholder="Deskripsi Produk"
                value={insertedProduct.productDesc}
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1px solid grey",
                  borderRadius: "10px",
                }}
                onChange={handleInputChange}
                name="productDesc"
              ></textarea>

              {/* Category Checkboxes */}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label
                  style={{
                    marginBottom: "5px",
                    fontSize: "14px",
                  }}
                >
                  Kategori
                </label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    width: "100%",
                    border: "1px solid grey",
                    padding: "10px",
                    borderRadius: "10px",
                  }}
                >
                  {categories.map((category, index) => (
                    <label key={index}>
                      <input
                        type="checkbox"
                        name="productCategory"
                        checked={insertedProduct.productCategory.includes(
                          category.value
                        )}
                        onChange={handleInputChange}
                        value={category.value}
                        style={{ marginRight: "10px" }}
                      />
                      {category.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* file input */}
              <div>
                <input
                  type="file"
                  id="fileInput"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleProductImageChange(e, setFiles)}
                  style={{ display: "none" }}
                />
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginTop: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "wrap",
                      border: files.length > 0 ? "1px solid grey" : "",
                      borderRadius: "10px",
                    }}
                  >
                    {files.length > 0 &&
                      Array.from(files).map((file, index) => (
                        <div
                          key={index}
                          style={{ margin: "10px", position: "relative" }}
                        >
                          <i
                            style={{
                              position: "absolute",
                              top: "0",
                              right: "0",
                              cursor: "pointer",
                              background:
                                "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7))",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              color: "#fff",
                            }}
                            onClick={() => {
                              setFiles((prevState) =>
                                prevState.filter((file, idx) => idx !== index)
                              );
                            }}
                          >
                            <CIcon icon={icon.cilX} />
                          </i>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`preview ${index}`}
                            style={{
                              width: "150px",
                              height: "150px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <label
                  htmlFor="fileInput"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px 20px",
                    width: "30%",
                    textAlign: "center",
                    backgroundColor: "var(--secondary-color)",
                    color: "#fff",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  <i>
                    <CIcon icon={icon.cilImagePlus} />
                  </i>
                </label>
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "10px 20px",
                    color: "#fff",
                    backgroundColor: "var(--primary-color)",
                    borderRadius: "5px",
                  }}
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
