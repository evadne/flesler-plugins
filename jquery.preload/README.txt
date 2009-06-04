jQuery.Preload 1.0

This is an advanced multi-functional preloader, that has 4 modes integrated.
Each mode suits a different, common situation.
The modes are: 

* URL: Preload a JS array of static URLs.
  	related settings: 
		+ base: This string is prepended to each URL in the array. 
		+ ext: This string is appended to the end of each URL in the array. 
* Rollover: Preload based on DOM images, slightly modifying their src.
 	Can be used for rollovers, or for image-thumb.
  	related settings: 
		+ find: String or regex that matches part of the srcs. 
		+ replace: Replacement to the matched part, to generate the alternate URL. 
* Placeholder : Take regular images and set a placeholder image while they load. Show each original image when fully loaded. Allows sequential loading with a threshold.
  	related settings: 
		+ placeholder: URL of the temporal image shown while loading. 
		+ notFound: Optional image to show if a given image failed to load. 
* Link: Preload the images that appear in the href of the given links.
  	related settings: none. 

Since 1.0.6, you can combine these 2 modes, for another common use.
If you have many images in a page, you might want to load a lighter version of them first, and then sequentially load and replace the real images.
To achieve this, use the light versions in the html, then preload the heavy ones as if they were rollover images(find+replace).
If you set 'placeholder' to true, each preloaded image will be set instead once it loads.

The plugin also provides 3 callbacks to interact with the image URLs during the preloading process. The callbacks get a hash of data, with details of the related image and global information.
The callbacks are: 

* onRequest: Called when requesting a new image. 
* onComplete: Called when a request is complete(loaded or failed). 
* onFinish: Called when all images are fully preloaded. 

The hash of data received by the callbacks, contains the following information: 

* loaded: how many images were preloaded successfully. 
* failed: how many images failed the preloading. 
* next: 0-based index of the next image to preload. 
* done: amount of preloaded images ( loaded + failed ). 
* found: whether the last image could be preloaded or not. 
* total: amount of images to preload overall. 
* image: URL of the related image. 
* original: The original source related to this image. 

There's also a threshold setting, that determines how many images are preloaded simultaneously, it is 1 by default.
Note that threshold and the callbacks, are not related to any mode, and can be useful for any of them.
