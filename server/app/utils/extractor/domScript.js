module.exports =
  function() {
    $(document).ready(function() {
      // event binders
      setTimeout(function() {
        console.log("url: ", $('body').attr('current_url'));
        window.parent.messenger.setUrl($('body').attr('current_url'));
      }, 100)

      function bindMouseEnterEvent() {
        $('body').off('mouseenter').on('mouseenter', '*', function(ev) {
          if (window.parent.messenger.isAnnotate()) {
            $('body').find('*').removeClass('__activate');
            $(this).addClass('__activate');
            window.parent.messenger.hover(dataCompiler(ev.currentTarget)); // sets to the window messenger object
          }
        });
      }

      bindMouseEnterEvent();
      $('body').on('mouseleave', '*', function(ev) {
        bindMouseEnterEvent();
        $(this).removeClass('__activate');
      });

      $('body').on('click','*', function(ev) {
        var isAnchor = $(ev.target).is('a');
        if (window.parent.messenger.isAnnotate()) {
          // true then we just do the regular actions
          // $(this).addClass('__clickActivate');
          // some error checking here
          ev.preventDefault();
          ev.stopPropagation();
          if ($(ev).hasClass('__chosenElement__')) {
            return;
          }
          var coordinates = {x: ev.clientX, y: ev.clientY};
          window.parent.messenger.click(dataCompiler(ev.currentTarget),coordinates); // sets to the window messenger object
          var scrapedFieldObj = window.parent.messenger.getScraperFieldObj();

          var targetElementName = `target ${scrapedFieldObj.targetElements.length + 1}`;
          var rectangle = ev.currentTarget.getBoundingClientRect();
          var div = `<div class="__chosenElement__ __chosenElement__${scrapedFieldObj.targetElements.length+1}" style="width: ${rectangle.width}px; height: ${rectangle.height}px; position: absolute; left: ${rectangle.left + window.scrollX}px; top: ${rectangle.top + window.scrollY}px; background-color:rgba(0, 110, 190, 0.5); z-index: 10000; text-align: center; line-height: ${rectangle.height}px; color: white; font-weight: bold; pointer-events: none;">${targetElementName}</div>`
          $('body').append(div);
        } else {
          if (isAnchor) {
            // interceptor
            var protocol = $('body').attr('proxy_protocol');
            var hostname = $('body').attr('proxy_hostname');
            var $anchor = $(ev.target);
            var re = /proxyurl/i;
            var found = $anchor.attr('href').match(re);
            if (!found) {
              var newUrl = '/api/scrape/proxy?proxyurl=' + protocol + '//' + hostname + $anchor.attr('href');
              $anchor.attr('href', newUrl);
            }
            window.location.href = ev.target.href
          }

        }
      });

      // data stuff
      // need to map out any given event handler to its current target
      // extract the contents into a json format...
      // all attributes will be come a key value pair
      // all inner elements will become content
      // send it on hover

      function dataCompiler(element) {
        var output;
        var attributes = getAttributes(element);
        var content = getContent(element);
        var aggregate = attributes.concat(content);
        aggregate = dataIndexer(aggregate);
        var selectorPath = getSelectorPath(element);

        return {
          selector: selectorPath.selector,
          selectorIndex: selectorPath.selectorIndex,
          elements: aggregate,
          repeats: selectorPath.repeating
        };
      }

      function dataIndexer(array) {
        for (var i = 0; i < array.length; i++) {
          if (array[i].attr === "content") {
            break;
          }
          array[i]['index'] = i;
          array[i]['name'] = 'field' + i;
        }
        return array;
      }

      function getAttributes(element) {
        // this compiles and gets all the attributes on given element
        var attributes;
        var output = [];
        $.each(element.attributes, function( index, attr ) {
          if (attr.value) {
            attributes = {};
            attributes['attr'] = attr.name;
            attributes['value'] = attr.value;
            attributes['attributeName'] = attr.name;
            output.push(attributes);
          }
        });
        return output;
      }

      function getContent(element) {
        // gets the content from the element
        var content = {};
        var output = [];
        var children = $(element).find('*');
        var innerHTML = "";
        if (children.length >= 5) {
          content['content'] = "Too many elements - narrow your search";
          output.push(content);
          return output;
        }
        if (children.length > 0) {
          for (var i = 0; i < children.length; i++) {
            // allow user to choose from each one
            if (children[i].innerHTML) {
              var obj = {};
              obj['value'] = children[i].textContent;
              obj['attr'] = 'text';
              output.push(obj);
            }
          }
          innerHTML += element.textContent;
        } else {
          // no children
          innerHTML += element.textContent;
        }
        content = {
          value: innerHTML,
          index: -1,
          attr: 'content'
        };
        output.push(content);
        // content['additionalTargets'] = additionalTargets;
        return output;
      }

      function getSelectorPath(element) {
        var selector = $(element).first().parentsUntil("html").andSelf().map(function(){
              return this.tagName;
            }).get().join(">");
        //finding repeating
        var repeating = $(selector);
        var repeats = $.map(repeating, function(elem, i){
            return {
              selector: selector,
              selectorIndex: i
            };
        });
        return {selector: selector, selectorIndex: $(repeating).index(element), repeating: repeats};
      }

    });
};
