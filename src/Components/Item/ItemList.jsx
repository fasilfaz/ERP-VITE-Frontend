import { useDispatch } from "react-redux";

const ItemList = ({ item }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...item, quantity: 1 },
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
      <div className="relative">
        {/* Top gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"></div>
        
        {/* Image container */}
        <div className="relative group">
          <img
            alt={item.name}
            src={item.image}
            className="h-48 w-full object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
      
      <div className="p-5 space-y-3">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 tracking-tight">{item.name}</h3>
        
        {/* Price can be added here if needed */}
        
        {/* Button */}
        <button 
          onClick={handleAddToCart}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white rounded-lg
            hover:from-yellow-500 hover:via-red-600 hover:to-pink-600
            transform transition-all duration-200
            font-medium shadow-sm hover:shadow-md
            focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
        >
          Add to Invoice
        </button>
      </div>
    </div>
  );
};

export default ItemList;