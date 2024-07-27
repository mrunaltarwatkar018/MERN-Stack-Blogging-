import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from "cors";
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import serviceAccountKey from "./mern-blog-website-551c9-firebase-adminsdk-ork0f-636542206d.json" assert { type: "json" };
import aws from "aws-sdk";

// schema below
import User from "./Schema/User.js";
import Blog from "./Schema/Blog.js";

const server = express();

let PORT = 3000;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
})

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json());
server.use(cors());

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true,
});

// setting up s3 bucket
const s3 = new aws.S3({
    region: 'ap-south-1',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const generateUploadURL = async () => {
    const date = new Date();

    const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

    return await s3.getSignedUrlPromise("putObject", {
        Bucket: "mernblogwebsiteee",
        Key: imageName,
        Expires: 1000,
        ContentType: "image/jpeg",
    });
};

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if ( token == null ) {
        return res.status(401).json( { error: "No access token" } );
    }
    
    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
        if (err) {
            // return res.status(403).json( { error: "Invalid access token" } );
            return res.status(403).json({ error: "Access token is invalid" });
        }

        req.user = user.id;
        next();
    })
}

const formatdatatoSend = (user) => {
    const access_token = jwt.sign(
        { id: user._id },
        process.env.SECRET_ACCESS_KEY
    );

    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname,
    };
};

const generateUsername = async (email) => {
    let username = email.split("@")[0];

    let isUsernameNotUnique = await User.exists({
        "personal_info.username": username,
    }).then((result) => result);

    isUsernameNotUnique ? (username += nanoid().substring(0, 5)) : "";

    return username;
};

//upload image url route
server.get("/get-upload-url", (req, res) => {
    generateUploadURL()
        .then( (url) => res.status(200).json({ uploadURL: url}))
        .catch((err) => {
            console.log(err.message);
            return res.status(500).json({error: err.message});
        });
});


server.post("/signup", (req, res) => {
    let { fullname, email, password } = req.body;

  // validating the data from frontend
    if (fullname.length < 3) {
        // status 403: invalidation status
        return res
        .status(403)
        .json({ error: "Fullname must be at least 3 letters long" });
    }

    if (!email.length) {
        return res.status(403).json({ error: "Email is required" });
    }

    if (!emailRegex.test(email)) {
        return res.status(403).json({ error: "Invalid Email" });
    }

    if (!passwordRegex.test(password)) {
        return res.status(403).json({
        error:
            "Password must be at least 6 to 20 characters long, contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
        });
    }

    bcrypt.hash(password, 10, async (err, hashed_password) => {
        let username = await generateUsername(email);

        let user = new User({
        personal_info: { fullname, email, password: hashed_password, username },
        });

        user
        .save()
        .then((u) => {
            return res.status(200).json(formatdatatoSend(u));
        })
        .catch((err) => {
            // status 500: internal server driver port
            if (err.code == 11000) {
            return res.status(500).json({ error: "Email already exists" });
            }

        return res.status(500).json({ error: err.message });
    });

        console.log(hashed_password);
    });
});

// check wheather the user is exist not not
server.post("/signin", (req, res) => {
    let { email, password } = req.body;

    User.findOne({ "personal_info.email": email })
    .then((user) => {
        if (!user) {
            return res.status(403).json({ error: "Email not found" });
        }

        if (!user.google_auth) {
            bcrypt.compare(password, user.personal_info.password, (err, result) => {
                if (err) {
                    return res
                        .status(403)
                        .json({ "error": "Error occured while login, Please try again" });
                    }
        
                    if (!result) {
                        return res.status(403).json({ error: "Invalid password" });
                    } else {
                        return res.status(200).json(formatdatatoSend(user));
                    }
            })
        } else {
            return res.status(403).json({ "error": "Account was created usong google. Try logging in with google" });
        }
    })
    .catch((err) => {
        console.log(err.message);
        return res.status(500).json({ error: err.message });
    });
});

server.post("/goolgle-auth", async (req, res) => {
// server.post("/google-auth", async (req, res) => {
    let {access_token} = req.body;

    getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
        let {email, name, picture} = decodedUser;

        picture = picture.replace("s96-c", "s384-c");

        let user = await User.findOne({ "personal_info.email": email })
        .select(
            "personal_info.fullname personal_info.username personal_info.profile_img google_auth"
        )
        .then((u) => {
            return u || null;
        })
        .catch((err) => {
            return res.status(500).json({ "error": err.message });
        })


        if (user) { // login
            if (!user.google_auth) {
                return res.status(403).json({ "error": "This email was signed up without google. Please log in with password to access the account" })
            }
        }
        else { // sign up
            let username = await generateUsername(email);

            user = new User ({
                // personal_info: { fullname: name, email, profile_img: picture, username },
                personal_info: { fullname: name, username },
                google_auth: true
            })

            await user.save().then((u) => {
                user = u;
            })
            .catch((err) => {
                return res.status(500).json({ "error": err.message });
            })

        }

        return res.status(200).json(formatdatatoSend(user))

    })
    .catch((err) => {
        return res.status(500).json({ "error": "Failed to authenticate you with google. Try with some other google account" });
    })
})

server.post( "/latest-blogs", (req, res) => {

    let { page } = req.body;

    let maxLimit = 5;

    Blog.find( { draft: false } )
        .populate( "author", "personal_info.profile_img personal_info.username personal_info.fullname -_id" )
        .sort( { publishedAt: -1 } )
        .select( "blog_id title des banner activity tags publishedAt -_id" )
        .skip( (page - 1) * maxLimit )
        .limit(maxLimit)
        .then( (blogs) => { 
            return res.status(200).json( { blogs } ) 
        } )
        .catch((err) => {
            return res.status(500).json({ error: err.message });
        })
} )

server.post("/all-latest-blogs-count", (req, res) => {

    Blog.countDocuments( { draft: false } )
        .then( (count) => { 
            return res.status(200).json( { totalDocs: count } ) 
        })
        .catch( (err) => {
            console.log(err.message);
            return res.status(500).json({ error: err.message });
        })
})

server.get("/trending-blogs", ( req, res ) => {

    Blog.find( { draft: false } )
        .populate(
            "author",
            "personal_info.profile_img personal_info.username personal_info.fullname -_id"
        )
        .sort( { "activity.total_read": -1, "activity.total_likes": -1, publishedAt: -1 })
        .select("blog_id title publishedAt -_id")
        .limit(5)
        .then( (blogs) => { return res.status(200).json( { blogs } ) } )
        .catch( (err) => { return res.status(500).json( { error: err.message } ) } )
} )

server.post("/search-blogs", (req, res) => {
    let { tag, query, page } = req.body;

    let findQuery;

    if ( tag ) {
        findQuery = { tags: tag, draft: false }
    } else if (query) {
        findQuery = { draft: false, title: new RegExp(query, "i" ) }
    }

    let maxLimit = 2;

    Blog.find(findQuery) 
        .populate( "author", "personal_info.profile_img personal_info.username personal_info.fullname -_id" )
        .sort( { publishedAt: -1 } )
        .select( "blog_id title des banner activity tags publishedAt -_id" )
        .skip( (page - 1) * maxLimit )
        .limit(maxLimit)
        .then( (blogs) => { 
            return res.status(200).json( { blogs } ) 
        } )
        .catch((err) => {
            return res.status(500).json({ error: err.message });
        })
})

server.post("/search-blogs-count", (req, res) => {

    let { tag, query } = req.body;

    let findQuery;

    if ( tag ) {
        findQuery = { tags: tag, draft: false }
    } else if (query) {
        findQuery = { draft: false, title: new RegExp(query, "i" ) }
    }

    Blog.countDocuments(findQuery)
        .then( (count) => {
            return res.status(200).json({ totalDocs: count })
        })
        .catch( err => {
            console.log(err.message);
            return res.status(500).json({ error: err.message });
        })
})

server.post("/search-users", (req, res) => {

    let { query } = req.body;

    User.find( { "personal_info.username": new RegExp(query, "i") } )
        .limit(50)
        .select( "personal_info.fullname personal_info.username personal_info.profile_img -_id" )
        .then( (users) => {
            return res.status(200).json({ users })
        } )
        .catch( err => {
            return res.status(500).json({ error: err.message })
        })

})

server.post("/create-blog", verifyJWT, (req, res) => {
    
    let authorId = req.user;

    let { title, des, banner, tags, content, draft } = req.body;

    if ( !title.length ) {
        return res.status(403).json( { error: "You must provide a title" } );
    }

    if (!draft) {
        if ( !des.length || des.length > 200 ) {
            return res.status(403).json( { error: "You must provide blog description under 200 characters" } );
        }

        if ( !banner.length ) {
            return res.status(403).json( { error: "You must provide blog banner to publish the blog" } );
        }
        
        if ( !content.blocks.length ) {
            return res.status(403).json( {  error: "There must be some blog content to publish the blog" } );
        }

        if ( !tags.length || tags.length > 10 ) {
            return res.status(403).json( { error: "Provide tags in order to publish the blog, Maximum 10" } );
        }
    }

    tags = tags.map((tag) => tag.toLowerCase());

    let blog_id = title.replace(/[^a-zA-Z0-9]/g, " ").replace(/\s+/g, "-").trim() + nanoid();

    let blog = new Blog( {
        title, des, banner, content, tags, author: authorId, blog_id, draft: Boolean(draft)
    } );

    blog
        .save()
        .then((blog) => {
            let incrementVal = draft ? 0 : 1;
            // val = val + 1;

            User.findOneAndUpdate(
                { _id: authorId },
                {
                    $inc: { "account_info.total_posts": incrementVal },
                    $push: { blogs: blog._id },
                }
            )
            .then((user) => {
                return res.status(200).json({ id: blog.blog_id });
            })
            .catch((err) => {
                return res
                .status(500)
                .json({ error: "Failed to update total posts number" });
            });
        })
        .catch((err) => {
            return res.status(500).json({ error: err.message });
        });
} )


server.listen(PORT, () => {
    console.log("listening on port --> " + PORT);
});
