class ToggleLike {
  constructor(toggleElement) {
    this.toggler = toggleElement;
    this.toggleLike();
  }

  toggleLike() {
    $(this.toggler).click(function (event) {
      event.preventDefault();

      let self = this;
      
      $.ajax({
        type: "POST",
        url: $(self).attr("href"),
      })
        .done(function (data) {
          console.log('data dta =',data.data);
          let likesCount = parseInt($(self).attr("data-likes"));
          console.log(likesCount);
          if (data.data.deleted == true) {
            likesCount -= 1;
          } else {
            likesCount +=1;
            data.data.deleted = true
          }

          $(self).attr("data-likes", likesCount);
          $(self).html(`${likesCount} &hearts;`);
          new Noty({
            type: "success",
            theme: "relax",
            layout: "topRight",
            text: "Liked Successfully",
            timeout: 1500,
          }).show();
        })
        .fail(function (err) {
          console.log("error liking");
        });
    });
  }
}
