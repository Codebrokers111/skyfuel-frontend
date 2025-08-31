import React from 'react'

const Home = () => {
    const products = [
  {
    id: 1,
    name: "Supplement Vitamins",
    price: 1999,
    image:
      new URL("../assets/prd_images/img1.jpg", import.meta.url).href,
    rating: 4.5
  },
  {
    id: 2,
    name: "Supplement Pro",
    price: 2999,
    image:
      new URL("../assets/prd_images/img2.jpg", import.meta.url).href,
    rating: 4.0
  },
  {
    id: 3,
    name: "Supplement Lite",
    price: 999,
    image:
      new URL("../assets/prd_images/img3.jpg", import.meta.url).href,
    rating: 3.5
  },
  {
    id: 4,
    name: "Supplement Max",
    price: 1499,
    image:
      new URL("../assets/prd_images/img4.jpg", import.meta.url).href,
    rating: 4.8
  },
  {
    id: 5,
    name: "Supplement ultra",
    price: 4999,
    image:
      new URL("../assets/prd_images/img5.jpg", import.meta.url).href,
    rating: 5.0
  },
];
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Featured Products
      </h1>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
          >
            {/* Image */}
            <img
              src={product.image}
              alt={product.name}
              className="p-4 rounded-t-lg"
              style={{height:'250px', width:'250px'}}
            />

            {/* Content */}
            <div className="px-5 pb-5 flex flex-col justify-between h-36">
              <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {product.name}
              </h2>
              <div className="flex items-center mt-2.5 mb-5">
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <svg className="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                </svg>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800 ms-3">{product.rating}</span>
        </div>
                <div className="flex items-center justify-between my-3pp">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{product.price}</span>
            <a href="#" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add to cart</a>
        </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
