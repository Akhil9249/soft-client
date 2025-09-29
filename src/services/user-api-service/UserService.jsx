import React from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const UserService = () => {

    const axiosPrivate = useAxiosPrivate()

    const postRegister = async (data) => {
        const response = await axiosPrivate.post("/signup",data);
        return response;
    };

    const postLogin = async (data) => {
        const response = await axiosPrivate.post("/login",data);
        return response;
    };


    //get all home data
    const getHomePageData = async () => {
        const response = await axiosPrivate.get("/product");
        return response.data;
    };


     //get all home data
     const getCategoryeData = async () => {
        const response = await axiosPrivate.get("/category");
        return response.data;
     };

        //get all home data
        const getProductData = async () => {
            const response = await axiosPrivate.get("/product");
            return response.data;
        };




// ******************************
//get all data from cart
const getCartPageData = async () => {

    const response = await axiosPrivate.get('/cart');
    return response.data;
};

//add to cart
const addToCart = async (data) => {

    const response = await axiosPrivate.post("/cart", data);
    return response.data;
};

//remove form cart
const handleRemoveFromCart = async (productId, data) => {

    const response = await axiosPrivate.delete(`/cart/${productId}`, {
        data: data
    });
    return response.data;
};

const handleCartQuantityChange = async (productId, data) => {

    const response = await axiosPrivate.put(`/cart/${productId}`, data)
    return response?.data
}

//get all data from wishlist
const getWishlistData = async (userId) => {

    const response = await axiosPrivate.get('/wishlist');
    return response.data;
};

//add to wishlist
const addToWihlist = async (data) => {

    const response = await axiosPrivate.post("/wishlist", data);
    return response.data;
};

//remove form wishlist
const handleRemoveFromWishlist = async (productId, data) => {

    const response = await axiosPrivate.delete(`/wishlist/${productId}`, {
        data: data
    });
    return response.data;
};


//post order
const postOrder = async (data) => {

    const response = await axiosPrivate.post("/order", data);
    return response.data;
};

//get all data from wishlist
const checkPorductAvailability = async () => {

    const response = await axiosPrivate.get("/order/check-cart/");
    return response.data;
};
const getSingleProductInCart = async (productId) => {

    const response = await axiosPrivate.get(`/product/in-cart/${productId}`)
    return response?.data
}

const getFilterProducts = async (categoryId ) => {
    const response = await axiosPrivate.get(`/product/filter/${categoryId }`);
    return response.data;
};


const SaveAddress = async (data) => {

    const response = await axiosPrivate.post("/address/add",data);
    return response.data;
};

const getAllAddress = async () => {

    const response = await axiosPrivate.get("/address");
    return response.data;
};

const getAllOrders = async () => {

    const response = await axiosPrivate.get("/order/single-user");
    return response.data;
};

const getUserDetail = async () => {

    const response = await axiosPrivate.get("/detail");
    return response.data;
};

const changeDetail = async (data) => {

    const response = await axiosPrivate.put("/detail",data);
    return response.data;
};

//get trending products

const getTrendingProducts = async () => {
    const response = await axiosPrivate.get("/product/trending");
    return response.data;
  };

  //get today's offer
    const getTodaysOffer = async () => {
        const response = await axiosPrivate.get("/product/today-offers");
        return response.data;
    };
    const getSingleProduct = async (productId) => {
  const response = await axiosPrivate.get(`/product/${productId}`);
  return response.data;
};




    return { 
        postRegister,
        postLogin,
        getHomePageData,
        getCartPageData,
        addToCart,
        handleRemoveFromCart,
        handleCartQuantityChange,
        getWishlistData,
        addToWihlist,
        handleRemoveFromWishlist,
        postOrder,
        checkPorductAvailability,
        getSingleProductInCart,
        getFilterProducts,
        getCategoryeData,
        getProductData,
        SaveAddress,
        getAllAddress,
        getAllOrders,
        getUserDetail,
        changeDetail,
        getTrendingProducts,
        getTodaysOffer,
        getSingleProduct
    };
};

export default UserService;
