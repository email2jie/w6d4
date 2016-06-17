const FollowToggle = require('./follow_toggle.js');

function UsersSearch(el){
  this.$el = $(el);
  this.$input = this.$el.find('input');
  this.$ul = this.$el.find('ul.users');
  this.handleInput();
}

UsersSearch.prototype.handleInput = function() {
  const self = this;
  this.$input.on("keypress", event => {
    const inputData = $(this.$input).serialize();
    console.log(inputData);
    $.ajax({
      type: "GET",
      url: "/users/search",
      data: inputData,
      dataType: "json",
      success(usersList){
        console.log(usersList);
        self.renderResults(usersList);
      }
    });
  });
}

UsersSearch.prototype.renderResults = function (results) {
  this.$ul.text("");
  results.forEach( (el) => {
    const $anchor = $('<a>').attr("href",`/users/${el.id}`)
            .text(`${el.username}`);
    const $li = $('<li>').append($anchor);
    const $button = $('<button>');
    let follow;
    console.log(el);
    if (el.followed) {
      follow = "followed";
    }else {
      follow = "unfollowed";
    }

    let options = {
      userId: el.id,
      followState: follow
    }
    new FollowToggle($button, options);

    $li.append($button);
    this.$ul.append($li);
  })
}

module.exports = UsersSearch;
