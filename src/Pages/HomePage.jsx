import { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import { useDispatch } from "react-redux";
import { get } from "../Utils/Serivces/apiService";
import { GET_ALL_ITEMS_API } from "../Utils/Contants/Api";
import ItemList from "../Components/Item/ItemList";

const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Cricket");
  
  const categories = [
    {
      name: "Cricket",
      imageUrl: "https://www.poornima.edu.in/wp-content/uploads/2023/09/cricket-clip-art_f4214a4f2.jpg",
    },
    {
      name: "Fitness",
      imageUrl: "https://clipart-library.com/data_images/107900.png",
    },
    {
      name: "Table Tennis",
      imageUrl: "https://cdn.pixabay.com/photo/2022/05/23/16/05/table-tennis-7216580_960_720.png",
    },
    {
      name: "Badminton",
      imageUrl: "https://clipart-library.com/images_k/badminton-transparent-background/badminton-transparent-background-10.png",
    },
    {
      name: "Football",
      imageUrl: "https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/21494/football-clipart-xl.png",
    },
    {
      name: "Basketball",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Basketball_Clipart.svg/2048px-Basketball_Clipart.svg.png",
    },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    (
      async () => {
          const res = await get(GET_ALL_ITEMS_API);
          console.log(res, 'res');
          if(res.success) {
            console.log(res.data, 'data');
            setItemsData(res.data);
          } else {
            console.log(res);
          }
      }
    )();
  }, [dispatch]);

  return (
    <Sidebar>
      <div className="w-full p-4 bg-gray-50">
        {/* Gradient bar at top */}
        <div className="w-full h-2 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-t-lg"></div>
        
        {/* Tabs Container */}
        <div className="w-full bg-white rounded-b-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 w-full">
            {categories.map((category, index) => (
              <button
                key={category.name + index}
                onClick={() => setSelectedCategory(category.name)}
                className={`relative p-3 transition-all duration-200 rounded-t-lg mx-1 my-2
                  ${
                    selectedCategory === category.name
                    ? "bg-gradient-to-r from-yellow-400/20 via-red-500/20 to-pink-500/20"
                    : "hover:bg-gray-50"
                  }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="h-8 w-8 object-contain"
                  />
                  <span className={`text-sm font-medium whitespace-nowrap
                    ${selectedCategory === category.name 
                      ? "text-red-500" 
                      : "text-gray-600"}`}
                  >
                    {category.name}
                  </span>
                </div>
                {/* Active indicator bar */}
                <div className={`absolute bottom-0 left-0 w-full h-0.5 rounded-full
                  ${selectedCategory === category.name 
                    ? "bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500" 
                    : "bg-transparent"}`} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {itemsData
              .filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase())
              .map((item) => (
                <ItemList key={item._id} item={item} />
              ))}
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default Homepage;