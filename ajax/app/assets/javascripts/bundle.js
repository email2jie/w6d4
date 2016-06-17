/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const FollowToggle = __webpack_require__(1);
	const UsersSearch = __webpack_require__(3);
	const TweetCompose = __webpack_require__(4);
	
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


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const FollowToggle = __webpack_require__(1);
	
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


/***/ },
/* 4 */
/***/ function(module, exports) {

	
	function TweetCompose(el) {
	  this.$el = $(el);
	  this.$el;
	  this.submit();
	  this.TextCount();
	  this.addMentionedUser();
	  this.removeMentionedUser();
	}
	
	TweetCompose.prototype.TextCount = function () {
	  this.$el.find('textarea').on("input", event => {
	    this.$el.find('.chars-left')
	    .text(`Characters remaining: ${140 - this.$el.find('textarea').val().length}`);
	  });
	};
	
	TweetCompose.prototype.removeMentionedUser = function () {
	  $('div.remove-mention').delegate("click", "a", event => {
	    let $tag = event.currentTarget();
	    $tag.parent.remove();
	
	  })
	};
	
	TweetCompose.prototype.addMentionedUser = function () {
	  $('a.add-mentioned-user').on("click", event =>{
	    const script = $('script.add-mentioned-user').html();
	    $('div.mentioned-users').append(script);
	  })
	
	  // console.log(script);
	};
	
	TweetCompose.prototype.submit = function () {
	  this.$el.on("submit", event => {
	    const self = this;
	    event.preventDefault();
	    const output = $(this.$el).serialize();
	    this.disableInputs();
	
	    $.ajax({
	      type: 'POST',
	      url: '/tweets',
	      dataType: 'json',
	      data: output,
	      success(tweet){
	        self.handleSuccess(tweet);
	      }
	    });
	  });
	};
	
	TweetCompose.prototype.disableInputs = function () {
	  const $inputs = $(':input');
	  $inputs.prop("disabled", true);
	};
	
	TweetCompose.prototype.clearInput = function () {
	  // debugger;
	  const $inputs = $('.tweetcontent');
	  $(':input').prop("disabled", false);
	  $inputs.prop("selected", false);;
	  $inputs.val("");
	};
	
	TweetCompose.prototype.handleSuccess = function (tweet) {
	  this.clearInput();
	  const $ul = $(this.$el.data("tweet-ul"));
	  const string = JSON.stringify(tweet);
	
	  const $li = $('<li>').text(string);
	  $ul.append($li);
	};
	
	module.exports = TweetCompose;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map