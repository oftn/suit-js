<?php
$errors = array();
require './php/ui.inc.php';
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="en-US"> 
<head>
<meta charset="utf-8"/>
<title>SUIT Canvas Toolkit Demo</title>
<style type="text/css">
* {
	margin: 0;
	padding: 0;
}
</style>
</head>
<body>

<?php
try {
	$ui = new UI('javascript');
	$ui->output_scripts(); ?>

<script type="application/ecmascript">

var demo_text = "This is text from a Label widget that has been added as the child of a Packer widget. The Packer widget lines up widgets in a row or column with optional spacing. It's the child of the Scroller widget which allows you to use your mouse wheel to scroll text. Scroll bars will be added when it becomes more developed. As a fallback, you can use your mouse to click-and-drag inside the Scroller to pan around. \n\nYou can set preferences to the Label widget to make it suit your needs. Currently you can set the font face, font size, line-height, and alignment (horizontal and vertical).\n\nAnother widget currently developed is the Button, which is underneath this Label text. It is added alongside this Label in the Packer.\n\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.\n\nThere are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.\n";

//------------------------------------

var counter = 1;

var suit_screen = new suit.Screen();
var packer = new suit.Packer("vertical");
packer.set_spacing (8);

var button = new suit.Button("Test button");
button.connect("activate", function() {
	var a = [], i = 50;
	while (i--) a.push(97+Math.random()*26|0);
	this.get_child().set_text(String.fromCharCode.apply(null, a));
});

var label = new suit.Label(demo_text);
label.set_line_height(1.6);

var another_label = new suit.Label("\nThis is just some more text placed after the Button above. This text is aligned to the right, one of the many things you can do with a Label. How cool is that? Not like amazing-cool, but neat-cool.");
another_label.set_line_height(1.6);
another_label.set_align("right");

var hpacker = new suit.Packer("horizontal");
hpacker.set_spacing (8);
hpacker.add(new suit.Button("Button 1"));
hpacker.add(new suit.Button("Button 2"));
hpacker.add(new suit.Button("Button 3"));

var vpacker = new suit.Packer("vertical");
vpacker.set_spacing (8);
vpacker.add(new suit.Button("Button 4"));
vpacker.add(new suit.Button("Button 5"));

hpacker.add(vpacker);

packer.add(label);
packer.add(button);
packer.add(hpacker);
packer.add(another_label);

var scroller = new suit.Scroller(packer);
suit_screen.set_child (scroller);

//------------------------------------

</script>
<?php
} catch ( DependenciesUnresolvedException $e ) {
	$errors = array_merge($errors, $e->scan_errors());
}
if(count($errors)) { foreach( $errors as $e ) { ?>
<div class="cv_error"><?php echo htmlentities($e); ?></div>
<?php } } ?>
</body>
</html>
