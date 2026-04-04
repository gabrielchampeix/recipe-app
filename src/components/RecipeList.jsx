import { db } from "../firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Fragment } from "react";
import { addRecipe, subscribeToRecipes, deleteRecipe, editRecipe } from "../services/recipes";

async function fetchRecipes() {
    const querySnapshot = await getDocs(collection(db, "recipes"));
    const recipes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    return recipes;
}


export default function RecipeList() {
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState("");
    const [editing, setEditing] = useState(false)
    const [editedId, setEditedId] = useState([])
    const [editedTitle, setEditedTitle] = useState("")
    const [editedTags, setEditedTags] = useState([])


    const filteredRecipes = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        fetchRecipes().then(setRecipes);
    }, []);

    useEffect(() => {
        const unsubscribe = subscribeToRecipes(setRecipes);
        return () => unsubscribe(); // cleanup
    }, []);

    async function handleDelete(id) {
        const confirmed = window.confirm("Delete this recipe?");
        if (!confirmed) return;
        await deleteRecipe(id);
    }

    return (
        <Fragment>
            {editing ? <EditModal
                title={editedTitle}
                tags={editedTags}
                id={editedId}
                closeHandle={() => setEditing(false)} /> : ""
            }
            <input
                type="text"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            ></input>
            <div>
                <h2>Recipes</h2>
                {filteredRecipes.map((recipe, index) => (
                    <Recipe
                        deleteHandle={() => handleDelete(recipe.id)}
                        editHandle={() => {
                            setEditing(true)
                            setEditedId(recipe.id)
                            setEditedTitle(recipe.title)
                            setEditedTags(recipe.tags)
                        }}
                        closeHandle={() => setEditing(false)}
                        key={index} title={recipe.title}
                        tags={recipe.tags}
                    />
                ))}
            </div>
            <div>
                <AddRecipeBox />
            </div>
        </Fragment>
    );
}

export function Recipe({ title = "title", tags = ["tag"], deleteHandle, editHandle }) {
    return (
        <div style={{ border: "1px solid black" }}>
            <h3>{title}</h3>
            <ul>
                {tags.map((tag, index) => (
                    <Tag key={index} label={tag} />
                ))}
            </ul>
            <button onClick={deleteHandle}>Delete</button>
            <button onClick={editHandle}>Edit</button>
        </div>
    )
}

export function EditModal({ id, title, tags = [], closeHandle }) {
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



export function AddRecipeBox() {
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
        <div style={{ backgroundColor: "bisque" }}>
            <h2>Add a recipe</h2>
            <form onSubmit={handleSubmit}>
                <label for="title">Title:</label>
                <input required onChange={(e) => setTitle(e.target.value)} type="text" value={title} id="title"></input>

                <label for="tag">Tags:</label>
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
    )
}

export function Tag({ label = "tag", canBeDeleted = false, tagDeleteHandle }) {
    return (
        <li style={{ padding: "4px", border: "1px solid grey", listStyle: "none", display: "inline" }}>
            {label}
            {canBeDeleted ? <button type="button" onClick={() => tagDeleteHandle(label)}>X</button> : ""}
        </li>
    )
}
