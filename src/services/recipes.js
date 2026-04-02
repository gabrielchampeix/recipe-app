import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function addRecipe(recipe) {
    const docRef = await addDoc(collection(db, "recipes"), {
        title: recipe.title,
        tags: recipe.tags || [],
        //ingredients: recipe.ingredients || [],
        //instructions: recipe.instructions || "",
        createdAt: serverTimestamp(),
    });

    return docRef.id;
}