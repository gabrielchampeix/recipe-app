import { addRecipe } from "../services/recipes";
import { useState } from "react";
import Tag from "./Tag";

export default function AddRecipeBox({ tagsToSelect = [] }) {
    const [visible, setVisible] = useState(false)
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");

    const removeTag = (tagToRemove) => {
        setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
    };


    function handleAddTag() {
        console.log(tagInput)
        setTags([...tags, tagInput]);
        // setTagInput(""); // reset input
    }

    function handleTagSelectChange(e) {
        const selectedTag = e.target.value;
        setTagInput(selectedTag)
        console.log(tagInput)
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
        <div className={`add-recipe-form ${visible ? "add-recipe-form-active" : ""}`}>
            <div onClick={() => { setVisible(!visible) }} className="add-recipe-box-header">
                <h2>Add a recipe</h2>
                <span>+</span>
            </div>
            <form onSubmit={handleSubmit}>

                {/* TITLE */}
                <div>
                    <label htmlFor="title">Title:</label>
                    <input required onChange={(e) => setTitle(e.target.value)} type="text" value={title} id="title"></input>
                </div>

                {/* TAGS */}
                <label htmlFor="tag">Tags:</label>
                {/* <input
                    onChange={(e) => setTagInput(e.target.value)}
                    value={tagInput} type="text" id="tag" placeholder="tag">
                </input> */}
                <select onChange={handleTagSelectChange} name="tags" id="tag">
                    <option value="" disabled selected>Select your option</option>
                    {tagsToSelect.map((tag, index) => (
                        <option key={index} value={tag.label} >{tag.label}</option>
                    ))}
                </select>
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
        //<div className="add-recipe-background"></div>
        // </div>
    )
}