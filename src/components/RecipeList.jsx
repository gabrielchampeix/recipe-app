import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Fragment } from "react";
import { addRecipe } from "../services/recipes";

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

    recipes.forEach(recipe => {
        console.log(recipe.tags)
    })

    return (
        <Fragment>
            <div>
                <h2>Recipes</h2>
                {recipes.map(recipe => (
                    <Recipe title={recipe.title} tags={recipe.tags} />
                ))}
            </div>
            <div>
                <AddRecipe />
            </div>
        </Fragment>
    );
}

export function Recipe({ title = "title", tags = ["tag"] }) {
    return (
        <div style={{ border: "1px solid black" }}>
            <h3>{title}</h3>
            <div style={{ display: "flex" }}>
                {tags.map(tag => (
                    <p>{tag}</p>
                ))}
            </div>
        </div>
    )
}



export function AddRecipe() {
    const [title, setTitle] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        await addRecipe({
            title,
            tags: [],
            //ingredients: [],
            //instructions: "",
        });

        setTitle(""); // reset form
    }

    return (
        <div style={{ backgroundColor: "bisque" }}>
            <h2>Add a recipe</h2>
            <form onSubmit={handleSubmit}>
                <label for="title">Title:</label>
                <input required onChange={(e) => setTitle(e.target.value)} type="text" value={title} id="title"></input>
                <div>
                    <label for="tag">Tags:</label>
                    <input type="text" id="tag" placeholder="tag"></input>
                </div>
                <button type="submit">Add the recipe</button>
            </form>
        </div>
    )
}


