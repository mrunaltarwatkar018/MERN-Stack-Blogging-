import { useContext, useRef } from "react";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link, Navigate } from "react-router-dom";
import {Toaster, toast} from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";


const UserAuthForm = ({ type }) => {

    let { userAuth: { access_token }, setUserAuth } = useContext(UserContext)

    const userAuthThroughServer = (serverRoute, formData) => {

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
        .then(({ data }) => {
            storeInSession("user", JSON.stringify(data))
            
            setUserAuth(data)
        })
        .catch(({ response }) => {
            toast.error(response.data.error)
        })

    }

    const handleSubmit = (e) => {

        e.preventDefault();

        let serverRoute = type =="sign-in" ? "/signin" : "/signup";

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

        //formData
        let form = new FormData(formElement)
        let formData = {};

        for(let [key, value] of form.entries()){
            formData[key] = value;
        }

        let { fullname, email, password } = formData;
        
        //form validation
            if(fullname){
                if (fullname.length < 3) {
                    return toast.error("Fullname must be at least 3 letters long");
                }
            }
            if (!email.length) {
                return toast.error("Enter Email");
            }
            if (!emailRegex.test(email)) {
                return toast.error("Email is Invalid");
            }
            if (!passwordRegex.test(password)) {
                return toast.error("password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters");
            }

            userAuthThroughServer(serverRoute, formData)

    }

    return(
        access_token ?
        <Navigate to="/" />
        :
        <AnimationWrapper keyValue={type}>
            <section className="h-cover flex items-center justify-center">
                <Toaster />
            <form id="formElement" className="w-[80%] max-w-[400px]">
                <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                    {type == "sign-in" ? "Welcome Back" : "Join us today"}
                </h1>

                {
                    type != "sign-in" ?
                    <InputBox
                        name="fullname"
                        type="text"
                        placeholder="Full Name"
                        icon="fi-rr-user"
                    />
                    : ""
                }

                <InputBox
                    name="email"
                    type="email"
                    placeholder="Email"
                    icon="fi-rr-envelope"
                />

                <InputBox
                    name="password"
                    type="password"
                    placeholder="Password"
                    icon="fi-rr-key"
                />

                <button
                    className="btn-dark center mt-14"
                    type="submit"
                    onClick={handleSubmit}
                >
                    { type.replace("-", " ") }
                </button>

                <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                    <hr className="w-1/2 border-black" />
                    <p>or</p>
                    <hr className="w-1/2 border-black" />
                </div>

                <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
                >
                    <img src={googleIcon} className="w-5" />
                    Continue with Google
                </button>

                {

                    type == "sign-in" ?
                    <p className="mt-6 text-dark-grey text-xl text-center">
                        Don't have an account?
                        <Link to="/signup" className="underline text-black text-xl ml-1">
                            Join us today
                        </Link>
                    </p>
                    :
                    <p className="mt-6 text-dark-grey text-xl text-center">
                        Already a Member?
                        <Link to="/signin" className="underline text-black text-xl ml-1">
                            Sign in here
                        </Link>
                    </p>

                }

            </form>
            </section>
        </AnimationWrapper>
    )
}

export default UserAuthForm;
















// import React, { useContext, useRef } from 'react';
// import InputBox from '../components/input.component';
// import googleIcon from '../imgs/google.png';
// import { Link } from 'react-router-dom';
// import AnimationWrapper from '../common/page-animation';
// import {Toaster, toast} from "react-hot-toast";
// import axios from 'axios';
// import { storeInSession } from '../common/session';
// import { UserContext } from '../App';


// const UserAuthForm = ({type}) => {

//     const authForm = useRef();

//     let {userAuth: {access_token}, setUserAuth} = useContext(UserContext);

//     if (access_token) {
//         console.log(access_token);
//     }

//     const userAuthThroughServer = (serverRoute, formData) => {
        
//         axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
//         .then(({ data }) => {
//             storeInSession("user", JSON.stringify(data))
            
//             setUserAuth(data)
//         })
//         .catch(({response}) => {
//             toast.error(response.data.error)
//         })

//     }

//     // const userAuthThroughServer = (serverRoute, formData) => {
//     //     console.log(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
        
//     //     axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
//     //     .then(({ data }) => {
//     //       console.log(data)
//     //     })
//     //     .catch(({ response }) => {
//     //       toast.error(response?.data?.error ?? 'An unknown error occurred')
//     //     })
//     //   }



//     // const userAuthThroughServer = (serverRoute, formData) => {
//     //     axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
//     //     .then(({ data }) => {
//     //         console.log(data)
//     //     })
//     //     .catch((error) => {
//     //         if (error.response && error.response.data && error.response.data.error) {
//     //             toast.error(error.response.data.error);
//     //         } else {
//     //             toast.error('An unknown error occurred');
//     //         }
//     //     });
//     // }

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         let serverRoute = type == "sign-in" ? "/signin" : "/signup";

//         let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;   // regex for email
//         let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;      // regex for password

//         // formData
//         let form = new FormData(authForm.current);
//         let formData = {};

//         for(let [key, value] of form.entries()) {
//             formData[key] = value;
//         }

//         let {fullname, email, password} = formData;

//         // form validation
//         if (fullname) {
//             if (fullname.length < 3) {
//                 return toast.error("Fullname must be at least 3 letters long")
//             }
//         }

//         if (!email.length) {
//             return toast.error("Email is required");
//         }

//         if (!emailRegex.test(email)) {
//             return toast.error("Invalid Email" );
//         }

//         if (!passwordRegex.test(password)) {
//             return toast.error("Password must be at least 6 to 20 characters long, contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character")
//         }


//         userAuthThroughServer(serverRoute, formData);
//     }

//     return (
//         access_token ? 
//         <Navigate to="/" /> 
//         : 

//         <AnimationWrapper keyValue={type} >
//             <section className="h-cover flex items-center justify-center">
//                 <Toaster/>
//                 <form ref={authForm} className="w-[80%] max-w-[400px]" >
//                     <h1 className="text-4xl font-gelasio capitalize text-center mb-24" >
//                         {type  == "sign-in" ? "Welcome back" : "Join us today" }
//                     </h1>

//                     {
//                         type != "sign-in" ?
//                         <InputBox 
//                             name="fullname"
//                             type="text"
//                             placeholder="Full Name"
//                             icon="fi-rr-user"

//                         />
//                         : ""
//                     }

//                     <InputBox 
//                         name="email"
//                         type="email"
//                         placeholder="Email"
//                         icon="fi-rr-envelope"
//                     />

//                     <InputBox 
//                         name="password"
//                         type="password"
//                         placeholder="Password"
//                         icon="fi-rr-key"
//                     />

//                     <button
//                         className="btn-dark center mt-14"
//                         type="submit"
//                         onClick={handleSubmit}
//                     >
//                         {type.replace("-", " ")}
//                     </button>

//                     <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
//                         <hr className="w-1/2 border-black"></hr>
//                         {/* <span>or</span> */}
//                         <p>or</p>
//                         <hr className="w-1/2 border-black"></hr>
//                     </div>

//                     <button
//                         className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
//                     >
//                         <img src={googleIcon} className="w-5"/>
//                         continue with google
//                     </button>

//                     {
//                         type == "sign-in" ?
//                         <p className="mt-6 text-dark-grey text-xl text-center" >
//                             Don't have an account ? 
//                             <Link 
//                                 to="/signup" 
//                                 className="underline text-black text-xl ml-1">
//                                 Join us today
//                             </Link>
//                         </p>
//                         :
//                         <p className="mt-6 text-dark-grey text-xl text-center" >
//                             Already a member ? 
//                             <Link 
//                                 to="/signin" 
//                                 className="underline text-black text-xl ml-1">
//                                 Sign in here.
//                             </Link>
//                         </p>

//                     }

//                 </form>
//             </section>
//         </AnimationWrapper>

//     );
// }

// export default UserAuthForm;













// /*
//         fetch(serverRoute, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(formData)
//                 })
//                 .then(res => res.json())
//                 .then(data => {
//                     if(data.error){
//                         toast.error(data.error);
//                         }
//                         else{
//                             toast.success(data.message);
//                             }
//                             })
//                             .catch(err => console.log(err));
//                             }
//                             const userAuth = (e) => {
//                                 e.preventDefault();
//                                 const formData = new FormData(authForm.current);
//                                 const email = formData.get('email');
//                                 const password = formData.get('password');
//                                 const serverRoute = `http://localhost:5000/${type}`;
//                                 const formDataObj = {
//                                     email: email,
//                                     password: password
//                                     };
//                                     userAuthThroughServer(serverRoute, formDataObj);
//                                     }
//                                     return (
//                                         <AnimationWrapper>
//                                             <div className="auth-form">
//                                                 <form ref={authForm} onSubmit={userAuth}>
//                                                     <InputBox type="email" name="email" placeholder="Email" />
//                                                     <InputBox type="password" name="password" placeholder="Password" />
//                                                     <button className="btn btn-primary">Login</button>
//                                                     <Link to="/signup" className="btn btn-outline-primary">Signup</Link>
//                                                     <div className="auth-form__google">
//                                                         <button className="btn btn-outline-primary">
//                                                             <i className="fab fa-google"></i>
//                                                             Login with Google
//                                                             </button>
//                                                             </div>
//                                                             </form>
//                                                             </div>
//                                                             </AnimationWrapper>
//                                                             );
//                                                             }
//                                                             export default Auth;
//                                                         </button>
//                                                     </div>
//                                                 </form>
//                                             </div>
//                                         </AnimationWrapper>
// */







// import React, { useContext, useRef } from 'react';
// import InputBox from '../components/input.component';
// import googleIcon from '../imgs/google.png';
// import { Link, Navigate } from 'react-router-dom';
// import AnimationWrapper from '../common/page-animation';
// import {Toaster, toast} from "react-hot-toast";
// import axios from "axios";
// import { storeInSession } from '../common/session';
// import { UserContext } from '../App';

// const UserAuthForm = ({type}) => {

//     const authForm = useRef();

//     let { userAuth: {access_token}, setUserAuth } = useContext(UserContext);

//     console.log(access_token);

//     const userAuthThroughServer = (serverRoute, formData) => {
//         axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
//         .then(({ data }) => {
//             storeInSession("user", JSON.stringify(data));
//             // toast.success("Login Successful");
//             setUserAuth(data);
//         })
//         .catch(( { response }) => {
//             toast.error(response.data.error);
//         })
//     }

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         let serverRoute = type == "sign-in" ? "/signin" : "/signup";

//         let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;   // regex for email
//         let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;      // regex for password

//         // formData
//         let form = new FormData(authForm.current);
//         let formData = {};
//         for (let [key, value] of form.entries()) {
//             formData[key] = value;
//         }

//         let {fullname, email, password} = formData;
        
//         // for validation
//         if (fullname) {
//             if (fullname.length < 3) {
//                 return toast.error("Fullname must be at least 3 letters long");
//             }
//         }
    
//         if (!email.length) {
//             return toast.error("Email is required" );
//         }
    
//         if (!emailRegex.test(email)) {
//             return toast.error("Invalid Email" );
//         }
    
//         if (!passwordRegex.test(password)) {
//             return toast.error("Password must be at least 6 to 20 characters long, contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character" )
//         }

//         userAuthThroughServer(serverRoute, formData);
//     }

//     return (

//         !access_token ?

//         <Navigate to="/" />

//         :

//         <AnimationWrapper keyValue={type} >
//             <section className="h-cover flex items-center justify-center">
//                 <Toaster />
//                 <form ref={authForm} className="w-[80%] max-w-[400px]" >
//                     <h1 className="text-4xl font-gelasio capitalize text-center mb-24" >
//                         {type  == "sign-in" ? "Welcome back" : "Join us today" }
//                     </h1>

//                     {
//                         type != "sign-in" ?
//                         <InputBox 
//                             name="fullname"
//                             type="text"
//                             placeholder="Full Name"
//                             icon="fi-rr-user"

//                         />
//                         : ""
//                     }

//                     <InputBox 
//                         name="email"
//                         type="email"
//                         placeholder="Email"
//                         icon="fi-rr-envelope"
//                     />

//                     <InputBox 
//                         name="password"
//                         type="password"
//                         placeholder="Password"
//                         icon="fi-rr-key"
//                     />

//                     <button
//                         className="btn-dark center mt-14"
//                         type="submit"
//                         onClick={handleSubmit}
//                     >
//                         {type.replace("-", " ")}
//                     </button>

//                     <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
//                         <hr className="w-1/2 border-black"></hr>
//                         {/* <span>or</span> */}
//                         <p>or</p>
//                         <hr className="w-1/2 border-black"></hr>
//                     </div>

//                     <button
//                         className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
//                     >
//                         <img src={googleIcon} className="w-5"/>
//                         continue with google
//                     </button>

//                     {
//                         type == "sign-in" ?
//                         <p className="mt-6 text-dark-grey text-xl text-center" >
//                             Don't have an account ? 
//                             <Link 
//                                 to="/signup" 
//                                 className="underline text-black text-xl ml-1">
//                                 Join us today
//                             </Link>
//                         </p>
//                         :
//                         <p className="mt-6 text-dark-grey text-xl text-center" >
//                             Already a member ? 
//                             <Link 
//                                 to="/signin" 
//                                 className="underline text-black text-xl ml-1">
//                                 Sign in here.
//                             </Link>
//                         </p>

//                     }

//                 </form>
//             </section>
//         </AnimationWrapper>

//     );
// }

// export default UserAuthForm;
