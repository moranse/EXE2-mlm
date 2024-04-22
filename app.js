import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';
import { getFirestore, addDoc, getDocs, collection,doc,deleteDoc} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,signOut} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyAEEngjGkam9ZXbqvVqusp4cchg1QobVcI",
  authDomain: "exe2-2cf27.firebaseapp.com",
  projectId: "exe2-2cf27",
  storageBucket: "exe2-2cf27.appspot.com",
  messagingSenderId: "866047555461",
  appId: "1:866047555461:web:0381a06c0e0c75793d36ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
console.log(db);

//get html elements
let firstName = document.querySelector("#firstName");
let lastName = document.querySelector("#lastName");
let email = document.querySelector("#email");
let userName = document.querySelector("#userName");
let pass = document.querySelector("#password");
let p = document.getElementById("p1");
//const userCredential="";//saveing the ID of the loged in user

function check() {//checking for no empty fields. call the signUp function.
  //תפיסה מחדש של המשתנים לאחר טעינת הדף -מניעת תפיסת שדות ריקים
  console.log("in check");
  firstName = document.querySelector("#firstName").value;
  lastName = document.querySelector("#lastName").value;
  email = document.querySelector("#email").value;
  userName = document.querySelector("#userName").value;
  pass = document.querySelector("#password").value;
  p = document.getElementById("p1");
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/;

  //בדיקת הקלט המוזן בטופס, במידה ותקין ימשיך לשלב יצירת המשתמש
  if (email == "" || userName == "" || pass == "" || firstName == "" || lastName == "") {
    p.innerHTML = "יש למלא את כל שדות הטופס";
  } else if (!(emailRegex.test(email))) {
    p.innerHTML = "יש להכניס כתובת מייל תקינה";
  } else if (pass.length < 6 || !(passRegex.test(pass))) {
    p.innerHTML = "סיסמא עם לפחות 6 תווים, אותיות גדולות וקטנות";
  } else {
    p.innerHTML = ""
    signUP();
  }
}

let userCollection = collection(db, "Users");//creat the collection
console.log(userCollection);

async function signUP() {//creat new user and signup to table page
  console.log("in signUp");
  //לשים לב ביצירת משתמש שדומיין של גוגל עם סיסמה לא מאובטחת או משתמש בדוי, הוא חוסם מליצור
  await addDoc(userCollection, {
    firstName: firstName,
    lastName: lastName,
    email: email,
    userName: userName,
    password: pass
  });
  async function sign(){
    console.log("in sign");
    email = document.querySelector("#email").value;
    pass = document.querySelector("#password").value;
    await createUserWithEmailAndPassword(auth,email,pass)
    console.log("רישום הצליח ");
    window.location.href="user.html";
  }//במידה והסיסמא לא שונה בין המשתמשים, פיירבייס חוסם את יצירת המשתמש במנגנון הזהויות
  sign();
  console.log(auth);
  console.log(firstName);
  console.log(lastName);
  console.log(email);
  console.log(userName);
  console.log(pass);
  console.log("user created successfully");
}

let user1 ="";

async function signIN(){ //this function sign in execting user
  let userName1 = document.querySelector("#userName").value;
  let pass1 = document.querySelector("#password").value;
  if (userName1!=="" ||pass1!==""){
  async function getData() {//להביא את הערכים שהוזנו מהטבלה במסד הנתונים
    let data = await getDocs(userCollection); 
    console.log(userCollection+ " "+data);
    data.forEach((doc)=>{//מציאת המשתמש מכל הרשומות בטבלה
      console.log(doc.data())
      if(doc.data().userName==userName1&&doc.data().password==pass1){
        console.log("user name is: "+userName1 +" password is: "+ pass1);
        console.log("the id of logedin user (from users table) is: "+doc.id);
        //email=getDocs(doc(db, "Users", doc.id)).email;//הבאת המייל של המשתמש הספציפי כדי לחברו
        let email1=doc.data().email;
        console.log(email1);
        signInWithEmailAndPassword(auth, email1, pass1)
        .then((userCredential) => {
          console.log(userCredential);
          user1 = auth.currentUser;
          // sessionStorage.setItem("email", user1.email);
          // sessionStorage.setItem("userName",user1.userName);
          console.log("Signed in users email: "+ user1.email);
          window.location.href="user.html";
        }) 
      }else{
        p.innerHTML="user not found"
      }
    });
  } getData();
}else{
  p.innerHTML="set username and password to login"
}
}

async function fillTable() {//creat user table and fill it
  let data = await getDocs(userCollection);
  console.log(data);
  let table=document.getElementById('userTable');
  let rows = table.getElementsByTagName('tr');
  let rowCount = rows.length;
  for (var x=rowCount-1; x>0; x--) {
    table.removeChild(rows[x]);
  }
    data.forEach(function(user){
      let userData=user.data();
      let newRow = document.createElement('tr');
      let newCellF = document.createElement('td');
      let newCellL = document.createElement('td');
      let newCellM = document.createElement('td');
      let newCellB = document.createElement('td');
      let deleteB=document.createElement('button');
      let userid=user.id;
      newCellB.appendChild(deleteB);
      deleteB.classList.add("button1");
      deleteB.innerHTML="delete";
      deleteB.addEventListener('click',() => deleteRow(userid));
      console.log(userData.firstName);
      console.log(userData.lastName);
      console.log(userData.email);
      deleteB=userid;
      newCellF.innerHTML = userData.firstName;
      newRow.appendChild(newCellF);
      newCellL.innerHTML = userData.lastName;
      newRow.appendChild(newCellL);
      newCellM.innerHTML = userData.email;
      newRow.appendChild(newCellM);
      newRow.appendChild(newCellB);
      table.appendChild(newRow);
  });
}

async function deleteRow(userid){//delete specific row
    await deleteDoc(doc(db, "Users",userid));//לא מוחק ממנגנון ההזדהות
    fillTable();
    console.log("row deleted" + userid);
}

function goToSign(){//for go back to the signup page
  window.location.href="signUp.html"
}

function signOUT(){
  console.log("in signOut");
  // sessionStorage.removeItem("email");
  // sessionStorage.removeItem("userName");
  signOut(auth);
  window.location.href="index.html";
}

if (document.getElementById("signupBtn")){//בודק האם האלמנט נוצר ורק  אז מוסיף לו אירוע
  document.getElementById("signupBtn").addEventListener('click', check);
}
if(document.getElementById("signinBtn")){//בודק האם האלמנט נוצר ורק  אז מוסיף לו אירוע
document.getElementById("signinBtn").addEventListener('click',signIN);
}
if(document.getElementById("userPage")){//בודק האם האלמנט נוצר ורק  אז מוסיף לו אירוע
  //window.addEventListener("load",onAuthStateChanged);
  window.addEventListener("load", fillTable);
}
if(document.getElementById("back")){//בודק האם האלמנט נוצר ורק  אז מוסיף לו אירוע
  document.getElementById("back").addEventListener("click", goToSign);
}
if(document.getElementById("signOut")){//בודק האם האלמנט נוצר ורק  אז מוסיף לו אירוע
  document.getElementById("signOut").addEventListener("click", signOUT);
}
// function onAuthStateChanged(user1){
//   if (user1) {
//     // User is signed in, load user.html
//     window.location.href = "user.html";
//   } else {
//     // No user is signed in, redirect to login page
//     window.location.href = "index.html";
//   }
// }