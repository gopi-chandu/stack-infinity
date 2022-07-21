{
  // for submitting the data for post using AJAX
  let createPost = function () {
    let newPostForm = $("#new-post-form");

    newPostForm.submit(function (event) {
      event.preventDefault();

      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(),
        success: function (data) {
          console.log("data : === ", data);
          let date = moment(data.data.post.createdAt).format("DD MMM YYYY");
          let newPost = createPostDOM(data.data.post, date);
          $("#post-list-container>ul").prepend(newPost);
          deletePost($(" .delete-button-jq", newPost));
          new Noty({
            type: "success",
            theme: "relax",
            layout: "topRight",
            text: "Post Created",
            timeout: 1500 ,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };
  // for showing post in DOM
  let createPostDOM = function (post, date) {
    // let date=moment(post.createdAt).format('DD MMM YYYY')
    return $(` 
    <li  id="post-${post._id}">
    <div class="post-container">
      <div class="post-content">
        <div class="top-post-box">
          <div>
            <div class="user-box">
              <div class="user-highlight">
                ${post.user.name}
              </div>
              <br>
              <small>${date}</small>
            </div>
          </div>
          
          <div class="delete-box">
            
              <div class="delete-button">
                <a class="delete-button-jq" href="/posts/destroy/${post._id}">x</a>
              </div>
            
          </div>
  
        </div>
        <!-- top post box ended -->
        <div class="post-content-body">
          <p>
            ${post.content}
          </p>
        </div>
          
      </div>
      <div class="comment-heading">
        <p>Comments</p>
      </div>
      <!-- post comments div -->
      <div class="post-comments">
  
          <div class="comment-form">
            <form action="/comments/create"  method="post">
              <div class='comment-text'>
                <!-- <input type="textarea"  rows="5"   > -->
  
                <textarea id="txtArea" rows="10" cols="70" name="content" placeholder="type something to comment ..." required class="comment-text-content"></textarea>
              </div>
              
              <input type="hidden" name="post"  value=${post._id} >
              <div class='comment-button-container'>
                <input type="submit" value="Add" class='comment-button'>
              </div>
              
            </form>
          </div>
          
  
        
        <div class="post-comments-list">
            <ul id="post-comments-${post._id}" class="list">
            </ul>
        </div>
      </div>
      </div>
  </li>
  
   
`);
  };

  let createComment = function () {
    let newCommentForm = $("#new-comment-form");
    newCommentForm.submit(function (event) {
      event.preventDefault();

      $.ajax({
        type: "post",
        url: "/comments/create",
        data: newCommentForm.serialize(),
        success: function (data) {
          let comment = data.data.comment;
          console.log("data === ", data);
          let newComment = createCommentDom(comment);
          $(`#post-comments-${comment.post}`).prepend(newComment);
          deleteComment($(` .delete-comment-button-jq`,newComment))
          new Noty({
            type: "success",
            theme: "relax",
            layout: "topRight",
            text: "Comment Created",
            timeout: 1500 ,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  let createCommentDom = function (comment) {
    return $(`<div id="comment-container-${comment._id}" class="post-comment-box">
    <li>
        <p class="comment">
          <div class="comment-top">

            <div class="user-name">
              ${comment.user.name}
            </div>
            
            <div class="delete-box">
                <div class="delete-button">
                  <a class="delete-comment-button-jq" href="/comments/destroy/${comment._id}">x</a>
                </div>
            </div>

          </div>
            <div class="comment-content">
              ${comment.content}
            </div>
          </p>
    </li>
</div>`);
  };
  //ajax to delete the post from DOM
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (event) {
      event.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          console.log(data);
          $(`#post-${data.data.post_id}`).remove();
          new Noty({
            type: "success",
            theme: "relax",
            layout: "topRight",
            text: "Post Deleted",
            timeout: 1500 ,
          }).show();
        },
        error: function (err) {
          console.log(err.responseText);
        },
      });
    });
  };

  let deleteComment=function(deleteLink){
    $(deleteLink).click(function(event){
      event.preventDefault();

      $.ajax({
        type:"get",
        url:$(deleteLink).prop('href'),
        success: function(data){
          console.log(data.data)
          $(`#comment-container-${data.data.comment}`).remove();
          new Noty({
            type: "success",
            theme: "relax",
            layout: "topRight",
            text: "Comment Deleted",
            timeout: 1500 ,
          }).show();
        },error: function (err) {
          console.log(err.responseText);
        }
      })
    })
  }
  createPost();

  createComment();
}
