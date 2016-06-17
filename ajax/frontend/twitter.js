const FollowToggle = require("./follow_toggle.js");
const UsersSearch = require("./users_search.js");
const TweetCompose = require("./tweet_compose.js");

$(function () {
  const $toggle = $("button.follow-toggle");
  const $search = $("nav.users-search");
  const $tweets = $(".tweet-compose");

  $toggle.each( (idx, el) => {
    new FollowToggle(el);
  });

  $search.each( (idx, el) => {
    new UsersSearch(el);
  });

  $tweets.each( (idx, el) => {
    new TweetCompose(el);
  })
});
