* What is this ?
	This plugin is meant to be a collection of snippets that improve accessibility for websites.
	It also includes a set of "recommendations" coded as tests to improve accessibilty (even beyond javascript).
	These recommendations can be tested against a page, and get a summary of the results.
	
* How to use it ?
	-First add a call to jquery.js(duh!).
	-Add jquery.accessible.js. This contains the engine for rules/fixes and a set of predefined ones.
	-Right after this, you are ready to run the fixes by calling jQuery.accessible(). You can pass in a hash to specify, with the id and true or false, which ones to run.
		IMPORTANT: don't call this function inside document.ready, call it right away instead.
	If you want to run the tests in your page:
		-Add jquery.accessible.validator.js after jquery.accessible.js.
		-Call jQuery.accessible.runTests(). (right away too)
			You can optionally indicate where to output the results, with a selector as first argument.

* What else ?
	This plugin is just giving its first steps, and it's mostly a draft/demonstration for now.
	The author's intention is to get developers to collaborate, in order to consolidate a large number of improvements to websites' accessibility.
	Allowing any developer to make his/her site, much more accessible, with little effort.
	If you have something to say or contribute, please:
		-Add a feature request at http://plugins.jquery.com/node/add/project_issue/Accessible/feature
		-Or email me to aflesler(at)gmail(dot)com.