import { useState } from "react";
import Tag from "./Tag";

export default function EditModal({ id, title, tags = [], closeHandle }) {
    const [newTags, setNewTags] = useState(tags)
    const [newTitle, setNewTitle] = useState(title)

    async function confirmChangeHandle(e, id, newTitle, newTags) {
        e.preventDefault();
        console.log("confirm")
        const confirmed = window.confirm("Are you sure you want to modify this recipe?");
        if (!confirmed) return;
        await editRecipe(id, newTitle, newTags)
    }

    const removeTag = (tagToRemove) => {
        setNewTags((prev) => prev.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "gainsboro",
            top: "0px",
            left: "0px",
            margin: "0"
        }}>
            <button onClick={closeHandle} style={{
                position: "absolute",
                right: "0px",
                cursor: "pointer"
            }}>X</button>
            <p>Edit {title}</p>
            <form onSubmit={(e) => confirmChangeHandle(e, id, newTitle, newTags)}>
                <label htmlFor="title">New title:</label>
                <input
                    onChange={(e) => {
                        setNewTitle(e.target.value)
                        console.log(newTitle)
                    }}
                    type="text" id="title"></input>

                <ul>
                    <label>Tags:</label>
                    {newTags.map((tag, index) => (
                        <Tag tagDeleteHandle={removeTag} canBeDeleted={true} key={index} label={tag} />
                    ))}
                </ul>
                <button type="submit">Confirm</button>
            </form>

        </div>
    )
}