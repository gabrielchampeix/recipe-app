import { useState } from "react";
import Tag from "./Tag";
import { editRecipe } from "../services/recipes";

export default function EditModal({ id, title, tags = [], closeHandle }) {
    //Tags management: text input for new tag, array to contain new tags
    const [newTagInput, setNewTagInput] = useState("")
    const [newTags, setNewTags] = useState(tags)
    const [newTitle, setNewTitle] = useState(title)

    async function confirmChangeHandle(e, id, newTitle, newTags) {
        e.preventDefault();
        const confirmed = window.confirm("Are you sure you want to modify this recipe?");
        if (!confirmed) return;
        await editRecipe(id, newTitle, newTags)
    }

    function removeTag(tagToRemove) {
        setNewTags((prev) => prev.filter((tag) => tag !== tagToRemove));
    };

    function handleAddTag() {
        if (!newTagInput.trim()) {
            alert("No tag entered")
            return
        };

        setNewTags([...newTags, newTagInput.trim()]);
        setNewTagInput(""); // reset input
    }

    return (
        <div className="edit-modal" style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "gainsboro",
            top: "0px",
            left: "0px",
            margin: "0"
        }}>


            {/* CLOSE BUTTON */}
            <button onClick={closeHandle} style={{
                position: "absolute",
                right: "0px",
                cursor: "pointer"
            }}>X</button>


            {/* EDIT SECTION */}
            <p>Edit {title}</p>
            <form onSubmit={(e) => confirmChangeHandle(e, id, newTitle, newTags)}>
                {/* Title */}
                <label htmlFor="title">New title:</label>
                <input
                    onChange={(e) => {
                        setNewTitle(e.target.value)
                    }}
                    type="text" id="title"></input>
                {/* Tags */}
                <ul>
                    <label>Tags:</label>
                    {newTags.map((tag, index) => (
                        <Tag tagDeleteHandle={removeTag} canBeDeleted={true} key={index} label={tag} />
                    ))}
                    <label for="tag">Enter a new tag:</label>
                    <input
                        onChange={(e) => setNewTagInput(e.target.value)}
                        value={newTagInput} type="text" id="tag" placeholder="tag">
                    </input>
                    <button type="button" onClick={handleAddTag}>
                        Add Tag
                    </button>
                </ul>
                <button type="submit">Confirm</button>
            </form>

        </div>
    )
}