import { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import axios from "axios";
import { useDispatch } from "react-redux";
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
    const getAllItems = async () => {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const { data } = await axios.get(
          "http://localhost:5000/api/items/get-item"
        );
        setItemsData(data);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        console.log(error);
      }
    };
    getAllItems();
  }, [dispatch]);

  return (
    <Sidebar>
      <div className="w-full p-4 bg-gray-50">
        {/* Tabs Container */}
        <div className="w-full bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-3 sm:grid-cols-6 w-full">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`relative flex flex-col items-center justify-center p-4 transition-all duration-200 
                  ${
                    selectedCategory === category.name
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                  }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="h-10 w-16 object-contain"
                  />
                  <span className={`text-sm font-medium 
                    ${selectedCategory === category.name 
                      ? "text-blue-600" 
                      : "text-gray-600"}`}
                  >
                    {category.name}
                  </span>
                </div>
                {/* Active indicator bar */}
                <div className={`absolute bottom-0 left-0 w-full h-0.5 
                  ${selectedCategory === category.name 
                    ? "bg-blue-500" 
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
              .filter((item) => item.category === selectedCategory)
              .map((item) => (
                <ItemList key={item.id} item={item} />
              ))}
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default Homepage;