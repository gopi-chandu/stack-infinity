const queue = require("../config/kue");

const commentsMailer = require("../mailers/comments_mailer");
const postCommentsMailer = require("../mailers/post_comment_mailer");

queue.process("emails", function (job, done) {
  console.log("worker is running");
  commentsMailer.newComment(job.data);
  done();
});

queue.process("post-comment-emails", function (job, done) {
  console.log("worker is running");
  postCommentsMailer.newPostComment(job.data);
  done();
});
