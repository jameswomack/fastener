requirejs.config({
  baseUrl: '/js'
});

require(['rivets', 'superagent'], function(rivets, request) {
  rivets.configure({templateDelimiters:['{{','}}']});
  var model = {
    serviceOfferings: [{title:'a'},{title:'b'},{title:'c'}],
    title: 'FOOOO',
    subTitle: 'Rocking you like a hurrica-ine!'
  };
  var bodyNode = document.querySelectorAll('body')[0];
  rivets.binders.partial = function(el, value) {
    request.get(el.attributes['rv-partial'].nodeValue.concat('.html'), function(res){
      el.innerHTML = res.text;
      rivets.bind(el.getElementsByTagName('ul')[0], model);
    });
  }
  //rivets.bind(bodyNode, model);
});
