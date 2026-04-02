import { db } from "../firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Fragment } from "react";
import { addRecipe, subscribeToRecipes, deleteRecipe } from "../services/recipes";

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
            <div>
                <h2>Recipes</h2>
                {recipes.map((recipe, index) => (
                    <Recipe deleteHandle={() => handleDelete(recipe.id)} key={index} title={recipe.title} tags={recipe.tags} />
                ))}
            </div>
            <div>
                <AddRecipe />
            </div>
        </Fragment>
    );
}

export function Recipe({ title = "title", tags = ["tag"], deleteHandle }) {
    return (
        <div style={{ border: "1px solid black" }}>
            <h3>{title}</h3>
            <div style={{ display: "flex" }}>
                {tags.map((tag, index) => (
                    <p key={index}>{tag}</p>
                ))}
            </div>
            <button onClick={deleteHandle}>Delete</button>
        </div>
    )
}



export function AddRecipe() {
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");

    function handleAddTag() {
        if (!tagInput.trim()) {
            alert("no tag")
            return
        };

        setTags([...tags, tagInput.trim()]);
        setTagInput(""); // reset input
    }

    async function handleSubmit(e) {
        e.preventDefault();
        await addRecipe({
            title,
            tags,
            //ingredients: [],
            //instructions: "",
        });

        setTitle(""); // reset form
        setTags([]);
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
                {tags.map((tag, index) => (
                    <p key={index}>{tag}</p>
                ))}
                <button type="submit">Add the recipe</button>
            </form>
        </div>
    )
}


