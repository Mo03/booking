import React from "react";

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => (
  <div className="category-filter">
    <button
      className={selectedCategory.name === "الكل" ? "active" : ""}
      onClick={() => onSelectCategory({ name: "الكل" })}
    >
      الكل
    </button>
    {categories.map((category, index) => (
      <button
        key={index}
        className={selectedCategory.name === category.name ? "active" : ""}
        onClick={() => onSelectCategory({ name: category.name })}
      >
        {category.name}
      </button>
    ))}
  </div>
);

export default CategoryFilter;
