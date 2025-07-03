const BlogPost = require("../models/BlogPost");

module.exports = {
    delete: async (req, res) => {
        try {
            const postId = req.params.id;
            await BlogPost.findByIdAndDelete(postId);
            res.redirect("/");
        } catch (error) {
            console.error(`Error deleting post by ID: ${error.message}`);
            res.status(500).send("Failed to delete post");
        }
    },

    redirectView: (req, res) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) {
            res.redirect(redirectPath);
        } else {
            console.error("Missing redirect path");
            res.status(500).send("No redirect path defined");
        }
    },
};

