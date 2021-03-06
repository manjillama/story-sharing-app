const User = require('../models/user');
const Blogger = require('../models/blogger');
const Blog = require('../models/blog');
const BlogTag = require('../models/blogTag');
const BlogThumbnail = require('../models/blogThumbnail');
const BlogImage = require('../models/blogImage');

module.exports = function(){
  User.hasOne(Blogger, {foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
  Blogger.belongsTo(User, {foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

  Blogger.hasMany(Blog, {foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
  Blog.belongsTo(Blogger, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

  Blog.hasMany(BlogTag, {foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
  BlogTag.belongsTo(Blog, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

  Blog.hasMany(BlogThumbnail, {foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
  BlogThumbnail.belongsTo(Blog, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

  Blog.hasMany(BlogImage, {foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
  BlogImage.belongsTo(Blog, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
}
