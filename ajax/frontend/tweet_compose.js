
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
