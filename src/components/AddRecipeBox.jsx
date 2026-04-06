import { addRecipe } from "../services/recipes";
import { useState } from "react";
import Tag from "./Tag";

export default function AddRecipeBox() {
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");

    const removeTag = (tagToRemove) => {
        setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
    };

    function handleAddTag() {
        if (!tagInput.trim()) {
            alert("No tag entered")
            return
        };

        setTags([...tags, tagInput.trim()]);
        setTagInput(""); // reset input
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (tags.length > 0) {
            await addRecipe({
                title,
                tags,
                //ingredients: [],
                //instructions: "",
            });

            setTitle(""); // reset form
            setTags([]);
        } else { alert("You need 1 tag at least") }
    }

    return (
        <div className="add-recipe-box add-recipe-box-active">
            <div className="add-recipe-form add-recipe-form-active">
                <h2>Add a recipe</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="title">Title:</label>
                    <input required onChange={(e) => setTitle(e.target.value)} type="text" value={title} id="title"></input>

                    <label htmlFor="tag">Tags:</label>
                    <input
                        onChange={(e) => setTagInput(e.target.value)}
                        value={tagInput} type="text" id="tag" placeholder="tag">
                    </input>
                    <button type="button" onClick={handleAddTag}>
                        Add Tag
                    </button>
                    <ul>
                        {tags.map((tag, index) => (
                            <Tag tagDeleteHandle={removeTag} canBeDeleted={true} key={index} label={tag} />
                        ))}
                    </ul>
                    <button type="submit">Add the recipe</button>
                </form>
            </div>
            <div className="add-recipe-background add-recipe-background-active"></div>
        </div>
    )
}