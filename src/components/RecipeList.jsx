import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { recipes } from "../data/recipesBackup";

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
        <div>
            {/* <Recipe title="Manual test" tags={["test", "test"]} /> */}
            {recipes.map(recipe => (
                <Recipe title={recipe.title} tags={recipe.tags} />
            ))}
            {/* {recipes.map(recipe => (
                <div key={recipe.id}>
                    <h3>{recipe.title}</h3>
                    {recipe.tags.map(tag => (
                        <p>{tag}</p>
                    ))}
                </div>
            ))} */}
        </div>
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