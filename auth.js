import { supabase } from "./supabase.js"

/* ================= REGISTER ================= */

window.registerUser = async function() {

    const username = document.getElementById("username").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    if (!username || !email || !password) {
        alert("Please fill all fields")
        return
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username: username
            }
        }
    })

    if (error) {
        alert(error.message)
    } else {
        alert("Registration successful! Please verify your email.")
        window.location.href = "login.html"
    }
}
/* ================= LOGIN ================= */

window.loginUser = async function() {

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    if (!email || !password) {
        alert("Please fill all fields")
        return
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) {
        alert(error.message)
    } else {
        window.location.href = "../index.html"
    }
}
