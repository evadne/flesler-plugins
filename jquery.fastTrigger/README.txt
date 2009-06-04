What is it
----------
This small plugin includes a clean and simplified version of jQuery.trigger, that will perform better and will specially scale better.

How is this achieved
--------------------
Many useless steps are skipped when programatically triggering an event, this step that jQuery does no matter what, are not really necessary for triggered events, and some of them hit on perfomance badly. Most of them are not optimized for speed and scalability, but for reusability and code size.

Differences with trigger
------------------------
This method supports array of data (can include an event object), namespaced events and exclusive triggering. The only known difference with jQuery.trigger is that this method doesn't trigger native handlers, so it's actually comparable to .triggerHandler().

Perfomance
----------
This is method is at least 4 times faster than the regular trigger, and will scale much better as you trigger on more elements at once.

Global triggering
-----------------
The equivalent for jQuery.event.trigger, is $.fastTrigger it accepts the same arguments as its prototype's counter-part, but triggers the event on all the elements in the page.
This is a dangerous method to use, as it may hang the browser if the page has many elements, using $.fastTrigger won't solve the problem, but will surely perform better.
This case should show off the previously mentioned (improved) scalability.

A few examples
--------------
$('div').fastTrigger('mouseover');//regular

$('h1,h2').fastTrigger('click.myNamespace');//with namespace

$('li p').fastTrigger('focus!');//exclusive

$('ul.list').fastTrigger('collapse');//custom event

$('#pane span').fastTrigger('click', ['foo','bar']);//with an array of data

var ev = {preventDefault:function(){},foo:1};//your own event object
$('a').fastTrigger('blur', [ ev, 8 ]);//yours is used instead

$.fastTrigger('keypress');//global triggering