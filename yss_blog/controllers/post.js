const BlogPost = require("../models/BlogPost")

module.exports = {
    delete: (req, res) => {
        let postId = req.params.id;
        BlogPost.findByIdAndRemove(postId)
            .then(() => {
                res.redirect("/");
            })
            .catch(error => {
                console.log(`Error deleting post by ID: ${error.message}`);
            });
    },

    redirectView: (req, res) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else console.log(error);
    },
}