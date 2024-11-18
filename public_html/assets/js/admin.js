
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, getDoc, doc, increment, updateDoc, collection, onSnapshot, addDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {getStorage, listAll, ref, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBpDrnuCX0GztgqmRxs6XXzWIsrXFofJu8",
    authDomain: "saveandget-test1.firebaseapp.com",
    databaseURL: "https://saveandget-test1-default-rtdb.firebaseio.com",
    projectId: "saveandget-test1",
    storageBucket: "saveandget-test1.appspot.com",
    messagingSenderId: "764820232194",
    appId: "1:764820232194:web:6349afe0e91f2c0aa6af1b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage()



let blogImageIn = document.getElementById('blogImage')
let blogTitleIn = document.getElementById('blogTitle')
let blogWriterIn = document.getElementById('blogWriter')
let mainBlogIn = document.getElementById('mainBlog')
let blogButton = document.getElementById('blogButton')


// FUNCTION TO POST BLOG ON FIREBASE

async function postBlog(){
    let blogImage = blogImageIn.value
    let blogTitle = blogTitleIn.value
    let blogWriter = blogWriterIn.value
    let mainBlog = mainBlogIn.value

    console.log(blogTitle, blogWriter, mainBlog);
}



blogButton.addEventListener('click', () => {
    console.log('i am clicked');
})






// REGISTERING USERS WITH A PHOTO AND OTHER DETAILS

async function signUpUser() {
    if(!validationUser()){
        return
    }


    let dateOfBirthInput = dateOfBirth.value
    let email = emailIn.value
    let gender = genderIn.value
    let username =  usernameIn.value
    let Firstname = firstNameIn.value;
    let Lastname = lastNameIn.value;
    let PhoneNumber = PhoneNumberIn.value;
    let password = passwordIn.value

    const collectionRef = collection(db, "Registered_Users");
    const querySnapshot = await getDocs(query(collectionRef, where("PhoneNumber", "==", PhoneNumber)));

    if (!querySnapshot.empty) {
        // User with the same phone number already exists
        console.log(querySnapshot)
        alert("User with the same phone number already exists. Please use a different phone number.");
    } else {
        // Creating the new user
        createUserWithEmailAndPassword(auth, email, password)
            .then((credentials) => {
                alert('User Created. Waiting for Redirect');
                let userId = credentials.user.uid;
                let file = photoImage.files[0]
                let displayImageName = file.name

                if(displayImageName == ''){
                    alert('Please choose a profile picture')
                }

                const storagePath = ref(storage, 'PROFILE PICTURE', + displayImageName)
                const uploadTask = uploadBytesResumable(storagePath, file)

                uploadTask.on('state_changed', snapshot => {
                    var progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes) * 100)
                    console.log(progress);
                }, error => {
                    console.error(error)
                }, async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
                    const ref = doc(db, "Registered_Users", userId);

                    await setDoc(ref, {
                        Firstname: Firstname,
                        Lastname: Lastname,
                        Username: username,
                        PhoneNumber: PhoneNumber,
                        Gender: gender,
                        Email: email,
                        DateOfBirth : dateOfBirthInput,
                        profilePicture : downloadURL
                })
                }
            )
                    // .then((response) => {
                    //     console.log(response);
                    // })
                    // .catch((error) => {
                    //     console.error(error);
                    // });

                // Redirecting the new user to the profile
                setTimeout(() => {
                   window.location.href = 'index.html'
                }, 3000);

            })
            .catch((error) => {
                alert(error.message);
            });
    }
}