import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Fragment } from "react";

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
    return (
        <div style={{ backgroundColor: "bisque" }}>
            <h2>Add a recipe</h2>
            <input id="title" placeholder="title"></input>
            <div>
                <h4>Tags</h4>
                <input id="tag" placeholder="tag"></input>
                <button>Add</button>
            </div>
        </div>
    )
}

