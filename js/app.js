$(function() {

  var invoices = {
    total: 0,
    items: []
  };
  var root = 'https://api.myjson.com/bins/zillb';

  $.ajax({
    url: root,
    method: 'GET'
  }).then((data) => {

    function createItem(j){
      var figure = $('<figure>');
      var div = $('<div>');
      var div2 = div.clone(false).attr({'class': "images-wrapper",'index': data[j].id});
      var div3 = div.clone(false).attr('class', "controls");
      var div4 = div.clone(false).attr('class', "prev-arrow prev");
      div4.html('<i class="fa fa-arrow-circle-o-left" aria-hidden="true"></i>');
      div3.append(div4);
      var div5 = div.clone(false).attr('class', "next-arrow next");
      div5.html('<i class="fa fa-arrow-circle-o-right" aria-hidden="true"></i>');
      div3.append(div5);
      div2.append(div3);
      figure.append(div2);

      var figcaption = $('<figcaption>');
      var h3 = $('<h3>').html(data[j].name);
      h3.addClass('title');
      var span = $('<span>').html(data[j].price);
      span.addClass('price');

      var a = $('<a>').attr('href',"#!");
      a.addClass('add');
      a.text('Add To Cart');

      figcaption.append(h3);
      figcaption.append(span);
      figcaption.append(a);
      figure.append(figcaption);

      var div1 = div.clone(false).attr('class',"carousel");

      var img = $('<img>');
      for(var i=0; i<data[j].carousel.length;i++){
          var img1 = img.clone(false);
          img1.attr('src',"images/"+data[j].carousel[i]+".jpg");
          img1.attr('alt',data[j][name]);
          div1.append(img1);
      }

      var li = $('<li>').attr('productId', data[j].id);
      li.addClass('products');
      li.append(div1);
      li.append(figure);
      return li;
    }

    for (var i=0; i<data.length; i++) {
      $(".grid").append(createItem(i));
      }


  $('body').on('click', '.products', function (event) {

     event.stopPropagation();
     var $itemID = $(this).attr('productId');
     var div = $('<div>');
     $(".wrapper").empty();
     var divBlock =  div.clone(false).addClass("block");

   for (var i=0; i<data[$itemID].carousel.length; i++){
      var divBlockW =  div.clone(false).addClass("block-w");
      divBlockW.addClass("block"+i);
      divBlockW.attr('style', 'background-image:' + 'url(images/'+data[$itemID].carousel[i]+'.jpg)');
      var divBlockBack =  div.clone(false).addClass("back");
      var divBlockText =  div.clone(false).addClass("text");
      var divBlockContainer =  div.clone(false).addClass("containerName").text(data[$itemID].name);
      var divBlockDescription =  div.clone(false).addClass("hellothere").text(data[$itemID].description);
      divBlockText.append(divBlockContainer);
      divBlockText.append(divBlockDescription);
      divBlockBack.append(divBlockText);
      divBlockW.append(divBlockBack);
      divBlock.append(divBlockW);
  }
      $(".wrapper").append(divBlock);
  });


var active = 'active';
var block = '.block-w';
var inactive = 'min';

var text = '.fadetext';

//Remove Functions
function removeActive() {
  $(block).removeClass(active);
}

function removeInactive() {
  $(block).removeClass(inactive);
}

//jQuery

$('body').on('click', '.block-w', function (event) {
  event.stopPropagation();
  $(block).removeClass(inactive);
  $(this).toggleClass(active).siblings().removeClass(active).toggleClass(inactive);
});

$(document).mouseover(function(e) {
  var container = $(block);
  if (container.has(e.target).length === 0) {
    setTimeout(removeInactive, 100);
    setTimeout(removeActive, 100);
  }
});



function createCartItem(item_id, productName, price, bg){
      var li = $("<li></li>");
      li.attr("id",  'item_' + item_id);
      li.addClass("cart-product");
      var span = $('<span>');
      var input = $('<input>').attr({"class": "qty", 'id':"qty_"+item_id, "value": 1});
      span.append(input);
      var div = $('<div>').attr("class", "price");
      div.html(productName+'<br/>'+'<span class="item-prices" id="price_'+item_id+'">'+price+'</span>&nbsp;');
      var a = $('<a>');
      a.attr({"class": "item-remove img-replace", "href": "#"}).text("Remove");

      li.append(span);
      li.append(div);
      li.append(a);
      li.find('input.qty').attr('style', 'background-image:'+ bg);
     return li;
  }

$('.add').on('click', function (event) {
      event.stopPropagation();
      var item = $(this).parents('li');
      var bg = item.find('.images-wrapper').css('background-image');
      var title = item.find(".title").text();
      var price = item.find(".price").text();
      var item_id = item.attr('productId');
      var itemProduct = {
                picture: '',
                quantity: 0,
                price: 0
              };

      if(document.getElementById("price_"+item_id))
        {
              var new_val = parseFloat($("#price_"+item_id).text());
              new_val +=parseFloat(price);
              $('#cart_items').find("#price_"+item_id).text(new_val.toFixed(2));
              var new_qty_val = parseFloat($("#qty_"+item_id).val());
              new_qty_val++;
              $("#qty_"+item_id).val(new_qty_val);

         }else{
              $('#cart_items').append(createCartItem(item_id, title, price, bg));

              itemProduct.picture = bg;
              itemProduct.price = price;
              itemProduct.quantity = item.find('.qty').val();
              invoices.items.push(itemProduct);
              console.log(invoices.items);
         }

          updateTotal();
         var removeButtons = $(".item-remove");
         removeButtons.each(function(index) {
              $(this).click(function(){
                         $(this).parent().remove();
                         updateTotal();
              });
         });
  });

    function updateTotal() {
        var quantities = 0,
        total = 0,
        $cartTotal = $('#total-price span'),
        items = $('#cart_items').children();

        var j = 0;
        items.each(function (index, item) {
            var $item = $(item);
            invoices.items[j].quantity = $item.find('.qty').val();
            total += parseFloat($item.find('.item-prices').text());
            j++;
        });

        invoices.total = parseFloat(Math.round(total * 100) / 100).toFixed(2);

        $cartTotal.text('$' + parseFloat(Math.round(total * 100) / 100).toFixed(2));
    }



  $('#cart_trigger').click(function (e) {
      if ($('#cart').hasClass('speed-in')) {
          $('#cart').removeClass('speed-in');
          $('body').removeClass('overflow-hidden');
      } else {
          $('body').addClass('overflow-hidden');
          $('#cart').addClass('speed-in');
      }
  });


  $modal = $('.modal-frame');
  $overlay = $('.modal-overlay');

  $modal.bind('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e){
    if($modal.hasClass('state-leave')) {
      $modal.removeClass('state-leave');
    }
  });

  $('.close').on('click', function(){
    $overlay.removeClass('state-show');
    $modal.removeClass('state-appear').addClass('state-leave');
  });

  $('.open').on('click', function(){
    $('#cart').removeClass('speed-in');
    $overlay.addClass('state-show');
    $modal.removeClass('state-leave').addClass('state-appear');

    $(".total-logo").find(".total-n").text(invoices.total);
    $(".product-in-cart").find("span").text(invoices.items.length);

    for (var i=0; i<invoices.items.length; i++){
      $('.cont-product').append(createProd(invoices.items[i]));
    }

  });

  function createProd(prod){
    var div = $("<div>").addClass("products");
    var pic = $('<span>').addClass("img").css('background-image',prod.picture);
    div.append(pic);
    var div1 = div.clone(false).addClass("cont-options");
    var div2 = div.clone(false).addClass("quantity");
    var button = $('<button>').addClass("plus").text('+');
    var span = $('<span>').addClass("num").text(prod.quantity);
    var button1 = button.clone(false).addClass("minus").text('-');
    div2.append(button);
    div2.append(span);
    div2.append(button1);
    div1.append(div2);
    var button2 = button.clone(false).addClass("remove").text('remove');
    div1.append(button2);
    div.append(div1);
    return div;
  }


  var carousel = $('.carousel');
  var imagesWrapper = $('.images-wrapper');
  var prevArrow = $('.prev');
  var nextArrow = $('.next');
  var imagesArray = [];
  var numberOfImages = [];

  for (i=0; i<carousel.length; i++){
    var childNodes = $(carousel[i]).children();
    imagesArray[i] = [];
    for (var j = 0; j < childNodes.length; j++) {
        var currentNode = childNodes[j];
        if ($(currentNode).prop("tagName") === 'IMG') {
            imagesArray[i].push(currentNode.src);
            $(currentNode).addClass('hide');
        }
    }
    numberOfImages[i] = imagesArray[i].length;
    $(imagesWrapper[i]).css('background-image','url(' + imagesArray[i][0] + ')');
  }


    var currentImage = [];
    for (i=0; i<carousel.length; i++){
          currentImage[i] = 0;
          $(prevArrow[i]).click( (e) => {
              handleSlideshowArrow('prev', $(this).parent().parent().attr('index'));
          });
          $(nextArrow[i]).click( (e) => {
              handleSlideshowArrow('next', $(this).parent().parent().attr('index'));
          });
      }

    function handleSlideshowArrow(val, i) {
      if (val === 'prev') {
          if (currentImage[i] > 0) {
              currentImage[i]--;
          } else {
              currentImage[i] = numberOfImages[i] - 1;
          }
      } else if (val === 'next') {
          if (currentImage[i] < numberOfImages[i] - 1) {
              currentImage[i]++;
          } else {
              currentImage[i] = 0;
          }
      }

      $(imagesWrapper[i]).addClass('fade-out');
      $(imagesWrapper[i]).css('background-image','url(' + imagesArray[i][currentImage[i]] + ')');
      $(imagesWrapper[i]).removeClass('fade-out');
  }

var $mm = $('.megamenu');
var $mmTrigger = $('.megamenu__trigger');
var $mmWrap = $('.megamenu__wrap');


function openMegaMenu() {
  $mm.css({
    top: '-' + $mmWrap.outerHeight() + 'px'
  });
  $mmTrigger.find('.icon').addClass('open');
  $mm.addClass('open');
}

function closeMegaMenu() {
  $mm.removeClass('open');
  $mm.attr('style', '');
  $mmTrigger.find('.icon').removeClass('open');

}

  // Mega Menu

$mmWrap.css('top', $mmTrigger.outerHeight());
$mmTrigger.on('click', function(e) {
  e.preventDefault();
  if ($mm.hasClass('open')) {
    closeMegaMenu();
  } else {
    openMegaMenu();
  }
});

$('.cc-number').on('keyup change', function(){
  if ($(this).val().length == 4) {
    $(this).next().focus();
  } else if ($(this).val().length == 0) {
    $(this).prev().focus();
  }
});

$(".button-cart").on('click', function(e){
  e.stopPropagation();
  $(".cont-product").addClass("slide-right");
  $(".container").addClass("slide-cont-left");
  $(this).addClass("btn-hiding");
  setTimeout(function(){
     $(".cont-product").addClass("zindex");
 }, 300);
});

$(".products").on('click', function(e){
  e.stopPropagation();
  $(".cont-options").removeClass("slideup");
  $(".products").removeClass("active");
  $(this).addClass("active");
  $(this).find(".cont-options").addClass("slideup");
});

$(window).on( "click", function(){
$(".products").removeClass("active");
  $(".cont-product").removeClass("zindex");
  $(".cont-product").removeClass("slide-right");
  $(".container").removeClass("slide-cont-left");
  $(".button-cart").removeClass("btn-hiding");
  $(".cont-options").removeClass("slideup");
});

});

});
