import express from 'express';
import path from 'path';
import methodOverride from 'method-override';
import 'dotenv/config.js'
import ejsMate from 'ejs-mate'
import { posts} from './utils/data/postData.js';
import User from './utils/models/model.js';
import { db } from './utils/models/database.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { auth } from './utils/middleware/auth.js';
import Post from './utils/models/Posts.js';



const app = express();
app.use(express.static('public'));
const port = process.env.PORT || 3200

// Add cookie parser middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.use('ejs',ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), 'views'));





// Routes

app.get('/', async(req, res)=>{
    try {
        const allPosts = await Post.find().populate('author', 'username').sort({createdAt: -1});
        res.render('home.ejs', {posts : allPosts})
    } catch (e) {
        console.error('error',e)
    }
})

app.get("/about",(req, res)=> {
    res.render("about.ejs")
})

app.get('/posts', async (req, res) => {
    try {
        const allPosts = await Post.find()
            .populate('author', 'username')
            .sort({ createdAt: -1 });
        
        res.render("index.ejs", { posts: allPosts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        
    }
});


app.get('/contact', (req, res)=>{
    res.render('contact.ejs')
})

app.get('/register',(req, res)=>{
    res.render('register.ejs')
})

app.get('/login', (req, res)=>{
    res.render('login.ejs')
})




// User Login Route
app.post('/login', async (req, res)=>{
    const {email, password} = req.body;
    
    try {
        const user = await User.findOne({ email });
        if(!user){
            return res.render('login', {error: "invalid credentials"})
        }

        // const isMatch = await bcrypt.compare(password, user.password);
        // if(!isMatch){
        //     return res.render('login', {error: 'invalid credentials'})
        // }

        // create jwt token
        const token = jwt.sign(
            { userId : user._id },
             process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )
        
        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.JWT_SECRET,
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        res.redirect('/posts');
        
    }catch (e) {
        res.status(400).render('login', { error: 'Login failed' });
    }
})



// User Register Routes
app.post('/userRegister', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = new User({ username, email, password });
        await user.save();

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.JWT_SECRET,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.redirect('/login');
    } catch (e) {
        res.status(400).render('register', { error: 'Username or Email already exists' });
    }
});





// get form route and post route
app.get("/posts/new", auth,(req, res)=>{
    res.render("new.ejs")
})



// route for crud operations
app.post('/posts', auth ,async(req, res)=>{
    const {username, content} = req.body

    try {
        // get user info from auth token
        const user = await User.findById(req.userId);

        if(!user){
            return res.status(401).render("new.ejs",{
                error: "User not found"
            })
        }

        // Create new Post with relationship to user
        const newPost = new Post({
            username,
            content,
            author: user._id,
            username: user.username // store username for easy access
        });

        // save post 
        const savePost = await newPost.save()

        // update user's posts array
        user.posts.push(savePost._id);
        await user.save();

        // console.log(savePost)
        res.redirect(`/posts/${savePost._id}`);


    } catch (e) {
        console.error("error creating post : ", e);
        res.status(501).send("error creating post")
    }
   
})


// posts route for user Id
app.get("/posts/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username');
        
        if (!post) {
            return res.status(404).send("Post not Found");
        }

        res.render("show.ejs", { post });
    } catch (error) {
        console.error("Error finding post:", error);
        res.status(500).send("Error loading post");
    }
})




// Update route
app.patch("/posts/:id", auth , async(req, res) => {

   try{
    const post = await Post.findById(req.params.id);

    if(!post){
        return res.status(404).render('edit.ejs', {error: 'Post not found', post: null})
    }

    // check if user is the author
    if(post.author.toString() !== req.userId){
        return res.status(403).render("edit.ejs", {
            error: "Unauthorized to edit this post",
            post
        });
    }

    // update only allowed fields
    const {content} = req.body;
    post.content = content;

    // save the update post
    const updatedPost = await post.save();

    res.redirect(`/posts/${req.params.id}`);
   }catch (e) {
        res.status(500).render("edit.ejs", {
            error: "Error updating post",
            post: req.body
        });
    }

});


app.get("/posts/:id/edit", auth, async (req, res) => {
    
    try {
        const post = await Post.findById(req.params.id)

        if(!post) {
            return res.status(404).send('Post not found')
        }

        // check if user is the author
        if(post.author.toString() !==req.userId){
            return res.status(403).send("Unauthorized to edit this post")
        }

        res.render('edit.ejs', {post})
    } catch (e) {
        res.status(500).send("error loading edit form")
    }
  
});


// Delete route
app.delete("/posts/:id", auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).send("Post not found");
        }

        // Check if user is the author
        if (post.author.toString() !== req.userId) {
            return res.status(403).send("Unauthorized to delete this post");
        }

        await Post.findByIdAndDelete(req.params.id);
        
        // Remove post from user's posts array
        await User.findByIdAndUpdate(req.userId, {
            $pull: { posts: req.params.id }
        });

        res.redirect("/posts");
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).send("Error deleting post");
    }
});


db()
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});



// Add logout route
app.get('/logout', (req, res)=> {
    res.clearCookie('token');
    res.redirect('login')
});

