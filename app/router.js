/**************** TEST CONTROLLERS *******************************************/
const TestController = require("./controllers/test/testController");
const TopicTestController = require("./controllers/test/topicTestController");
const CreateSchema = require("./services/elastic-search/dev/createSchema");
const Reindex = require("./services/elastic-search/dev/reindex");

const SearchBlogs = require("./services/elastic-search/searchBlogs");
const SearchWriters = require("./services/elastic-search/searchWriters");

/****************************************************************************/
const HomeController = require("./controllers/homeController");
const Authentication = require("./controllers/authentication");
const BloggerController = require("./controllers/bloggerController");
const BlogController = require("./controllers/blogController");
const BlogTagController = require("./controllers/blogTagController");
const BlogThumbnailController = require("./controllers/blogThumbnailController");
const BlogImageController = require("./controllers/blogImageController");
const UsernameController = require("./controllers/usernameController");
const StoryController = require("./controllers/storyController");

const Blogger = require("./models/blogger");
const passportService = require("./services/passport"); // configuring passport to use LocalStrategy and JwtStrategy
const passport = require("passport");

// By default passport will try to make a cookie based session hence session = false
const requireEmailAndPass = passport.authenticate("local", {
  failureRedirect: "/unauthenticated",
  session: false
});
const requireJwt = passport.authenticate("jwt", { session: false });

module.exports = app => {
  app.post("/signup", Authentication.signUp);
  // Restricting end point with LocalStrategy
  app.post("/signin", requireEmailAndPass, Authentication.signIn);

  /*
   * Blogger profile routes
   */
  app.get("/auth/api/user/get-user", requireJwt, BloggerController.getBlogger); // Restricting end point with JwtStrategy
  app.put(
    "/auth/api/user/edit",
    requireJwt,
    BloggerController.updateBloggerInfo
  );
  app.get(
    "/auth/api/user/blogs/:status",
    requireJwt,
    BlogController.getUserStories
  );

  /*
   * Blog actions
   */
  app.post("/auth/blog/create-blog", requireJwt, BlogController.createBlog);
  app.get("/auth/blog/action/get/:id", requireJwt, BlogController.getBlog);
  app.post(
    "/auth/blog/action/publish/:id",
    requireJwt,
    BlogController.publishBlog
  );
  app.delete(
    "/auth/blog/action/delete/:id",
    requireJwt,
    BlogController.deleteBlog
  );
  app.get(
    "/auth/blog/get/blog-count/",
    requireJwt,
    BlogController.getBlogCount
  );

  /*
   * Blog thumbnail
   */
  app.post(
    "/auth/blog/action/upload-thumbnail/:id",
    requireJwt,
    BlogThumbnailController.uploadThumbnail
  );
  app.delete(
    "/auth/blog/action/remove-thumbnail/:id",
    requireJwt,
    BlogThumbnailController.removeThumbnail
  );

  /*
   * Blog image
   */
  app.post(
    "/auth/blog/action/upload-image/:postId",
    requireJwt,
    BlogImageController.uploadBlogImage
  );

  /*
   * Blog Tags
   */
  app.post(
    "/auth/blog/action/publish/add-tag/:postId",
    requireJwt,
    BlogTagController.addBlogTag
  );
  app.delete(
    "/auth/blog/action/publish/remove-tag/:postId/:tagId",
    requireJwt,
    BlogTagController.removeBlogTag
  );
  app.get(
    "/auth/blog/action/publish/get-tag/:postId",
    requireJwt,
    BlogTagController.fetchBlogTag
  );

  /*
   * Settings
   */
  app.post(
    "/auth/api/user/username-check",
    requireJwt,
    UsernameController.checkAvaibility
  );
  app.post(
    "/auth/api/user/change-username",
    requireJwt,
    UsernameController.changeUsername
  );

  /*
   * Public Apis
   */
  app.get("/api/story/:id", StoryController.fetchStory);
  app.get(
    "/api/user/get-user/:username",
    BloggerController.getBloggerByUsername
  );
  app.get("/api/user/get-stories/:id", StoryController.fetchUserStories);
  /*
   * Testing
   */
  app.get("/users", TestController.findAllUsers);
  app.get("/test-user", TestController.findByUsernameOrEmail);
  app.get("/test-tags", TestController.findUserStoryBlogTags);
  app.get("/test-stories", TestController.findAllStories);
  app.get("/test-topic/:topic", TopicTestController.findByTopic);

  /*
   * Test elastic search
   */
  app.get("/auth/api/search/dev/create-schema", CreateSchema);
  app.get("/auth/api/search/dev/reindex", Reindex);

  app.get("/api/search/stories/:q", SearchBlogs.searchBlogs);
  app.get("/api/search/people/:q", SearchWriters.searchWriters);

  app.get("/unauthenticated", function(req, res) {
    res.json({ error: "Authentication Failed" });
  });
};
