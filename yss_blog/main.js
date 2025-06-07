const express = require('express');
const path = require('path');
const newPostController = require('./controllers/newPost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const storePostController = require('./controllers/storePost');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');
const logoutController = require('./controllers/logout');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const BlogPost = require('./models/BlogPost');
const User = require("./models/User");
const fileUpload = require('express-fileupload');
const Post = require("./controllers/post"); // import delete post controller
const methodOverride = require("method-override")

const app = express();
const ejs = require('ejs');


app.set('view engine', 'ejs');

//Method override
app.use(
    methodOverride("_method", {
        methods: ["POST", "GET"]
    })
);



app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/my_database", { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });

const PORT = 4000;

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Flash middleware
app.use(flash());

global.loggedIn = null;
app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    next();
});

app.use(fileUpload());

app.listen(PORT, () => {
    console.log('App listening on port 4000');
});

// Routes

// app.get('/', async (req, res) => {
//     // const blogposts = await BlogPost.find({});
//     const blogposts = await BlogPost.find().populate('userId', 'username');
//     res.render('index', {
//         blogposts: blogposts
//     });
// })
// ;

//Index page url
app.get("/", async (req, res) => {
    try {
        const blogposts = await BlogPost.find().populate("userid", "username");
        res.render("index", { blogposts });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

// app.get('/about', (req, res) => {
//     res.render('about');
// });

// app.get('/contact', (req, res) => {
//     res.render('contact');
// });

// app.get('/samplepost', (req, res) => {
//     res.render('samplepost');
// });

//Post related urls
app.get('/post/:id', async (req, res) => {
    const blogpost = await BlogPost.findById(req.params.id).populate("userid", "username")
    res.render('post', {
        blogpost: blogpost
    });
});
app.get('/posts/new', newPostController);
app.get('/posts/new', authMiddleware, newPostController);
app.post('/posts/store', authMiddleware, storePostController);
//Delete button
app.delete("/:id/delete", Post.delete, Post.redirectView); // added a deleted button
app.get('/create', (req, res) => {
    res.render('create');
});


//authentication and log in related urls
app.get('/auth/register', newUserController);
app.post('/users/register', storeUserController);

app.get('/auth/login', loginController);
app.post('/users/login', loginUserController);

app.get('/auth/logout', logoutController);
app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController);
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController);
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);
app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController);


app.get('/auth/logout', logoutController);
app.use((req, res) => res.render('notfound'));
