#QuickStick
This simple jQuery plugin creates "sticky" headers and footers through very simple commands. I created it because I became tired of repeating similar code all over the place.

##"Sticky" Header
There can be more than one "sticky" header per page. This allows multiple, separate divs to be chained together into what appears to be one header. Use the following to create a "sticky" header:
```javascript
$(selector).quickStickHeader([options]);
```
The following options can be supplied (defaults are shown):
```javascript
$(selector).quickStickHeader({
  'headerClass': 'quick-stick',
  'scrollClass': 'scrolling',
  'offsetTop': 0,
  'hideOriginal': true,
  'z-index': 1000,
  'allowOverflow': true,
  'onStick': null,
  'onUnstick': null
});
```
###Options Explained
- __headerClass__: This is the class that QuickStick adds on to the header when it is "stuck" to the top of the window. This is useful for styling drop shadows.
- __scrollClass__: This is that class that QuickStick adds on to the header when 'allowOverflow' is true and the contents overflows the window.
- __offsetTop__: This offsets where the header is "stuck". Positive values move the header down, away from the top of the window. 
- __hideOriginal__: This is useful in conjunction with _offsetTop_. It hides the original header.
- __z-index__: Sets the z-index for when the header is "stuck".
- __allowOverflow__: Indicates if the header is allowed to overflow the window. 
- __onStick__: This is a callback function that is triggered when the header is "stuck" to the window.
- __onUnstick__: This a callback function that is triggered when the header is "unstuck" from the window.

###Usage Information
The "sticky" header is implemented by creating a clone of the origin element. This clone is get "stuck" to the top of the window. The limitations of this approach are that headers referenced by an 'Id' will not update the clone automatically. This can be overcome by calling the update function:
```javascript
$(selector).quickStickHeader('update');
```
My recommendation is to use a class reference which will update both the clone and the original.

##"Sticky" Footer
This might be a somewhat misleading description for the functionality. The "sticky" footer sticks to the bottom of the window only if its normal position would be _above_ the bottom. In other words, if the content above the footer is taller than the window, then the footer will be pushed below the bottom of the window. If the content is not as tall as the window, then the footer will stay "stuck" to the bottom of the window.

Use the following to create a "sticky" footer:
```javascript
$(selector).quickStickFooter();
```
There currently are no options for the footer. However, there is a function to update the position of the footer.
```javascript
$(selector).quickStickFooter('update');
```
This is useful when you are dynamically adding content to the page.