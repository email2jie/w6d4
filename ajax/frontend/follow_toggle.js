function FollowToggle(el, options) {
  this.$el = $(el);
  this.userId = this.$el.data("user-id") || options.userId;
  this.followState = this.$el.data("initial-follow-state") || options.followState;
  this.render();
  this.handleClick();
}

FollowToggle.prototype.render = function () {
  if(this.followState === "unfollowed"){
    this.$el.text("Follow!");
    this.$el.prop("disabled", false);
  }else if(this.followState === "followed"){
    this.$el.text("Unfollow!");
    this.$el.prop("disabled", false);
  }else if(this.followState === "following"){
    this.$el.text("following");
    this.$el.prop("disabled", true);
  }else if(this.followState === "unfollowing"){
    this.$el.text("unfollowing");
    this.$el.prop("disabled", true);
  }
};

FollowToggle.prototype.toggle = function () {
  if(this.followState === "unfollowed"){
    this.followState = "following";
  }else if(this.followState === "followed"){
    this.followState = "unfollowing";
  }else if(this.followState === "following"){
    this.followState = "followed";
  }else if(this.followState === "unfollowing"){
    this.followState = "unfollowed";
  }
  this.render();
};

FollowToggle.prototype.handleClick = function () {
  const self = this;
  this.$el.on("click", event => {
    event.preventDefault();
    const formData = $(this).serialize();
    let method;
    if (self.followState === 'unfollowed') {
      method = 'POST';
      self.toggle();
    } else {
      method = 'DELETE';
      self.toggle();
    };
    $.ajax({
      type: `${method}`,
      url: `/users/${self.userId}/follow`,
      data: formData,
      dataType: "json",
      success(){
        self.toggle();
      }
    });
  });
};

module.exports = FollowToggle;
