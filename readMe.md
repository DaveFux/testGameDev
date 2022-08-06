# Inspired Gaming Programming Test

## Goal

- To write a web app that graphically displays a 2D firework display that is driven by an XML
  data file, rendered onto a HTML5 canvas element.
- When run, the web app is to read in an XML file “fireworks.xml” that contains a list of
  elements that describe the type of firework and when it is to be fired. Once all fireworks
  have been fired, the display starts again from the beginning.
- The web app is to be written using HTML5, JavaScript and/or any other related technologies.
- Open source third party libraries are permitted. We preffer PIXI.js to draw on canvas
- A zip file must be provided that includes source code, assets & libraries used, so that it can
  be unzipped directly onto a web server and run without warnings or errors. If your app
  requires additional work to get it to run, instructions should be provided on how to achieve
  this.
- The resultant web app should at least work on the latest versions of Chrome and Firefox.

## When reviewing the solution, we will be evaluating the following aspects

- JavaScript - usage of JavaScript language features.
- Code Readability - it should be evident what the code is doing without the need for
  excessive commenting.
- Modularity - the code should be easily expanded upon, for instance to add additional
  firework types, or graphical effects.
- Error handling - the web app should handle errors in the XML file. Displaying an error and
  stopping the web app is an acceptable solution to malformed data. Crashing is not.
- Animation - the animation must be smooth and frame rate independent.

The graphics can be as simple or as complex as you like, as we will only be evaluating the
functional aspects of the solution.
Code quality is of far more importance than graphical quality.

We would expect this to be completed within a fortnight, however it should be stressed that if
you require extra time we are more than willing to provide this – do not submit something you
have rushed or are not happy with presenting. This exercise should be used to show off what
you are capable of, and is an important part of your job application.

## XML Data format

Your web app must conform to the following XML data structure:

```xml
<?xml version="1.0" ?>
<FireworkDisplay>
 <Firework begin="1000" type="Fountain" colour="0x20FF40" duration="5000">
 <Position x="0" y="-384"/>
 </Firework>
 <Firework begin="2000" type="Rocket" colour="0xFF2020" duration="1000">
 <Position x="500" y="-384"/>
 <Velocity x="-180" y="600"/>
 </Firework>
</FireworkDisplay>
```

The XML document has a root element “FireworkDisplay” that contains any number of “Firework”
elements.

There are 2 types of fireworks defined in the data file:

- Rocket - travels for the specified duration and explodes.
- Fountain - shoots a stream of particles upwards for the specified duration.

The firework element has the following attributes:

- begin - the time when the firework is triggered.
- type - the type of firework - Fountain or Rocket.
- colour - the colour of the particles in a 24 bit RGB format (8 bits per colour).
- duration - for a Fountain, the time particles are emitted for. For a Rocket, its flight time
  before it explodes.
- Position - for a Fountain, the point of origin for the particles. For a Rocket, its starting
  position.
- Velocity – Rocket only: how many pixels the Rocket travels per second.

All times are specified in milliseconds.
The display area is assumed to be 1024 x 768 with the origin in the centre.

## Example XML

A fireworks.xml file should have been provided alongside this document that you may use to test
your web app against.

## Example Solution

An example solution (as a windows executable) should have been provided alongside this document
that will allow you to see how the XML data can be visualised. It is not a requirement to copy the
graphical style of the provided example, although you may use the graphics files from the example if
you wish.
