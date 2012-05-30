#QuickStick
This simple jQuery plugin creates "sticky" headers and footers through very simple commands. I created it because I became tired of repeating similar code all over the place.

##"Sticky" Header
Use the following to create a "sticky" header:
```javascript
$(selector).quickStickHeader([options]);
```
The following options can be supplied (defaults are shown):
```javascript
$(selector).quickStickHeader({
  headerClass: quick-stick,
  offsetTop: 0,
  hideOriginal: false,
  onStick: null,
  onUnstick: null
});
```
###Options Explained
- __headerClass__: This is the class that QuickStick adds on to the header when it is "stuck" to the top of the window. This is useful for styling drop shadows.
- __offsetTop__: This offsets where the header is "stuck". Positive values move the header down, away from the top of the window.
- __hideOriginal__: This is useful in conjunction with _offsetTop_. It hides the original header.
- __onStick__: This is a callback function that is triggered when the header is "stuck" to the window.
- __onUnstick__: This a callback function that is triggered when the header is "unstuck" from the window.

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